import {
  ItemKind,
  ItemStatus,
  LphType,
  MachineType,
  Prisma,
  PrismaClient,
  ProType,
  ReportStatus,
  Role,
  Uom,
} from "../../generated/prisma";

type SeedContext = {
  users: Record<Role, { id: string; username: string; role: Role }>;
  locations: {
    injection: { id: number; code: string };
    printing: { id: number; code: string };
    blow: { id: number; code: string };
    packing: { id: number; code: string };
    fg: { id: number; code: string };
    hold: { id: number; code: string };
  };
  items: {
    fg123456789: { id: number; code: string };
    fg123456780: { id: number; code: string };
    wip987654321: { id: number; code: string };
    wip987654320: { id: number; code: string };
    raw111111111: { id: number; code: string };
    raw222222222: { id: number; code: string };
  };
  machines: {
    injection: { id: number; name: string };
    printing: { id: number; name: string };
    blow: { id: number; name: string };
    packing: { id: number; name: string };
  };
  proPrefix: { id: number; code: string };
  rigidPro: { id: number; proNumber: string };
  paperPro: { id: number; proNumber: string };
  steps: {
    rigidInjection: { id: number; orderNo: number };
    rigidPrinting: { id: number; orderNo: number };
    rigidPacking: { id: number; orderNo: number };
    paperStep1: { id: number; orderNo: number };
    paperStep2: { id: number; orderNo: number };
    paperStep3: { id: number; orderNo: number };
  };
};

function roleUsername(role: Role): string {
  return `user_${role.toLowerCase()}`;
}

async function createUser(db: PrismaClient, role: Role) {
  return db.user.create({
    data: {
      username: roleUsername(role),
      passwordHash: "pass",
      role,
    },
    select: {
      id: true,
      username: true,
      role: true,
    },
  });
}

export async function seedBaseContext(db: PrismaClient): Promise<SeedContext> {
  const usersByRole = {
    [Role.SUPERADMIN]: await createUser(db, Role.SUPERADMIN),
    [Role.ADMIN]: await createUser(db, Role.ADMIN),
    [Role.PPIC]: await createUser(db, Role.PPIC),
    [Role.OPERATOR]: await createUser(db, Role.OPERATOR),
    [Role.MASTER]: await createUser(db, Role.MASTER),
  };

  const machines = {
    injection: await db.machine.create({
      data: {
        name: "INJECTION-01",
        stdOutputPerHour: 120,
        stdOutputPerShift: 900,
        uom: Uom.pcs,
        type: MachineType.RIGID,
      },
      select: { id: true, name: true },
    }),
    printing: await db.machine.create({
      data: {
        name: "PRINTING-01",
        stdOutputPerHour: 120,
        stdOutputPerShift: 900,
        uom: Uom.sheet,
        type: MachineType.RIGID,
      },
      select: { id: true, name: true },
    }),
    blow: await db.machine.create({
      data: {
        name: "BLOW-01",
        stdOutputPerHour: 120,
        stdOutputPerShift: 900,
        uom: Uom.pcs,
        type: MachineType.RIGID,
      },
      select: { id: true, name: true },
    }),
    packing: await db.machine.create({
      data: {
        name: "PACKING-01",
        stdOutputPerHour: 120,
        stdOutputPerShift: 900,
        uom: Uom.pcs,
        type: MachineType.RIGID,
      },
      select: { id: true, name: true },
    }),
  };

  const locations = {
    injection: await db.inventoryLocation.create({
      data: {
        code: `WIP_M_${machines.injection.id}`,
        name: "WIP Pool Injection",
        type: "WIP",
        machineId: machines.injection.id,
      },
      select: { id: true, code: true },
    }),
    printing: await db.inventoryLocation.create({
      data: {
        code: `WIP_M_${machines.printing.id}`,
        name: "WIP Pool Printing",
        type: "WIP",
        machineId: machines.printing.id,
      },
      select: { id: true, code: true },
    }),
    blow: await db.inventoryLocation.create({
      data: {
        code: `WIP_M_${machines.blow.id}`,
        name: "WIP Pool Blow",
        type: "WIP",
        machineId: machines.blow.id,
      },
      select: { id: true, code: true },
    }),
    packing: await db.inventoryLocation.create({
      data: {
        code: `WIP_M_${machines.packing.id}`,
        name: "WIP Pool Packing",
        type: "WIP",
        machineId: machines.packing.id,
      },
      select: { id: true, code: true },
    }),
    fg: await db.inventoryLocation.create({
      data: {
        code: "FG_WH",
        name: "FG Warehouse",
        type: "FG",
      },
      select: { id: true, code: true },
    }),
    hold: await db.inventoryLocation.create({
      data: {
        code: "HOLD_QA",
        name: "Hold QA",
        type: "HOLD",
      },
      select: { id: true, code: true },
    }),
  };

  const items = {
    fg123456789: await db.item.create({
      data: {
        code: "123456789",
        name: "FG 123456789",
        kind: ItemKind.FG,
        status: ItemStatus.ACTIVE,
        createdById: usersByRole[Role.PPIC].id,
      },
      select: { id: true, code: true },
    }),
    fg123456780: await db.item.create({
      data: {
        code: "123456780",
        name: "FG 123456780",
        kind: ItemKind.FG,
        status: ItemStatus.ACTIVE,
        createdById: usersByRole[Role.PPIC].id,
      },
      select: { id: true, code: true },
    }),
    wip987654321: await db.item.create({
      data: {
        code: "987654321",
        name: "WIP 987654321",
        kind: ItemKind.WIP,
        status: ItemStatus.ACTIVE,
        createdById: usersByRole[Role.PPIC].id,
      },
      select: { id: true, code: true },
    }),
    wip987654320: await db.item.create({
      data: {
        code: "987654320",
        name: "WIP 987654320",
        kind: ItemKind.WIP,
        status: ItemStatus.ACTIVE,
        createdById: usersByRole[Role.PPIC].id,
      },
      select: { id: true, code: true },
    }),
    raw111111111: await db.item.create({
      data: {
        code: "111111111",
        name: "RAW 111111111",
        kind: ItemKind.RAW,
        status: ItemStatus.ACTIVE,
        createdById: usersByRole[Role.PPIC].id,
      },
      select: { id: true, code: true },
    }),
    raw222222222: await db.item.create({
      data: {
        code: "222222222",
        name: "RAW 222222222",
        kind: ItemKind.RAW,
        status: ItemStatus.ACTIVE,
        createdById: usersByRole[Role.PPIC].id,
      },
      select: { id: true, code: true },
    }),
  };

  const proPrefix = await db.proPrefix.create({
    data: {
      code: "11",
      name: "11-PREFIX",
      type: ProType.RIGID,
    },
    select: { id: true, code: true },
  });

  const rigidPro = await db.pro.create({
    data: {
      proNumber: "900000001",
      productName: "Rigid Product",
      qtyPoPcs: 1000,
      type: ProType.RIGID,
      status: "OPEN",
      partNumber: items.fg123456789.code,
      fgItemId: items.fg123456789.id,
      proPrefixId: proPrefix.id,
    },
    select: { id: true, proNumber: true },
  });

  const paperPro = await db.pro.create({
    data: {
      proNumber: "900000002",
      productName: "Paper Product",
      qtyPoPcs: 1000,
      type: ProType.PAPER,
      status: "OPEN",
      partNumber: items.fg123456789.code,
      fgItemId: items.fg123456789.id,
      proPrefixId: proPrefix.id,
    },
    select: { id: true, proNumber: true },
  });

  const steps = {
    rigidInjection: await db.proses.create({
      data: {
        proId: rigidPro.id,
        orderNo: 1,
        machineId: machines.injection.id,
        outputItemId: items.wip987654321.id,
        partNumber: items.wip987654321.code,
      },
      select: { id: true, orderNo: true },
    }),
    rigidPrinting: await db.proses.create({
      data: {
        proId: rigidPro.id,
        orderNo: 2,
        machineId: machines.printing.id,
        outputItemId: items.wip987654320.id,
        partNumber: items.wip987654320.code,
      },
      select: { id: true, orderNo: true },
    }),
    rigidPacking: await db.proses.create({
      data: {
        proId: rigidPro.id,
        orderNo: 3,
        machineId: machines.packing.id,
        outputItemId: items.fg123456789.id,
        partNumber: items.fg123456789.code,
      },
      select: { id: true, orderNo: true },
    }),
    paperStep1: await db.proses.create({
      data: {
        proId: paperPro.id,
        orderNo: 1,
        machineId: machines.printing.id,
        outputItemId: items.wip987654321.id,
        partNumber: items.wip987654321.code,
      },
      select: { id: true, orderNo: true },
    }),
    paperStep2: await db.proses.create({
      data: {
        proId: paperPro.id,
        orderNo: 2,
        machineId: machines.blow.id,
        outputItemId: items.wip987654320.id,
        partNumber: items.wip987654320.code,
      },
      select: { id: true, orderNo: true },
    }),
    paperStep3: await db.proses.create({
      data: {
        proId: paperPro.id,
        orderNo: 3,
        machineId: machines.packing.id,
        outputItemId: items.fg123456789.id,
        partNumber: items.fg123456789.code,
      },
      select: { id: true, orderNo: true },
    }),
  };

  await db.prosesMaterial.create({
    data: {
      prosesId: steps.rigidPrinting.id,
      itemMasterId: items.wip987654321.id,
      qtyReq: new Prisma.Decimal(1),
    },
  });

  return {
    users: usersByRole,
    locations,
    items,
    machines,
    proPrefix,
    rigidPro,
    paperPro,
    steps,
  };
}

type CreateReportInput = {
  prosesId: number;
  reportType: LphType;
  operatorName?: string;
  qtyPassOn?: number;
  qtyWip?: number;
  qtyHold?: number;
  qtyReject?: number;
};

export async function createPendingReport(
  db: PrismaClient,
  operatorId: string,
  input: CreateReportInput,
) {
  return db.productionReport.create({
    data: {
      prosesId: input.prosesId,
      reportDate: new Date(),
      shift: 1,
      operatorName: input.operatorName ?? "Operator",
      reportType: input.reportType,
      status: ReportStatus.PENDING,
      qtyPassOn: new Prisma.Decimal(input.qtyPassOn ?? 0),
      qtyWip: new Prisma.Decimal(input.qtyWip ?? 0),
      qtyHold: new Prisma.Decimal(input.qtyHold ?? 0),
      qtyReject: new Prisma.Decimal(input.qtyReject ?? 0),
      createdById: operatorId,
    },
  });
}

export async function seedInventory(
  db: PrismaClient,
  args: {
    locationId: number;
    itemMasterId: number;
    itemCode: string;
    qty: number;
    proId?: number | null;
    prosesId?: number | null;
  },
) {
  return db.inventoryTxn.create({
    data: {
      type: "IN",
      date: new Date(),
      groupId: "SEED",
      locationId: args.locationId,
      itemMasterId: args.itemMasterId,
      itemId: args.itemCode,
      qty: new Prisma.Decimal(args.qty),
      proId: args.proId ?? null,
      prosesId: args.prosesId ?? null,
    },
  });
}
