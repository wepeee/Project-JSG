import { ProType, LphType } from "../../generated/prisma";
import {
  approveReportPosting,
  createProWithFgCode,
  createProsesWithOutputCode,
  updateProFgCode,
  updateProsesOutputCode,
} from "~/server/domain/inventory-service";
import { db } from "../setup";
import { createPendingReport, seedBaseContext } from "../helpers/seed";

describe("B2 FK integrity", () => {
  test("F1. Create PRO with existing FG code sets fgItemId", async () => {
    const ctx = await seedBaseContext(db);

    const pro = await createProWithFgCode(db, {
      proNumber: "900000003",
      productName: "FK Pro",
      qtyPoPcs: 1000,
      type: ProType.RIGID,
      fgCode: ctx.items.fg123456789.code,
      proPrefixId: ctx.proPrefix.id,
    });

    expect(pro.fgItemId).toBe(ctx.items.fg123456789.id);
  });

  test("F2. Update PRO FG code updates fgItemId", async () => {
    const ctx = await seedBaseContext(db);
    const pro = await createProWithFgCode(db, {
      proNumber: "900000003",
      productName: "FK Pro",
      qtyPoPcs: 1000,
      type: ProType.RIGID,
      fgCode: ctx.items.fg123456789.code,
      proPrefixId: ctx.proPrefix.id,
    });

    const updated = await updateProFgCode(db, pro.id, ctx.items.fg123456780.code);
    expect(updated.fgItemId).toBe(ctx.items.fg123456780.id);
  });

  test("F3. Create and update Proses output code sets outputItemId", async () => {
    const ctx = await seedBaseContext(db);
    const created = await createProsesWithOutputCode(db, {
      proId: ctx.rigidPro.id,
      orderNo: 99,
      outputCode: ctx.items.wip987654321.code,
    });
    expect(created.outputItemId).toBe(ctx.items.wip987654321.id);

    const updated = await updateProsesOutputCode(
      db,
      created.id,
      ctx.items.wip987654320.code,
    );
    expect(updated.outputItemId).toBe(ctx.items.wip987654320.id);
  });

  test("F4. InventoryTxn created by posting always has itemMasterId NOT NULL", async () => {
    const ctx = await seedBaseContext(db);
    const report = await createPendingReport(db, ctx.users.OPERATOR.id, {
      prosesId: ctx.steps.rigidInjection.id,
      reportType: LphType.INJECTION,
      qtyPassOn: 150,
    });

    await approveReportPosting(db, report.id);

    const txns = await db.inventoryTxn.findMany({
      where: { productionReportId: report.id },
    });

    expect(txns.length).toBeGreaterThan(0);
    expect(txns.every((t) => t.itemMasterId !== null)).toBe(true);
  });
});
