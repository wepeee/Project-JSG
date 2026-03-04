# COVERAGE MAP

Dokumen ini memetakan suite test saat ini terhadap behavior runtime web.

Konteks audit penting:
- Banyak integration test saat ini mengeksekusi `src/server/domain/inventory-service.ts` dan `src/server/domain/inventory-policy.ts`.
- Kedua file itu **belum dipanggil** oleh route tRPC runtime (`src/server/api/routers/**`) pada kondisi code saat ini.
- Artinya, coverage suite ini dominan adalah **service-layer test**, bukan end-to-end route/runtime parity.

Seed shorthand yang dipakai di tabel:
- `BASE_SEED`: `seedBaseContext(db)`  
  Membuat users (`SUPERADMIN/ADMIN/PPIC/OPERATOR/MASTER`), items (`123456789`, `123456780`, `987654321`, `987654320`, dst), locations (`WIP_POOL_INJECTION`, `WIP_POOL_PRINTING`, `WIP_POOL_BLOW`, `FG_WH`, `HOLD_QA`), PRO/steps dasar.
- `REPORT_SEED`: `createPendingReport(...)`
- `STOCK_SEED`: `seedInventory(...)`

## 1) Daftar test cases (1 baris per test)
| Test name | File test | Scenario (simulasi) | Assertion utama | Data seeded |
|---|---|---|---|---|
| returns normalized code for `" 123456789 "` | `tests/unit/assert-nine-digit-code.test.ts` | Validasi trim + 9 digit | return `"123456789"` | none |
| rejects length < 9 | `tests/unit/assert-nine-digit-code.test.ts` | kode 8 digit | throw error | none |
| rejects length > 9 | `tests/unit/assert-nine-digit-code.test.ts` | kode 10 digit | throw error | none |
| rejects alpha characters | `tests/unit/assert-nine-digit-code.test.ts` | kode berisi huruf | throw error | none |
| rejects symbols | `tests/unit/assert-nine-digit-code.test.ts` | kode berisi `-` | throw error | none |
| rejects empty string | `tests/unit/assert-nine-digit-code.test.ts` | kode kosong/spasi | throw error | none |
| parses `"1.000,5"` to 1000.5 | `tests/unit/number-and-qty.test.ts` | parse format angka Indonesia | hasil `1000.5` | none |
| parses `"1000"` to 1000 | `tests/unit/number-and-qty.test.ts` | parse integer normal | hasil `1000` | none |
| rejects invalid input | `tests/unit/number-and-qty.test.ts` | parse string invalid | throw error | none |
| returns 0 for all zeroes | `tests/unit/number-and-qty.test.ts` | total qty seluruh komponen 0 | hasil `0` | none |
| returns precise decimal sum | `tests/unit/number-and-qty.test.ts` | sum passOn+wip+hold+reject desimal | hasil `104.5` | none |
| maps INJECTION to WIP_POOL_INJECTION | `tests/unit/pool-plan-role.test.ts` | resolver pool untuk INJECTION | output location `WIP_POOL_INJECTION` | none |
| maps BLOW_MOULDING to WIP_POOL_BLOW | `tests/unit/pool-plan-role.test.ts` | resolver pool untuk BLOW | output location `WIP_POOL_BLOW` | none |
| maps PRINTING to WIP_POOL_PRINTING | `tests/unit/pool-plan-role.test.ts` | resolver pool untuk PRINTING | output location `WIP_POOL_PRINTING` | none |
| maps PACKING_ASSEMBLY to FG output and PRINTING input | `tests/unit/pool-plan-role.test.ts` | resolver pool packing | output `FG_WH`, input `WIP_POOL_PRINTING` | none |
| throws for unknown type | `tests/unit/pool-plan-role.test.ts` | resolver type tidak didukung | throw error | none |
| builds rigid printing OUT+IN plan with signed qty | `tests/unit/pool-plan-role.test.ts` | build ledger plan printing rigid | OUT negatif, IN positif, lokasi/qty sesuai | none |
| allows SUPERADMIN | `tests/unit/pool-plan-role.test.ts` | role guard superadmin | tidak throw | none |
| denies non-superadmin | `tests/unit/pool-plan-role.test.ts` | role guard role lain | throw `FORBIDDEN` | none |
| I1. PPIC create item -> status DRAFT with 9-digit code | `tests/integration/item-governance.test.ts` | PPIC create item 9 digit | status `DRAFT`, code tersimpan | `BASE_SEED` |
| I2. Duplicate code does not create new record | `tests/integration/item-governance.test.ts` | create item duplikat | throw conflict, count tidak nambah | `BASE_SEED` + create item awal |
| I3. SUPERADMIN can list items by DRAFT status | `tests/integration/item-governance.test.ts` | superadmin list DRAFT | hasil berisi item draft | `BASE_SEED` + 1 draft item |
| I4. Non-superadmin cannot list items by DRAFT status | `tests/integration/item-governance.test.ts` | admin akses list draft | throw forbidden | `BASE_SEED` |
| I5. SUPERADMIN can activate DRAFT item | `tests/integration/item-governance.test.ts` | transisi DRAFT->ACTIVE | status `ACTIVE` | `BASE_SEED` + 1 draft item |
| I6. resolveItemMasterId missing -> PRECONDITION_FAILED and no auto-create; existing -> same id | `tests/integration/item-governance.test.ts` | resolve code missing/existing | missing throw + count tetap, existing return id sama | `BASE_SEED` |
| F1. Create PRO with existing FG code sets fgItemId | `tests/integration/fk-integrity.test.ts` | create PRO dengan fg code existing | `pro.fgItemId` terisi benar | `BASE_SEED` |
| F2. Update PRO FG code updates fgItemId | `tests/integration/fk-integrity.test.ts` | ubah fg code pro | `fgItemId` berubah sesuai code baru | `BASE_SEED` + PRO baru |
| F3. Create and update Proses output code sets outputItemId | `tests/integration/fk-integrity.test.ts` | create/update output code proses | `outputItemId` terisi & berubah benar | `BASE_SEED` |
| F4. InventoryTxn created by posting always has itemMasterId NOT NULL | `tests/integration/fk-integrity.test.ts` | approve posting report injection | semua txn `itemMasterId != null` | `BASE_SEED` + `REPORT_SEED` |
| P1. Approve creates inventory txns and sets stockPostedAt | `tests/integration/inventory-posting-invariants.test.ts` | approve report sekali | txn terbentuk, `stockPostedAt` set, status APPROVED | `BASE_SEED` + `REPORT_SEED` |
| P2. Approve idempotent: second approve does not duplicate txns | `tests/integration/inventory-posting-invariants.test.ts` | approve dua kali report sama | call kedua idempotent + count txn tetap | `BASE_SEED` + `REPORT_SEED` |
| P3. All txns per report share the same groupId | `tests/integration/inventory-posting-invariants.test.ts` | printing posting dengan stock cukup | semua txn report punya 1 `groupId` | `BASE_SEED` + `STOCK_SEED` + `REPORT_SEED` |
| P4. Atomicity: insufficient stock -> no txn and stockPostedAt remains null | `tests/integration/inventory-posting-invariants.test.ts` | printing approve saat stock kurang | throw precondition + no txn + not posted | `BASE_SEED` + low `STOCK_SEED` + `REPORT_SEED` |
| P5. Void reversal flips IN/OUT and restores balance | `tests/integration/inventory-posting-invariants.test.ts` | approve lalu void | net qty kembali 0 setelah reversal | `BASE_SEED` + `REPORT_SEED` |
| P6. Void idempotent: second void does not duplicate reversals | `tests/integration/inventory-posting-invariants.test.ts` | void dua kali report sama | void kedua idempotent + reversal count tetap | `BASE_SEED` + `REPORT_SEED` |
| R1. Injection approve -> IN to WIP_POOL_INJECTION with code 987654321 | `tests/integration/rigid-flow.test.ts` | rigid injection posting | 1 txn IN ke pool injection qty/code benar | `BASE_SEED` + `REPORT_SEED` |
| R2. Printing approve -> OUT WIP_POOL_INJECTION (qtyProducedTotal) + IN WIP_POOL_PRINTING | `tests/integration/rigid-flow.test.ts` | rigid printing transfer antar pool | OUT qtyProducedTotal + IN qtyPassOn, lokasi benar | `BASE_SEED` + `STOCK_SEED` + `REPORT_SEED` |
| R3. Guardrail insufficient stock -> reject and no partial write | `tests/integration/rigid-flow.test.ts` | rigid printing stock kurang | reject + tidak ada partial txn | `BASE_SEED` + low `STOCK_SEED` + `REPORT_SEED` |
| R4. Ambiguous input WIP (>1 material WIP) -> reject | `tests/integration/rigid-flow.test.ts` | proses printing punya >1 material WIP | reject precondition | `BASE_SEED` + extra `prosesMaterial` + `REPORT_SEED` |
| Pa1. Non-last paper step: qtyWip -> current WIP, qtyPassOn -> next WIP | `tests/integration/paper-regression.test.ts` | paper non-last | 2 txn IN: current buffer + next buffer | `BASE_SEED` + `REPORT_SEED` |
| Pa2. Last paper step: qtyPassOn -> IN FG_WH with FG code 123456789 | `tests/integration/paper-regression.test.ts` | paper last step | 1 txn IN ke FG_WH code/qty benar | `BASE_SEED` + `REPORT_SEED` |

## 2) Mapping ke code produksi (wajib)
Catatan status runtime:
- `src/server/domain/inventory-policy.ts` dan `src/server/domain/inventory-service.ts` saat ini **belum direferensikan** oleh router runtime.
- Route runtime aktif ada di `src/server/api/routers/**` (mis. `items.ts`, `pros.ts`, `verification.ts`).

| Test case | Fungsi yang dieksekusi oleh test (actual) | Route/fungsi produksi runtime yang ekuivalen | Helper/service baru dipakai runtime app? | Audit action |
|---|---|---|---|---|
| returns normalized code for `" 123456789 "` | `src/server/domain/inventory-policy.ts::assertNineDigitCode` | Tidak ada validasi 9-digit di runtime; `src/server/api/routers/ppic/items.ts::create` pakai regex alfanumerik | TIDAK | Integrasikan validator 9-digit ke route runtime atau pindahkan test ke validator yang benar-benar dipakai runtime |
| rejects length < 9 | `assertNineDigitCode` | idem di atas | TIDAK | idem |
| rejects length > 9 | `assertNineDigitCode` | idem di atas | TIDAK | idem |
| rejects alpha characters | `assertNineDigitCode` | idem di atas | TIDAK | idem |
| rejects symbols | `assertNineDigitCode` | idem di atas | TIDAK | idem |
| rejects empty string | `assertNineDigitCode` | idem di atas | TIDAK | idem |
| parses `"1.000,5"` to 1000.5 | `inventory-policy.ts::parseIndonesianNumber` | Tidak ada function runtime yang memanggil helper ini | TIDAK | Hapus helper/test jika tidak diperlukan, atau pakai helper ini di parsing runtime |
| parses `"1000"` to 1000 | `parseIndonesianNumber` | Tidak ada mapping runtime langsung | TIDAK | idem |
| rejects invalid input | `parseIndonesianNumber` | Tidak ada mapping runtime langsung | TIDAK | idem |
| returns 0 for all zeroes | `inventory-policy.ts::computeQtyProducedTotal` | Logika sum setara tersebar inline di `verification.ts::approveReport` | TIDAK (helper tidak dipakai) | Refactor runtime agar pakai helper, atau test langsung route runtime |
| returns precise decimal sum | `computeQtyProducedTotal` | setara inline di `verification.ts::approveReport` | TIDAK | idem |
| maps INJECTION to WIP_POOL_INJECTION | `inventory-policy.ts::resolvePoolByReportType` | Routing lokasi ada inline di `verification.ts::approveReport` | TIDAK | Refactor route untuk reuse helper atau pindah test ke route call |
| maps BLOW_MOULDING to WIP_POOL_BLOW | `resolvePoolByReportType` | inline runtime `verification.ts::approveReport` | TIDAK | idem |
| maps PRINTING to WIP_POOL_PRINTING | `resolvePoolByReportType` | inline runtime `verification.ts::approveReport` | TIDAK | idem |
| maps PACKING_ASSEMBLY to FG output and PRINTING input | `resolvePoolByReportType` | inline runtime `verification.ts::approveReport` | TIDAK | idem |
| throws for unknown type | `resolvePoolByReportType` | runtime punya branch berbeda (tidak panggil helper) | TIDAK | idem |
| builds rigid printing OUT+IN plan with signed qty | `inventory-policy.ts::buildInventoryTxnPlan` | Logika posting inline di `verification.ts::approveReport` | TIDAK | Refactor ke shared service/helper runtime atau alihkan test ke route |
| allows SUPERADMIN | `inventory-policy.ts::assertSuperadminRole` | ekuivalen middleware `src/server/api/trpc.ts::superAdminProcedure` | TIDAK (helper ini tidak dipakai route) | Uji middleware/route langsung; helper bisa dihapus bila tidak dipakai |
| denies non-superadmin | `assertSuperadminRole` | `superAdminProcedure` di runtime | TIDAK | idem |
| I1. PPIC create item -> status DRAFT with 9-digit code | `inventory-service.ts::createDraftItem` | `src/server/api/routers/ppic/items.ts::create` | TIDAK | Pindahkan test ke pemanggilan route (`createCaller(appRouter).items.create`) atau wire service ke route |
| I2. Duplicate code does not create new record | `createDraftItem` | `items.ts::create` | TIDAK | idem |
| I3. SUPERADMIN can list items by DRAFT status | `inventory-service.ts::listItemsByStatus` | `items.ts::listByStatus` | TIDAK | idem |
| I4. Non-superadmin cannot list items by DRAFT status | `listItemsByStatus` | `items.ts::listByStatus` + `superAdminProcedure` | TIDAK | idem |
| I5. SUPERADMIN can activate DRAFT item | `inventory-service.ts::activateItem` | ekuivalen `items.ts::approve` | TIDAK | idem |
| I6. resolveItemMasterId missing/existing | `inventory-service.ts::resolveItemMasterId` | fungsi lokal `resolveItemMasterId` di `superadmin/verification.ts::approveReport` | TIDAK | Satukan logic resolver ke shared runtime module; test route approve langsung |
| F1. Create PRO with existing FG code sets fgItemId | `inventory-service.ts::createProWithFgCode` | `ppic/pros.ts::create` + `lookupItemId` | TIDAK | Pindah test ke route `pros.create` |
| F2. Update PRO FG code updates fgItemId | `inventory-service.ts::updateProFgCode` | `ppic/pros.ts::update` | TIDAK | Pindah test ke route `pros.update` |
| F3. Create and update Proses output code sets outputItemId | `inventory-service.ts::createProsesWithOutputCode`, `updateProsesOutputCode` | `ppic/pros.ts::update` branch proses upsert | TIDAK | Pindah test ke route `pros.update` (karena runtime tidak expose service ini) |
| F4. InventoryTxn created by posting always has itemMasterId NOT NULL | `inventory-service.ts::approveReportPosting` | `superadmin/verification.ts::approveReport` | TIDAK | Pindah ke route `verification.approveReport` atau wire service ke route |
| P1. Approve creates inventory txns and sets stockPostedAt | `approveReportPosting` | `verification.ts::approveReport` | TIDAK | idem |
| P2. Approve idempotent | `approveReportPosting` | `verification.ts::approveReport` (guard idempotency) | TIDAK | idem |
| P3. groupId consistency | `approveReportPosting` | `verification.ts::approveReport` | TIDAK | idem |
| P4. Atomicity no partial write | `approveReportPosting` | `verification.ts::approveReport` + transaction | TIDAK | idem |
| P5. Void reversal | `inventory-service.ts::voidReportPosting` | `verification.ts::voidReport` | TIDAK | idem |
| P6. Void idempotent | `voidReportPosting` | `verification.ts::voidReport` | TIDAK | idem |
| R1. Injection pool IN | `approveReportPosting` | `verification.ts::approveReport` | TIDAK | idem |
| R2. Printing pool OUT/IN | `approveReportPosting` | `verification.ts::approveReport` | TIDAK | idem |
| R3. Guardrail insufficient stock | `approveReportPosting` | `verification.ts::approveReport` | TIDAK | idem |
| R4. Ambiguous WIP input reject | `approveReportPosting` | ekuivalen validasi input material di approve flow runtime | TIDAK | idem |
| Pa1. Paper non-last buffer IN | `approveReportPosting` (paper branch) | `verification.ts::approveReport` (paper behavior runtime berbeda/inline) | TIDAK | Audit parity perlu verifikasi manual; idealnya test route langsung |
| Pa2. Paper last -> FG IN | `approveReportPosting` (paper branch) | `verification.ts::approveReport` | TIDAK | idem |

Ringkasan section 2:
- **Semua test case saat ini mengeksekusi helper/service baru yang belum terhubung ke route runtime.**
- Untuk audit behavior yang sama dengan web runtime, rekomendasi utama:
  1. Refactor route runtime agar memakai `inventory-service`/`inventory-policy`, **atau**
  2. Ubah integration tests agar memanggil route produksi (`createCaller(appRouter)` -> `items/pros/verification`).

## 3) Invariant inventory yang dibuktikan oleh suite ini
Checklist berikut adalah status pembuktian **di level suite saat ini (service-layer)**:

- [x] approve idempotent  
  Dibuktikan oleh: `P2. Approve idempotent: second approve does not duplicate txns`

- [x] void idempotent  
  Dibuktikan oleh: `P6. Void idempotent: second void does not duplicate reversals`

- [x] atomicity (no partial write)  
  Dibuktikan oleh: `P4. Atomicity...`, `R3. Guardrail insufficient stock...`

- [x] guardrail insufficient stock  
  Dibuktikan oleh: `P4`, `R3`

- [x] groupId consistency  
  Dibuktikan oleh: `P3. All txns per report share the same groupId`

- [x] itemMasterId NOT NULL  
  Dibuktikan oleh: `F4. InventoryTxn created by posting always has itemMasterId NOT NULL`

- [x] rigid pool IN/OUT benar  
  Dibuktikan oleh: `R1`, `R2`

- [x] paper buffer IN benar  
  Dibuktikan oleh: `Pa1`, `Pa2`

- [x] material lock guard  
  Dibuktikan oleh: `R4. Ambiguous input WIP (>1 material WIP) -> reject`

- [x] role access (superadmin-only)  
  Dibuktikan oleh: `I4. Non-superadmin cannot list items by DRAFT status`, `denies non-superadmin` (U6)

Catatan audit final:
- Checklist di atas valid untuk service-layer implementation yang diuji oleh suite saat ini.
- Untuk memenuhi target “behavior yang sama dengan web runtime”, parity route-level belum terjamin sampai test dipindah ke route produksi atau service di-wire ke route produksi.
