import { TRPCError } from "@trpc/server";
import { LphType, Role, TxnType } from "../../../generated/prisma";

export type QtyShape = {
  qtyPassOn: number;
  qtyWip: number;
  qtyHold: number;
  qtyReject: number;
};

export type PoolResolution = {
  outputLocationCode: string;
  inputLocationCode?: string;
};

export type PlannedLedgerLine = {
  type: TxnType;
  locationCode: string;
  itemCode: string;
  itemMasterId: number;
  qty: number;
};

export type BuildTxnPlanInput = {
  reportType: LphType;
  isPaperFlow?: boolean;
  isLastStep?: boolean;
  qtyPassOn: number;
  qtyWip: number;
  qtyHold: number;
  qtyReject: number;
  inputItemCode?: string;
  inputItemMasterId?: number;
  outputItemCode: string;
  outputItemMasterId: number;
  nextOutputItemCode?: string;
  nextOutputItemMasterId?: number;
};

export function assertNineDigitCode(input: string): string {
  const normalized = input.trim();

  if (!normalized) {
    throw new Error("Code cannot be empty.");
  }

  if (!/^\d{9}$/.test(normalized)) {
    throw new Error("Code must be numeric-only with exactly 9 digits.");
  }

  return normalized;
}

export function parseIndonesianNumber(input: string): number {
  const raw = input.trim();
  if (!raw) {
    throw new Error("Value cannot be empty.");
  }

  const normalized = raw.replace(/\./g, "").replace(/,/g, ".");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    throw new Error(`Invalid numeric format: "${input}"`);
  }

  const value = Number(normalized);
  if (Number.isNaN(value)) {
    throw new Error(`Invalid numeric value: "${input}"`);
  }
  return value;
}

export function computeQtyProducedTotal(qty: QtyShape): number {
  return qty.qtyPassOn + qty.qtyWip + qty.qtyHold + qty.qtyReject;
}

export function resolvePoolByReportType(reportType: LphType): PoolResolution {
  switch (reportType) {
    case LphType.INJECTION:
      return { outputLocationCode: "WIP_POOL_INJECTION" };
    case LphType.BLOW_MOULDING:
      return { outputLocationCode: "WIP_POOL_BLOW" };
    case LphType.PRINTING:
      return { outputLocationCode: "WIP_POOL_PRINTING" };
    case LphType.PACKING_ASSEMBLY:
      return {
        outputLocationCode: "FG_WH",
        inputLocationCode: "WIP_POOL_PRINTING",
      };
    default:
      throw new Error(`Unsupported report type: ${reportType as string}`);
  }
}

export function assertSuperadminRole(role: Role): void {
  if (role !== Role.SUPERADMIN) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "SUPERADMIN role is required.",
    });
  }
}

function pushIn(
  lines: PlannedLedgerLine[],
  locationCode: string,
  itemCode: string,
  itemMasterId: number,
  qty: number,
): void {
  if (qty <= 0) return;
  lines.push({
    type: TxnType.IN,
    locationCode,
    itemCode,
    itemMasterId,
    qty,
  });
}

function pushOut(
  lines: PlannedLedgerLine[],
  locationCode: string,
  itemCode: string,
  itemMasterId: number,
  qty: number,
): void {
  if (qty <= 0) return;
  lines.push({
    type: TxnType.OUT,
    locationCode,
    itemCode,
    itemMasterId,
    qty: -qty,
  });
}

export function buildInventoryTxnPlan(
  input: BuildTxnPlanInput,
): PlannedLedgerLine[] {
  const lines: PlannedLedgerLine[] = [];
  const qtyProducedTotal = computeQtyProducedTotal(input);

  if (input.isPaperFlow) {
    if (input.isLastStep) {
      pushIn(
        lines,
        "FG_WH",
        input.outputItemCode,
        input.outputItemMasterId,
        input.qtyPassOn,
      );
      return lines;
    }

    const currentPool = resolvePoolByReportType(input.reportType);
    pushIn(
      lines,
      currentPool.outputLocationCode,
      input.outputItemCode,
      input.outputItemMasterId,
      input.qtyWip,
    );

    if (input.qtyPassOn > 0) {
      const nextCode = input.nextOutputItemCode ?? input.outputItemCode;
      const nextId = input.nextOutputItemMasterId ?? input.outputItemMasterId;
      pushIn(lines, "WIP_POOL_BLOW", nextCode, nextId, input.qtyPassOn);
    }
    return lines;
  }

  switch (input.reportType) {
    case LphType.INJECTION: {
      pushIn(
        lines,
        "WIP_POOL_INJECTION",
        input.outputItemCode,
        input.outputItemMasterId,
        input.qtyPassOn,
      );
      break;
    }

    case LphType.BLOW_MOULDING: {
      pushIn(
        lines,
        "WIP_POOL_BLOW",
        input.outputItemCode,
        input.outputItemMasterId,
        input.qtyPassOn,
      );
      break;
    }

    case LphType.PRINTING: {
      if (!input.inputItemCode || !input.inputItemMasterId) {
        throw new Error("Printing plan requires input item context.");
      }
      pushOut(
        lines,
        "WIP_POOL_INJECTION",
        input.inputItemCode,
        input.inputItemMasterId,
        qtyProducedTotal,
      );
      pushIn(
        lines,
        "WIP_POOL_PRINTING",
        input.outputItemCode,
        input.outputItemMasterId,
        input.qtyPassOn,
      );
      break;
    }

    case LphType.PACKING_ASSEMBLY: {
      if (!input.inputItemCode || !input.inputItemMasterId) {
        throw new Error("Packing plan requires input item context.");
      }
      pushOut(
        lines,
        "WIP_POOL_PRINTING",
        input.inputItemCode,
        input.inputItemMasterId,
        qtyProducedTotal,
      );
      pushIn(
        lines,
        "FG_WH",
        input.outputItemCode,
        input.outputItemMasterId,
        input.qtyPassOn,
      );
      break;
    }

    default:
      throw new Error(`Unsupported report type: ${input.reportType as string}`);
  }

  return lines;
}
