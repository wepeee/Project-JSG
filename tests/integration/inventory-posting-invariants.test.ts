/**
 * B3 Inventory posting invariants — route-level tests.
 *
 * Routes exercised:
 *   verification.approveReport   (superAdminProcedure)
 *   verification.voidReport      (superAdminProcedure)
 */

import { LphType, ReportStatus, Role, TxnType } from "../../generated/prisma";
import { db } from "../setup";
import {
  createPendingReport,
  seedBaseContext,
  seedInventory,
} from "../helpers/seed";
import { createTestCaller } from "../helpers/caller";

describe("B3 Inventory posting invariants (route-level)", () => {
  test("P1. verification.approveReport creates txns and sets stockPostedAt", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 120,
    });

    await caller.verification.approveReport({ id: report.id });

    const posted = await db.productionReport.findUnique({
      where: { id: report.id },
    });
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
    });

    expect(txns.length).toBeGreaterThan(0);
    expect(posted?.stockPostedAt).not.toBeNull();
    expect(posted?.status).toBe(ReportStatus.APPROVED);
  });

  test("P2. Double approve is idempotent (no duplicate txns)", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 100,
    });

    await caller.verification.approveReport({ id: report.id });
    const firstCount = await db.inventoryTxn.count({
      where: { productionReportId: report.id },
    });

    // Second approve — already APPROVED, should not create more txns
    await expect(
      caller.verification.approveReport({ id: report.id }),
    ).rejects.toThrow(); // Router throws "Report already approved/posted"

    const secondCount = await db.inventoryTxn.count({
      where: { productionReportId: report.id },
    });

    expect(secondCount).toBe(firstCount);
  });

  test("P3. Void reversal flips IN/OUT and balances to zero", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 250,
    });

    await caller.verification.approveReport({ id: report.id });
    await caller.verification.voidReport({
      id: report.id,
      reason: "test void",
    });

    // Reversals are linked with productionReportId: null, we find all txns by checking the report
    const originalTxns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
    });
    const voidTxns = await db.inventoryTxn.findMany({
      where: { notes: { contains: report.id } },
    });

    // Net balance across all related txns should be 0
    const allTxns = [...originalTxns, ...voidTxns];
    const net = allTxns.reduce((acc, txn) => {
      const sign = txn.type === TxnType.IN ? 1 : -1;
      return acc + sign * txn.qty.toNumber();
    }, 0);

    expect(net).toBe(0);
  });

  test("P4. Void a non-APPROVED report -> error", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 100,
    });

    await expect(
      caller.verification.voidReport({ id: report.id, reason: "bad" }),
    ).rejects.toThrow(); // "Only APPROVED reports can be VOIDED"
  });

  test("P5. All txns per report share same groupId", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    // Seed stock so printing OUT succeeds
    await seedInventory(db, {
      locationId: ctx.locations.printing.id,
      itemMasterId: ctx.items.wip987654321.id,
      itemCode: ctx.items.wip987654321.code,
      qty: 700,
      proId: ctx.rigidPro.id,
      prosesId: ctx.steps.rigidInjection.id,
    });

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidPrinting.id,
      reportType: LphType.PRINTING,
      qtyPassOn: 500,
      qtyWip: 50,
      qtyHold: 25,
      qtyReject: 25,
    });

    await caller.verification.approveReport({ id: report.id });
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
    });

    expect(txns.length).toBeGreaterThan(0);
    const groupIds = new Set(txns.map((t) => t.groupId));
    expect(groupIds.size).toBe(1);
  });

  test("P6. Atomicity: insufficient stock -> no txn, report stays PENDING", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.SUPERADMIN.id, Role.SUPERADMIN);

    // Seed just 100 into injection pool
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
    const after = await db.productionReport.findUnique({
      where: { id: report.id },
    });

    expect(txns).toHaveLength(0);
    expect(after?.stockPostedAt).toBeNull();
    expect(after?.status).toBe(ReportStatus.PENDING);
  });
});
