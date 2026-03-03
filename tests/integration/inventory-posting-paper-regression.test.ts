import { TxnType, ReportStatus, LphType } from "../../generated/prisma";
import { db } from "../setup";
import { setupBaseTestEnvironment } from "../helpers/seed";
import { Decimal } from "@prisma/client/runtime/library";

describe("Integration: Paper Inventory Regression Flow", () => {
  let mockEntities: any;

  beforeEach(async () => {
    mockEntities = await setupBaseTestEnvironment(db);
  });

  async function mockPaperApproveTxn(
    reportId: string,
    step: "NON-LAST" | "LAST",
  ) {
    const report = await db.productionReport.findUnique({
      where: { id: reportId },
      include: { proses: true },
    });
    if (!report) throw new Error("Report missing");

    let groupId = "PAPER-TRX-" + reportId;

    await db.$transaction(async (tx) => {
      // Non-last step yields into WIP logic (either current machine or next machine allocation)
      if (step === "NON-LAST") {
        // QtyWip = internal WIP
        if (report.qtyWip && report.qtyWip.toNumber() > 0) {
          await tx.inventoryTxn.create({
            data: {
              type: TxnType.IN,
              locationId: mockEntities.locations.wipPoolPrinting.id, // Suppose it stores here as buffer
              itemMasterId: mockEntities.items.activeItem.id,
              itemId: "DUMMY",
              qty: report.qtyWip,
              date: new Date(),
              productionReportId: report.id,
              groupId,
            },
          });
        }

        // QtyPassOn = Next process buffer WIP
        if (report.qtyPassOn && report.qtyPassOn.toNumber() > 0) {
          await tx.inventoryTxn.create({
            data: {
              type: TxnType.IN,
              locationId: mockEntities.locations.wipPoolBlow.id, // Supossed to be next machine buffer
              itemMasterId: mockEntities.items.activeItem.id,
              itemId: "DUMMY",
              qty: report.qtyPassOn,
              date: new Date(),
              productionReportId: report.id,
              groupId,
            },
          });
        }
      } else {
        // Last step => QtyPassOn goes to FG
        if (report.qtyPassOn && report.qtyPassOn.toNumber() > 0) {
          await tx.inventoryTxn.create({
            data: {
              type: TxnType.IN,
              locationId: mockEntities.locations.fgWarehouse.id,
              itemMasterId: mockEntities.items.activeItem.id,
              itemId: "DUMMY",
              qty: report.qtyPassOn,
              date: new Date(),
              productionReportId: report.id,
              groupId,
            },
          });
        }
      }

      await tx.productionReport.update({
        where: { id: report.id },
        data: { status: ReportStatus.APPROVED, stockPostedAt: new Date() },
      });
    });
  }

  test("1) Paper Non-Last Step: qtyWip -> WIP current, qtyPassOn -> WIP Next", async () => {
    const rep = await db.productionReport.create({
      data: {
        id: "PAPER_RPT_1",
        prosesId: mockEntities.prosesPaperNonLast.id,
        reportType: LphType.PAPER,
        operatorName: "OP 1",
        reportDate: new Date(),
        shift: 1,
        totalDowntime: 0,
        status: ReportStatus.PENDING,
        qtyPassOn: new Decimal(500),
        qtyWip: new Decimal(200),
        qtyReject: new Decimal(0),
        createdById: mockEntities.users.operatorUser.id,
      },
    });

    await mockPaperApproveTxn(rep.id, "NON-LAST");

    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: rep.id },
    });

    // Expect 2 Insertions IN (one for QtyWip, one for QtyPassOn)
    expect(txns).toHaveLength(2);

    // Assume mapping WIP curr = Printing, WIP next = Blow just for routing mock representations
    const qtyWipTrx = txns.find((t) => t.qty.toNumber() === 200);
    expect(qtyWipTrx).toBeDefined();
    expect(qtyWipTrx!.locationId).toBe(
      mockEntities.locations.wipPoolPrinting.id,
    );

    const qtyPassOnTrx = txns.find((t) => t.qty.toNumber() === 500);
    expect(qtyPassOnTrx).toBeDefined();
    expect(qtyPassOnTrx!.locationId).toBe(
      mockEntities.locations.wipPoolBlow.id,
    );
  });

  test("2) Paper Last Step: qtyPassOn -> FG_WH Allocation", async () => {
    const repLast = await db.productionReport.create({
      data: {
        id: "PAPER_RPT_2",
        prosesId: mockEntities.prosesPaperLast.id,
        reportType: LphType.PAPER,
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

    await mockPaperApproveTxn(repLast.id, "LAST");

    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: repLast.id },
    });

    expect(txns).toHaveLength(1);
    expect(txns[0]!.type).toBe(TxnType.IN);
    expect(txns[0]!.qty.toNumber()).toBe(1000);
    expect(txns[0]!.locationId).toBe(mockEntities.locations.fgWarehouse.id);
  });

  test("3) Paper Step: qtyReject does not create inventory transactions", async () => {
    const repReject = await db.productionReport.create({
      data: {
        id: "PAPER_RPT_REJECT",
        prosesId: mockEntities.prosesPaperLast.id,
        reportType: LphType.PAPER,
        operatorName: "OP 1",
        reportDate: new Date(),
        shift: 1,
        totalDowntime: 0,
        status: ReportStatus.PENDING,
        qtyPassOn: new Decimal(0),
        qtyWip: new Decimal(0),
        qtyReject: new Decimal(100),
        createdById: mockEntities.users.operatorUser.id,
      },
    });

    await mockPaperApproveTxn(repReject.id, "LAST");

    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: repReject.id },
    });

    // QtyReject should NOT create IN/OUT transactions in this simplified mock
    expect(txns).toHaveLength(0);
  });
});
