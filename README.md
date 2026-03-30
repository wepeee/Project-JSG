# Production Monitoring App (T3 + Prisma)

Web app monitoring produksi dengan multi-role dashboard:
- `SUPERADMIN`
- `ADMIN`
- `PPIC`
- `OPERATOR`
- `MASTER`

Fokus utama:
- manajemen PRO dan proses produksi (paper + rigid),
- laporan harian operator,
- inventory flow (RAW/WIP/FG),
- dashboard analitik per role.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- tRPC + React Query
- NextAuth
- Prisma + PostgreSQL
- Tailwind CSS + shadcn/ui

## Struktur Dashboard

Routing dashboard memakai role slot pada `src/app/dashboard`:
- `@superadmin`
- `@admin`
- `@ppic`
- `@operator`
- `@master`

Entry utama tetap di `/dashboard`, lalu konten ditentukan dari role user login.

## Prasyarat

- Node.js 20+
- `pnpm` (project memakai `pnpm@10`)
- PostgreSQL (lokal, Docker, Supabase, atau managed service lain)

## Setup Lokal

1. Install dependency:

```bash
pnpm install
```

2. Buat env:

```bash
cp .env.example .env
```

3. Isi minimal variabel berikut di `.env`:
- `AUTH_SECRET`
- `DATABASE_URL`
- `DIRECT_URL`

4. Jalankan migrasi dev:

```bash
pnpm db:migrate:dev --name init
```

5. (Opsional) seed data:

```bash
pnpm db:seed
```

6. Jalankan app:

```bash
pnpm dev
```

## Script Penting

- `pnpm dev` - jalankan dev server
- `pnpm build` - build production
- `pnpm start` - start app production
- `pnpm typecheck` - cek TypeScript
- `pnpm lint` - lint project
- `pnpm db:migrate:dev` - buat + apply migration di dev
- `pnpm db:migrate` - apply migration di staging/prod (`prisma migrate deploy`)
- `pnpm db:seed` - seed data
- `pnpm db:studio` - buka Prisma Studio
- `pnpm db:inject:dummy-pro` - inject data PRO dummy end-to-end

## Database & Migration Policy

Jangan langsung pakai workflow destruktif di production.

Praktik aman:
- dev: `pnpm db:migrate:dev`
- staging/prod: `pnpm db:migrate`
- selalu backup sebelum migrate production
- gunakan strategi expand/backfill/contract untuk perubahan schema besar

Panduan detail ada di:
- [Database Persistence & Safe Migration](docs/database-persistence-safe-migration.md)

## Catatan Supabase

Jika memakai Supabase pooler:
- `DATABASE_URL` gunakan koneksi runtime pooler (`pgbouncer=true&connection_limit=1`)
- `DIRECT_URL` gunakan koneksi direct untuk migrasi/DDL (`sslmode=require`)

Contoh ada di:
- `.env.example`
- [Supabase + Vercel Trial Runbook](docs/supabase-vercel-trial.md)

## CI/CD Dev -> Trial

Workflow GitHub Actions untuk alur aman DB ada di:
- `.github/workflows/deploy-trial.yml`

Workflow ini melakukan:
1. Quality gate (`typecheck`)
2. Migration ke DB trial (`pnpm db:migrate` = `prisma migrate deploy`)
3. Opsional trigger Vercel Deploy Hook

### Setup Sekali (One-time)

Siapkan GitHub Secrets di repository:
- `TRIAL_DATABASE_URL`
- `TRIAL_DIRECT_URL`
- `VERCEL_DEPLOY_HOOK_URL` (opsional)

### Tutorial Harian Dev (Perubahan Schema)

1. Kerja di branch `develop`/feature.
2. Ubah `prisma/schema.prisma`.
3. Generate migration di lokal:

```bash
pnpm db:migrate:dev --name <nama_migrasi>
```

4. Commit `schema.prisma` + `prisma/migrations/...`.
5. Buat PR dan merge ke `main`.
6. Setelah merge, workflow `Deploy Trial` otomatis jalan.
7. Cek hasil di tab `Actions` GitHub.

### Kalau Mau Deploy App Setelah Migration

- Jika pakai Vercel Git Integration: deploy otomatis setelah push/merge ke `main`.
- Jika pakai deploy hook: isi `VERCEL_DEPLOY_HOOK_URL`, workflow akan trigger deploy setelah migration sukses.

### Kalau Workflow Gagal

1. Cek step yang gagal di GitHub Actions.
2. Perbaiki di branch baru.
3. Merge ulang ke `main` (workflow rerun otomatis), atau jalankan manual via `workflow_dispatch`.

### Kapan Perlu Manual Migration?

Manual disarankan jika:
- migration besar/destruktif,
- perlu maintenance window,
- perlu backup + verifikasi operator terlebih dulu.

Perintah manual (ke DB trial/prod-like):

```bash
pnpm db:migrate
```

### Larangan Penting

- Jangan pakai `pnpm db:push` (`prisma db push`) ke trial/prod-like.
- Jangan pakai `pnpm db:reset` di trial/prod-like.

Runbook detail:
- [Dev -> Trial -> Vercel CI/CD](docs/dev-trial-vercel-cicd.md)

## Dokumentasi Internal

- [Global Style Management](docs/global-style-management.md)
- [User Stories by Role](docs/user-stories-by-role.md)
- [Database Persistence & Safe Migration](docs/database-persistence-safe-migration.md)
- [Supabase + Vercel Trial](docs/supabase-vercel-trial.md)
- [Dev -> Trial -> Vercel CI/CD](docs/dev-trial-vercel-cicd.md)

## Catatan Keamanan

- Jangan commit `.env` atau secret apa pun.
- Jika credential pernah ter-expose, segera rotate password/token.
- Untuk production, batasi privilege DB user dan aktifkan backup berkala.
