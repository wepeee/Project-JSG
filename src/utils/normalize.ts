/** Normalize item code: trim, uppercase, collapse whitespace */
export function normalizeCode(raw: string): string {
  return raw.trim().replace(/\s+/g, "_").toUpperCase();
}
