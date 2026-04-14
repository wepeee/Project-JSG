import { ItemKind, ItemStatus, Role } from "../../generated/prisma";
import { db } from "../setup";
import { createTestCaller } from "../helpers/caller";
import { seedBaseContext } from "../helpers/seed";

describe("PRO shift calculation consistency", () => {
  test("create: sheet machine + sheet material splits shifts and planned target", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.PPIC.id, Role.PPIC);

    const matSheet = await db.item.create({
      data: {
        code: "MAT_SHEET_001",
        name: "Material Sheet 001",
        kind: ItemKind.RAW,
        status: ItemStatus.ACTIVE,
        baseUom: "sheet",
      },
      select: { id: true },
    });

    const created = await caller.pros.create({
      productName: "Calc Sheet",
      partNumber: ctx.items.fg123456789.code,
      proPrefixId: ctx.proPrefix.id,
      type: "RIGID",
      qtyPoPcs: 10000,
      proses: [
        {
          up: 2,
          machineId: ctx.machines.printing.id, // sheet machine, std 900
          partNumber: ctx.items.wip987654321.code,
          materials: [{ materialId: matSheet.id, qtyReq: 3000 }],
        },
      ],
    });

    const steps = await db.proses.findMany({
      where: { proId: created.id },
      orderBy: { orderNo: "asc" },
      select: { estimatedShifts: true, plannedQtyPcs: true },
    });

    expect(steps).toHaveLength(4);
    expect(steps.every((s) => s.estimatedShifts === 4)).toBe(true);
    const totalPlanned = steps.reduce(
      (acc, s) => acc + Number(s.plannedQtyPcs ?? 0),
      0,
    );
    expect(totalPlanned).toBe(6000);
  });

  test("create: pcs machine + pcs material uses pcs basis then converts via UP/CAV", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.PPIC.id, Role.PPIC);

    const matPcs = await db.item.create({
      data: {
        code: "MAT_PCS_001",
        name: "Material Pcs 001",
        kind: ItemKind.RAW,
        status: ItemStatus.ACTIVE,
        baseUom: "pcs",
      },
      select: { id: true },
    });

    const created = await caller.pros.create({
      productName: "Calc Pcs",
      partNumber: ctx.items.fg123456789.code,
      proPrefixId: ctx.proPrefix.id,
      type: "RIGID",
      qtyPoPcs: 10000,
      proses: [
        {
          up: 2,
          machineId: ctx.machines.injection.id, // pcs machine, std 900
          partNumber: ctx.items.wip987654321.code,
          materials: [{ materialId: matPcs.id, qtyReq: 2000 }],
        },
      ],
    });

    const steps = await db.proses.findMany({
      where: { proId: created.id },
      orderBy: { orderNo: "asc" },
      select: { estimatedShifts: true, plannedQtyPcs: true },
    });

    expect(steps).toHaveLength(2);
    expect(steps.every((s) => s.estimatedShifts === 2)).toBe(true);
    const totalPlanned = steps.reduce(
      (acc, s) => acc + Number(s.plannedQtyPcs ?? 0),
      0,
    );
    expect(totalPlanned).toBe(2000);
  });

  test("update: recalculates estimatedShifts and plannedQtyPcs with same formula", async () => {
    const ctx = await seedBaseContext(db);
    const caller = createTestCaller(ctx.users.PPIC.id, Role.PPIC);

    const matSheet = await db.item.create({
      data: {
        code: "MAT_SHEET_002",
        name: "Material Sheet 002",
        kind: ItemKind.RAW,
        status: ItemStatus.ACTIVE,
        baseUom: "sheet",
      },
      select: { id: true },
    });

    const created = await caller.pros.create({
      productName: "Calc Update",
      partNumber: ctx.items.fg123456789.code,
      proPrefixId: ctx.proPrefix.id,
      type: "RIGID",
      qtyPoPcs: 10000,
      expand: false,
      proses: [
        {
          up: 2,
          machineId: ctx.machines.printing.id,
          partNumber: ctx.items.wip987654321.code,
          materials: [],
        },
      ],
    });

    const existingStep = await db.proses.findFirst({
      where: { proId: created.id },
      select: { id: true, orderNo: true },
    });
    expect(existingStep).toBeTruthy();

    await caller.pros.update({
      id: created.id,
      productName: "Calc Update v2",
      partNumber: ctx.items.fg123456789.code,
      proPrefixId: ctx.proPrefix.id,
      qtyPoPcs: 10000,
      type: "RIGID",
      proses: [
        {
          id: existingStep!.id,
          orderNo: existingStep!.orderNo,
          up: 2,
          machineId: ctx.machines.printing.id,
          partNumber: ctx.items.wip987654321.code,
          materials: [{ materialId: matSheet.id, qtyReq: 3000 }],
        },
      ],
    });

    const updatedStep = await db.proses.findUnique({
      where: { id: existingStep!.id },
      select: { estimatedShifts: true, plannedQtyPcs: true },
    });

    expect(updatedStep?.estimatedShifts).toBe(4);
    expect(Number(updatedStep?.plannedQtyPcs ?? 0)).toBe(6000);
  });
});
