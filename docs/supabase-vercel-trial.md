# Supabase Postgres + Vercel Trial Runbook

## 1) Required env vars

```env
DATABASE_URL="postgresql://<POOLER_USER>:<PASSWORD>@<POOLER_HOST>:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_URL="postgresql://<DB_USER>:<PASSWORD>@<DIRECT_HOST>:5432/postgres?sslmode=require"
AUTH_SECRET="<long-random-secret>"
AUTH_TRUST_HOST=true
NODE_ENV=production
```

## 2) Apply schema to Supabase

```bash
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm prisma db seed
```

## 3) Deploy to Vercel

1. Import repo to Vercel
2. Set framework preset: `Next.js`
3. Set env vars for Production (same keys as above)
4. Deploy

## 4) Verify after deploy

1. Open app URL and login
2. Create/update one record that touches Prisma writes
3. Check Supabase table rows updated
4. Check Vercel logs for DB/auth errors
