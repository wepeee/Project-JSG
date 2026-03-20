# Database Persistence & Safe Migration (Anti Data Loss)

Panduan ini untuk kondisi:
- aplikasi sudah deploy (production jalan),
- tim dev tetap mengubah schema database,
- perubahan harus aman tanpa kehilangan data.

## 1) Konsep Dasar: `Database Persistence`

`Persistence` artinya data database disimpan di storage yang tidak ikut hilang saat container/app restart atau redeploy.

Penting:
- Container itu ephemeral (bisa mati/ganti kapan saja).
- Data harus disimpan di persistent volume atau managed database service.

Jika pakai Docker Postgres sendiri:
- Wajib mount volume ke path data Postgres (`/var/lib/postgresql/data`).
- Jangan simpan data di filesystem container tanpa volume.

Contoh `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: strong-password
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 2) Aturan Wajib Environment

- Pisahkan DB: `dev`, `staging`, `prod` (jangan share satu DB).
- `dev` bebas eksperimen.
- `staging` mirror production untuk test migrasi.
- `prod` hanya lewat migration script yang sudah diuji.

## 3) Workflow Prisma Yang Aman

### Di lokal/dev

1. Ubah `schema.prisma`.
2. Generate migration:

```bash
pnpm prisma migrate dev --name <nama_migrasi>
```

3. Test fitur yang terdampak.
4. Commit:
- file migration di `prisma/migrations/...`
- perubahan `schema.prisma`.

### Di staging/prod

Jalankan migration dari file yang sudah di-commit:

```bash
pnpm prisma migrate deploy
```

Jangan pakai di production:
- `prisma db push` (bisa drift, tidak ada histori migration yang rapi)
- `prisma migrate reset` (destruktif)

## 4) Strategi Perubahan Schema Tanpa Data Loss (Expand/Contract)

Gunakan 2-3 tahap untuk perubahan besar:

1. **Expand**
- Tambah kolom/tabel baru nullable.
- Deploy app yang bisa baca format lama + baru.

2. **Backfill**
- Isi data lama ke kolom baru lewat script/job.
- Verifikasi data konsisten.

3. **Contract**
- Setelah semua aman, baru hapus kolom lama / set `NOT NULL` / tambah unique constraint final.

Ini menghindari downtime panjang dan kegagalan deploy mendadak.

## 5) Backup Sebelum Migrasi Production

Minimal lakukan backup sebelum `migrate deploy`.

### Postgres self-hosted (contoh)

```bash
pg_dump "$DATABASE_URL" -Fc -f backup_before_migration.dump
```

Restore (jika rollback data diperlukan):

```bash
pg_restore -d "$DATABASE_URL" --clean --if-exists backup_before_migration.dump
```

### Jika pakai Supabase/managed service

- Gunakan fitur backup/PITR bawaan provider.
- Pastikan retention backup aktif.
- Catat timestamp sebelum deploy.

## 6) Rollback Reality Check

Rollback code cepat, rollback data tidak selalu cepat.

Karena itu:
- migration harus **forward-safe**,
- hindari migration destruktif dalam 1 langkah,
- siapkan script rollback manual untuk kasus khusus.

## 7) Checklist Deploy DB Change

Sebelum deploy:
- migration sudah dites di staging.
- backup production sudah dibuat.
- ada maintenance window jika migration berat.
- observability siap (error rate, query latency, connection count).

Saat deploy:
- deploy app version kompatibel.
- jalankan `prisma migrate deploy`.
- verifikasi endpoint penting + query utama.

Setelah deploy:
- monitor error 15-30 menit.
- cek integritas data sampling.
- dokumentasikan hasil deploy dan issue.

## 8) Hal Yang Paling Sering Bikin Data Loss

- Menjalankan `migrate reset` di env yang salah.
- Menambah kolom `NOT NULL` langsung tanpa default/backfill.
- Rename/drop kolom tanpa tahap transisi.
- Tidak backup sebelum migrasi.
- Menjalankan app baru yang tidak kompatibel dengan schema lama.

## 9) Rekomendasi Praktis Untuk Tim Kamu

- Tetap pakai Prisma migration files sebagai source of truth.
- Untuk production, pakai:
  - app deploy,
  - lalu `pnpm prisma migrate deploy`.
- Jadikan backup pre-deploy sebagai SOP wajib.
- Kalau DB di Docker, pastikan volume persistent + backup schedule.
- Kalau DB managed (Supabase/DO Managed PG), aktifkan PITR/automated backup.

