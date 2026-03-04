/**
 * P1 Blindspots integration tests — route-level.
 */

import { LphType, Role, TxnType, ItemStatus } from "../../generated/prisma";
import { db } from "../setup";
import {
  createPendingReport,
  seedBaseContext,
  seedInventory,
} from "../helpers/seed";
import { createTestCaller } from "../helpers/caller";

describe("P1 Blindspots (route-level)", () => {
  test("BS1. Concurrency: 2 approvals for same stock -> one fails", async () => {
    const ctx = await seedBaseContext(db);
    // Use two callers for realism
    const caller1 = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);
    const caller2 = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    // Seed stock: 100
    await seedInventory(db, {
      locationId: ctx.locations.printing.id,
      itemMasterId: ctx.items.wip987654321.id,
      itemCode: ctx.items.wip987654321.code,
      qty: 100,
      proId: ctx.rigidPro.id,
      prosesId: ctx.steps.rigidInjection.id,
    });

    // Create 2 reports consuming 60 each (total 120 > 100)
    const report1 = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidPrinting.id,
      reportType: LphType.PRINTING,
      qtyPassOn: 60,
    });

    const report2 = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidPrinting.id,
      reportType: LphType.PRINTING,
      qtyPassOn: 60,
    });

    // Fire concurrently
    const results = await Promise.allSettled([
      caller1.verification.approveReport({ id: report1.id }),
      caller2.verification.approveReport({ id: report2.id }),
    ]);

    const successes = results.filter((r) => r.status === "fulfilled");
    const failures = results.filter((r) => r.status === "rejected");

    expect(successes).toHaveLength(1);
    expect(failures).toHaveLength(1);

    // Verify balance is exactly 40 (100 - 60)
    const txns = await db.inventoryTxn.groupBy({
      by: ["type"],
      where: {
        locationId: ctx.locations.printing.id,
        itemMasterId: ctx.items.wip987654321.id,
      },
      _sum: { qty: true },
    });

    let balance = 0;
    for (const g of txns) {
      if (g.type === "IN") balance += Number(g._sum.qty?.toString() ?? "0");
      if (g.type === "OUT") balance -= Number(g._sum.qty?.toString() ?? "0");
    }
    expect(balance).toBe(40);
  });

  test("BS2. Ambiguous WIP input (>1 material) -> reject", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    // Step has existing material material
    // Add another WIP material to rigidPrinting
    await db.prosesMaterial.create({
      data: {
        prosesId: ctx.steps.rigidPrinting.id,
        itemMasterId: ctx.items.wip987654320.id, // wip987654320 is also WIP
        qtyReq: 1,
      },
    });

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidPrinting.id,
      reportType: LphType.PRINTING,
      qtyPassOn: 100,
    });

    await expect(
      caller.verification.approveReport({ id: report.id }),
    ).rejects.toThrow(/ambiguous/i);
  });

  test("BS3. Draft item usage -> returns isDraft flag", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    // Create a DRAFT item and seed it
    const draftItem = await db.item.create({
      data: {
        code: "DRAFT-123",
        name: "Draft Item",
        kind: "WIP",
        status: ItemStatus.DRAFT,
        createdById: ctx.users.PPIC.id,
      },
    });

    await seedInventory(db, {
      locationId: ctx.locations.printing.id,
      itemMasterId: draftItem.id,
      itemCode: draftItem.code,
      qty: 100,
      proId: ctx.rigidPro.id,
    });

    // Make printing consume this draft item instead?
    // Or just approve a report that consumes it.
    // the verify function resolves material by step order/prevStep.
    // Let's modify step1 output to be this draft item.
    await db.proses.update({
      where: { id: ctx.steps.rigidInjection.id },
      data: { partNumber: draftItem.code, outputItemId: draftItem.id },
    });

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidPrinting.id,
      reportType: LphType.PRINTING,
      qtyPassOn: 50,
    });

    const result = await caller.verification.approveReport({ id: report.id });

    // Check if result contains warnings or draft flag
    // (Assuming the business logic handles this as requested)
    expect(result).toHaveProperty("isDraft", true);
  });

  test("BS4. RIGID Blow path: IN to WIP_M_blow", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    // Create report for a step that outputs to blow machine
    // paperStep2 machine is blow
    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.paperStep1.id, // step 1 outputs to next step machine
      reportType: LphType.PRINTING,
      qtyPassOn: 500,
    });

    // Step 2 machine = blow
    await caller.verification.approveReport({ id: report.id });

    const blowTxn = await db.inventoryTxn.findFirst({
      where: {
        productionReportId: report.id,
        locationId: ctx.locations.blow.id,
        type: "IN",
      },
    });

    expect(blowTxn).toBeDefined();
    expect(blowTxn?.qty.toNumber()).toBe(500);
  });

  test("BS5. Packing -> FG reversal: void restores balance", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    // Seed stock for packing (last step)
    await seedInventory(db, {
      locationId: ctx.locations.packing.id,
      itemMasterId: ctx.items.wip987654320.id,
      itemCode: ctx.items.wip987654320.code,
      qty: 1000,
      proId: ctx.rigidPro.id,
      prosesId: ctx.steps.rigidPrinting.id,
    });

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidPacking.id,
      reportType: LphType.PACKING_ASSEMBLY,
      qtyPassOn: 300,
    });

    // 1. Approve
    await caller.verification.approveReport({ id: report.id });

    // 2. Void
    await caller.verification.voidReport({
      id: report.id,
      reason: "Test reversal",
    });

    const txns = await db.inventoryTxn.findMany({
      where: {
        locationId: ctx.locations.fg.id,
        itemMasterId: ctx.items.fg123456789.id,
      },
    });

    // Should have IN (300) and OUT (-300) -> Net 0
    let net = 0;
    for (const t of txns) {
      if (t.type === "IN") net += Number(t.qty.toString());
      else if (t.type === "OUT") net -= Number(t.qty.toString());
    }
    expect(net).toBe(0);
  });
});
