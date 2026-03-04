import { LphType, ReportStatus, TxnType } from "../../generated/prisma";
import {
  approveReportPosting,
  voidReportPosting,
} from "~/server/domain/inventory-service";
import { db } from "../setup";
import {
  createPendingReport,
  seedBaseContext,
  seedInventory,
} from "../helpers/seed";

describe("B3 Inventory posting invariants", () => {
  test("P1. Approve creates inventory txns and sets stockPostedAt", async () => {
    const ctx = await seedBaseContext(db);
    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 120,
    });

    const result = await approveReportPosting(db, report.id);
    const posted = await db.productionReport.findUnique({ where: { id: report.id } });
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
    });

    expect(result.idempotent).toBe(false);
    expect(txns.length).toBeGreaterThan(0);
    expect(posted?.stockPostedAt).not.toBeNull();
    expect(posted?.status).toBe(ReportStatus.APPROVED);
  });

  test("P2. Approve idempotent: second approve does not duplicate txns", async () => {
    const ctx = await seedBaseContext(db);
    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 100,
    });

    await approveReportPosting(db, report.id);
    const firstCount = await db.inventoryTxn.count({
      where: { productionReportId: report.id },
    });

    const second = await approveReportPosting(db, report.id);
    const secondCount = await db.inventoryTxn.count({
      where: { productionReportId: report.id },
    });

    expect(second.idempotent).toBe(true);
    expect(secondCount).toBe(firstCount);
  });

  test("P3. All txns per report share the same groupId", async () => {
    const ctx = await seedBaseContext(db);
    await seedInventory(db, {
      locationId: ctx.locations.injection.id,
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

    await approveReportPosting(db, report.id);
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
    });

    expect(txns).toHaveLength(2);
    const groupIds = new Set(txns.map((t) => t.groupId));
    expect(groupIds.size).toBe(1);
    expect(txns[0]?.groupId).toBe(`POST-${report.id}`);
  });

  test("P4. Atomicity: insufficient stock -> no txn and stockPostedAt remains null", async () => {
    const ctx = await seedBaseContext(db);
    await seedInventory(db, {
      locationId: ctx.locations.injection.id,
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

    await expect(approveReportPosting(db, report.id)).rejects.toMatchObject({
      code: "PRECONDITION_FAILED",
    });

    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
    });
    const after = await db.productionReport.findUnique({ where: { id: report.id } });

    expect(txns).toHaveLength(0);
    expect(after?.stockPostedAt).toBeNull();
    expect(after?.status).toBe(ReportStatus.PENDING);
  });

  test("P5. Void reversal flips IN/OUT and restores balance", async () => {
    const ctx = await seedBaseContext(db);
    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 250,
    });

    await approveReportPosting(db, report.id);
    await voidReportPosting(db, report.id, "test void");

    const txns = await db.inventoryTxn.findMany({
      where: {
        OR: [{ productionReportId: report.id }, { groupId: `VOID-${report.id}` }],
      },
    });

    const net = txns.reduce((acc, txn) => {
      const sign = txn.type === TxnType.IN ? 1 : -1;
      return acc + sign * txn.qty.toNumber();
    }, 0);

    expect(net).toBe(0);
  });

  test("P6. Void idempotent: second void does not duplicate reversals", async () => {
    const ctx = await seedBaseContext(db);
    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 200,
    });

    await approveReportPosting(db, report.id);
    const firstVoid = await voidReportPosting(db, report.id, "first");
    const firstReversalCount = await db.inventoryTxn.count({
      where: { groupId: `VOID-${report.id}` },
    });

    const secondVoid = await voidReportPosting(db, report.id, "second");
    const secondReversalCount = await db.inventoryTxn.count({
      where: { groupId: `VOID-${report.id}` },
    });

    expect(firstVoid.idempotent).toBe(false);
    expect(firstReversalCount).toBeGreaterThan(0);
    expect(secondVoid.idempotent).toBe(true);
    expect(secondReversalCount).toBe(firstReversalCount);
  });
});
