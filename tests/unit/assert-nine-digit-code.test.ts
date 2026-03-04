import { assertNineDigitCode } from "~/server/domain/inventory-policy";

describe("U1 assertNineDigitCode", () => {
  test('returns normalized code for " 123456789 "', () => {
    expect(assertNineDigitCode(" 123456789 ")).toBe("123456789");
  });

  test("rejects length < 9", () => {
    expect(() => assertNineDigitCode("12345678")).toThrow(
      "exactly 9 digits",
    );
  });

  test("rejects length > 9", () => {
    expect(() => assertNineDigitCode("1234567890")).toThrow(
      "exactly 9 digits",
    );
  });

  test("rejects alpha characters", () => {
    expect(() => assertNineDigitCode("12345A789")).toThrow(
      "exactly 9 digits",
    );
  });

  test("rejects symbols", () => {
    expect(() => assertNineDigitCode("12-3456789")).toThrow(
      "exactly 9 digits",
    );
  });

  test("rejects empty string", () => {
    expect(() => assertNineDigitCode("   ")).toThrow("cannot be empty");
  });
});
