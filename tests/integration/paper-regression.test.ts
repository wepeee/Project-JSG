import { LphType, TxnType } from "../../generated/prisma";
import { approveReportPosting } from "~/server/domain/inventory-service";
import { db } from "../setup";
import { createPendingReport, seedBaseContext } from "../helpers/seed";

describe("B5 PAPER regression", () => {
  test("Pa1. Non-last paper step: qtyWip -> current WIP, qtyPassOn -> next WIP", async () => {
    const ctx = await seedBaseContext(db);
    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.paperStep1.id,
      reportType: LphType.PRINTING,
      qtyWip: 200,
      qtyPassOn: 500,
      qtyReject: 0,
      qtyHold: 0,
    });

    await approveReportPosting(db, report.id);
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
      include: { location: true },
    });

    expect(txns).toHaveLength(2);
    expect(txns.every((t) => t.type === TxnType.IN)).toBe(true);

    const currentWip = txns.find((t) => t.qty.toNumber() === 200);
    const nextWip = txns.find((t) => t.qty.toNumber() === 500);

    expect(currentWip?.location.code).toBe("WIP_POOL_PRINTING");
    expect(currentWip?.itemId).toBe("987654321");
    expect(nextWip?.location.code).toBe("WIP_POOL_BLOW");
    expect(nextWip?.itemId).toBe("987654320");
  });

  test("Pa2. Last paper step: qtyPassOn -> IN FG_WH with FG code 123456789", async () => {
    const ctx = await seedBaseContext(db);
    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.paperStep3.id,
      reportType: LphType.PAPER,
      qtyPassOn: 1000,
      qtyWip: 0,
      qtyReject: 0,
      qtyHold: 0,
    });

    await approveReportPosting(db, report.id);
    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
      include: { location: true },
    });

    expect(txns).toHaveLength(1);
    expect(txns[0]?.type).toBe(TxnType.IN);
    expect(txns[0]?.location.code).toBe("FG_WH");
    expect(txns[0]?.itemId).toBe("123456789");
    expect(txns[0]?.qty.toNumber()).toBe(1000);
  });
});
