/** Normalize item code: trim, uppercase, collapse whitespace */
export function normalizeCode(raw: string): string {
  return raw.trim().replace(/\s+/g, "_").toUpperCase();
}

export type InferredItemKind = "WIP" | "FG" | "CONSUMABLE";

/**
 * Infer item kind from PN rule (digit pertama):
 * - 7: WIP
 * - 8: FG
 * - 9: JASA (mapped to CONSUMABLE in current schema)
 */
export function inferItemKindFromPnCode(raw: string): InferredItemKind | null {
  const code = normalizeCode(raw);
  if (!code) return null;

  const first = code.charAt(0);
  if (first === "7") return "WIP";
  if (first === "8") return "FG";
  if (first === "9") return "CONSUMABLE";
  return null;
}
