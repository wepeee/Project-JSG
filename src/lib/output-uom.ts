export type OutputCountUom = "pcs" | "sheet";

/**
 * Normalize machine UOM into supported output count units for LPH.
 * Scope is intentionally limited to sheet/pcs for output counts.
 */
export function resolveOutputCountUom(
  machineUom: string | null | undefined,
): OutputCountUom {
  return machineUom === "sheet" ? "sheet" : "pcs";
}

/**
 * Resolve report output unit with snapshot priority, then machine fallback.
 */
export function resolveReportOutputUom(input: {
  outputUom?: string | null;
  machineUom?: string | null;
}): OutputCountUom {
  if (input.outputUom === "sheet" || input.outputUom === "pcs") {
    return input.outputUom;
  }
  return resolveOutputCountUom(input.machineUom);
}
