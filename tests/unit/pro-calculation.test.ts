import { calculateProStepShiftAndTarget } from "~/lib/pro-calculation";

describe("U4 pro calculation helper", () => {
  test("sheet machine + sheet material uses sheet material as basis", () => {
    const result = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 900,
      upCav: 2,
      qtyPoPcs: 10000,
      firstMaterialQty: 3000,
      firstMaterialUom: "sheet",
    });

    expect(result.source).toBe("from_sheet_material");
    expect(result.qtyBasisSheet).toBe(3000);
    expect(result.qtyBasisPcs).toBe(6000);
    expect(result.shiftCount).toBe(4);
    expect(result.plannedQtyPcsTotal).toBe(6000);
  });

  test("pcs machine + pcs material uses pcs material as basis", () => {
    const result = calculateProStepShiftAndTarget({
      machineUom: "pcs",
      machineStdOutputPerShift: 900,
      upCav: 2,
      qtyPoPcs: 10000,
      firstMaterialQty: 2000,
      firstMaterialUom: "pcs",
    });

    expect(result.source).toBe("from_pcs_material");
    expect(result.qtyBasisPcs).toBe(2000);
    expect(result.qtyBasisSheet).toBe(1000);
    expect(result.shiftCount).toBe(2);
    expect(result.plannedQtyPcsTotal).toBe(2000);
  });

  test("no material falls back to qty PO", () => {
    const result = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 900,
      upCav: 2,
      qtyPoPcs: 10000,
      firstMaterialQty: undefined,
      firstMaterialUom: undefined,
    });

    expect(result.source).toBe("fallback_qty_po");
    expect(result.qtyBasisPcs).toBe(10000);
    expect(result.qtyBasisSheet).toBe(5000);
    expect(result.shiftCount).toBe(6);
    expect(result.plannedQtyPcsTotal).toBe(10000);
  });

  test("material uom mismatch falls back to qty PO", () => {
    const result = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 900,
      upCav: 2,
      qtyPoPcs: 10000,
      firstMaterialQty: 2000,
      firstMaterialUom: "pcs",
    });

    expect(result.source).toBe("fallback_qty_po");
    expect(result.qtyBasisPcs).toBe(10000);
    expect(result.qtyBasisSheet).toBe(5000);
  });

  test("up/cav empty or zero is treated as 1", () => {
    const resultZero = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 900,
      upCav: 0,
      qtyPoPcs: 10000,
      firstMaterialQty: undefined,
      firstMaterialUom: undefined,
    });
    const resultEmpty = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 900,
      upCav: undefined,
      qtyPoPcs: 10000,
      firstMaterialQty: undefined,
      firstMaterialUom: undefined,
    });

    expect(resultZero.upCav).toBe(1);
    expect(resultEmpty.upCav).toBe(1);
    expect(resultZero.qtyBasisSheet).toBe(10000);
    expect(resultEmpty.qtyBasisSheet).toBe(10000);
  });

  test("non sheet/pcs machine falls back to qty PO conversion", () => {
    const result = calculateProStepShiftAndTarget({
      machineUom: "meter",
      machineStdOutputPerShift: 900,
      upCav: 2,
      qtyPoPcs: 10000,
      firstMaterialQty: 3000,
      firstMaterialUom: "meter",
    });

    expect(result.source).toBe("fallback_qty_po");
    expect(result.qtyBasisPcs).toBe(10000);
    expect(result.qtyBasisSheet).toBe(5000);
    expect(result.shiftCount).toBe(6);
  });
});
