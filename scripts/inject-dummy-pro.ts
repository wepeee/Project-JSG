import "dotenv/config";
import { hash } from "bcryptjs";
import {
  LphType,
  PrismaClient,
  ProStatus,
  ProType,
  ReportStatus,
  Role,
  Uom,
  MachineType,
} from "../generated/prisma";

const pad3 = (n: number) => String(n).padStart(3, "0");
const mm = (d: Date) => String(d.getMonth() + 1).padStart(2, "0");
const yy = (d: Date) => String(d.getFullYear()).slice(-2);
const normalizeCode = (x: string) => x.trim().toUpperCase().replace(/\s+/g, "_");

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

async function ensurePrefix(code: string, name: string, type: ProType) {
  return db.proPrefix.upsert({
    where: { code },
    update: { name, type },
    create: { code, name, type },
  });
}

async function ensureMachine(
  name: string,
  type: MachineType,
  uom: Uom,
  stdPerHour: number,
  stdPerShift: number,
) {
  const found = await db.machine.findFirst({
    where: { name, type },
  });
  if (found) return found;
  return db.machine.create({
    data: {
      name,
      type,
      uom,
      stdOutputPerHour: stdPerHour,
      stdOutputPerShift: stdPerShift,
    },
  });
}

async function pickMachines(type: MachineType, count: number) {
  const realMachines = await db.machine.findMany({
    where: {
      type,
      NOT: [{ name: { startsWith: "DUMMY " } }],
    },
    orderBy: [{ stdOutputPerShift: "desc" }, { name: "asc" }],
    take: count,
  });

  if (realMachines.length >= count) return realMachines;

  const allMachines = await db.machine.findMany({
    where: { type },
    orderBy: [{ stdOutputPerShift: "desc" }, { name: "asc" }],
    take: count,
  });
  if (allMachines.length >= count) return allMachines;

  const fallback = [...allMachines];
  while (fallback.length < count) {
    const idx = fallback.length + 1;
    const created = await ensureMachine(
      `AUTO ${type} M${idx}`,
      type,
      type === "PAPER" ? Uom.sheet : Uom.pcs,
      1000,
      6000,
    );
    fallback.push(created);
  }
  return fallback.slice(0, count);
}

async function ensureItem(
  codeRaw: string,
  name: string,
  kind: "RAW" | "WIP" | "FG" | "CONSUMABLE",
  baseUom = "pcs",
) {
  const code = normalizeCode(codeRaw);
  return db.item.upsert({
    where: { code },
    update: {
      name,
      kind,
      baseUom,
      status: "ACTIVE",
      createdFrom: "DUMMY_INJECT",
    },
    create: {
      code,
      name,
      kind,
      baseUom,
      status: "ACTIVE",
      createdFrom: "DUMMY_INJECT",
    },
  });
}

async function cleanupOldDummies() {
  const oldPros = await db.pro.findMany({
    where: {
      productName: { startsWith: "[DUMMY MASTER]" },
    },
    select: {
      id: true,
      proses: {
        select: { id: true },
      },
    },
  });

  if (oldPros.length === 0) return 0;

  const proIds = oldPros.map((p) => p.id);
  const prosesIds = oldPros.flatMap((p) => p.proses.map((s) => s.id));

  await db.$transaction(async (tx) => {
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

    await tx.pro.deleteMany({
      where: { id: { in: proIds } },
    });
  });

  return oldPros.length;
}

async function cleanupOldDummyMachines() {
  const result = await db.machine.deleteMany({
    where: {
      name: { startsWith: "DUMMY " },
      proses: { none: {} },
    },
  });
  return result.count;
}

async function createPaperPro(input: {
  index: number;
  ppicId: string;
  operatorId: string;
  prefixId: number;
  machines: Array<{ id: number; name: string }>;
  rawItemIds: number[];
}) {
  const now = new Date();
  const prefix = `98${mm(now)}${yy(now)}`;
  const proNumber = `${prefix}${pad3(input.index)}`;

  const fgCode = `FG_DMY_PAPER_${input.index}`;
  const fgItem = await ensureItem(
    fgCode,
    `[DUMMY MASTER] FG Paper ${input.index}`,
    "FG",
    "pcs",
  );

  const targetQty = 12000 + input.index * 900;
  const pro = await db.pro.create({
    data: {
      proNumber,
      productName: `[DUMMY MASTER] Paper Product ${input.index}`,
      partNumber: fgItem.code,
      qtyPoPcs: targetQty,
      status: ProStatus.IN_PROGRESS,
      type: ProType.PAPER,
      proPrefixId: input.prefixId,
      fgItemId: fgItem.id,
      startDate: now,
      createdById: input.ppicId,
      updatedById: input.ppicId,
    },
  });

  const outputCodes = [
    `WIP_DMY_PAPER_${input.index}_1`,
    `WIP_DMY_PAPER_${input.index}_2`,
    `WIP_DMY_PAPER_${input.index}_3`,
  ];
  const outputs = [];
  for (const [idx, c] of outputCodes.entries()) {
    outputs.push(
      await ensureItem(
        c,
        `[DUMMY MASTER] WIP Paper ${input.index}-${idx + 1}`,
        "WIP",
        "pcs",
      ),
    );
  }

  const steps = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    d.setHours(i === 0 ? 6 : i === 1 ? 11 : 16, 0, 0, 0);

    const machine = input.machines[i % input.machines.length];
    const step = await db.proses.create({
      data: {
        proId: pro.id,
        orderNo: i + 1,
        up: i === 2 ? 2 : 1,
        machineId: machine!.id,
        startDate: d,
        partNumber: outputs[i]!.code,
        outputItemId: outputs[i]!.id,
        estimatedShifts: 1,
        materials: {
          create: [
            {
              itemMasterId: input.rawItemIds[i % input.rawItemIds.length]!,
              qtyReq: 2000 + i * 300,
            },
          ],
        },
      },
    });
    steps.push(step);
  }

  const outputPlan = [
    Math.round(targetQty * 0.7),
    Math.round(targetQty * 0.62),
    Math.round(targetQty * (input.index % 2 === 0 ? 0.55 : 0.82)),
  ];

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]!;
    const reportDate = new Date(step.startDate ?? now);
    await db.productionReport.create({
      data: {
        prosesId: step.id,
        reportDate,
        shift: i + 1,
        operatorName: "operator_dummy",
        reportType: i === 2 ? LphType.PACKING_ASSEMBLY : LphType.PRINTING,
        qtyPassOn: outputPlan[i]!,
        qtyHold: 0,
        qtyWip: 0,
        qtyReject: 0,
        totalDowntime: 20 + i * 5,
        status: ReportStatus.APPROVED,
        createdById: input.operatorId,
        checkedAt: new Date(reportDate.getTime() + 60 * 60 * 1000),
      },
    });
  }

  return { proNumber, type: "PAPER", steps: steps.length };
}

async function createRigidPro(input: {
  index: number;
  ppicId: string;
  operatorId: string;
  prefixId: number;
  machineId: number;
  rawItemId: number;
}) {
  const now = new Date();
  const prefix = `99${mm(now)}${yy(now)}`;
  const proNumber = `${prefix}${pad3(input.index)}`;

  const fgCode = `FG_DMY_RIGID_${input.index}`;
  const fgItem = await ensureItem(
    fgCode,
    `[DUMMY MASTER] FG Rigid ${input.index}`,
    "FG",
    "pcs",
  );

  const targetQty = 5000 + input.index * 600;
  const pro = await db.pro.create({
    data: {
      proNumber,
      productName: `[DUMMY MASTER] Rigid Product ${input.index}`,
      partNumber: fgItem.code,
      qtyPoPcs: targetQty,
      status: ProStatus.IN_PROGRESS,
      type: ProType.RIGID,
      proPrefixId: input.prefixId,
      fgItemId: fgItem.id,
      startDate: now,
      createdById: input.ppicId,
      updatedById: input.ppicId,
    },
  });

  const wip = await ensureItem(
    `WIP_DMY_RIGID_${input.index}_1`,
    `[DUMMY MASTER] WIP Rigid ${input.index}`,
    "WIP",
    "pcs",
  );

  const stepStart = new Date(now);
  stepStart.setHours(6, 0, 0, 0);
  const step = await db.proses.create({
    data: {
      proId: pro.id,
      orderNo: 1,
      up: 4,
      machineId: input.machineId,
      startDate: stepStart,
      partNumber: wip.code,
      outputItemId: wip.id,
      estimatedShifts: 1,
      batchNo: `BATCH-DMY-${input.index}`,
      materials: {
        create: [
          {
            itemMasterId: input.rawItemId,
            qtyReq: 850 + input.index * 40,
          },
        ],
      },
    },
  });

  await db.productionReport.create({
    data: {
      prosesId: step.id,
      reportDate: stepStart,
      shift: 1,
      operatorName: "operator_dummy",
      reportType: LphType.INJECTION,
      batchNo: `BATCH-DMY-${input.index}`,
      qtyPassOn: Math.round(targetQty * (input.index % 2 === 0 ? 0.6 : 0.88)),
      qtyHold: 0,
      qtyWip: 0,
      qtyReject: 0,
      totalDowntime: 15,
      status: ReportStatus.APPROVED,
      createdById: input.operatorId,
      checkedAt: new Date(stepStart.getTime() + 60 * 60 * 1000),
    },
  });

  return { proNumber, type: "RIGID", steps: 1 };
}

async function main() {
  console.log(`[inject-dummy-pro] Using DB from ${dbConfig.source}`);

  const ppic = await ensureUser(Role.PPIC, "ppic_dummy");
  const operator = await ensureUser(Role.OPERATOR, "operator_dummy");
  await ensureUser(Role.MASTER, "master_dummy");

  const paperPrefix = await ensurePrefix("98", "DUMMY PAPER", ProType.PAPER);
  const rigidPrefix = await ensurePrefix("99", "DUMMY RIGID", ProType.RIGID);

  const rawA = await ensureItem("RAW_DMY_A", "[DUMMY] RAW A", "RAW", "sheet");
  const rawB = await ensureItem("RAW_DMY_B", "[DUMMY] RAW B", "RAW", "sheet");
  const rawC = await ensureItem("RAW_DMY_C", "[DUMMY] RAW C", "RAW", "kg");

  const removed = await cleanupOldDummies();
  console.log(`[inject-dummy-pro] Removed old dummy PRO: ${removed}`);
  const removedMachines = await cleanupOldDummyMachines();
  console.log(`[inject-dummy-pro] Removed old dummy machines: ${removedMachines}`);

  const paperMachines = await pickMachines(MachineType.PAPER, 3);
  const rigidMachine = (await pickMachines(MachineType.RIGID, 1))[0]!;
  console.log(
    `[inject-dummy-pro] Using PAPER machines: ${paperMachines.map((m) => m.name).join(", ")}`,
  );
  console.log(
    `[inject-dummy-pro] Using RIGID machine: ${rigidMachine.name}`,
  );

  const created = [];
  created.push(
    await createPaperPro({
      index: 1,
      ppicId: ppic.id,
      operatorId: operator.id,
      prefixId: paperPrefix.id,
      machines: paperMachines.map((m) => ({ id: m.id, name: m.name })),
      rawItemIds: [rawA.id, rawB.id, rawC.id],
    }),
  );
  created.push(
    await createPaperPro({
      index: 2,
      ppicId: ppic.id,
      operatorId: operator.id,
      prefixId: paperPrefix.id,
      machines: paperMachines.map((m) => ({ id: m.id, name: m.name })),
      rawItemIds: [rawA.id, rawB.id, rawC.id],
    }),
  );
  created.push(
    await createRigidPro({
      index: 1,
      ppicId: ppic.id,
      operatorId: operator.id,
      prefixId: rigidPrefix.id,
      machineId: rigidMachine.id,
      rawItemId: rawA.id,
    }),
  );
  created.push(
    await createRigidPro({
      index: 2,
      ppicId: ppic.id,
      operatorId: operator.id,
      prefixId: rigidPrefix.id,
      machineId: rigidMachine.id,
      rawItemId: rawB.id,
    }),
  );

  console.table(created);
  console.log(
    "[inject-dummy-pro] Done. Data siap dilihat di dashboard MASTER > Gap Target PRO.",
  );
}

main()
  .catch((err) => {
    console.error("[inject-dummy-pro] Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
