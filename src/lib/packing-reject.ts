export const PACKING_REJECT_SPLIT = [
  [
    "B. Spot",
    "Cekung",
    "Baret",
    "Buble",
    "Print Pethal",
    "Print Miring",
    "Print Blobor",
    "Pecah",
    "Acrylic Mix Up",
    "Lengket",
    "Botol Bertekstur",
    "Tertempel Sticker",
    "Konstaminasi",
    "Warna Tidak Standart",
    "Buram",
    "Kotor Fat",
  ],
  [
    "B. Spot 3",
    "Pecah 2",
    "Warna # Std",
    "Short Shoot",
    "Menempel Pada Botol",
    "Kotor Fat 2",
  ],
  [
    "B. Spot 5",
    "Print Pethal",
    "Pecah 6",
    "Warna # Std 7",
    "Baret 8",
    "Kotor Fat 9",
  ],
  ["B. Spot 10", "Warna # Std 11", "Kotor Fat 12"],
  ["B. Spot 13", "Warna # Std 14", "Kotor Fat 15"],
  [
    "Stiker Halal",
    "Stiker BB & Derma",
    "Stiker BB & WCD",
    "Sticker BB",
    "STICKER WCD",
    "Stiker Barcode",
    "Stiker Toner",
    "Sticker Bottom",
    "Stiker Bottom Baru",
    "Other",
  ],
] as const;

export const PACKING_PRIMARY_REJECT_KEYS = [
  ...PACKING_REJECT_SPLIT[0],
] as const;

export const PACKING_STICKER_GROUP_INDEX = 5;

export function getPackingRejectGroupLabel(groupIndex: number): string {
  const base = `Bagian ${groupIndex + 1}`;
  if (groupIndex === PACKING_STICKER_GROUP_INDEX) {
    return `${base} (Stiker)`;
  }
  return base;
}

function toSafeNumber(value: unknown): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "."));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function sumPackingPrimaryRejectFromBreakdown(
  breakdown: Record<string, unknown> | null | undefined,
): number {
  if (!breakdown) return 0;

  return PACKING_PRIMARY_REJECT_KEYS.reduce((sum, key) => {
    return sum + toSafeNumber(breakdown[key]);
  }, 0);
}
