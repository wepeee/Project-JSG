import {
  computeQtyProducedTotal,
  parseIndonesianNumber,
} from "~/server/domain/inventory-policy";

describe("U2 parseIndonesianNumber", () => {
  test('parses "1.000,5" to 1000.5', () => {
    expect(parseIndonesianNumber("1.000,5")).toBe(1000.5);
  });

  test('parses "1000" to 1000', () => {
    expect(parseIndonesianNumber("1000")).toBe(1000);
  });

  test("rejects invalid input", () => {
    expect(() => parseIndonesianNumber("abc")).toThrow("Invalid numeric");
  });
});

describe("U3 computeQtyProducedTotal", () => {
  test("returns 0 for all zeroes", () => {
    expect(
      computeQtyProducedTotal({
        qtyPassOn: 0,
        qtyWip: 0,
        qtyHold: 0,
        qtyReject: 0,
      }),
    ).toBe(0);
  });

  test("returns precise decimal sum", () => {
    expect(
      computeQtyProducedTotal({
        qtyPassOn: 100.25,
        qtyWip: 1.5,
        qtyHold: 2.25,
        qtyReject: 0.5,
      }),
    ).toBe(104.5);
  });
});
