---
name: audit-log
description: Audit trail and manager-override rules — which actions are audited, what each entry contains, writing it in the same transaction, read-only access, and approval flows for voids and large discounts. Use when implementing voids, discounts, edits after sending, transfers/merges/splits, reprints, cash drawer, price or settings changes, logins, or loyalty adjustments.
---

# Audit log and approvals

The audit log protects owners from staff theft; it is a selling point. (SRS §3.12, §4.) This skill is the reference for the action list and entry fields (D-24 in `docs/DECISIONS.md`); SRS follows it.

## Audited actions (minimum)
`ORDER_ITEM_VOID`, `ORDER_VOID`, `DISCOUNT_APPLIED`, `ORDER_EDITED_AFTER_SEND`, `TABLE_TRANSFER`, `TABLE_MERGE`, `BILL_SPLIT`, `REFUND`, `RECEIPT_REPRINT`, `TICKET_REPRINT`, `CASH_DRAWER_OPEN`, `CASH_MOVEMENT`, `SHIFT_OPEN`, `SHIFT_CLOSE`, `PRICE_CHANGED`, `ITEM_OUT_OF_STOCK`, `SETTINGS_CHANGED`, `ROLE_CHANGED`, `USER_LOGIN`, `MANAGER_OVERRIDE`, `LOYALTY_REDEEM`, `LOYALTY_ADJUST`, `DEVICE_PAIRED`, `DEVICE_REVOKED`, `HUB_PROMOTED`, `HUB_DRAINED`, `CUSTOMER_PHONE_CHANGED`, `SUBSCRIPTION_CHANGED`, `TENANT_SUSPENDED`.

## Entry shape
`tenant_id, branch_id, user_id, approved_by (nullable), device_id, action, entity, entity_id, before (json), after (json), reason, created_at`.
- `reason` is mandatory for voids, discounts over the role limit, refunds, cash-out, loyalty adjustments and customer phone changes; the UI must not allow submitting without it.

## Rules
- The infrastructure (table, RLS, `audit.record`, DB grants) is built in phase 0 (T-04b), so every task from T-05 on writes its audit entries directly. T-12 adds Manager Override, the read API and the admin screen (D-23).
- Write the audit entry **in the same transaction** as the change, through one helper `audit.record(tx, entry)`. If the change commits, the entry exists.
- On the Hub, audit entries go into SQLite and the outbox like any other Hub-owned fact.
- No update or delete API exists for audit logs. The DB role for the app has no UPDATE/DELETE grant on `audit_logs`.
- Visibility: Tenant Admin sees all; Branch Manager sees their branch; others none.

## Manager override
- Actions above a user's permission (void as cashier/captain, refund as cashier, discount above the role's limits) trigger an override: a manager enters their PIN on the same device, or approves a push request on their device.
- Discount limits (D-13): the discount must satisfy **both** `discount_limit_bp` (percent of subtotal) and `discount_limit_amount`; `null` means no limit on that dimension. Breaking either one needs an override. The check comes from `packages/pricing`, not from UI code.
- Refunds (D-14) require Branch Manager permission and a reason; the entry's `after` includes the per-method split (D-33).
- Customer phone change (D-38) requires manager permission and a reason; one `CUSTOMER_PHONE_CHANGED` entry references both customers and the two `LOYALTY_ADJUST` transactions.
- `HUB_PROMOTED` records the manager's confirmation that the old Hub is down and the new `hub_epoch`; `HUB_DRAINED` records the drained Hub and the recovered open orders (D-31).
- Failed PIN attempts and the lock (5 attempts → 1 minute on the user, D-34) are recorded under `USER_LOGIN` with the outcome.
- Both the requester (`user_id`) and the approver (`approved_by`) are recorded.
- Discount limits are per role and set by the Tenant Admin in settings, including for captains.

## Tests
Each audited action has a test asserting the entry and its before/after (and `approved_by` for overrides); a rollback test proves no entry is left when the change fails; a test proves the API rejects edits/deletes.
