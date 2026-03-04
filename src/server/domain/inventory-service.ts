import { TRPCError } from "@trpc/server";
import {
  ItemKind,
  ItemStatus,
  LphType,
  Prisma,
  PrismaClient,
  ProType,
  ReportStatus,
  Role,
  TxnType,
} from "../../../generated/prisma";
import {
  assertNineDigitCode,
  assertSuperadminRole,
  buildInventoryTxnPlan,
  type PlannedLedgerLine,
} from "./inventory-policy";

type DbClient = PrismaClient | Prisma.TransactionClient;

type CreateDraftItemInput = {
  actorRole: Role;
  createdById: string;
  code: string;
  name: string;
  kind: ItemKind;
};

type CreateProInput = {
  proNumber: string;
  productName: string;
  qtyPoPcs: number;
  type: ProType;
  fgCode: string;
  proPrefixId?: number;
};

type CreateProsesInput = {
  proId: number;
  orderNo: number;
  outputCode: string;
  machineId?: number | null;
  materials?: Array<{ itemMasterId: number; qtyReq: number }>;
};

type ApprovalResult = {
  idempotent: boolean;
  groupId: string;
};

type VoidResult = {
  idempotent: boolean;
  reversalCount: number;
};

function toNumber(value: Prisma.Decimal | number | null | undefined): number {
  if (value == null) return 0;
  return typeof value === "number" ? value : value.toNumber();
}

async function findLocationIdByCode(tx: DbClient, code: string): Promise<number> {
  const location = await tx.inventoryLocation.findUnique({ where: { code } });
  if (!location) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: `Inventory location "${code}" is missing.`,
    });
  }
  return location.id;
}

async function getOnHandQty(
  tx: DbClient,
  locationId: number,
  itemMasterId: number,
): Promise<number> {
  const inAgg = await tx.inventoryTxn.aggregate({
    _sum: { qty: true },
    where: {
      locationId,
      itemMasterId,
      type: TxnType.IN,
    },
  });

  const outAgg = await tx.inventoryTxn.aggregate({
    _sum: { qty: true },
    where: {
      locationId,
      itemMasterId,
      type: TxnType.OUT,
    },
  });

  return toNumber(inAgg._sum.qty) - toNumber(outAgg._sum.qty);
}

function assertPpicRole(role: Role): void {
  if (role !== Role.PPIC && role !== Role.SUPERADMIN) {
    throw new TRPCError({ code: "FORBIDDEN", message: "PPIC role is required." });
  }
}

export async function createDraftItem(
  db: DbClient,
  input: CreateDraftItemInput,
) {
  assertPpicRole(input.actorRole);
  const code = assertNineDigitCode(input.code);

  const existing = await db.item.findUnique({ where: { code } });
  if (existing) {
    throw new TRPCError({
      code: "CONFLICT",
      message: `Item code ${code} already exists.`,
    });
  }

  return db.item.create({
    data: {
      code,
      name: input.name.trim(),
      kind: input.kind,
      status: ItemStatus.DRAFT,
      createdById: input.createdById,
      createdFrom: "PPIC_TEST",
    },
  });
}

export async function listItemsByStatus(
  db: DbClient,
  actorRole: Role,
  status: ItemStatus,
) {
  assertSuperadminRole(actorRole);
  return db.item.findMany({
    where: { status },
    orderBy: { code: "asc" },
  });
}

export async function activateItem(
  db: DbClient,
  actorRole: Role,
  itemId: number,
) {
  assertSuperadminRole(actorRole);
  return db.item.update({
    where: { id: itemId },
    data: { status: ItemStatus.ACTIVE },
  });
}

export async function resolveItemMasterId(
  db: DbClient,
  codeInput: string,
): Promise<number> {
  const code = assertNineDigitCode(codeInput);
  const item = await db.item.findUnique({ where: { code } });
  if (!item) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: `Item code ${code} is not registered.`,
    });
  }
  return item.id;
}

export async function createProWithFgCode(db: DbClient, input: CreateProInput) {
  const proNumber = assertNineDigitCode(input.proNumber);
  const fgCode = assertNineDigitCode(input.fgCode);
  const fgItemId = await resolveItemMasterId(db, fgCode);

  return db.pro.create({
    data: {
      proNumber,
      productName: input.productName,
      qtyPoPcs: input.qtyPoPcs,
      type: input.type,
      partNumber: fgCode,
      fgItemId,
      proPrefixId: input.proPrefixId,
      status: "OPEN",
    },
  });
}

export async function updateProFgCode(
  db: DbClient,
  proId: number,
  fgCodeInput: string,
) {
  const fgCode = assertNineDigitCode(fgCodeInput);
  const fgItemId = await resolveItemMasterId(db, fgCode);
  return db.pro.update({
    where: { id: proId },
    data: { partNumber: fgCode, fgItemId },
  });
}

export async function createProsesWithOutputCode(
  db: DbClient,
  input: CreateProsesInput,
) {
  const outputCode = assertNineDigitCode(input.outputCode);
  const outputItemId = await resolveItemMasterId(db, outputCode);

  return db.proses.create({
    data: {
      proId: input.proId,
      orderNo: input.orderNo,
      machineId: input.machineId ?? null,
      partNumber: outputCode,
      outputItemId,
      materials: {
        create: (input.materials ?? []).map((m) => ({
          itemMasterId: m.itemMasterId,
          qtyReq: new Prisma.Decimal(m.qtyReq),
        })),
      },
    },
  });
}

export async function updateProsesOutputCode(
  db: DbClient,
  prosesId: number,
  outputCodeInput: string,
) {
  const outputCode = assertNineDigitCode(outputCodeInput);
  const outputItemId = await resolveItemMasterId(db, outputCode);

  return db.proses.update({
    where: { id: prosesId },
    data: {
      partNumber: outputCode,
      outputItemId,
    },
  });
}

function selectInputWipForPrinting(
  materials: Array<{ itemMasterId: number; itemMaster: { kind: ItemKind; code: string } }>,
): { itemMasterId: number; itemCode: string } {
  const wipMaterials = materials.filter((m) => m.itemMaster.kind === ItemKind.WIP);
  if (wipMaterials.length !== 1) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Ambiguous WIP input for printing step.",
    });
  }
  return {
    itemMasterId: wipMaterials[0]!.itemMasterId,
    itemCode: wipMaterials[0]!.itemMaster.code,
  };
}

async function applyInventoryPlan(
  tx: DbClient,
  reportId: string,
  proId: number,
  prosesId: number,
  groupId: string,
  now: Date,
  plan: PlannedLedgerLine[],
): Promise<void> {
  for (const line of plan) {
    if (line.type === TxnType.OUT) {
      const locationId = await findLocationIdByCode(tx, line.locationCode);
      const onHand = await getOnHandQty(tx, locationId, line.itemMasterId);
      if (onHand < Math.abs(line.qty)) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: `Insufficient stock at ${line.locationCode}.`,
        });
      }
    }
  }

  for (const line of plan) {
    const locationId = await findLocationIdByCode(tx, line.locationCode);
    await tx.inventoryTxn.create({
      data: {
        groupId,
        date: now,
        type: line.type,
        itemId: line.itemCode,
        itemMasterId: line.itemMasterId,
        qty: new Prisma.Decimal(Math.abs(line.qty)),
        locationId,
        proId,
        prosesId,
        productionReportId: reportId,
      },
    });
  }
}

export async function approveReportPosting(
  db: PrismaClient,
  reportId: string,
): Promise<ApprovalResult> {
  const groupId = `POST-${reportId}`;
  const now = new Date();

  const pre = await db.productionReport.findUnique({
    where: { id: reportId },
    select: { status: true, stockPostedAt: true },
  });
  if (!pre) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Report not found." });
  }
  if (pre.status === ReportStatus.VOID) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "VOID report cannot be approved.",
    });
  }
  if (pre.stockPostedAt) {
    return { idempotent: true, groupId };
  }

  return db.$transaction(
    async (tx) => {
      const report = await tx.productionReport.findUnique({
        where: { id: reportId },
        include: {
          proses: {
            include: {
              outputItem: true,
              pro: {
                include: {
                  proses: {
                    orderBy: { orderNo: "asc" },
                    include: { outputItem: true },
                  },
                },
              },
              materials: {
                include: {
                  itemMaster: {
                    select: { kind: true, code: true },
                  },
                },
              },
            },
          },
        },
      });

      if (!report) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Report not found." });
      }

      if (report.stockPostedAt || report.status === ReportStatus.APPROVED) {
        return { idempotent: true, groupId };
      }

      const claim = await tx.productionReport.updateMany({
        where: {
          id: report.id,
          stockPostedAt: null,
          status: ReportStatus.PENDING,
        },
        data: {
          status: ReportStatus.APPROVED,
          stockPostedAt: now,
        },
      });

      if (claim.count === 0) {
        return { idempotent: true, groupId };
      }

      if (!report.proses.outputItem) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Proses output item is required.",
        });
      }

      const qtyPassOn = toNumber(report.qtyPassOn);
      const qtyWip = toNumber(report.qtyWip);
      const qtyHold = toNumber(report.qtyHold);
      const qtyReject = toNumber(report.qtyReject);

      const outputItemCode = assertNineDigitCode(report.proses.outputItem.code);
      const outputItemMasterId = report.proses.outputItem.id;

      const sortedSteps = report.proses.pro.proses;
      const currentStepIndex = sortedSteps.findIndex((s) => s.id === report.prosesId);
      const nextStep = currentStepIndex >= 0 ? sortedSteps[currentStepIndex + 1] : null;
      const isLastStep = !nextStep;

      let plan: PlannedLedgerLine[];

      if (report.proses.pro.type === ProType.PAPER) {
        plan = buildInventoryTxnPlan({
          reportType: report.reportType,
          isPaperFlow: true,
          isLastStep,
          qtyPassOn,
          qtyWip,
          qtyHold,
          qtyReject,
          outputItemCode,
          outputItemMasterId,
          nextOutputItemCode: nextStep?.outputItem?.code,
          nextOutputItemMasterId: nextStep?.outputItem?.id,
        });
      } else {
        let inputItemCode: string | undefined;
        let inputItemMasterId: number | undefined;

        if (report.reportType === LphType.PRINTING) {
          const selected = selectInputWipForPrinting(
            report.proses.materials.map((m) => ({
              itemMasterId: m.itemMasterId,
              itemMaster: {
                kind: m.itemMaster.kind,
                code: m.itemMaster.code,
              },
            })),
          );
          inputItemCode = selected.itemCode;
          inputItemMasterId = selected.itemMasterId;
        }

        if (report.reportType === LphType.PACKING_ASSEMBLY) {
          const prevStep = currentStepIndex > 0 ? sortedSteps[currentStepIndex - 1] : null;
          if (!prevStep?.outputItem) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "Packing input item is missing from previous step.",
            });
          }
          inputItemCode = prevStep.outputItem.code;
          inputItemMasterId = prevStep.outputItem.id;
        }

        plan = buildInventoryTxnPlan({
          reportType: report.reportType,
          qtyPassOn,
          qtyWip,
          qtyHold,
          qtyReject,
          inputItemCode,
          inputItemMasterId,
          outputItemCode,
          outputItemMasterId,
        });
      }

      await applyInventoryPlan(
        tx,
        report.id,
        report.proses.proId,
        report.prosesId,
        groupId,
        now,
        plan,
      );

      return { idempotent: false, groupId };
    },
    {
      isolationLevel: "Serializable",
    },
  );
}

export async function voidReportPosting(
  db: PrismaClient,
  reportId: string,
  reason: string,
): Promise<VoidResult> {
  const pre = await db.productionReport.findUnique({
    where: { id: reportId },
    select: { status: true, stockPostedAt: true },
  });
  if (!pre) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Report not found." });
  }
  if (pre.status === ReportStatus.VOID) {
    return { idempotent: true, reversalCount: 0 };
  }
  if (pre.status !== ReportStatus.APPROVED || !pre.stockPostedAt) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Only posted APPROVED reports can be voided.",
    });
  }

  return db.$transaction(async (tx) => {
    const report = await tx.productionReport.findUnique({
      where: { id: reportId },
      select: { status: true },
    });
    if (!report) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Report not found." });
    }
    if (report.status === ReportStatus.VOID) {
      return { idempotent: true, reversalCount: 0 };
    }

    const originals = await tx.inventoryTxn.findMany({
      where: { productionReportId: reportId },
    });

    for (const row of originals) {
      await tx.inventoryTxn.create({
        data: {
          groupId: `VOID-${reportId}`,
          date: new Date(),
          type: row.type === TxnType.IN ? TxnType.OUT : TxnType.IN,
          itemId: row.itemId,
          itemMasterId: row.itemMasterId,
          qty: row.qty,
          locationId: row.locationId,
          proId: row.proId,
          prosesId: row.prosesId,
          productionReportId: null,
          notes: "REVERSAL",
        },
      });
    }

    await tx.productionReport.update({
      where: { id: reportId },
      data: {
        status: ReportStatus.VOID,
        voidReason: reason,
        voidedAt: new Date(),
      },
    });

    return { idempotent: false, reversalCount: originals.length };
  });
}
