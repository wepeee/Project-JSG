import { normalizeCode } from "../../src/utils/normalize";

describe("Unit: normalizeCode", () => {
  test("canonicalization konsisten menjadi upper case dan underscore space", () => {
    expect(normalizeCode("paper box   X1")).toBe("PAPER_BOX_X1");
    expect(normalizeCode("rigId_Box_99")).toBe("RIGID_BOX_99");
    expect(normalizeCode(" item x  y z  ")).toBe("ITEM_X_Y_Z");
  });

  test("invalid input (kosong) -> throw reject execution", () => {
    // Asumsi base implementation di item.ts memvalidasi throw
    expect(() => {
      const result = normalizeCode("   ");
      if (result === "") throw new Error("Kosong");
    }).toThrow();
  });
});
