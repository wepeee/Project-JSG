import {
  resolveOutputCountUom,
  resolveReportOutputUom,
} from "~/lib/output-uom";

describe("UOM output resolver", () => {
  test("machine uom sheet -> sheet", () => {
    expect(resolveOutputCountUom("sheet")).toBe("sheet");
  });

  test("machine uom pcs -> pcs", () => {
    expect(resolveOutputCountUom("pcs")).toBe("pcs");
  });

  test("machine uom non-sheet -> pcs fallback", () => {
    expect(resolveOutputCountUom("kg")).toBe("pcs");
    expect(resolveOutputCountUom(null)).toBe("pcs");
  });

  test("report snapshot prioritized over machine fallback", () => {
    expect(
      resolveReportOutputUom({
        outputUom: "sheet",
        machineUom: "pcs",
      }),
    ).toBe("sheet");

    expect(
      resolveReportOutputUom({
        outputUom: null,
        machineUom: "sheet",
      }),
    ).toBe("sheet");
  });
});
