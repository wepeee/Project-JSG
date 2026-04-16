import { LphType, Role, Uom } from "../../generated/prisma";
import { createTestCaller } from "../helpers/caller";
import { PACKING_PRIMARY_REJECT_KEYS } from "../../src/lib/packing-reject";
import { seedBaseContext } from "../helpers/seed";
import { db } from "../setup";

describe("LPH output UOM snapshot (route-level)", () => {
  const buildInput = (overrides: {
    prosesId: number;
    reportType: LphType;
    qtyPassOn?: number;
    qtyReject?: number;
    rejectBreakdown?: Record<string, number>;
  }) => ({
    prosesId: overrides.prosesId,
    shift: 1,
    reportDate: new Date("2026-04-01T00:00:00.000Z"),
    operatorName: "Operator Test",
    reportType: overrides.reportType,
    qtyPassOn: overrides.qtyPassOn ?? 100,
    qtyHold: 0,
    qtyWip: 0,
    qtyReject: overrides.qtyReject ?? 0,
    rejectBreakdown: overrides.rejectBreakdown ?? {},
  });

  test("createReport on sheet machine -> outputUom sheet", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.OPERATOR.id, Role.OPERATOR);

    const report = await caller.production.createReport(
      buildInput({
        prosesId: ctx.steps.paperStep1.id,
        reportType: LphType.PAPER,
      }),
    );

    expect(report.outputUom).toBe("sheet");
  });

  test("createReport on pcs machine -> outputUom pcs", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.OPERATOR.id, Role.OPERATOR);

    const report = await caller.production.createReport(
      buildInput({
        prosesId: ctx.steps.rigidInjection.id,
        reportType: LphType.INJECTION,
      }),
    );

    expect(report.outputUom).toBe("pcs");
  });


  test("createReport PACKING only counts Bagian 1 into qtyReject", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.OPERATOR.id, Role.OPERATOR);

    const report = await caller.production.createReport(
      buildInput({
        prosesId: ctx.steps.rigidPacking.id,
        reportType: LphType.PACKING_ASSEMBLY,
        qtyReject: 999,
        rejectBreakdown: {
          [PACKING_PRIMARY_REJECT_KEYS[0]]: 11,
          [PACKING_PRIMARY_REJECT_KEYS[1]]: 4,
          "B. Spot 3": 20,
          "Stiker Halal": 30,
        },
      }),
    );

    expect(Number(report.qtyReject)).toBe(15);
  });

  test("updateReport PACKING ignores Bagian 2-6 changes for qtyReject", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.OPERATOR.id, Role.OPERATOR);

    const created = await caller.production.createReport(
      buildInput({
        prosesId: ctx.steps.rigidPacking.id,
        reportType: LphType.PACKING_ASSEMBLY,
        rejectBreakdown: {
          [PACKING_PRIMARY_REJECT_KEYS[0]]: 8,
          "B. Spot 3": 10,
        },
      }),
    );

    expect(Number(created.qtyReject)).toBe(8);

    const updated = await caller.production.updateReport({
      id: created.id,
      data: buildInput({
        prosesId: ctx.steps.rigidPacking.id,
        reportType: LphType.PACKING_ASSEMBLY,
        qtyPassOn: 120,
        qtyReject: 777,
        rejectBreakdown: {
          [PACKING_PRIMARY_REJECT_KEYS[0]]: 8,
          "B. Spot 3": 55,
          "Stiker Halal": 44,
        },
      }),
    });

    expect(Number(updated.qtyReject)).toBe(8);
  });
  test("updateReport keeps outputUom synced with current process machine uom", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.OPERATOR.id, Role.OPERATOR);

    const created = await caller.production.createReport(
      buildInput({
        prosesId: ctx.steps.paperStep1.id,
        reportType: LphType.PAPER,
      }),
    );
    expect(created.outputUom).toBe("sheet");

    await db.machine.update({
      where: { id: ctx.machines.printing.id },
      data: { uom: Uom.pcs },
    });

    const updated = await caller.production.updateReport({
      id: created.id,
      data: {
        ...buildInput({
          prosesId: ctx.steps.paperStep1.id,
          reportType: LphType.PAPER,
          qtyPassOn: 120,
        }),
      },
    });

    expect(updated.outputUom).toBe("pcs");
  });
});

