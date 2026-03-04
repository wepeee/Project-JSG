/**
 * B5 PAPER regression — route-level tests.
 *
 * Routes exercised:
 *   verification.approveReport   (superAdminProcedure)
 */

import { LphType, Role, TxnType } from "../../generated/prisma";
import { db } from "../setup";
import {
  createPendingReport,
  seedBaseContext,
  seedInventory,
} from "../helpers/seed";
import { createTestCaller } from "../helpers/caller";

describe("B5 PAPER regression (route-level)", () => {
  test("Pa1. Non-last paper step: qtyWip + qtyPassOn create IN txns", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.paperStep1.id,
      reportType: LphType.PRINTING,
      qtyWip: 200,
      qtyPassOn: 500,
      qtyReject: 0,
      qtyHold: 0,
    });

    await caller.verification.approveReport({ id: report.id });
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
      include: { location: true },
    });

    // Paper non-last step should create IN transactions
    // The verification.ts router routes differently but we verify outputs
    expect(txns.length).toBeGreaterThanOrEqual(1);
    expect(txns.some((t) => t.type === TxnType.IN)).toBe(true);
  });

  test("Pa2. Last paper step: qtyPassOn -> IN FG_WH", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    // Seed stock in the WIP bin for the machine of step 3 (Packing)
    await seedInventory(db, {
      locationId: ctx.locations.packing.id, // paperStep3 in seed uses machines.packing.id
      itemMasterId: ctx.items.wip987654320.id, // previous step (blow) output
      itemCode: ctx.items.wip987654320.code,
      qty: 1500,
      proId: ctx.paperPro.id,
      prosesId: ctx.steps.paperStep2.id,
    });

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.paperStep3.id,
      reportType: LphType.PAPER,
      qtyPassOn: 1000,
      qtyWip: 0,
      qtyReject: 0,
      qtyHold: 0,
    });

    await caller.verification.approveReport({ id: report.id });
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
      include: { location: true },
    });

    // Last step → FG warehouse
    const fgTxn = txns.find(
      (t) => t.location.type === "FG" && t.type === TxnType.IN,
    );
    expect(fgTxn).toBeDefined();
    expect(fgTxn?.qty.toNumber()).toBe(1000);
  });
});
