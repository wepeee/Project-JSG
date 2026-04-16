import { calculateProStepShiftAndTarget } from "~/lib/pro-calculation";

describe("U4 pro calculation helper", () => {
  test("always uses qty PO as target basis", () => {
    const result = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 900,
      upCav: 2,
      qtyPoPcs: 10000,
    });

    expect(result.source).toBe("from_pro_target");
    expect(result.qtyBasisPcs).toBe(10000);
    expect(result.qtyBasisSheet).toBe(5000);
    expect(result.shiftCount).toBe(6);
    expect(result.plannedQtyPcsTotal).toBe(10000);
  });

  test("machine uom/material context does not change qty basis", () => {
    const sheetResult = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 900,
      upCav: 2,
      qtyPoPcs: 10000,
    });
    const pcsResult = calculateProStepShiftAndTarget({
      machineUom: "pcs",
      machineStdOutputPerShift: 900,
      upCav: 2,
      qtyPoPcs: 10000,
    });

    expect(sheetResult.qtyBasisPcs).toBe(10000);
    expect(pcsResult.qtyBasisPcs).toBe(10000);
    expect(sheetResult.shiftCount).toBe(pcsResult.shiftCount);
  });

  test("up/cav empty or zero is treated as 1", () => {
    const resultZero = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 900,
      upCav: 0,
      qtyPoPcs: 10000,
    });
    const resultEmpty = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 900,
      upCav: undefined,
      qtyPoPcs: 10000,
    });

    expect(resultZero.upCav).toBe(1);
    expect(resultEmpty.upCav).toBe(1);
    expect(resultZero.qtyBasisSheet).toBe(10000);
    expect(resultEmpty.qtyBasisSheet).toBe(10000);
  });

  test("invalid std output falls back to 1 shift", () => {
    const result = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 0,
      upCav: 2,
      qtyPoPcs: 10000,
    });

    expect(result.shiftCount).toBe(1);
    expect(result.shiftSheetLoads).toHaveLength(1);
    expect(result.shiftSheetLoads[0]).toBe(5000);
  });

  test("non-positive qty PO yields zero target with minimum 1 shift", () => {
    const result = calculateProStepShiftAndTarget({
      machineUom: "sheet",
      machineStdOutputPerShift: 900,
      upCav: 2,
      qtyPoPcs: 0,
    });

    expect(result.plannedQtyPcsTotal).toBe(0);
    expect(result.qtyBasisPcs).toBe(0);
    expect(result.shiftCount).toBe(1);
  });
});

