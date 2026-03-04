# PPIC/LPH/Inventory Tests

## Prerequisites
- MySQL test database configured in `.env.test.local`
- `DATABASE_URL` must target a test DB (name contains `test`)

Example:

```env
DATABASE_URL="mysql://root:password@localhost:3306/belajar_test"
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

## Minimal MySQL prerequisite
- MySQL server is reachable from runner (default `localhost:3306`).
- Test DB name includes `test` (for safety guard in `tests/setup.ts`).
