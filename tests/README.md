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
- Integration only: `pnpm test:integration`

## Notes
- Integration suite runs DB migration (`prisma migrate deploy`, fallback `prisma db push`).
- Tables are truncated after every integration test for repeatability.
- Test data uses numeric-only 9-digit item/PN codes.
