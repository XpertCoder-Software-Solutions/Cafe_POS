---
name: multi-tenancy-rls
description: Tenant isolation rules for the SaaS — tenant_id on every table, PostgreSQL Row Level Security, Prisma tenant context, and isolation tests. Use when adding a table, writing a query or repository, touching auth/request context, or writing migrations.
---

# Multi-tenancy and RLS

One database, many restaurants. A data leak between tenants is the worst bug this product can have. Two layers protect against it: application context and PostgreSQL RLS.

## Every tenant-scoped table
- Has `tenant_id uuid not null` with an index (usually composite with the main lookup column).
- Branch-scoped tables also carry `branch_id`; still keep `tenant_id` for RLS.
- Platform-level tables (`plans`, `addon_catalog`, `platform_settings`) have no `tenant_id` and are only reachable from the platform app.

## RLS setup (in the migration that creates the table)
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (tenant_id = current_setting('app.tenant_id', true)::uuid)
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::uuid);
```
- The app connects as a role that is **not** a superuser and **not** the table owner (owners bypass RLS unless FORCE is set; keep FORCE anyway).
- Platform-admin operations use a separate role/connection with `BYPASSRLS`, used only inside the platform module.

## Prisma tenant context
- Each request runs inside a transaction that first executes `SELECT set_config('app.tenant_id', $1, true)` (transaction-local).
- Implement this once as a Prisma client extension / `TenantPrismaService.run(tenantId, fn)`. Repositories receive the scoped client; they never accept `tenantId` from request bodies.
- `tenantId` comes from the authenticated principal (user JWT or device token), never from URL params or payloads.
- Background jobs set the context explicitly per tenant they process.

## Queries
- Still filter by `tenant_id` in application queries (defense in depth, better plans).
- Raw SQL must run through the scoped client.
- IDs from the client (e.g. `item_id` in an order) are re-validated as belonging to the tenant before use — RLS makes the lookup fail, treat that as 404.

## Required tests for every new table
An isolation test that:
1. Creates data for tenant A and tenant B.
2. Sets context to A and runs `findMany()` with **no where clause** → only A's rows.
3. Tries to insert a row with B's `tenant_id` under A's context → rejected.

Keep a shared helper `expectTenantIsolation(model)` so each table's test is one line, and a CI check that fails if a table with `tenant_id` has no policy:
```sql
SELECT c.relname FROM pg_class c JOIN pg_attribute a ON a.attrelid=c.oid
WHERE a.attname='tenant_id' AND c.relkind='r' AND NOT c.relrowsecurity;
```

## Files and caches
- R2 object keys are prefixed `tenants/<tenantId>/...`.
- Redis keys are prefixed `t:<tenantId>:...`.
- Socket.io rooms are `tenant:<id>`, `branch:<id>`, `station:<deviceId>`; a socket joins only rooms of its own tenant.
