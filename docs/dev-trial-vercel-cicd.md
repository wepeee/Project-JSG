# Dev -> Trial -> Vercel CI/CD Runbook

Dokumen ini untuk setup kamu:
- DB `dev` terpisah,
- DB `trial` diperlakukan seperti production,
- deploy aplikasi di Vercel.

Tujuan: perubahan schema aman tanpa data loss.

## Prinsip Utama

- `dev` boleh `prisma migrate dev`.
- `trial/prod-like` hanya `prisma migrate deploy`.
- Jangan pakai `prisma db push` di `trial/prod-like`.
- Selalu backup trial sebelum migration besar.

## Alur Harian Developer

1. Ubah `prisma/schema.prisma` di branch feature.
2. Generate migration:

```bash
pnpm db:migrate:dev --name <nama_migrasi>
```

3. Test lokal.
4. Commit:
- `prisma/schema.prisma`
- `prisma/migrations/...`

5. Buka PR ke `main`.

## Alur Saat Merge ke `main`

1. CI jalan (lint/type/test sesuai workflow).
2. Workflow deploy akan jalankan:

```bash
pnpm db:migrate
```

Command di atas = `prisma migrate deploy` ke DB trial.

3. Jika migration sukses:
- Vercel Git Integration bisa auto deploy seperti biasa, atau
- GitHub Action trigger Vercel Deploy Hook (opsional).

## GitHub Secrets yang Dibutuhkan

Wajib:
- `TRIAL_DATABASE_URL`
- `TRIAL_DIRECT_URL`

Opsional (kalau mau trigger deploy hook dari Actions):
- `VERCEL_DEPLOY_HOOK_URL`

Catatan:
- Untuk Supabase, `TRIAL_DIRECT_URL` sebaiknya direct connection (port 5432, `sslmode=require`) untuk migrasi.
- `TRIAL_DATABASE_URL` bisa runtime URL (pooler).

## Kapan Manual, Kapan Otomatis

Manual masih disarankan jika:
- migration berat/destruktif,
- perlu maintenance window,
- perubahan data perlu backfill manual.

Otomatis aman untuk:
- migration additive umum (tambah tabel/kolom nullable/index).

## Checklist Anti Data Loss

Sebelum merge:
- migration diuji di lokal.
- tidak ada perintah destruktif tanpa rencana transisi.

Sebelum apply ke trial:
- backup trial tersedia.
- env secret di GitHub benar.

Sesudah deploy:
- cek halaman login + query utama.
- cek log error Prisma/tRPC.

## Recovery Singkat

Jika migration gagal:
1. Stop deploy lanjutan.
2. Perbaiki migration di branch baru.
3. Jalankan migration perbaikan (forward fix), hindari reset DB.

Jika data problem:
1. Gunakan backup/PITR dari provider.
2. Restore ke titik aman.
3. Deploy patch app + migration koreksi.
