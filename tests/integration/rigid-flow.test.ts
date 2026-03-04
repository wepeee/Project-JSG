/**
 * B4 RIGID flow — route-level tests.
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

describe("B4 RIGID flow (route-level)", () => {
  test("R1. Injection approve -> IN to WIP_POOL_INJECTION", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 300,
    });

    await caller.verification.approveReport({ id: report.id });
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
      include: { location: true },
    });

    // Injection step 1 → auto-refill IN + OUT (transfer logic)
    // Based on verification.ts: step1 auto-creates IN for totalProduced then OUT for totalOut
    // qtyPassOn=300, step1 => isFirstStep, totalOut=300
    // Produces: AUTO IN (300) + OUT (300) + IN to next step (300)
    // We check for presence of transactions and their correctness
    expect(txns.length).toBeGreaterThanOrEqual(1);

    // There should be at least an IN to the next step's WIP location
    const inToWip = txns.find(
      (t) => t.type === TxnType.IN && t.location.type === "WIP",
    );
    expect(inToWip).toBeDefined();
    expect(inToWip?.qty.toNumber()).toBe(300);
  });

  test("R2. Printing approve -> OUT injection pool, IN printing pool", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    // Seed stock in printing pool (this is where injection pushes PassOn stock)
    await seedInventory(db, {
      locationId: ctx.locations.printing.id,
      itemMasterId: ctx.items.wip987654321.id,
      itemCode: ctx.items.wip987654321.code,
      qty: 1000,
      proId: ctx.rigidPro.id,
      prosesId: ctx.steps.rigidInjection.id,
    });

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidPrinting.id,
      reportType: LphType.PRINTING,
      qtyPassOn: 500,
      qtyWip: 30,
      qtyHold: 20,
      qtyReject: 10,
    });

    await caller.verification.approveReport({ id: report.id });
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
      include: { location: true },
    });

    expect(txns.length).toBeGreaterThanOrEqual(2);
    expect(txns.some((t) => t.type === TxnType.OUT)).toBe(true);
    expect(txns.some((t) => t.type === TxnType.IN)).toBe(true);
  });

  test("R3. Guardrail: insufficient stock -> reject, no partial write", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    await seedInventory(db, {
      locationId: ctx.locations.printing.id,
      itemMasterId: ctx.items.wip987654321.id,
      itemCode: ctx.items.wip987654321.code,
      qty: 100,
      proId: ctx.rigidPro.id,
      prosesId: ctx.steps.rigidInjection.id,
    });

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidPrinting.id,
      reportType: LphType.PRINTING,
      qtyPassOn: 120,
      qtyWip: 20,
      qtyHold: 10,
      qtyReject: 5,
    });

    await expect(
      caller.verification.approveReport({ id: report.id }),
    ).rejects.toThrow();

    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
    });
    expect(txns).toHaveLength(0);
  });
});
