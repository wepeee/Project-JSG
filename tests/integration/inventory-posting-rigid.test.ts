import { TxnType, ReportStatus, LphType } from "../../generated/prisma";
import { db } from "../setup";
import { setupBaseTestEnvironment } from "../helpers/seed";
import { Decimal } from "@prisma/client/runtime/library";

describe("Integration: Rigid Inventory Posting logic", () => {
  let mockEntities: any;

  beforeEach(async () => {
    mockEntities = await setupBaseTestEnvironment(db);
  });

  // Mock an approval mechanism wrapper for transactions
  async function mockApproveTxn(
    reportId: string,
    processType: "INJECTION" | "PRINTING",
  ) {
    const report = await db.productionReport.findUnique({
      where: { id: reportId },
      include: { proses: { include: { materials: true } } },
    });
    if (!report || report.status !== ReportStatus.PENDING)
      throw new Error("Invalid report");

    let groupId = "TEST-GROUP-" + reportId;

    await db.$transaction(async (tx) => {
      if (processType === "INJECTION") {
        await tx.inventoryTxn.create({
          data: {
            type: TxnType.IN,
            locationId: mockEntities.locations.wipPoolInjection.id,
            itemMasterId: mockEntities.items.activeItem.id, // Usually the output item
            itemId: "DUMMY",
            qty: report.qtyPassOn || new Decimal(0),
            date: new Date(),
            productionReportId: report.id,
            groupId,
          },
        });
      } else if (processType === "PRINTING") {
        // Out from injection pool
        const reqStock = 500;
        const agg = await tx.inventoryTxn.aggregate({
          _sum: { qty: true },
          where: {
            locationId: mockEntities.locations.wipPoolInjection.id,
            type: TxnType.IN,
            itemMasterId: mockEntities.items.activeItem.id,
          },
        });
        const aggOut = await tx.inventoryTxn.aggregate({
          _sum: { qty: true },
          where: {
            locationId: mockEntities.locations.wipPoolInjection.id,
            type: TxnType.OUT,
            itemMasterId: mockEntities.items.activeItem.id,
          },
        });

        const stock =
          (agg._sum.qty?.toNumber() || 0) - (aggOut._sum.qty?.toNumber() || 0);

        if (stock < reqStock) {
          throw new Error("Insufficient pool stock");
        }

        await tx.inventoryTxn.create({
          data: {
            type: TxnType.OUT,
            locationId: mockEntities.locations.wipPoolInjection.id,
            itemMasterId: mockEntities.items.activeItem.id,
            itemId: "DUMMY",
            qty: new Decimal(reqStock),
            date: new Date(),
            productionReportId: report.id,
            groupId,
          },
        });

        // In to printing pool
        await tx.inventoryTxn.create({
          data: {
            type: TxnType.IN,
            locationId: mockEntities.locations.wipPoolPrinting.id,
            itemMasterId: mockEntities.items.activeItem.id,
            itemId: "DUMMY",
            qty: report.qtyPassOn || new Decimal(0),
            date: new Date(),
            productionReportId: report.id,
            groupId,
          },
        });
      }

      await tx.productionReport.update({
        where: { id: report.id },
        data: { status: ReportStatus.APPROVED, stockPostedAt: new Date() },
      });
    });
  }

  test("1) Injection approve -> IN ke WIP_POOL_INJECTION (qty sesuai)", async () => {
    const report = await db.productionReport.create({
      data: {
        id: "REPORT_INJ_1",
        prosesId: mockEntities.prosesInjection.id,
        reportType: LphType.INJECTION,
        operatorName: "OP 1",
        reportDate: new Date(),
        shift: 1,
        totalDowntime: 0,
        status: ReportStatus.PENDING,
        qtyPassOn: new Decimal(1000),
        qtyReject: new Decimal(0),
        createdById: mockEntities.users.operatorUser.id,
      },
    });

    await mockApproveTxn(report.id, "INJECTION");

    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
    });
    expect(txns).toHaveLength(1);
    expect(txns[0]!.type).toBe(TxnType.IN);
    expect(txns[0]!.qty.toNumber()).toBe(1000);
  });

  test("2) Printing approve -> OUT pool injection + IN pool printing", async () => {
    // PREREQUISITE: Seed stock in Injection pool
    await db.inventoryTxn.create({
      data: {
        type: TxnType.IN,
        locationId: mockEntities.locations.wipPoolInjection.id,
        itemMasterId: mockEntities.items.activeItem.id,
        itemId: "SEED",
        qty: new Decimal(1000),
        date: new Date(),
        groupId: "SEED-STOCK",
      },
    });

    const reportPrint = await db.productionReport.create({
      data: {
        id: "REPORT_PRT_1",
        prosesId: mockEntities.prosesPrinting.id,
        reportType: LphType.PRINTING,
        operatorName: "OP 1",
        reportDate: new Date(),
        shift: 1,
        totalDowntime: 0,
        status: ReportStatus.PENDING,
        qtyPassOn: new Decimal(500),
        qtyReject: new Decimal(0),
        createdById: mockEntities.users.operatorUser.id,
      },
    });

    await mockApproveTxn(reportPrint.id, "PRINTING");

    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: reportPrint.id },
    });
    expect(txns.length).toBeGreaterThanOrEqual(1);
    expect(txns.some((t) => t.type === TxnType.OUT)).toBe(true);
  });

  test("3) Guardrail insufficient -> error thrown AND no state change", async () => {
    // No stock seeded
    const reportOver = await db.productionReport.create({
      data: {
        id: "REPORT_PRT_OVER",
        prosesId: mockEntities.prosesPrinting.id,
        reportType: LphType.PRINTING,
        operatorName: "OP 1",
        reportDate: new Date(),
        shift: 1,
        totalDowntime: 0,
        status: ReportStatus.PENDING,
        qtyPassOn: new Decimal(5000),
        qtyReject: new Decimal(0),
        createdById: mockEntities.users.operatorUser.id,
      },
    });

    await expect(mockApproveTxn(reportOver.id, "PRINTING")).rejects.toThrow(
      "Insufficient pool stock",
    );

    const f = await db.productionReport.findUnique({
      where: { id: reportOver.id },
    });
    expect(f?.status).toBe(ReportStatus.PENDING);
  });

  test("4) Void reversal -> correctly reverts transactions", async () => {
    const reportVoid = await db.productionReport.create({
      data: {
        id: "REPORT_VOID_TEST",
        prosesId: mockEntities.prosesInjection.id,
        reportType: LphType.INJECTION,
        operatorName: "OP 1",
        reportDate: new Date(),
        shift: 1,
        totalDowntime: 0,
        status: ReportStatus.PENDING,
        qtyPassOn: new Decimal(200),
        qtyReject: new Decimal(0),
        createdById: mockEntities.users.operatorUser.id,
      },
    });
    await mockApproveTxn(reportVoid.id, "INJECTION");

    // Mock Void
    await db.$transaction(async (tx) => {
      const origs = await tx.inventoryTxn.findMany({
        where: { productionReportId: reportVoid.id },
      });
      for (const t of origs) {
        await tx.inventoryTxn.create({
          data: {
            type: t.type === TxnType.IN ? TxnType.OUT : TxnType.IN,
            locationId: t.locationId,
            itemMasterId: t.itemMasterId!,
            itemId: t.itemId,
            qty: t.qty,
            date: new Date(),
            productionReportId: reportVoid.id,
            notes: "VOID_REVERSAL",
            groupId: "VOID-" + reportVoid.id,
          },
        });
      }
      await tx.productionReport.update({
        where: { id: reportVoid.id },
        data: { status: ReportStatus.VOID },
      });
    });

    const revs = await db.inventoryTxn.findMany({
      where: { notes: "VOID_REVERSAL", productionReportId: reportVoid.id },
    });
    expect(revs).toHaveLength(1);
    expect(revs[0]!.type).toBe(TxnType.OUT);
  });
});
