# COVERAGE MAP

Dokumen ini memetakan suite test integrasi terhadap fungsionalitas runtime tRPC.
Semua test sekarang berjalan di **Route Level (Opsi B)**, memanggil runtime via tRPC caller untuk menjamin parity antara test dan produksi.

## 1) Daftar Test Cases (25 Tests)

| Test ID     | File Test                              | Route / Operasi              | Scenario (Simulasi)               | Assertion Utama                                             |
| ----------- | -------------------------------------- | ---------------------------- | --------------------------------- | ----------------------------------------------------------- |
| **I1-I6**   | `item-governance.test.ts`              | `items.create/list/approve`  | Governance Item (Draft -> Active) | Status berubah, validasi code 9-digit                       |
| **P1-P3**   | `inventory-posting-invariants.test.ts` | `verification.approveReport` | Invarian dasar posting            | Txn terbentuk,GroupId konsisten, Idempotent                 |
| **P4**      | `inventory-posting-invariants.test.ts` | `verification.approveReport` | Guardrail Stock                   | Reject jika stock kurang, no partial write                  |
| **P5-P6**   | `inventory-posting-invariants.test.ts` | `verification.voidReport`    | Invarian Void                     | Reversal txn terbentuk, Idempotent                          |
| **F1**      | `fk-integrity.test.ts`                 | `pros.create`                | FK Item Master (FG)               | `fgItemId` terisi otomatis via code                         |
| **F2**      | `fk-integrity.test.ts`                 | `verification.approveReport` | Item Master Integrity             | Pastikan `itemMasterId` NOT NULL di setiap hasil posting    |
| **F3**      | `fk-integrity.test.ts`                 | `pros.update`                | **Material Lock Guard**           | Perubahan material ditolak jika sudah ada `InventoryTxn`    |
| **R1-R3**   | `rigid-flow.test.ts`                   | `verification.approveReport` | Rigid Flow (Transfer)             | Stock IN/OUT antar machine bin sesuai flow RIGID            |
| **Pa1-Pa2** | `paper-regression.test.ts`             | `verification.approveReport` | Paper Flow (Buffer)               | QtyWip dan qtyPassOn masuk ke pool yang benar               |
| **BS1**     | `p1-blindspots.test.ts`                | `verification.approveReport` | **Concurrency**                   | 2 Approval berebut stock yang sama -> 1 Fail                |
| **BS2**     | `p1-blindspots.test.ts`                | `verification.approveReport` | **Ambiguous WIP**                 | Reject jika proses punya >1 material WIP                    |
| **BS3**     | `p1-blindspots.test.ts`                | `verification.approveReport` | **Draft Flag**                    | Response menyertakan `isDraft: true` jika item status DRAFT |
| **BS4**     | `p1-blindspots.test.ts`                | `verification.approveReport` | **Blow Path**                     | Stock mengalir benar ke machine BLOW                        |
| **BS5**     | `p1-blindspots.test.ts`                | `verification.voidReport`    | **Packing reversal**              | Void pada step terakhir mengosongkan saldo FG               |

## 2) Mapping Route Runtime vs Fungsi Produksi

Semua integration tests sekarang memanggil route tRPC berikut (Verified Runtime):

| Route tRPC                   | File Produksi                                       | Test yang Mengcover                                                               |
| ---------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- |
| `items.create`               | `src/server/api/routers/ppic/items.ts`              | `item-governance.test.ts`                                                         |
| `items.listByStatus`         | `src/server/api/routers/ppic/items.ts`              | `item-governance.test.ts`                                                         |
| `items.approve`              | `src/server/api/routers/ppic/items.ts`              | `item-governance.test.ts`                                                         |
| `pros.create`                | `src/server/api/routers/ppic/pros.ts`               | `fk-integrity.test.ts`                                                            |
| `pros.update`                | `src/server/api/routers/ppic/pros.ts`               | `fk-integrity.test.ts` (Material Lock)                                            |
| `verification.approveReport` | `src/server/api/routers/superadmin/verification.ts` | `inventory-posting-invariants`, `rigid-flow`, `paper-regression`, `p1-blindspots` |
| `verification.voidReport`    | `src/server/api/routers/superadmin/verification.ts` | `inventory-posting-invariants`, `p1-blindspots`                                   |

## 3) Invariant Status (Audit Checklist)

Checklist ini membuktikan keamanan sistem di level runtime:

- [x] **Concurrency Safety**: Dibuktikan oleh `BS1`. Race condition pada stock ditangani oleh database transaction + balance check.
- [x] **Material Lock**: Dibuktikan oleh `F3`. Mencegah inkonsistensi data material setelah transaksi gudang terjadi.
- [x] **Idempotency (Approve/Void)**: Dibuktikan oleh `P2` dan `P6`. Mencegah double-posting stock.
- [x] **Atomicity**: Dibuktikan oleh `P4`. Satu kegagalan (mis. stock kurang) membatalkan seluruh rangkaian transaksi (rollback).
- [x] **Data Integrity**: Dibuktikan oleh `F2`. Menjamin link ke Item Master selalu valid untuk keperluan laporan inventory.
- [x] **Ambiguous Guard**: Dibuktikan oleh `BS2`. Mencegah auto-routing salah jika input material tidak spesifik.
- [x] **Draft Visibility**: Dibuktikan oleh `BS3`. Memberikan awareness jika ada item non-aktif yang terpakai.
