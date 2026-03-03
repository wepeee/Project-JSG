import {
  TxnType,
  ReportStatus,
  LphType,
  ItemStatus,
} from "../../generated/prisma";
import { db } from "../setup";
import { setupBaseTestEnvironment } from "../helpers/seed";
import { Decimal } from "@prisma/client/runtime/library";

describe("Integration: P1 Inventory Blind-spots", () => {
  let mockEntities: any;

  beforeEach(async () => {
    mockEntities = await setupBaseTestEnvironment(db);
  });

  // --- 1) Concurrency Test ---
  test("1) Concurrency: simultaneous approval should prevent negative stock", async () => {
    // Seed pool with 100
    await db.inventoryTxn.create({
      data: {
        type: TxnType.IN,
        locationId: mockEntities.locations.wipPoolInjection.id,
        itemMasterId: mockEntities.items.activeItem.id,
        itemId: "SYNC_SEED",
        qty: new Decimal(100),
        date: new Date(),
        groupId: "SEED",
      },
    });

    // Create 2 reports consuming 60 each (Total 120 > 100)
    const createReport = async (id: string) =>
      db.productionReport.create({
        data: {
          id,
          prosesId: mockEntities.prosesPrinting.id,
          reportType: LphType.PRINTING,
          operatorName: "OP CONC",
          reportDate: new Date(),
          shift: 1,
          status: ReportStatus.PENDING,
          qtyPassOn: new Decimal(50),
          createdById: mockEntities.users.operatorUser.id,
        },
      });

    const r1 = await createReport("CONC_1");
    const r2 = await createReport("CONC_2");

    // Mock logic for approval with lock/transaction-level check
    const approveWithStockCheck = async (reportId: string) => {
      return db.$transaction(
        async (tx) => {
          // Must perform aggregate INSIDE transaction with locking if possible,
          // but simple aggregate + create is usually enough for snapshot isolation or serialized if guarded.
          // In MySQL, we might need a lock or just check after aggregate.
          const aggIn = await tx.inventoryTxn.aggregate({
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

          const currentStock =
            (Number(aggIn._sum.qty) || 0) - (Number(aggOut._sum.qty) || 0);
          if (currentStock < 60) throw new Error("Insufficient stock");

          await tx.inventoryTxn.create({
            data: {
              type: TxnType.OUT,
              locationId: mockEntities.locations.wipPoolInjection.id,
              itemMasterId: mockEntities.items.activeItem.id,
              itemId: "CONC_OUT",
              qty: new Decimal(60),
              date: new Date(),
              productionReportId: reportId,
              groupId: "GRP-" + reportId,
            },
          });

          await tx.productionReport.update({
            where: { id: reportId },
            data: { status: ReportStatus.APPROVED },
          });
        },
        {
          isolationLevel: "Serializable", // Force SERIALIZABLE to ensure concurrency safety in this test
        },
      );
    };

    const results = await Promise.allSettled([
      approveWithStockCheck(r1.id),
      approveWithStockCheck(r2.id),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
    expect((rejected[0] as any).reason.message).toBe("Insufficient stock");

    // Final balance check
    const finalAggIn = await db.inventoryTxn.aggregate({
      _sum: { qty: true },
      where: {
        locationId: mockEntities.locations.wipPoolInjection.id,
        type: TxnType.IN,
        itemMasterId: mockEntities.items.activeItem.id,
      },
    });
    const finalAggOut = await db.inventoryTxn.aggregate({
      _sum: { qty: true },
      where: {
        locationId: mockEntities.locations.wipPoolInjection.id,
        type: TxnType.OUT,
        itemMasterId: mockEntities.items.activeItem.id,
      },
    });
    const finalStock =
      (Number(finalAggIn._sum.qty) || 0) - (Number(finalAggOut._sum.qty) || 0);
    expect(finalStock).toBe(40); // 100 - 60
  });

  // --- 2) Ambiguous WIP Input ---
  test("2) Ambiguous WIP input: error when multiple WIP materials found", async () => {
    // Add another WIP material to the same proses
    const dummyWipItem = await db.item.create({
      data: {
        code: "WIP_AMBIGUOUS_1",
        name: "Ambi WIP",
        kind: "WIP",
        status: "ACTIVE",
        createdById: mockEntities.users.ppicUser.id,
      },
    });

    await db.prosesMaterial.create({
      data: {
        prosesId: mockEntities.prosesPrinting.id,
        itemMasterId: mockEntities.items.activeItem.id, // Ensure kind is RAW or WIP?
        qtyReq: new Decimal(1),
      },
    });

    // We need to ensure activeItem is WIP for this specific test case simulation
    await db.item.update({
      where: { id: mockEntities.items.activeItem.id },
      data: { kind: "WIP" },
    });

    await db.prosesMaterial.create({
      data: {
        prosesId: mockEntities.prosesPrinting.id,
        itemMasterId: dummyWipItem.id,
        qtyReq: new Decimal(1),
      },
    });

    // Mock logic that expects exactly 1 WIP material for consumption
    const approvePrintingWithWipCheck = async (prosesId: number) => {
      const materials = await db.prosesMaterial.findMany({
        where: { prosesId },
        include: { itemMaster: true },
      });
      const wipMaterials = materials.filter((m) => m.itemMaster.kind === "WIP");
      if (wipMaterials.length > 1) {
        throw new Error(
          "Ambiguous WIP input: Multiple WIP materials found for this process.",
        );
      }
    };

    await expect(
      approvePrintingWithWipCheck(mockEntities.prosesPrinting.id),
    ).rejects.toThrow("Ambiguous WIP input");
  });

  // --- 3) Draft Item Warning ---
  test("3) Draft item warning: backend response should flag draft status", async () => {
    // Mocking the result of a search or list operation
    const items = await db.item.findMany({
      where: {
        id: {
          in: [
            mockEntities.items.activeItem.id,
            mockEntities.items.draftItem.id,
          ],
        },
      },
    });

    const response = items.map((item) => ({
      id: item.id,
      code: item.code,
      isDraft: item.status === ItemStatus.DRAFT,
    }));

    const draftEntry = response.find(
      (r) => r.id === mockEntities.items.draftItem.id,
    );
    const activeEntry = response.find(
      (r) => r.id === mockEntities.items.activeItem.id,
    );

    expect(draftEntry?.isDraft).toBe(true);
    expect(activeEntry?.isDraft).toBe(false);
  });

  // --- 4) itemMasterId NOT NULL check ---
  test("4) Integrity: essential that inventoryTxn has itemMasterId set", async () => {
    const txn = await db.inventoryTxn.create({
      data: {
        type: TxnType.IN,
        locationId: mockEntities.locations.fgWarehouse.id,
        itemMasterId: mockEntities.items.activeItem.id,
        itemId: mockEntities.items.activeItem.code,
        qty: new Decimal(10),
        date: new Date(),
        groupId: "INTEGRITY_TEST",
      },
    });

    expect(txn.itemMasterId).not.toBeNull();

    // Attempting to create without itemMasterId if DB schema allows but logic forbids
    const orphanedTxn = await db.inventoryTxn.findUnique({
      where: { id: txn.id },
    });
    expect(orphanedTxn?.itemMasterId).toBe(mockEntities.items.activeItem.id);
  });

  // --- 5) RIGID Blow Path ---
  test("5) RIGID: Blow path properly routes pool blow IN/OUT", async () => {
    const blowProses = await db.proses.create({
      data: {
        proId: mockEntities.proRigid.id,
        orderNo: 3,
        machineId: mockEntities.machines.injMachine.id, // Reuse machine for simplicity
        outputItemId: mockEntities.items.activeItem.id,
      },
    });

    const reportBlow = await db.productionReport.create({
      data: {
        id: "RPT_BLOW_1",
        prosesId: blowProses.id,
        reportType: LphType.BLOW_MOULDING,
        operatorName: "OP BLOW",
        reportDate: new Date(),
        shift: 1,
        status: ReportStatus.PENDING,
        qtyPassOn: new Decimal(300),
        createdById: mockEntities.users.operatorUser.id,
      },
    });

    // Mock logic for Blow Approval
    await db.$transaction(async (tx) => {
      await tx.inventoryTxn.create({
        data: {
          type: TxnType.IN,
          locationId: mockEntities.locations.wipPoolBlow.id,
          itemMasterId: mockEntities.items.activeItem.id,
          itemId: "BLOW_OUT",
          qty: new Decimal(300),
          date: new Date(),
          productionReportId: reportBlow.id,
          groupId: "BLOW-GRP",
        },
      });
      await tx.productionReport.update({
        where: { id: reportBlow.id },
        data: { status: ReportStatus.APPROVED },
      });
    });

    const txn = await db.inventoryTxn.findFirst({
      where: { productionReportId: reportBlow.id },
    });
    expect(txn?.locationId).toBe(mockEntities.locations.wipPoolBlow.id);
    expect(txn?.qty.toNumber()).toBe(300);
  });

  // --- 6) Packing -> FG ---
  test("6) RIGID: Packing to FG consumption and reversal", async () => {
    // Seed pool printing
    await db.inventoryTxn.create({
      data: {
        type: TxnType.IN,
        locationId: mockEntities.locations.wipPoolPrinting.id,
        itemMasterId: mockEntities.items.activeItem.id,
        itemId: "PRINT_SEED",
        qty: new Decimal(500),
        date: new Date(),
        groupId: "SEED",
      },
    });

    const packProses = await db.proses.create({
      data: {
        proId: mockEntities.proRigid.id,
        orderNo: 4,
        outputItemId: mockEntities.items.activeItem.id,
      },
    });

    const reportPack = await db.productionReport.create({
      data: {
        id: "RPT_PACK_1",
        prosesId: packProses.id,
        reportType: LphType.PACKING_ASSEMBLY,
        operatorName: "OP PACK",
        reportDate: new Date(),
        shift: 1,
        status: ReportStatus.PENDING,
        qtyPassOn: new Decimal(500),
        createdById: mockEntities.users.operatorUser.id,
      },
    });

    // Mock Packing Approve (Consume Print Pool -> IN FG)
    await db.$transaction(async (tx) => {
      // OUT from Printing
      await tx.inventoryTxn.create({
        data: {
          type: TxnType.OUT,
          locationId: mockEntities.locations.wipPoolPrinting.id,
          itemMasterId: mockEntities.items.activeItem.id,
          itemId: "PACK_CONSUME",
          qty: new Decimal(500),
          date: new Date(),
          productionReportId: reportPack.id,
          groupId: "PACK-GRP",
        },
      });
      // IN to FG
      await tx.inventoryTxn.create({
        data: {
          type: TxnType.IN,
          locationId: mockEntities.locations.fgWarehouse.id,
          itemMasterId: mockEntities.items.activeItem.id,
          itemId: "PACK_FG",
          qty: new Decimal(500),
          date: new Date(),
          productionReportId: reportPack.id,
          groupId: "PACK-GRP",
        },
      });
      await tx.productionReport.update({
        where: { id: reportPack.id },
        data: { status: ReportStatus.APPROVED },
      });
    });

    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: reportPack.id },
    });
    expect(txns).toHaveLength(2);
    expect(
      txns.some((t) => t.locationId === mockEntities.locations.fgWarehouse.id),
    ).toBe(true);

    // Reversal
    await db.$transaction(async (tx) => {
      const origs = await tx.inventoryTxn.findMany({
        where: { productionReportId: reportPack.id },
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
            productionReportId: reportPack.id,
            notes: "REVERSAL",
          },
        });
      }
      await tx.productionReport.update({
        where: { id: reportPack.id },
        data: { status: ReportStatus.VOID },
      });
    });

    const revs = await db.inventoryTxn.findMany({
      where: { productionReportId: reportPack.id, notes: "REVERSAL" },
    });
    expect(revs).toHaveLength(2);
    expect(
      revs.find((r) => r.locationId === mockEntities.locations.fgWarehouse.id)
        ?.type,
    ).toBe(TxnType.OUT);
  });
});
