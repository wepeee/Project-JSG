---
description: End-to-end manual test for WIP Monitor ↔ LPH integration
---

# E2E Test: WIP Monitor ↔ LPH (Operator Report) Integration

## Prerequisites

- Dev server running (`pnpm run dev`)
- Database seeded with at least 1 Machine and basic data
- 3 user accounts: PPIC, Operator, SuperAdmin

---

## Step 1: PPIC Creates PRO

1. Login as **PPIC** user
2. Go to **Daftar PRO** → Create new PRO
   - Product Name: `Test Integrasi WIP`
   - Qty PO: `1000`
   - Type: `PAPER`
3. Add at least 2 Proses (steps):
   - Step 1: `Cetak` → **assign Machine** (e.g. Assembly 1), **Part Number: `PN-CETAK-001`**
   - Step 2: `Finishing` → **assign Machine** (e.g. Assembly 2), **Part Number: `PN-FINISH-001`**
4. Save → PRO status should be `OPEN`
5. **Verify:** Go to **Inventory → Production Matrix** → PRO should appear with all cells `-`

> ⚠️ **IMPORTANT:** Machine and Part Number are now REQUIRED. Without them, operator cannot submit reports.

## Step 2: Operator Submits LPH (Step 1)

1. Login as **Operator**
2. Find the PRO → Open Step 1 (Cetak)
3. **Check:** If machineId or partNumber missing, submit button is **disabled** with warning banner
4. Fill production report:
   - Shift: 1
   - Start Time: 07:00, End Time: 15:00
   - **qtyGood: 500** (must explicitly fill, no silent default)
   - **qtyPassOn: 500** (must explicitly fill, no silent default)
   - qtyReject: 10 (optional, defaults to 0)
   - qtyHold: 5 (optional, defaults to 0)
5. Submit → should see **2 confirmations:**
   - (only if qtyPassOn=0) "Output Pass On = 0. Apakah Anda yakin?"
   - Final: "Apakah Anda yakin data sudah benar?"
6. **Verify:**
   - Report status = `PENDING`
   - WIP Monitor: **NO CHANGE** (not approved yet)
   - Production Matrix: **NO CHANGE** (only APPROVED reports counted)

## Step 3: Test Validation Guards

1. Try creating a PRO step WITHOUT machine → operator form should show:
   - ⚠ "Mesin belum di-assign oleh PPIC"
   - Submit button disabled
2. Try creating a PRO step WITHOUT partNumber → operator form should show:
   - ⚠ "Part Number belum diisi oleh PPIC"
   - Submit button disabled
3. Try submitting with empty qtyGood AND empty qtyPassOn → alert:
   - "Output (Qty Good atau Qty Pass On) wajib diisi!"

## Step 4: SuperAdmin Approves Report

1. Login as **SuperAdmin**
2. Go to **Verifikasi Laporan** → find the PENDING report
3. Click **Approve**
4. **Verify:**
   - Report status = `APPROVED`
   - `stockPostedAt` should be set
   - **InventoryTxn created:**
     - IN 500 → `WIP_M_<machineId>` (Step 1 is NOT last step, so → WIP)
     - IN 5 → `HOLD_QA`
     - IN 10 → `SCRAP_BIN`
   - **WIP Monitor auto-refreshes** (no manual reload needed via `utils.inventory.invalidate()`)

## Step 5: Test PartNumber Guard on Approve

1. If somehow partNumber is missing when admin tries to approve:
   - Backend throws: "Part Number belum diisi pada proses ini. PPIC harus mengisi Part Number sebelum approve."
   - Report stays PENDING

## Step 6: Check WIP Monitor

1. Login as **PPIC**
2. Go to **Inventory → WIP Monitor (Audit View)**
3. **Expected:** Row showing:
   - PRO: `Test Integrasi WIP`
   - Location: `WIP Bin - Assembly 1` (or equivalent)
   - Item: `PN-CETAK-001`
   - Qty: `500`

## Step 7: Check Production Matrix

1. Go to **Inventory → Production Matrix**
2. **Expected:**
   - Row: `Test Integrasi WIP` PRO
   - Column `Assembly 1`: `500`
   - Column `Assembly 2`: `-` (no report yet)
   - FG Received: `0` or `-`
   - Fulfillment: `0%`

## Step 8: Operator Submits LPH (Step 2 - Last Step)

1. Login as **Operator**
2. Find the PRO → Open Step 2 (Finishing)
3. Fill production report:
   - **qtyGood: 490**
   - **qtyPassOn: 490**
4. Submit → status PENDING

## Step 9: SuperAdmin Approves Step 2 Report

1. Approve the Step 2 report
2. **Verify InventoryTxn:**
   - IN 490 → `FG_WH` (last step → Finish Good!)
3. **Check WIP Monitor:**
   - WIP for Assembly 1 stays at 500
   - No new WIP row (because last step goes to FG, not WIP)
4. **Check Production Matrix:**
   - Column `Assembly 2`: `490`
   - FG Received: `490`
   - Fulfillment: `49%` (490/1000)

## Step 10: Check Stock Card

1. Click on a WIP Monitor row → **Stock Card Dialog** should open
2. Should show individual transactions:
   - Date | Type IN | Qty 500 | Location WIP*M*<id>

---

## Summary of Business Rules Implemented

| Rule                             | Implementation                                                           |
| -------------------------------- | ------------------------------------------------------------------------ |
| qtyPassOn explicit (no silent 0) | Zod: `.min(0)` instead of `.default(0)` for qtyGood and qtyPassOn        |
| qtyPassOn=0 confirm              | Frontend confirm dialog before submit                                    |
| machineId required               | Backend: throw error if null. Frontend: disable submit + warning         |
| partNumber required              | Backend approveReport: throw if null. Frontend: disable submit + warning |
| Auto-refresh after approve       | `utils.inventory.invalidate()` in approveMutation.onSuccess              |
