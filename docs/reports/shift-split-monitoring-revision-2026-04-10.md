# Laporan Revisi Monitoring Shift Pecah

Tanggal: 2026-04-10  
Proyek: PPIC - Monitoring Produksi Paper/Rigid  
Cakupan: Perbaikan mismatch alert planning shift dan alur konsumsi upstream pada split shift paper

## 1) Ringkasan Masalah

### 1.1 Mismatch Alert Shift di Perencanaan PRO
- Kasus pengguna: alert menampilkan jumlah shift sangat besar (contoh: 102 shift), tetapi PRO yang dibuat ternyata tidak terpecah sebanyak itu.
- Risiko: kepercayaan planner turun karena warning UI tidak sesuai keputusan backend.

### 1.2 Risiko Konsumsi pada Paper Multi-proses Saat Shift Pecah
- Kasus pengguna: pada alur paper, saat satu proses terpecah jadi beberapa shift/chunk, approval bisa salah mengambil konsumsi dari chunk proses yang sama, bukan dari proses upstream yang seharusnya.
- Risiko: alur pergerakan stok menjadi tidak logis dan tampilan lineage di WIP monitor menyesatkan.

## 2) Analisis Akar Masalah

### 2.1 Rumus Alert UI Belum Selaras Penuh dengan Logika Create
- Logika create di backend (source of truth) menggunakan:
  - ekspansi split hanya untuk mesin dengan UOM `sheet`
  - basis qty:
    - jika qty material pertama ada -> pakai qty material pertama
    - jika tidak -> pakai `qtyPoPcs`
  - basis UP:
    - jika qty material pertama ada -> `1`
    - jika tidak -> pakai `UP` step
  - kebutuhan shift: `ceil(qty / (up * stdOutputPerShift))`
- Sebelumnya, warning UI bisa melenceng dari aturan ini sehingga menimbulkan persepsi mismatch.

Referensi:
- [src/server/api/routers/ppic/pros.ts](/e:/Kuliah/KP/belajar/src/server/api/routers/ppic/pros.ts:700)
- [src/server/api/routers/ppic/pros.ts](/e:/Kuliah/KP/belajar/src/server/api/routers/ppic/pros.ts:714)

### 2.2 Resolusi Upstream Approval Mengambil Baris Sebelumnya Terdekat
- Pada kondisi split, "baris sebelumnya terdekat" bisa jadi masih chunk proses logis yang sama.
- Tanpa split guard, `consumptionItem` berpotensi mengarah ke rantai PN dari proses yang sama.

Referensi:
- [src/server/api/routers/superadmin/verification.ts](/e:/Kuliah/KP/belajar/src/server/api/routers/superadmin/verification.ts:387)

## 3) Revisi yang Diimplementasikan

### 3.1 Penyelarasan Rumus Alert Planning
- Estimasi di baris planner diubah supaya sama persis dengan aturan backend:
  - hanya mesin `sheet` yang dihitung untuk alert split
  - jika qty material pertama ada, gunakan qty tersebut dengan UP=1
  - jika tidak, fallback ke `qtyPo` dengan `UP` step
  - `shiftCount = max(1, ceil(qtyBasis / (upBasis * capacity)))`

Referensi:
- [src/app/dashboard/@ppic/_components/pro/pro-planner.tsx](/e:/Kuliah/KP/belajar/src/app/dashboard/@ppic/_components/pro/pro-planner.tsx:1795)
- [src/app/dashboard/@ppic/_components/pro/pro-planner.tsx](/e:/Kuliah/KP/belajar/src/app/dashboard/@ppic/_components/pro/pro-planner.tsx:1815)

### 3.2 Split-step Upstream Guard pada Approval Paper
- Ditambahkan deteksi split logis untuk alur paper:
  - mesin sama
  - part number sama (normalisasi)
  - UP sama
- Proses approval sekarang melakukan backtrack melewati chunk yang masih satu proses logis, lalu memilih upstream step yang benar.
- `consumptionItem` sekarang memprioritaskan PN dari upstream step tersebut.

Referensi:
- [src/server/api/routers/superadmin/verification.ts](/e:/Kuliah/KP/belajar/src/server/api/routers/superadmin/verification.ts:342)
- [src/server/api/routers/superadmin/verification.ts](/e:/Kuliah/KP/belajar/src/server/api/routers/superadmin/verification.ts:349)
- [src/server/api/routers/superadmin/verification.ts](/e:/Kuliah/KP/belajar/src/server/api/routers/superadmin/verification.ts:387)

## 4) Dampak ke Monitoring (Ekspektasi)

### 4.1 Untuk Perencanaan PPIC
- Angka alert sekarang seharusnya konsisten dengan keputusan split saat create.
- Kasus false-positive shift sangat besar karena beda rumus tidak boleh muncul lagi.

### 4.2 Untuk Monitoring Inventory Paper
- Untuk chunk split dari proses yang sama, konsumsi OUT tidak lagi menarik dari chunk proses yang sama.
- Penarikan stok harus menelusuri output proses upstream yang benar.
- Dampaknya, chain pada WIP monitor lebih valid secara semantik untuk operasi split shift.

## 5) Ringkasan Kalkulasi

### 5.1 Estimasi Shift Split (UI dan Create Harus Sama)
- Jika UOM mesin bukan `sheet` -> `need = 1`
- Jika UOM mesin `sheet`:
  - `qtyBasis = firstMaterialQty (jika ada) atau qtyPoPcs`
  - `upBasis = 1 (jika firstMaterialQty ada) atau UP`
  - `need = max(1, ceil(qtyBasis / (upBasis * stdOutputPerShift)))`

### 5.2 Sumber Konsumsi Approval untuk Split Paper
- Untuk step selain step pertama:
  - telusuri mundur dari step saat ini
  - lewati baris berurutan yang dianggap satu split logis (mesin sama + PN sama + UP sama)
  - konsumsi dari baris pertama sebelumnya yang berada di luar grup split tersebut

## 6) Status Validasi

### 6.1 Validasi Statis
- `pnpm typecheck`: LOLOS

### 6.2 Validasi Integration
- Belum bisa diselesaikan di sesi mesin ini karena akses DB test lokal bermasalah:
  - setup test Prisma gagal konek ke `localhost:5432` dan ada issue permission spawn schema-engine (`EPERM`) di environment ini.
- Ini issue runtime environment, bukan assertion failure dari logika bisnis revisi.

## 7) Skenario UAT yang Direkomendasikan

1. Buat PRO paper dengan 1 proses yang wajib split menjadi 2+ shift pada mesin sheet.  
Ekspektasi: angka alert shift == jumlah split yang benar-benar dibuat.

2. Buat PRO paper multi-proses dengan split pada proses tengah.  
Approve report per shift/chunk secara urut.  
Ekspektasi: tiap chunk mengambil konsumsi dari item proses upstream yang benar, bukan dari chunk proses yang sama.

3. Verifikasi tren di WIP monitor setelah approval.  
Ekspektasi: jalur source/target stok mengikuti rantai proses, tanpa artefak self-consume pada step yang sama.

4. Uji proteksi stok minus.  
Ekspektasi: jika stok upstream benar-benar tidak cukup, sistem tetap blok dengan error FIFO/precondition.

## 8) Risiko Residual dan Hardening Lanjutan

- Deteksi split saat ini memakai heuristik mesin + PN + UP untuk paper.
- Jika ke depan ada kebutuhan mesin/PN/UP sama tetapi semantik segmen berbeda, sebaiknya tambah split group id eksplisit saat create agar lineage deterministik.

## 9) Kesimpulan

- Dua titik revisi kritis sudah diimplementasikan:
  - penyelarasan rumus alert shift dengan logika create backend
  - split-step upstream guard untuk konsumsi saat approval
- Revisi ini langsung menjawab concern monitoring pada kasus shift pecah dan menurunkan risiko inkonsistensi planning/approval.
