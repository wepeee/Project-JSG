import * as XLSX from "xlsx";

type CellValue = string | number | boolean | null | undefined;

export function downloadExcel(params: {
  sheetName: string;
  fileName: string;
  rows: CellValue[][];
}) {
  const { sheetName, fileName, rows } = params;
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, fileName);
}

export async function readExcelRows(file: File): Promise<string[][]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];
  const firstSheet = workbook.Sheets[firstSheetName];
  if (!firstSheet) return [];

  const rows = XLSX.utils.sheet_to_json<CellValue[]>(firstSheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  return rows.map((row) =>
    row.map((value) => (value === null || value === undefined ? "" : String(value))),
  );
}
