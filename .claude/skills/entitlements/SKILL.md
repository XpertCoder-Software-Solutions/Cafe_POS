---
name: entitlements
description: Subscription, add-on and feature-access logic — the can() function, grace periods, automatic restriction, tenant suspension, per-unit branch/device add-ons, tenant toggles, and the signed offline license token. Use when gating any feature, touching plans/add-ons/subscription payments, or building the license for the Hub.
---

# Entitlements

A feature is usable only when all three hold, and the tenant is not suspended:
```
usable = granted AND (valid OR in grace) AND enabled by the tenant
```
(SRS §2; decisions D-17 → D-22 and D-32 in `docs/DECISIONS.md`, which win on conflict.)

## Codes (D-20)
One source of truth in `packages/types`:
- `FeatureCode`: `DINE_IN | TAKEAWAY | DELIVERY | QR_ORDERING | LOYALTY | ADVANCED_REPORTS`
- `AddonCode`: `EXTRA_BRANCH | EXTRA_CASHIER | EXTRA_CAPTAIN | DELIVERY | QR_ORDERING | LOYALTY | ADVANCED_REPORTS`

`DINE_IN` and `TAKEAWAY` come from the base plan. Never invent other strings.

## The single entry point
- `packages/entitlements` exports `can(ctx, feature, opts?)`, `explain(ctx, feature)` and `limits(ctx)`.
  - `ctx`: `{ tenantId, branchId?, deviceId? }` plus an `EntitlementSnapshot` (from cache on the server, from the license on the Hub) and `now`.
  - `can()` returns a result object, not a boolean: `{ allowed, state: 'ACTIVE'|'GRACE'|'RESTRICTED'|'NOT_GRANTED'|'DISABLED'|'SUSPENDED', graceEndsAt?, reason }`.
  - With a `branchId`, `can()` also checks that branch's own entitlement (base plan for the primary branch, its `EXTRA_BRANCH` record otherwise). With a `deviceId`, it checks that device's slot.
- Nothing else checks plans. `if (tenant.plan === ...)` anywhere is a bug. Add a lint rule or grep check in CI.
- The function is pure: give it a snapshot and `now`, it returns the answer. Identical on server and Hub, trivially testable.

## State is computed, not trusted
- State is derived from `starts_at`, `ends_at`, and grace days every time.
- Grace days = record override ?? tenant override ?? `platform_settings.default_grace_days`.
- `status_cached` columns exist only for dashboards and notifications. The hourly job (BullMQ) updates them and fires notifications (7, 3, 1 days before end; grace entered; restricted), but correctness never depends on the job having run.

## Notifications (D-22)
- MVP channels: in-app (banner + notification center in admin and platform dashboards) and **email** to the Tenant Admin and the platform owner.
- Everything goes through one `Notifier` interface with pluggable providers, so WhatsApp/SMS can be added later without touching callers. Tests use a fake provider.

## Branches and devices: one record per unit (D-18, D-19, D-32)
- Every extra branch and every extra device is its **own** `tenant_addons` row: `quantity = 1`, `target_type` (`BRANCH`|`DEVICE`) + `target_id`, its own dates and grace.
- The base plan covers the branch marked `is_primary`. **Every** branch — the primary and each `EXTRA_BRANCH` — includes `included_cashiers` (1 — the Hub counts as this cashier) and `included_captains` (2).
- Extra device slots are typed (`EXTRA_CASHIER` or `EXTRA_CAPTAIN`) and **bound to a branch** (`branch_id`); `target_id` is the device occupying the slot. Enforce at device pairing, per branch: a device needs a free included slot of its type in its branch, or an active add-on record of that branch bound to it.
- When a record is restricted, **exactly the bound branch or device** is restricted. There is no "oldest stays active" rule. Never delete branches or devices.

## Restriction semantics (SRS §2.4, D-17)
When a feature (or a branch's record) becomes `RESTRICTED`:
- Creating a new order of that type, or adding a new round/items to an open order of that type, is rejected with `FEATURE_RESTRICTED`.
- Allowed on existing open orders: pay, split, transfer, merge, void an item, close, reprint. Shift close still works.
- Restriction affects only that feature (delivery restricted does not stop dine-in). A restricted **base plan** blocks every new order type.
- All historical data and reports stay readable. Never delete anything.

## Suspension (D-22)
- Manual action by the platform owner (`tenants.status = SUSPENDED`). Different from restriction: no grace, everything stops at once, and open orders can **not** be closed from devices.
- `can()` returns `SUSPENDED` for every feature. The Tenant Admin keeps read-only access to the admin dashboard (reports and export).
- The Hub's license is revoked on the next sync.

## Grace UX
During grace, both admin and cashier show a banner with days remaining. Expose `explain()` so the UI gets the text and date.

## Tenant toggles
`feature_toggles` (tenant-wide or per branch) can only switch **off** a granted feature, or back on. A toggle can never grant.

## Caching
- Server: snapshot cached in Redis `t:<tenantId>:entitlements`, invalidated on any change to subscriptions, add-ons, toggles, payments or tenant status. Publish an event so connected Hubs refresh their license.

## Offline license (Hub)
- Server issues a JWT signed with **Ed25519** (private key only on the server). Claims: `tenantId`, `branchId`, `tenantStatus`, `features` (with startsAt/endsAt/graceDays per feature), `branchEntitlement`, `deviceSlots`, `maxOfflineHours`, `iat`, `exp`.
- `maxOfflineHours` = `tenants.max_offline_hours_override ?? platform_settings.max_offline_hours` (D-21).
- The Hub verifies with the embedded public key and runs the same `can()` on it with the Hub's clock.
- If the Hub has been offline longer than `maxOfflineHours` since last successful sync: block new orders, allow closing open ones.
- Guard against clock rollback: store the highest `now` ever seen; if the system clock goes backward significantly, treat time as the stored maximum.

## Manual subscription payments
Recording a payment (`subscription_payments`) and extending the covered plan/add-ons happen in one transaction, with a subscription event and an audit entry.

## Tests
Cover every state transition, device slots counted per branch (an extra branch brings its own 1 cashier + 2 captains), grace override precedence, toggle-off of a granted feature, toggle-on of a non-granted feature (still denied), per-unit branch and device records (restricting one restricts only its target), device slots by type, restriction with an open order (pay/close allowed, new round rejected), suspension, license tampering, expired license, max-offline override, and offline-limit exceeded.
