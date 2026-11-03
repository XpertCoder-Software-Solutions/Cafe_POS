---
name: offline-sync
description: Hub-first offline architecture — the branch Hub (Electron/Android running packages/hub-core) with SQLite, tablets talking to the Hub over LAN, the outbox/inbox event sync with the cloud, idempotency, business dates and daily order numbers, customer merge, device pairing, Hub failure and offline limits. Use for any work on the Hub, sync, devices, connectivity status, or anything that must keep working without internet.
---

# Offline and sync

The branch must keep taking orders, printing and closing shifts with no internet. (SRS §5.4–5.6, §7.6–7.7; decisions D-01 → D-08, D-29, D-31, D-38 in `docs/DECISIONS.md`, which win on conflict.)

## Topology
- One **Hub** per branch (the main cashier device). All Hub logic lives in **`packages/hub-core`** (TypeScript, transport-agnostic). It uses `pricing`, `entitlements`, `sync` and `receipts`; it never re-implements them. (D-01)
  - **Windows:** Electron runs `hub-core` in Node, behind **Fastify + Socket.io**, with **better-sqlite3 + Drizzle ORM**. No NestJS, no Prisma on the device. (D-03)
  - **Android:** Capacitor runs `hub-core` in the WebView. Kotlin is only thin native plugins: local HTTP/WebSocket server that forwards to JS, SQLite (Drizzle `sqlite-proxy` driver), printer SDK, Foreground Service. **No business logic in Kotlin.** (D-01)
- The Hub schema (Drizzle) is a subset of the cloud schema (Prisma). DTOs and event shapes come from `packages/types`; a contract test checks events are compatible on both sides. (D-03)
- Tablets and other POS devices **always** talk to the Hub over the LAN, online or offline. One code path, no "offline mode".
- **No cloud fallback.** Devices never write orders to the cloud. If the Hub is down, the branch stops taking new orders until the Hub restarts (Electron auto-restarts and starts with Windows) or a manager runs **Promote to Hub** (phase 2, T-38b, details below). Devices show "Hub unavailable". (D-02)
- Hub discovery: IP saved at pairing, mDNS (`_cafepos._tcp`) as fallback.

## Ownership (avoids conflicts)
| Data | Source of truth | Direction |
|---|---|---|
| orders, order items, table sessions and table status, payments, refunds, shifts, cash movements, print jobs, audit logs, loyalty transactions (earn/redeem/reverse), daily availability (`branch_item_availability`) | Hub | Hub → cloud |
| menu, prices and permanent hiding (`item_branch_overrides`), modifiers, branch settings, users, roles, devices, table definitions (number, capacity, section, QR token), entitlements/license, loyalty balances | Cloud | cloud → Hub |
| customers | merged by rule (below) | both |

Apart from the two exceptions below, no record is edited on both sides. If admin edits the menu while the branch is offline, the change waits in the cloud and is pulled on reconnect.

### The only two last-write-wins exceptions (D-29)
Last-write-wins by `updated_at` is allowed in exactly these two places. Everything else has one source of truth.
- **Daily availability (D-05):** an admin change to out-of-stock is sent to the Hub as a **command**; the Hub applies it and emits the event back. Conflicts on `is_out_of_stock` resolve last-write-wins by `updated_at`.
- **Customers (D-06):** phone normalized to E.164; `customers.id = UUIDv5(tenant_id + phone)` and `loyalty_accounts.id` derived the same way, so two branches creating the same customer offline produce the same id and merge naturally. Name: last-write-wins by `updated_at`. Addresses: union, never deleted.
- **Phone change (D-38):** never edit the phone of an existing customer (it is the id). Create a new customer for the new phone, move the balance with two `LOYALTY_ADJUST` transactions (negative on old, positive on new), mark the old one `merged_into = new`, never delete it. Manager permission, reason, audited. The loyalty **balance is never a stored fact on the Hub**; the cloud computes it from `loyalty_transactions` and sends it down read-only.

## Business date and numbering (D-04)
- Each branch has `timezone` (default `Africa/Cairo`) and `business_day_start` (default `06:00`).
- The Hub computes `business_date` for every order with the Hub clock in the branch timezone: before `business_day_start` → previous day.
- The daily number restarts at 1 for each new `business_date`. Daily reports and Z group by `business_date`.
- The daily number is **for display only**, never a key. Orders are unique on `(hub_device_id, business_date, daily_number)` (D-31).

## Write path on the Hub
1. Device sends a command with `client_uuid` (generated on the device) and `device_id`.
2. Hub validates (entitlements via license, permissions, `pricing`), writes the domain rows **and** an outbox event in one SQLite transaction.
3. Hub assigns `business_date` and the daily order number (Hub is the only numberer). Hub clock is the reference time.
4. Hub broadcasts to local devices and creates print jobs.
5. A command repeated with the same `client_uuid` returns the original result (idempotent).

## Outbox → cloud (D-08)
- Hub table `outbox_events`: `id (uuid)`, `seq bigint` (monotonic per Hub), `type`, `payload`, `created_at`, `sent_at`.
- Cloud table `sync_inbox`: `tenant_id`, `hub_device_id`, `seq`, `event_id` (unique), `type`, `received_at`, `applied_at`; unique `(hub_device_id, seq)`.
- Uploader sends batches in `seq` order, retries with backoff, never skips a failed event.
- Applying an already-received event is a no-op. Events are applied in a transaction per batch.
- Cloud acknowledges the highest contiguous `seq` applied; Hub marks events sent up to it.
- Events are facts ("OrderCreated", "ItemVoided", "PaymentRecorded", "RefundRecorded"), with full payloads (snapshots), so the cloud can rebuild without asking the Hub.

## Cloud → Hub
- Pull by `updated_since` cursor per entity type (menu, settings, users, tables, license, loyalty balances). Server pushes a "changed" nudge over Socket.io; Hub then pulls. Admin commands for Hub-owned data (out-of-stock) are delivered the same way.
- Pull order on reconnect: upload outbox first, then pull config, then refresh license, then loyalty balances.

## Loyalty offline
Earn is recorded locally and synced. Redeem uses the last known balance, capped by `offline_redeem_limit`; the cloud reconciles on sync and flags negative balances for review.

## Limits and status
- Connection status (online / offline / Hub unavailable + pending event count + last sync time) is shown on every device.
- Offline longer than `maxOfflineHours` (platform default, per-tenant override, D-21) → no new orders; open orders can still be closed (see entitlements skill).
- A suspended tenant's license is revoked on the next sync (D-22).
- QR ordering is disabled while the Hub is unreachable from the cloud; the menu still shows.

## Devices
- Pairing: admin creates a short-lived code; device exchanges it for a long-lived device token (stored hashed server-side) and a role (HUB / CASHIER / CAPTAIN). Revocation is immediate on the cloud and propagated to the Hub.
- Device count limits come from entitlements, per type (the Hub counts as the cashier).
- **Promote to Hub (phase 2, D-02, D-31):**
  1. A manager promotes a paired cashier device after **confirming the old Hub is down**.
  2. The cloud revokes the old Hub immediately and issues a new `hub_epoch` (stored on the branch and the device). Events carry the epoch of the Hub that produced them.
  3. The new Hub pulls the latest state and continues numbering from the last number the cloud knows for the same `business_date` **+ 500**, so the kitchen never sees a repeated number. Audited as `HUB_PROMOTED`.
  4. After promotion the old Hub can no longer accept commands from devices. As soon as it reaches the cloud it learns it was revoked and enters **drain** mode immediately: rejects every new command, uploads its remaining outbox (the outbox is never discarded), then asks to be re-paired.
  5. **The cloud never rejects an event from a stale epoch.** Those events are facts (food was served, money was paid). They are accepted and applied normally (idempotent by event id). Orders whose events happened after the promotion time are flagged `recovered_from_drain = true`.
  6. Their revenue and payments go into reports, attributed to the old Hub's shift, or to a recovered shift (`shifts.kind = RECOVERED`) if they have no open shift.
  7. Recovered orders are listed in the admin under "أوردرات مستردة من Hub متوقف" for the manager to review and close the open ones. Audited as `HUB_DRAINED`.
  8. Duplicate daily numbers between the old and new Hub are **not** an error: uniqueness is `(hub_device_id, business_date, daily_number)`. The recovered list shows the device next to the order number.

## Testing (required)
- Duplicate submission → one order.
- Out-of-order and duplicated event batches → correct final state.
- Kill the network mid-batch, restart the Hub mid-upload → no loss, no duplicates.
- One hour offline with 200 orders across 3 tablets → full sync, totals match.
- Menu change while offline → appears after reconnect, old orders keep snapshots.
- Same customer created offline in two branches → one customer, addresses merged.
- Orders across `business_day_start` → correct `business_date` and number reset.
- Event contract test between the Hub (Drizzle) and the cloud (Prisma).
- Promote to Hub: the old Hub drains its outbox without duplicate events and rejects new commands; nothing from a stale epoch is rejected by the cloud.
- **Required scenario (D-31):** a Hub loses internet, another device is promoted, the old Hub records 10 orders while disconnected, then the internet returns → all 10 orders exist in the cloud, are flagged `recovered_from_drain`, appear in the recovered list, and report/shift totals include every payment (no money missing).
- Customer phone change: balance moved exactly, old customer `merged_into` the new one.
Write these as automated integration tests (a fake cloud and a Hub process), not only manual checks.
