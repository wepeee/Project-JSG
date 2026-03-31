import "dotenv/config";
import { hash } from "bcryptjs";
import {
  ItemKind,
  ItemStatus,
  LphType,
  PrismaClient,
  ProStatus,
  ProType,
  Role,
  type Machine,
  type Item,
} from "../generated/prisma";

const dbConfig = (() => {
  if (process.env.SEED_DATABASE_URL) {
    return { source: "SEED_DATABASE_URL", url: process.env.SEED_DATABASE_URL };
  }
  if (process.env.DIRECT_URL) {
    return { source: "DIRECT_URL", url: process.env.DIRECT_URL };
  }
  if (process.env.DATABASE_URL) {
    return { source: "DATABASE_URL", url: process.env.DATABASE_URL };
  }
  throw new Error(
    "Missing DB URL. Set SEED_DATABASE_URL, DIRECT_URL, or DATABASE_URL.",
  );
})();

const db = new PrismaClient({
  datasources: {
    db: { url: dbConfig.url },
  },
});

const PRODUCT_PREFIX = "[AUTO RIGID 1STEP]";

type Scenario = {
  key: string;
  processName: string;
  reportType: LphType;
  machineKeywords: string[];
  outputKind: ItemKind;
  primaryMaterialKind: ItemKind;
};

const scenarios: Scenario[] = [
  {
    key: "INJ",
    processName: "Injection",
    reportType: LphType.INJECTION,
    machineKeywords: ["injection", "inject"],
    outputKind: ItemKind.WIP,
    primaryMaterialKind: ItemKind.RAW,
  },
  {
    key: "BLW",
    processName: "Blow Mould",
    reportType: LphType.BLOW_MOULDING,
    machineKeywords: ["blow", "mould", "mold"],
    outputKind: ItemKind.WIP,
    primaryMaterialKind: ItemKind.WIP,
  },
  {
    key: "PRT",
    processName: "Printing",
    reportType: LphType.PRINTING,
    machineKeywords: ["print", "printing"],
    outputKind: ItemKind.WIP,
    primaryMaterialKind: ItemKind.WIP,
  },
  {
    key: "PCK",
    processName: "Packing",
    reportType: LphType.PACKING_ASSEMBLY,
    machineKeywords: ["pack", "assembly", "finish", "fg"],
    outputKind: ItemKind.FG,
    primaryMaterialKind: ItemKind.WIP,
  },
];

async function ensureUser(role: Role, username: string) {
  const existing = await db.user.findUnique({ where: { username } });
  if (existing) return existing;

  const passwordHash = await hash(username, 10);
  return db.user.create({
    data: {
      username,
      passwordHash,
      role,
    },
  });
}

async function ensureRigidPrefix() {
  const existing = await db.proPrefix.findFirst({
    where: { type: ProType.RIGID },
    orderBy: { id: "asc" },
  });
  if (existing) return existing;

  for (let i = 10; i <= 99; i++) {
    const code = String(i).padStart(2, "0");
    const taken = await db.proPrefix.findUnique({ where: { code } });
    if (!taken) {
      return db.proPrefix.create({
        data: {
          code,
          name: "AUTO RIGID",
          type: ProType.RIGID,
        },
      });
    }
  }
  throw new Error("Tidak menemukan kode prefix 2 digit yang tersedia.");
}

async function getNextProNumber() {
  const all = await db.pro.findMany({
    select: { proNumber: true },
  });

  let max = 100000000;
  for (const p of all) {
    const n = Number(p.proNumber);
    if (Number.isFinite(n)) max = Math.max(max, n);
  }
  return String(max + 1).padStart(9, "0");
}

function pickMachineForScenario(
  machines: Machine[],
  scenario: Scenario,
  fallbackIndex: number,
) {
  const found = machines.find((m) => {
    const n = m.name.toLowerCase();
    return scenario.machineKeywords.some((kw) => n.includes(kw));
  });
  if (found) return found;
  return machines[fallbackIndex % machines.length]!;
}

async function pickOrCreateItem(
  kind: ItemKind,
  fallbackCode: string,
  fallbackName: string,
  createdById: string,
  offset = 0,
): Promise<Item> {
  const existing = await db.item.findMany({
    where: {
      kind,
      status: { not: ItemStatus.ARCHIVED },
    },
    orderBy: { id: "asc" },
    take: 50,
  });
  if (existing.length > 0) {
    return existing[offset % existing.length]!;
  }

  return db.item.create({
    data: {
      code: fallbackCode,
      name: fallbackName,
      kind,
      status: ItemStatus.ACTIVE,
      baseUom: "pcs",
      createdById,
      createdFrom: "INJECT_4PRO_1STEP",
    },
  });
}

async function cleanupOldInjectedPros() {
  const oldPros = await db.pro.findMany({
    where: { productName: { startsWith: PRODUCT_PREFIX } },
    select: {
      id: true,
      proses: { select: { id: true } },
    },
  });
  if (oldPros.length === 0) return 0;

  const proIds = oldPros.map((p) => p.id);
  const prosesIds = oldPros.flatMap((p) => p.proses.map((s) => s.id));

  await db.$transaction(async (tx) => {
    await tx.inventoryTxn.deleteMany({
      where: {
        OR: [
          { groupId: { startsWith: "SEED-4PRO-1STEP-" } },
          {
            notes: {
              contains: "Auto seed FIFO stock for injected single-step rigid reports",
            },
          },
        ],
      },
    });

    if (prosesIds.length > 0) {
      await tx.inventoryTxn.deleteMany({
        where: {
          OR: [{ proId: { in: proIds } }, { prosesId: { in: prosesIds } }],
        },
      });
      await tx.productionReport.deleteMany({
        where: { prosesId: { in: prosesIds } },
      });
    }
    await tx.pro.deleteMany({ where: { id: { in: proIds } } });
  });

  return oldPros.length;
}

async function main() {
  console.log(`[inject-4pro-1step] Using DB from ${dbConfig.source}`);

  const ppic =
    (await db.user.findFirst({ where: { role: Role.PPIC } })) ??
    (await ensureUser(Role.PPIC, "ppic_injector"));
  const operator =
    (await db.user.findFirst({ where: { role: Role.OPERATOR } })) ??
    (await ensureUser(Role.OPERATOR, "operator_injector"));

  const rigidMachines = await db.machine.findMany({
    where: { type: "RIGID" },
    orderBy: [{ name: "asc" }],
  });
  if (rigidMachines.length === 0) {
    throw new Error(
      "Tidak ada mesin RIGID. Buat minimal 1 mesin RIGID dulu di master mesin.",
    );
  }

  const removed = await cleanupOldInjectedPros();
  if (removed > 0) {
    console.log(`[inject-4pro-1step] Removed old injected PRO: ${removed}`);
  }

  const prefix = await ensureRigidPrefix();
  const wipStaging = await db.inventoryLocation.upsert({
    where: { code: "WIP_STAGING" },
    update: {},
    create: {
      code: "WIP_STAGING",
      name: "WIP Staging Area",
      type: "WIP",
    },
    select: { id: true },
  });
  const seededWipItems = new Set<number>();

  const created: Array<{
    proNumber: string;
    process: string;
    machine: string;
    outputPN: string;
    reportCount: number;
  }> = [];

  for (let i = 0; i < scenarios.length; i++) {
    const sc = scenarios[i]!;
    const machine = pickMachineForScenario(rigidMachines, sc, i);

    const fgItem = await pickOrCreateItem(
      ItemKind.FG,
      `AUTOFG000${i + 1}`,
      `${PRODUCT_PREFIX} FG ${sc.processName}`,
      ppic.id,
      i,
    );

    const outputItem =
      sc.outputKind === ItemKind.FG
        ? fgItem
        : await pickOrCreateItem(
            ItemKind.WIP,
            `AUTOWIP00${i + 1}`,
            `${PRODUCT_PREFIX} WIP ${sc.processName}`,
            ppic.id,
            i,
          );

    const materialItem = await pickOrCreateItem(
      sc.primaryMaterialKind,
      `AUTOMAT00${i + 1}`,
      `${PRODUCT_PREFIX} MAT ${sc.processName}`,
      ppic.id,
      i + 1,
    );

    // IMPORTANT:
    // Approval flow for WIP materials uses FIFO over WIP locations.
    // Seed enough stock so injected reports can be approved without "stok tidak cukup".
    if (materialItem.kind === ItemKind.WIP && !seededWipItems.has(materialItem.id)) {
      await db.inventoryTxn.create({
        data: {
          groupId: `SEED-4PRO-1STEP-${materialItem.id}-${Date.now()}`,
          type: "IN",
          date: new Date(),
          itemId: materialItem.code,
          itemMasterId: materialItem.id,
          qty: 10000,
          locationId: wipStaging.id,
          notes: "Auto seed FIFO stock for injected single-step rigid reports",
        },
      });
      seededWipItems.add(materialItem.id);
    }

    const proNumber = await getNextProNumber();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + i);
    startDate.setHours(7, 0, 0, 0);

    const pro = await db.pro.create({
      data: {
        proNumber,
        productName: `${PRODUCT_PREFIX} ${sc.processName}`,
        qtyPoPcs: 1200 + i * 200,
        type: ProType.RIGID,
        status: ProStatus.IN_PROGRESS,
        proPrefixId: prefix.id,
        partNumber: fgItem.code,
        fgItemId: fgItem.id,
        startDate,
        createdById: ppic.id,
        updatedById: ppic.id,
      },
    });

    const proses = await db.proses.create({
      data: {
        proId: pro.id,
        orderNo: 1,
        up: machine.cavity ?? 1,
        estimatedShifts: 1,
        machineId: machine.id,
        startDate,
        partNumber: outputItem.code,
        outputItemId: outputItem.id,
        materials: {
          create: [
            {
              itemMasterId: materialItem.id,
              qtyReq: 1,
            },
          ],
        },
      },
    });

    for (let r = 0; r < 2; r++) {
      const reportDate = new Date(startDate);
      reportDate.setHours(startDate.getHours() + r * 8, 0, 0, 0);

      const startTime = new Date(reportDate);
      const endTime = new Date(reportDate);
      endTime.setHours(startTime.getHours() + 4);

      await db.productionReport.create({
        data: {
          prosesId: proses.id,
          reportDate,
          shift: r + 1,
          operatorName: operator.username,
          reportType: sc.reportType,
          startTime,
          endTime,
          qtyPassOn: 180 + i * 25 + r * 20,
          qtyHold: r === 0 ? 3 : 4,
          qtyWip: sc.reportType === LphType.PACKING_ASSEMBLY ? 0 : 6 + r,
          qtyReject: 2 + r,
          totalDowntime: 20 + r * 5,
          status: "PENDING",
          createdById: operator.id,
        },
      });
    }

    created.push({
      proNumber: pro.proNumber,
      process: sc.processName,
      machine: machine.name,
      outputPN: outputItem.code,
      reportCount: 2,
    });
  }

  console.table(created);
  console.log(
    "[inject-4pro-1step] Done. 4 PRO rigid (single step) + 8 operator reports berhasil dibuat.",
  );
}

main()
  .catch((err) => {
    console.error("[inject-4pro-1step] Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
