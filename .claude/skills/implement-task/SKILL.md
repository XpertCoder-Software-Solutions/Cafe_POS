---
name: implement-task
description: Implement one backlog task (T-xx) end to end — read its row in docs/BACKLOG.md and the referenced SRS sections, plan, get approval, build with tests, verify, and update the backlog. Use whenever the user says "implement T-xx", "next task", or names a task ID.
---

# Implementing a backlog task

The project is built one task at a time from `docs/BACKLOG.md`. Each task has an ID, the SRS requirements it covers, its dependencies, and a done-criterion. Follow these steps in order.

## 1. Load context
- Read the task's row in `docs/BACKLOG.md`.
- Read every SRS section / FR code it references in `docs/SRS.md`. Read the whole section, not only the FR line.
- Check every dependency task is marked done (`[x]`) in the backlog. If one is not, stop and tell the user which.
- Read `CLAUDE.md` rules again. They override anything else.
- Load any other project skill the task touches (see "Skill map" below).

## 2. Plan (do not write code yet)
Present a short plan:
- Files to create or change, grouped by package/app.
- Schema / migration changes (tables, columns, RLS policies, indexes).
- Public API (endpoints, events, function signatures).
- Tests you will write, and which edge cases they cover.
- Anything in the SRS that is ambiguous → ask as a numbered question. Never guess on money, permissions, sync, or entitlements.

Wait for the user's approval.

## 3. Build
- Write tests alongside code. For `packages/pricing`, `packages/entitlements`, `packages/sync`: tests first.
- Keep the change scoped to this task. If you discover needed work outside it, note it as a follow-up instead of doing it.
- New tenant-scoped tables get `tenant_id`, an RLS policy, and an isolation test in the same change.
- Sensitive actions write an audit log in the same transaction.

## 4. Verify (all must pass before saying done)
```
pnpm typecheck
pnpm lint
pnpm test
```
Then check the done-criterion from the backlog row explicitly, and say how it was checked. If it needs real hardware (printer, POS device) say so and give the user exact manual test steps.

## 5. Close
- Mark the task `[x]` in `docs/BACKLOG.md`.
- Summarize: what changed, migrations added, how to run/test it, follow-ups.
- Propose a commit message: `feat(T-xx): <short summary>`.

## Skill map
| Task touches | Load skill |
|---|---|
| totals, tax, service, discounts, rounding, payments, Z-report, loyalty points | money-and-pricing |
| any new table, query, repository, auth context | multi-tenancy-rls |
| features, add-ons, plans, grace, restriction, license token | entitlements |
| Hub, offline, outbox, devices, idempotency | offline-sync |
| receipts, tickets, printers, ESC/POS | thermal-printing |
| void, discount, refund, reprint, price change, settings | audit-log |
| any React screen in pos/admin/platform/menu | pos-ui |
