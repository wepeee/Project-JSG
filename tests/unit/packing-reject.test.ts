import {
  PACKING_PRIMARY_REJECT_KEYS,
  sumPackingPrimaryRejectFromBreakdown,
} from "../../src/lib/packing-reject";

describe("packing reject helper", () => {
  test("sumPackingPrimaryRejectFromBreakdown only sums Bagian 1 keys", () => {
    const breakdown = {
      [PACKING_PRIMARY_REJECT_KEYS[0]]: 10,
      [PACKING_PRIMARY_REJECT_KEYS[1]]: "2",
      "Stiker Halal": 99,
      "B. Spot 3": 7,
      "Other": "8",
    };

    expect(sumPackingPrimaryRejectFromBreakdown(breakdown)).toBe(12);
  });

  test("handles empty/null breakdown as zero", () => {
    expect(sumPackingPrimaryRejectFromBreakdown(undefined)).toBe(0);
    expect(sumPackingPrimaryRejectFromBreakdown(null)).toBe(0);
    expect(sumPackingPrimaryRejectFromBreakdown({})).toBe(0);
  });
});
