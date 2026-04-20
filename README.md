# Project JSG - Production Monitoring System

Aplikasi web monitoring produksi multi-role untuk operasional pabrik (paper & rigid), dengan fokus pada:
- perencanaan PRO,
- eksekusi laporan harian operator (LPH),
- verifikasi superadmin,
- inventory flow RAW/WIP/FG,
- dashboard analitik lintas role.

Dokumen ini ditulis sebagai **onboarding context** untuk developer baru dan AI agent baru.

## 1) Identitas Project

- Nama operasional: **Project JSG**
- Domain use case: **Manufacturing Production Monitoring**
- Frontend/backend style: **Monorepo Next.js App Router + tRPC**
- Database utama: **PostgreSQL**
- ORM: **Prisma**
- Auth: **NextAuth Credentials**

Role utama di sistem:
- `SUPERADMIN`
- `ADMIN`
- `PPIC`
- `OPERATOR`
- `MASTER`

## 2) Tech Stack

- Next.js 15 (App Router)
- TypeScript
- tRPC + TanStack Query
- NextAuth (credentials)
- Prisma + PostgreSQL
- Tailwind CSS + shadcn/ui
- Jest (integration + unit)

## 3) Struktur Aplikasi

Entry dashboard di `/dashboard` dengan role-slot:
- `src/app/dashboard/@superadmin`
- `src/app/dashboard/@admin`
- `src/app/dashboard/@ppic`
- `src/app/dashboard/@operator`
- `src/app/dashboard/@master`

Root layout:
- metadata/title di `src/app/layout.tsx`
- providers (session/theme/progress) di `src/app/providers.tsx`

Catatan UI global saat ini:
- default theme: `dark`
- favicon aktif: `/jsg.ico`

## 4) Domain Data Inti (Prisma)

Lihat `prisma/schema.prisma`.

Entity utama:
- `User`, `UserMachineAccess`
- `Machine` (dengan UOM dan kapasitas shift)
- `Item` (unified RAW/WIP/FG/CONSUMABLE)
- `Pro`, `Proses`, `ProsesMaterial`
- `ProductionReport`
- `InventoryLocation`, `InventoryTxn`

Poin penting model saat ini:
- `Proses.plannedQtyPcs` untuk target per row/proses
- `Proses.splitGroupId` untuk grouping proses hasil split
- `ProductionReport.outputUom` (`pcs`/`sheet`) sebagai snapshot UOM output laporan
- Inventory posting ditrace ke PRO/Proses/Report via FK

## 5) Aturan Bisnis Penting (Current Behavior)

### 5.1 Perhitungan target/shift PRO
- Source utama perhitungan adalah **target PRO (`qtyPoPcs`)**.
- `UP/CAV` dipakai untuk konversi kebutuhan lembar (`sheet`) saat estimasi shift.
- Jika proses terpecah menjadi multi-shift, target didistribusikan ke row berdasarkan load shift (integer distribution), totalnya tetap sama dengan target PRO.

### 5.2 Output UOM laporan operator
- Output UOM laporan disimpan sebagai snapshot `ProductionReport.outputUom`.
- Fokus UOM output saat ini: `pcs` dan `sheet`.
- Dipakai agar verifikasi/arsip tidak ambigu unit output.

### 5.3 Inventory
- Sistem menyimpan transaksi IN/OUT/ADJUST di `InventoryTxn`.
- Traceability mengikat transaksi ke `Pro`, `Proses`, dan/atau `ProductionReport`.

## 6) Setup Lokal

Prasyarat:
- Node.js 20+
- pnpm 10+
- PostgreSQL

Langkah:

```bash
pnpm install
cp .env.example .env
```

Isi variabel minimal di `.env`:
- `AUTH_SECRET`
- `DATABASE_URL`
- `DIRECT_URL`

Lalu:

```bash
pnpm db:generate
pnpm db:migrate:dev --name init
pnpm db:seed   # opsional
pnpm dev
```

## 7) Script Penting

Aplikasi:
- `pnpm dev` - dev server
- `pnpm build` - build production
- `pnpm start` - start production server
- `pnpm preview` - build + start

Quality:
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:unit`
- `pnpm test:integration`

Database:
- `pnpm db:generate`
- `pnpm db:migrate:dev`
- `pnpm db:migrate` (deploy migration)
- `pnpm db:seed`
- `pnpm db:studio`
- `pnpm db:push` (dev only, bukan prod-like)
- `pnpm db:reset` (dev only)

Inject sample data:
- `pnpm db:inject:dummy-pro`
- `pnpm db:inject:paper-approved`
- `pnpm db:inject:paper-daily-sample`
- `pnpm db:inject:pending-verification`
- `pnpm db:inject:rigid-4pro-1step`
- `pnpm db:inject:rigid-daily-sample`

## 8) Deployment (Server SSH)

Flow ringkas deploy rutin:

```bash
git fetch origin
git pull origin main
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:migrate
pnpm build
pm2 restart all --update-env
pm2 save
```

Verifikasi cepat:

```bash
pm2 status
pm2 logs --lines 100
```

## 9) DB Strategy: Dev / Trial / Prod-like

Prinsip aman:
- Dev: `prisma migrate dev`
- Trial/Prod-like: `prisma migrate deploy`
- Hindari `db push` dan `db reset` di environment prod-like
- Selalu backup sebelum migration penting

Jika database existing non-empty dan kena `P3005`, lakukan baseline sekali (`prisma migrate resolve --applied ...`) lalu lanjut `migrate deploy`.

## 10) CI/CD

Workflow:
- `.github/workflows/deploy-trial.yml`

Cakupan utama:
- quality gate,
- migrate trial database,
- verifikasi sinkron schema,
- optional trigger Vercel deploy hook.

Dokumen detail:
- `docs/dev-trial-vercel-cicd.md`

## 11) Troubleshooting Cepat

### Logout redirect ke localhost
- Pastikan `NEXTAUTH_URL` di server adalah domain production (bukan localhost).
- Restart dengan `pm2 restart all --update-env`.

### `git pull` ditolak karena perubahan lokal generated Prisma
- Bersihkan perubahan generated lalu pull ulang:

```bash
git restore generated/prisma
git clean -fd generated/prisma
git pull origin main
```

### Transaction timeout Prisma
- Kurangi pekerjaan di dalam interactive transaction.
- Lakukan precheck di luar transaction bila memungkinkan.

## 12) Testing & Regression Safety

Integration tests utama tersedia di:
- `tests/integration/fk-integrity.test.ts`
- `tests/integration/inventory-posting-invariants.test.ts`
- `tests/integration/item-governance.test.ts`
- `tests/integration/p1-blindspots.test.ts`
- `tests/integration/paper-regression.test.ts`
- `tests/integration/pro-shift-calculation.test.ts`
- `tests/integration/report-output-uom.test.ts`
- `tests/integration/rigid-flow.test.ts`

Jalankan:

```bash
pnpm test:integration
```

## 13) Dokumentasi Internal

- `docs/user-stories-by-role.md`
- `docs/global-style-management.md`
- `docs/database-persistence-safe-migration.md`
- `docs/supabase-vercel-trial.md`
- `docs/dev-trial-vercel-cicd.md`
- `docs/reports/shift-split-monitoring-revision-2026-04-10.md`

## 14) Security Notes

- Jangan commit `.env` dan secret.
- Rotate credential yang pernah terekspos.
- Gunakan user DB dengan privilege minimum.
- Pastikan backup restore drill berjalan berkala.

## 15) AI Handoff Notes (Important)

Saat AI baru masuk project ini, prioritas pemahaman:
1. Domain manufaktur PRO -> Proses -> LPH -> Verifikasi -> Inventory posting.
2. Perhitungan shift/target berbasis `qtyPoPcs` dan distribusi `plannedQtyPcs`.
3. Snapshot unit output laporan (`outputUom`) agar metrik tidak salah interpretasi.
4. Migration policy aman (no destructive ops di prod-like).
5. Role-based dashboard dan batasan akses mesin/operator.

---
Last updated: 2026-04-20 (Asia/Jakarta)
