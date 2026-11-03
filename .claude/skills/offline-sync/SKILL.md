---
name: offline-sync
description: Hub-first offline architecture — the branch Hub (Electron/Android) with SQLite, tablets talking to the Hub over LAN, the outbox/event sync with the cloud, idempotency, daily order numbers, device pairing and offline limits. Use for any work on the Hub, sync, devices, connectivity status, or anything that must keep working without internet.
---

# Offline and sync

The branch must keep taking orders, printing and closing shifts with no internet. (SRS §5.4–5.6, §7.6.)

## Topology
- One **Hub** per branch (the main cashier device: Windows/Electron first, Android later). It runs a local HTTP + Socket.io server and SQLite.
- Tablets and other POS devices **always** talk to the Hub over the LAN, online or offline. There is one code path, not an "offline mode".
- The Hub syncs with the cloud in the background. If the Hub itself is down and the internet is up, devices fall back to the cloud API directly (same API contract).
- Hub discovery: IP saved at pairing, mDNS (`_cafepos._tcp`) as fallback.

## Ownership (avoids conflicts)
| Data | Source of truth | Direction |
|---|---|---|
| orders, order items, table sessions, payments, shifts, cash movements, print jobs, audit logs, loyalty earn/redeem | Hub | Hub → cloud |
| menu, prices, modifiers, branch settings, users, roles, devices, tables, entitlements/license, loyalty balances | Cloud | cloud → Hub |
No record is edited on both sides. If admin edits the menu while the branch is offline, the change waits in the cloud and is pulled on reconnect.

## Write path on the Hub
1. Device sends a command with `client_uuid` (generated on the device) and `device_id`.
2. Hub validates (entitlements via license, permissions, `pricing` package), writes the domain rows **and** an outbox event in one SQLite transaction.
3. Hub assigns the branch's daily order number (Hub is the only numberer). Hub clock is the reference time.
4. Hub broadcasts to local devices and creates print jobs.
5. A command repeated with the same `client_uuid` returns the original result (idempotent).

## Outbox → cloud
- `sync_events`: `id (uuid)`, `device_id`, `seq` (monotonic per Hub), `type`, `payload`, `created_at`, `sent_at`.
- Uploader sends batches in `seq` order, retries with backoff, never skips a failed event.
- Cloud stores `(hub_device_id, seq)` and the event id; applying an already-applied event is a no-op. Events are applied in a transaction per batch.
- Cloud acknowledges the highest contiguous `seq` applied; Hub marks events sent up to it.
- Events are facts ("OrderCreated", "ItemVoided", "PaymentRecorded"), with full payloads (snapshots), so the cloud can rebuild without asking the Hub.

## Cloud → Hub
- Pull by `updated_since` cursor per entity type (menu, settings, users, tables, license). Server pushes a "changed" nudge over Socket.io; Hub then pulls.
- Pull order on reconnect: upload outbox first, then pull config, then refresh license.

## Loyalty offline
Earn is recorded locally and synced. Redeem uses the last known balance, capped by `offline_redeem_limit`; the cloud reconciles on sync and flags negative balances for review.

## Limits and status
- Connection status (online / offline + pending event count + last sync time) is shown on every device.
- Offline longer than `maxOfflineHours` → no new orders; open orders can still be closed (see entitlements skill).
- QR ordering is disabled while the Hub is unreachable from the cloud; the menu still shows.

## Devices
- Pairing: admin creates a short-lived code; device exchanges it for a long-lived device token (stored hashed server-side) and a role (HUB / CASHIER / CAPTAIN). Revocation is immediate on the cloud and propagated to the Hub.
- Device count limits come from entitlements.

## Testing (required)
- Duplicate submission → one order.
- Out-of-order and duplicated event batches → correct final state.
- Kill the network mid-batch, restart the Hub mid-upload → no loss, no duplicates.
- One hour offline with 200 orders across 3 tablets → full sync, totals match.
- Menu change while offline → appears after reconnect, old orders keep snapshots.
Write these as automated integration tests (a fake cloud and a Hub process), not only manual checks.
