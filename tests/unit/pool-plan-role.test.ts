import { TRPCError } from "@trpc/server";
import { LphType, Role, TxnType } from "../../generated/prisma";
import {
  assertSuperadminRole,
  buildInventoryTxnPlan,
  resolvePoolByReportType,
} from "~/server/domain/inventory-policy";

describe("U4 resolvePoolByReportType", () => {
  test("maps INJECTION to WIP_POOL_INJECTION", () => {
    expect(resolvePoolByReportType(LphType.INJECTION)).toEqual({
      outputLocationCode: "WIP_POOL_INJECTION",
    });
  });

  test("maps BLOW_MOULDING to WIP_POOL_BLOW", () => {
    expect(resolvePoolByReportType(LphType.BLOW_MOULDING)).toEqual({
      outputLocationCode: "WIP_POOL_BLOW",
    });
  });

  test("maps PRINTING to WIP_POOL_PRINTING", () => {
    expect(resolvePoolByReportType(LphType.PRINTING)).toEqual({
      outputLocationCode: "WIP_POOL_PRINTING",
    });
  });

  test("maps PACKING_ASSEMBLY to FG output and PRINTING input", () => {
    expect(resolvePoolByReportType(LphType.PACKING_ASSEMBLY)).toEqual({
      outputLocationCode: "FG_WH",
      inputLocationCode: "WIP_POOL_PRINTING",
    });
  });

  test("throws for unknown type", () => {
    expect(() => resolvePoolByReportType("PAPER" as LphType)).toThrow(
      "Unsupported",
    );
  });
});

describe("U5 buildInventoryTxnPlan", () => {
  test("builds rigid printing OUT+IN plan with signed qty", () => {
    const lines = buildInventoryTxnPlan({
      reportType: LphType.PRINTING,
      qtyPassOn: 500,
      qtyWip: 20,
      qtyHold: 10,
      qtyReject: 5,
      inputItemCode: "987654321",
      inputItemMasterId: 11,
      outputItemCode: "987654320",
      outputItemMasterId: 12,
    });

    expect(lines).toHaveLength(2);
    const outLine = lines.find((l) => l.type === TxnType.OUT);
    const inLine = lines.find((l) => l.type === TxnType.IN);

    expect(outLine?.locationCode).toBe("WIP_POOL_INJECTION");
    expect(outLine?.qty).toBe(-(500 + 20 + 10 + 5));
    expect(inLine?.locationCode).toBe("WIP_POOL_PRINTING");
    expect(inLine?.qty).toBe(500);
    expect(lines.filter((l) => l.type === TxnType.IN).every((l) => l.qty > 0)).toBe(
      true,
    );
    expect(lines.filter((l) => l.type === TxnType.OUT).every((l) => l.qty < 0)).toBe(
      true,
    );
  });
});

describe("U6 assertSuperadminRole", () => {
  test("allows SUPERADMIN", () => {
    expect(() => assertSuperadminRole(Role.SUPERADMIN)).not.toThrow();
  });

  test("denies non-superadmin", () => {
    try {
      assertSuperadminRole(Role.ADMIN);
      throw new Error("Expected role guard to throw.");
    } catch (error) {
      expect(error).toBeInstanceOf(TRPCError);
      expect((error as TRPCError).code).toBe("FORBIDDEN");
    }
  });
});
