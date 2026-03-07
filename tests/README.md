# PPIC/LPH/Inventory Tests

## Prerequisites
- PostgreSQL test database configured in `.env.test.local`
- `DATABASE_URL` must target a test DB (name contains `test`)

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/belajar_test?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/belajar_test?schema=public"
```

## Run
- All tests: `pnpm test`
- Unit only: `pnpm test:unit`
- Integration only: `pnpm test:integration -- --runInBand`

## Notes
- Integration suite runs DB migration (`prisma migrate deploy`, fallback `prisma db push`).
- Tables are truncated after every integration test for repeatability.
- Test data uses numeric-only 9-digit item/PN codes.
- In CI, do not rely on `.env.test.local`; provide `DATABASE_URL` as CI env var/secret.

## Minimal PostgreSQL prerequisite
- PostgreSQL server is reachable from runner (default `localhost:5432`).
- Test DB name includes `test` (for safety guard in `tests/setup.ts`).
