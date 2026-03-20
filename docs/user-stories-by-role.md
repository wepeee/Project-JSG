# User Stories per Role

Tanggal: 13 Maret 2026  
Sumber pemetaan: menu dashboard role-based + router tRPC aktif di project ini.

## SUPERADMIN

1. Sebagai `SUPERADMIN`, saya ingin melihat dashboard overview lintas departemen agar bisa memantau KPI produksi secara cepat.
2. Sebagai `SUPERADMIN`, saya ingin mengelola akun user (buat user baru dan lihat daftar user) agar kontrol akses sistem tetap tertata.
3. Sebagai `SUPERADMIN`, saya ingin mengelola mesin Paper agar data kapasitas dan standar mesin selalu valid.
4. Sebagai `SUPERADMIN`, saya ingin mengelola mesin Rigid agar data kapasitas dan standar mesin selalu valid.
5. Sebagai `SUPERADMIN`, saya ingin melihat WIP Monitor Paper agar bisa memantau stok, shortage, dan arus inventory.
6. Sebagai `SUPERADMIN`, saya ingin melihat WIP Monitor Rigid agar bisa memantau stok, shortage, dan arus inventory.
7. Sebagai `SUPERADMIN`, saya ingin memverifikasi laporan produksi (approve/reject) agar data produksi yang masuk terkontrol.
8. Sebagai `SUPERADMIN`, saya ingin melakukan void laporan jika ditemukan masalah kritis agar data historis tetap akurat.
9. Sebagai `SUPERADMIN`, saya ingin mengatur standar output per produk/PRO (manual maupun auto compute) agar evaluasi performa konsisten.
10. Sebagai `SUPERADMIN`, saya ingin mengatur akses mesin per operator agar operator hanya melapor di mesin yang diizinkan.
11. Sebagai `SUPERADMIN`, saya ingin melihat audit log aktivitas agar perubahan penting bisa ditelusuri.
12. Sebagai `SUPERADMIN`, saya ingin membuka OEE analytics agar bisa menganalisis availability, performance, dan quality.

## ADMIN

1. Sebagai `ADMIN`, saya ingin melihat dashboard overview sesuai departemen agar bisa memonitor kondisi area saya.
2. Sebagai `ADMIN`, saya ingin melihat OEE analytics agar bisa membaca performa mesin dan bottleneck utama.
3. Sebagai `ADMIN`, saya ingin melihat WIP Monitor (Paper/Rigid) agar bisa memantau shortage dan stok proses.
4. Sebagai `ADMIN`, saya ingin memverifikasi laporan produksi (approve/reject + catatan admin) agar kualitas data operator terjaga.
5. Sebagai `ADMIN`, saya ingin melihat daftar laporan produksi agar bisa audit kronologi output per PRO.
6. Sebagai `ADMIN`, saya ingin melihat Std Output (read-only) agar keputusan verifikasi tetap mengacu pada standar yang sama.

## PPIC

1. Sebagai `PPIC`, saya ingin melihat daftar PRO per tipe (Paper/Rigid/All) agar prioritas kerja mudah dipantau.
2. Sebagai `PPIC`, saya ingin membuat PRO baru dengan beberapa step proses agar rencana produksi bisa dieksekusi operator.
3. Sebagai `PPIC`, saya ingin memilih Part Number saat isi step dan auto-fill UP/mesin/material jika PN sudah ada agar input lebih cepat.
4. Sebagai `PPIC`, saya ingin tetap bisa input manual jika PN belum ada agar proses planning tidak terhenti.
5. Sebagai `PPIC`, saya ingin perubahan PN/material dari form PRO ikut membentuk data item/master yang dibutuhkan agar master data terus bertumbuh dari aktivitas nyata.
6. Sebagai `PPIC`, saya ingin edit/hapus/reschedule PRO agar penjadwalan tetap adaptif terhadap kondisi lapangan.
7. Sebagai `PPIC`, saya ingin mengelola master proses (list/create/update/delete) agar urutan kerja tiap produk standar.
8. Sebagai `PPIC`, saya ingin mengelola material/item untuk RAW/WIP/FG agar kebutuhan bahan per step jelas.
9. Sebagai `PPIC`, saya ingin melihat schedule produksi dan lompat langsung ke PRO terkait agar koordinasi harian lebih cepat.
10. Sebagai `PPIC`, saya ingin melihat detail progres PRO agar risiko line stop bisa dideteksi lebih awal.

## OPERATOR

1. Sebagai `OPERATOR`, saya ingin melihat jadwal tugas harian per shift agar saya tahu pekerjaan yang harus dijalankan.
2. Sebagai `OPERATOR`, saya ingin jadwal terfilter oleh akses mesin saya agar hanya tugas relevan yang muncul.
3. Sebagai `OPERATOR`, saya ingin membuka detail task (PRO, proses, mesin, target, material) agar eksekusi sesuai instruksi PPIC.
4. Sebagai `OPERATOR`, saya ingin mengisi laporan produksi (good/reject/downtime/catatan) agar realisasi produksi tercatat.
5. Sebagai `OPERATOR`, saya ingin submit laporan ke status menunggu verifikasi agar data saya diproses oleh admin/superadmin.
6. Sebagai `OPERATOR`, saya ingin melihat riwayat laporan agar progres kerja saya dapat ditinjau kembali.
7. Sebagai `OPERATOR`, saya ingin merevisi laporan yang ditolak berdasarkan catatan revisi agar laporan bisa disetujui.

## MASTER

1. Sebagai `MASTER`, saya ingin melihat dashboard overview read-only agar mendapatkan gambaran performa produksi tanpa mengubah data.
2. Sebagai `MASTER`, saya ingin melihat OEE analytics Paper agar bisa mengawasi performa area paper.
3. Sebagai `MASTER`, saya ingin melihat OEE analytics Rigid agar bisa mengawasi performa area rigid.
4. Sebagai `MASTER`, saya ingin memantau gap target per PRO (target vs output vs kurang) agar bisa follow-up PRO yang berisiko tidak tercapai.

## Catatan Akses dan Batasan Saat Ini

1. Beberapa endpoint menggunakan `protectedProcedure`, jadi akses aktual tetap mengikuti filter role di UI dan validasi tambahan per endpoint.
2. Fitur `Pengaturan` di sidebar superadmin saat ini masih placeholder.
3. Proses persetujuan item (`approve/bulk approve/update item`) saat ini dibatasi untuk `SUPERADMIN`.
