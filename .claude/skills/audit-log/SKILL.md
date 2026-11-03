---
name: audit-log
description: Audit trail and manager-override rules — which actions are audited, what each entry contains, writing it in the same transaction, read-only access, and approval flows for voids and large discounts. Use when implementing voids, discounts, edits after sending, transfers/merges/splits, reprints, cash drawer, price or settings changes, logins, or loyalty adjustments.
---

# Audit log and approvals

The audit log protects owners from staff theft; it is a selling point. (SRS §3.12, §4.)

## Audited actions (minimum)
`ORDER_ITEM_VOID`, `ORDER_VOID`, `DISCOUNT_APPLIED`, `ORDER_EDITED_AFTER_SEND`, `TABLE_TRANSFER`, `TABLE_MERGE`, `BILL_SPLIT`, `RECEIPT_REPRINT`, `TICKET_REPRINT`, `CASH_DRAWER_OPEN`, `CASH_MOVEMENT`, `SHIFT_OPEN`, `SHIFT_CLOSE`, `PRICE_CHANGED`, `ITEM_OUT_OF_STOCK`, `SETTINGS_CHANGED`, `ROLE_CHANGED`, `USER_LOGIN`, `MANAGER_OVERRIDE`, `LOYALTY_REDEEM`, `LOYALTY_ADJUST`, `DEVICE_PAIRED`, `DEVICE_REVOKED`.

## Entry shape
`tenant_id, branch_id, user_id, approved_by (nullable), device_id, action, entity, entity_id, before (json), after (json), reason, created_at`.
- `reason` is mandatory for voids, discounts over the role limit, cash-out and loyalty adjustments; the UI must not allow submitting without it.

## Rules
- Write the audit entry **in the same transaction** as the change, through one helper `audit.record(tx, entry)`. If the change commits, the entry exists.
- On the Hub, audit entries go into SQLite and the outbox like any other Hub-owned fact.
- No update or delete API exists for audit logs. The DB role for the app has no UPDATE/DELETE grant on `audit_logs`.
- Visibility: Tenant Admin sees all; Branch Manager sees their branch; others none.

## Manager override
- Actions above a user's permission (void as cashier/captain, discount above the role's `discount_limit_bp`/`discount_limit_amount`) trigger an override: a manager enters their PIN on the same device, or approves a push request on their device.
- Both the requester (`user_id`) and the approver (`approved_by`) are recorded.
- Discount limits are per role and set by the Tenant Admin in settings, including for captains.

## Tests
Each audited action has a test asserting the entry and its before/after; a rollback test proves no entry is left when the change fails; a test proves the API rejects edits/deletes.
