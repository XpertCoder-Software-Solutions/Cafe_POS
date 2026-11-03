---
name: entitlements
description: Subscription, add-on and feature-access logic — the can() function, grace periods, automatic restriction, tenant toggles, and the signed offline license token. Use when gating any feature, touching plans/add-ons/subscription payments, or building the license for the Hub.
---

# Entitlements

A feature is usable only when all three hold:
```
usable = granted AND (valid OR in grace) AND enabled by the tenant
```
(SRS §2.)

## The single entry point
- `packages/entitlements` exports `can(ctx, feature, opts?)` and `explain(ctx, feature)`.
  - `ctx`: `{ tenantId, branchId? }` plus an `EntitlementSnapshot` (from cache on the server, from the license on the Hub).
  - `feature`: enum `DINE_IN | TAKEAWAY | DELIVERY | QR_ORDERING | LOYALTY | EXTRA_BRANCH | EXTRA_DEVICE | ADVANCED_REPORTS`.
  - Returns a result object, not a boolean: `{ allowed, state: 'ACTIVE'|'GRACE'|'RESTRICTED'|'NOT_GRANTED'|'DISABLED', graceEndsAt?, reason }`.
- Nothing else checks plans. `if (tenant.plan === ...)` anywhere is a bug. Add a lint rule or grep check in CI.
- The function is pure: give it a snapshot and `now`, it returns the answer. This makes it identical on server and Hub and trivially testable.

## State is computed, not trusted
- State is derived from `starts_at`, `ends_at`, and grace days every time.
- Grace days = record override ?? tenant override ?? `platform_settings.default_grace_days`.
- `status_cached` columns exist only for dashboards and notifications. The hourly job (BullMQ) updates them and fires notifications (7, 3, 1 days before end; grace entered; restricted), but correctness never depends on the job having run.

## Quantity add-ons
- Branch count limit = plan included branches + sum of active `EXTRA_BRANCH` quantities.
- Device limit = plan included devices (1 cashier + 2 captains) + active `EXTRA_DEVICE` quantities. Enforce at device pairing.
- When quantity drops (add-on restricted), do not delete branches/devices: block creating new ones and block orders on branches beyond the limit, oldest branches stay active.

## Restriction semantics (SRS §2.4)
When a feature becomes `RESTRICTED`:
- Creating a new order of that type, or adding items to an order of that type, is rejected with a clear error code `FEATURE_RESTRICTED`.
- Existing open orders can still be completed, paid and closed. Shift close still works.
- All historical data and reports stay readable.
- Never delete anything.

## Grace UX
During grace, both admin and cashier show a banner with days remaining. Expose `explain()` so the UI gets the text and date.

## Tenant toggles
`feature_toggles` (tenant-wide or per branch) can only switch **off** a granted feature, or back on. A toggle can never grant.

## Caching
- Server: snapshot cached in Redis `t:<tenantId>:entitlements`, invalidated on any change to subscriptions, add-ons, toggles, or payments. Publish an event so connected Hubs refresh their license.

## Offline license (Hub)
- Server issues a JWT signed with **Ed25519** (private key only on the server). Claims: `tenantId`, `branchId`, `features` (with startsAt/endsAt/graceDays per feature), `limits`, `maxOfflineHours`, `iat`, `exp`.
- The Hub verifies with the embedded public key and runs the same `can()` on it with the Hub's clock.
- If the Hub has been offline longer than `maxOfflineHours` since last successful sync: block new orders, allow closing open ones.
- Guard against clock rollback: store the highest `now` ever seen; if the system clock goes backward significantly, treat time as the stored maximum.

## Manual subscription payments
Recording a payment (`subscription_payments`) and extending the covered plan/add-ons happen in one transaction, with an audit/subscription event.

## Tests
Cover every state transition, grace override precedence, toggle-off of a granted feature, toggle-on of a non-granted feature (still denied), quantity limits, restriction with an open order, license tampering, expired license, and offline-limit exceeded.
