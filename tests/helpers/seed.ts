import {
  PrismaClient,
  ItemStatus,
  ItemKind,
  LocationType,
  MachineType,
  Uom,
  Role,
  ProType,
  ProStatus,
} from "../../generated/prisma";

export async function setupBaseTestEnvironment(db: PrismaClient) {
  // --- MOCK USERS ---
  const ppicUser = await db.user.create({
    data: { username: "ppic-test", passwordHash: "pass", role: Role.PPIC },
  });
  const adminUser = await db.user.create({
    data: { username: "admin-test", passwordHash: "pass", role: Role.ADMIN },
  });
  const superAdminUser = await db.user.create({
    data: {
      username: "super-test",
      passwordHash: "pass",
      role: Role.SUPERADMIN,
    },
  });
  const operatorUser = await db.user.create({
    data: { username: "op-test", passwordHash: "pass", role: Role.OPERATOR },
  });

  // --- MOCK INVENTORY LOCATIONS ---
  const locations = {
    wipPoolInjection: await db.inventoryLocation.create({
      data: {
        code: "WIP_POOL_INJECTION",
        name: "WIP Pool Injection",
        type: LocationType.WIP,
      },
    }),
    wipPoolPrinting: await db.inventoryLocation.create({
      data: {
        code: "WIP_POOL_PRINTING",
        name: "WIP Pool Printing",
        type: LocationType.WIP,
      },
    }),
    wipPoolBlow: await db.inventoryLocation.create({
      data: {
        code: "WIP_POOL_BLOW",
        name: "WIP Pool Blow",
        type: LocationType.WIP,
      },
    }),
    fgWarehouse: await db.inventoryLocation.create({
      data: {
        code: "FG_WH",
        name: "Warehouse Finish Good",
        type: LocationType.FG,
      },
    }),
    scrapHoldLocation: await db.inventoryLocation.create({
      data: {
        code: "HOLD_SCRAP_WH",
        name: "Warehouse Scraps/Hold",
        type: LocationType.HOLD,
      },
    }),
  };

  // --- MOCK ITEMS (Model is Item, not ItemMaster) ---
  const items = {
    activeItem: await db.item.create({
      data: {
        code: "ACTIVE_MAT_1",
        name: "Item Active Dummy",
        kind: ItemKind.RAW,
        status: ItemStatus.ACTIVE,
        createdById: ppicUser.id,
      },
    }),
    draftItem: await db.item.create({
      data: {
        code: "DRAFT_MAT_1",
        name: "Item Draft Dummy",
        kind: ItemKind.RAW,
        status: ItemStatus.DRAFT,
        createdById: ppicUser.id,
      },
    }),
  };

  // --- MOCK MACHINES ---
  const machines = {
    injMachine: await db.machine.create({
      data: {
        name: "Mesin Injection 01",
        stdOutputPerHour: 100,
        stdOutputPerShift: 800,
        uom: Uom.pcs,
        type: MachineType.RIGID,
      },
    }),
    paperMachine: await db.machine.create({
      data: {
        name: "Mesin Paper 01",
        stdOutputPerHour: 100,
        stdOutputPerShift: 800,
        uom: Uom.sheet,
        type: MachineType.PAPER,
      },
    }),
  };

  // --- MOCK PROS & PROSES ---
  const proRigid = await db.pro.create({
    data: {
      proNumber: "R12345678",
      productName: "Rigid Box 01",
      qtyPoPcs: 1000,
      type: ProType.RIGID,
      status: ProStatus.OPEN,
    },
  });

  const prosesInjection = await db.proses.create({
    data: {
      proId: proRigid.id,
      orderNo: 1,
      machineId: machines.injMachine.id,
      outputItemId: items.activeItem.id,
    },
  });

  const prosesPrinting = await db.proses.create({
    data: { proId: proRigid.id, orderNo: 2, outputItemId: items.activeItem.id },
  });

  const proPaper = await db.pro.create({
    data: {
      proNumber: "P12345678",
      productName: "Paper Box 01",
      qtyPoPcs: 1000,
      type: ProType.PAPER,
      status: ProStatus.OPEN,
    },
  });

  const prosesPaperNonLast = await db.proses.create({
    data: {
      proId: proPaper.id,
      orderNo: 1,
      machineId: machines.paperMachine.id,
      outputItemId: items.activeItem.id,
    },
  });

  const prosesPaperLast = await db.proses.create({
    data: {
      proId: proPaper.id,
      orderNo: 2,
      machineId: machines.paperMachine.id,
      outputItemId: items.activeItem.id,
    },
  });

  return {
    users: { ppicUser, adminUser, superAdminUser, operatorUser },
    locations,
    items,
    machines,
    proRigid,
    prosesInjection,
    prosesPrinting,
    proPaper,
    prosesPaperNonLast,
    prosesPaperLast,
  };
}
