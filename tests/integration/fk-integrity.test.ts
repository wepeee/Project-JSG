/**
 * B2 FK integrity — route-level tests.
 *
 * Routes exercised:
 *   verification.approveReport    (superAdminProcedure) -> itemMasterId not null
 *   pros.create                   (ppicProcedure)       -> fgItemId set via partNumber
 */

import { LphType, Role } from "../../generated/prisma";
import { db } from "../setup";
import { createPendingReport, seedBaseContext } from "../helpers/seed";
import { createTestCaller } from "../helpers/caller";

describe("B2 FK integrity (route-level)", () => {
  test("F1. pros.create with existing Part Number sets fgItemId", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.PPIC.id, Role.PPIC);

    const pro = await caller.pros.create({
      productName: "FK Test Product",
      partNumber: ctx.items.fg123456789.code,
      proPrefixId: ctx.proPrefix.id,
      type: "RIGID",
      qtyPoPcs: 1000,
      expand: false,
      proses: [
        {
          machineId: ctx.machines.injection.id,
          partNumber: ctx.items.wip987654321.code,
          materials: [],
        },
      ],
    });

    const fullPro = await db.pro.findUnique({ where: { id: pro.id } });
    expect(fullPro?.fgItemId).toBe(ctx.items.fg123456789.id);
  });

  test("F2. InventoryTxn created by approveReport always has itemMasterId NOT NULL", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 150,
    });

    await caller.verification.approveReport({ id: report.id });

    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
    });

    expect(txns.length).toBeGreaterThan(0);
    expect(txns.every((t) => t.itemMasterId !== null)).toBe(true);
  });

  test("F3. Material lock: pros.update rejects material change after inventory posting", async () => {
    const ctx = await seedBaseContext(db);
    const adminCaller = createTestCaller(
      ctx.users.SUPERADMIN.id,
      Role.SUPERADMIN,
    );
    const ppicCaller = createTestCaller(ctx.users.PPIC.id, Role.PPIC);

    // Approve a report on rigidInjection -> creates InventoryTxn referencing that proses
    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 100,
    });
    await adminCaller.verification.approveReport({ id: report.id });

    // Now try to update the PRO and change materials on rigidInjection
    // This must be rejected because InventoryTxn already exists for that proses
    await expect(
      ppicCaller.pros.update({
        id: ctx.rigidPro.id,
        productName: "Rigid Product",
        proPrefixId: ctx.proPrefix.id,
        qtyPoPcs: 1000,
        proses: [
          {
            id: ctx.steps.rigidInjection.id,
            orderNo: 1,
            up: 1,
            machineId: ctx.machines.injection.id,
            partNumber: ctx.items.wip987654321.code,
            materials: [{ materialId: ctx.items.raw111111111.id, qtyReq: 500 }],
          },
          {
            id: ctx.steps.rigidPrinting.id,
            orderNo: 2,
            up: 1,
            machineId: ctx.machines.printing.id,
            partNumber: ctx.items.wip987654320.code,
          },
          {
            id: ctx.steps.rigidPacking.id,
            orderNo: 3,
            up: 1,
            machineId: ctx.machines.packing.id,
            partNumber: ctx.items.fg123456789.code,
          },
        ],
      }),
    ).rejects.toThrow(/transaksi inventory/);
  });
});
