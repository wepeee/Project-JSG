import { LphType, TxnType } from "../../generated/prisma";
import { approveReportPosting } from "~/server/domain/inventory-service";
import { db } from "../setup";
import {
  createPendingReport,
  seedBaseContext,
  seedInventory,
} from "../helpers/seed";

describe("B4 RIGID flow (numeric-only)", () => {
  test("R1. Injection approve -> IN to WIP_POOL_INJECTION with code 987654321", async () => {
    const ctx = await seedBaseContext(db);
    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 300,
    });

    await approveReportPosting(db, report.id);
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
      include: { location: true },
    });

    expect(txns).toHaveLength(1);
    expect(txns[0]?.type).toBe(TxnType.IN);
    expect(txns[0]?.location.code).toBe("WIP_POOL_INJECTION");
    expect(txns[0]?.itemId).toBe("987654321");
    expect(txns[0]?.qty.toNumber()).toBe(300);
  });

  test("R2. Printing approve -> OUT WIP_POOL_INJECTION (qtyProducedTotal) + IN WIP_POOL_PRINTING", async () => {
    const ctx = await seedBaseContext(db);
    await seedInventory(db, {
      locationId: ctx.locations.injection.id,
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

    await approveReportPosting(db, report.id);
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
      include: { location: true },
      orderBy: { type: "asc" },
    });

    expect(txns).toHaveLength(2);
    const outTxn = txns.find((t) => t.type === TxnType.OUT);
    const inTxn = txns.find((t) => t.type === TxnType.IN);

    expect(outTxn?.location.code).toBe("WIP_POOL_INJECTION");
    expect(outTxn?.qty.toNumber()).toBe(560);
    expect(inTxn?.location.code).toBe("WIP_POOL_PRINTING");
    expect(inTxn?.itemId).toBe("987654320");
    expect(inTxn?.qty.toNumber()).toBe(500);
  });

  test("R3. Guardrail insufficient stock -> reject and no partial write", async () => {
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
    expect(txns).toHaveLength(0);
  });

  test("R4. Ambiguous input WIP (>1 material WIP) -> reject", async () => {
    const ctx = await seedBaseContext(db);
    await db.prosesMaterial.create({
      data: {
        prosesId: ctx.steps.rigidPrinting.id,
        itemMasterId: ctx.items.wip987654320.id,
        qtyReq: 1,
      },
    });

    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidPrinting.id,
      reportType: LphType.PRINTING,
      qtyPassOn: 100,
    });

    await expect(approveReportPosting(db, report.id)).rejects.toMatchObject({
      code: "PRECONDITION_FAILED",
    });
  });
});
