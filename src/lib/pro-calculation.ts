export type ProCalcSource = "from_pro_target";

export type ProCalcInput = {
  machineUom?: string | null;
  machineStdOutputPerShift?: number | null;
  upCav?: number | null;
  qtyPoPcs: number;
};

export type ProCalcResult = {
  source: ProCalcSource;
  upCav: number;
  stdOutputPerShift: number;
  qtyBasisPcs: number;
  qtyBasisSheet: number;
  plannedQtyPcsTotal: number;
  shiftCount: number;
  shiftSheetLoads: number[];
  totalPlannedSheets: number;
};

function positiveOrZero(value?: number | null): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function sanitizeUpCav(value?: number | null): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function buildShiftSheetLoads(opts: {
  totalSheets: number;
  shiftCount: number;
  stdOutputPerShift: number;
}): number[] {
  const totalSheets = Math.max(0, Number(opts.totalSheets ?? 0));
  const shiftCount = Math.max(1, Math.floor(Number(opts.shiftCount ?? 1)));
  const std = Number(opts.stdOutputPerShift ?? 0);

  if (shiftCount === 1) return [totalSheets];
  if (!(std > 0)) return Array.from({ length: shiftCount }, () => totalSheets / shiftCount);

  const loads: number[] = [];
  let remaining = totalSheets;
  for (let i = 0; i < shiftCount; i++) {
    const load = Math.max(0, Math.min(remaining, std));
    loads.push(load);
    remaining -= load;
  }

  return loads;
}

export function calculateProStepShiftAndTarget(input: ProCalcInput): ProCalcResult {
  const upCav = sanitizeUpCav(input.upCav);
  const stdOutputPerShift = positiveOrZero(input.machineStdOutputPerShift);
  const qtyPoPcs = positiveOrZero(input.qtyPoPcs);

  const source: ProCalcSource = "from_pro_target";
  const qtyBasisPcs = qtyPoPcs;
  const qtyBasisSheet = qtyBasisPcs / upCav;

  const plannedQtyPcsTotal = Math.max(0, Math.round(qtyBasisPcs));
  const shiftCount =
    stdOutputPerShift > 0
      ? Math.max(1, Math.ceil(qtyBasisSheet / stdOutputPerShift))
      : 1;

  const shiftSheetLoads = buildShiftSheetLoads({
    totalSheets: qtyBasisSheet,
    shiftCount,
    stdOutputPerShift,
  });
  const totalPlannedSheets = shiftSheetLoads.reduce((acc, n) => acc + n, 0);

  return {
    source,
    upCav,
    stdOutputPerShift,
    qtyBasisPcs,
    qtyBasisSheet,
    plannedQtyPcsTotal,
    shiftCount,
    shiftSheetLoads,
    totalPlannedSheets,
  };
}
