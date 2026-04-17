"use client";

import * as React from "react";
import { FileText, Printer, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { type RouterOutputs } from "~/trpc/react";

type ScheduleItem = RouterOutputs["pros"]["getSchedule"][number];

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: ScheduleItem[];
  weekLabel: string;
  weekStart: Date;
  weekEnd: Date;
  proType: "PAPER" | "RIGID";
};

// ─── helpers ─────────────────────────────────────────────────────────────
function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function shiftFromDate(d: Date): 1 | 2 | 3 {
  const h = d.getHours();
  if (h >= 16) return 3;
  if (h >= 11) return 2;
  return 1;
}

function formatDateID(d: Date) {
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(d: Date) {
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Normalise material list to a single string
function materialsString(mats: ScheduleItem["proses"][number]["materials"]) {
  if (!mats || mats.length === 0) return "-";
  return mats
    .map((m) => `${m.itemMaster.name} ${Number(m.qtyReq).toLocaleString("id-ID")} ${m.itemMaster.baseUom ?? ""}`)
    .join("; ");
}

function resolveStepTargetQty(
  process: { plannedQtyPcs?: number | null; estimatedShifts?: number | null },
  qtyPoPcs: number,
) {
  const plannedQty = Number(process.plannedQtyPcs ?? 0);
  if (plannedQty > 0) return plannedQty;

  const estimatedShifts = Number(process.estimatedShifts ?? 0);
  if (estimatedShifts > 0) return Math.ceil(Number(qtyPoPcs ?? 0) / estimatedShifts);

  return Number(qtyPoPcs ?? 0);
}

// Compute total output from approved/pending reports
function totalOutput(reports: { status: string; qtyPassOn: any }[]) {
  return reports.reduce((acc, r) => acc + Number(r.qtyPassOn ?? 0), 0);
}

// ─── Group schedule by machine ────────────────────────────────────────────
type Row = {
  no: number;
  partNumber: string;
  proNumber: string;
  productName: string;
  upCav: number;
  qtyPro: number;
  uom: string;
  material: string;
  deadline: string;
  tanggal: string;
  shift: string;
  target: number;
  output: number;
  selisih: number;
  status: string;
};

type MachineGroup = {
  machineName: string;
  departement: string;
  date: Date;
  rows: Row[];
};

function buildMachineGroups(items: ScheduleItem[], rangeStart: Date, rangeEnd: Date): MachineGroup[] {
  const map = new Map<string, MachineGroup>();

  for (const pro of items) {
    for (const process of pro.proses) {
      const stepStartRaw = (process as any).startDate ?? pro.startDate;
      if (!stepStartRaw) continue;

      const stepStart = new Date(stepStartRaw);
      const dayOnly = new Date(stepStart);
      dayOnly.setHours(0, 0, 0, 0);

      if (dayOnly < rangeStart || dayOnly > rangeEnd) continue;

      const machineName = process.machine?.name ?? "Tanpa Mesin";
      const shift = shiftFromDate(stepStart);
      const dk = dateKey(dayOnly);
      const groupKey = `${machineName}::${dk}`;

      if (!map.has(groupKey)) {
        map.set(groupKey, {
          machineName,
          departement: pro.type === "PAPER" ? "Produksi Paper Packaging" : "Produksi Rigid Packaging",
          date: dayOnly,
          rows: [],
        });
      }

      const group = map.get(groupKey)!;
      const uom = process.machine?.stdOutputPerShift
        ? "sheet"
        : "pcs";

      const target = resolveStepTargetQty(process as any, pro.qtyPoPcs);
      const outputTotal = totalOutput(process.productionReports);

      group.rows.push({
        no: group.rows.length + 1,
        partNumber: process.partNumber ?? pro.partNumber ?? "-",
        proNumber: pro.proNumber,
        productName: pro.productName,
        upCav: process.up ?? 1,
        qtyPro: pro.qtyPoPcs,
        uom: uom,
        material: materialsString(process.materials),
        deadline: pro.startDate ? formatDateShort(new Date(pro.startDate)) : "-",
        tanggal: formatDateShort(dayOnly),
        shift: `Shift ${shift}`,
        target: Math.round(target),
        output: outputTotal,
        selisih: Math.round(target) - outputTotal,
        status: pro.status,
      });
    }
  }

  // Sort groups by date, then machine name
  return Array.from(map.values()).sort((a, b) => {
    if (a.date < b.date) return -1;
    if (a.date > b.date) return 1;
    return a.machineName.localeCompare(b.machineName);
  });
}

// ─── Shared cell border style ─────────────────────────────────────────────
const B = "1.2px solid #222"; // main table border — dark, consistent
const Bh = "1.2px solid #000"; // header border — slightly thicker / darker

// ─── PDF Page Component ───────────────────────────────────────────────────
function PdfPage({
  group,
  pageNum,
  totalPages,
}: {
  group: MachineGroup;
  pageNum: number;
  totalPages: number;
}) {
  const today = new Date();
  const revNo = "04";
  const docNo = "JSG-PRO-FR-01-001";

  const spvLabel =
    group.departement.includes("Rigid")
      ? "SPV RIGID PACKAGING"
      : "SPV PAPER PACKAGING";

  return (
    <div
      className="pdf-page"
      style={{
        width: "100%",
        height: "210mm",
        maxHeight: "210mm",
        padding: "6mm 10mm",
        backgroundColor: "white",
        fontFamily: "'Arial', 'Helvetica Neue', sans-serif",
        fontSize: "8.5pt",
        color: "#000",
        boxSizing: "border-box",
        overflow: "hidden",
        pageBreakInside: "avoid",
        breakInside: "avoid",
        pageBreakAfter: "always",
        breakAfter: "page",
      }}
    >
      {/* ═══════════════ HEADER ═══════════════ */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "4pt",
          border: "2px solid #b8860b", // gold outer border like original
        }}
      >
        <tbody>
          <tr>
            {/* Logo + Judul */}
            <td
              style={{
                width: "70%",
                borderRight: "2px solid #b8860b",
                padding: "6pt 10pt",
                verticalAlign: "middle",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <tr>
                    <td style={{ width: "50pt", verticalAlign: "middle" }}>
                      {/* JS Logo — mimicking the colourful JS box */}
                      <div
                        style={{
                          width: "40pt",
                          height: "40pt",
                          border: "2.5px solid #b8860b",
                          borderRadius: "3pt",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 900,
                          fontSize: "18pt",
                          color: "#1a1a1a",
                          fontFamily: "Georgia, serif",
                        }}
                      >
                        JS
                      </div>
                    </td>
                    <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "11pt",
                          letterSpacing: "0.5pt",
                        }}
                      >
                        PT JUWARA SOLUTION GLOBAL
                      </div>
                      <div
                        style={{
                          fontWeight: 900,
                          fontSize: "12pt",
                          letterSpacing: "1pt",
                          marginTop: "3pt",
                        }}
                      >
                        PERSIAPAN PERGANTIAN PRODUKSI
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            {/* Doc Info */}
            <td style={{ width: "30%", padding: 0, verticalAlign: "top" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  height: "100%",
                }}
              >
                <tbody>
                  {[
                    ["No Doc.", docNo],
                    ["Tanggal Berlaku", formatDateShort(today)],
                    ["Rev", revNo],
                    ["Hal", `${pageNum} / ${totalPages}`],
                  ].map(([label, value], i) => (
                    <tr key={i}>
                      <td
                        style={{
                          borderBottom: "1px solid #b8860b",
                          borderLeft: "1px solid #b8860b",
                          padding: "1.5pt 6pt",
                          fontSize: "7.5pt",
                          whiteSpace: "nowrap",
                          width: "50%",
                        }}
                      >
                        {label}
                      </td>
                      <td
                        style={{
                          borderBottom: "1px solid #b8860b",
                          borderLeft: "1px solid #b8860b",
                          padding: "1.5pt 6pt",
                          fontSize: "7.5pt",
                          fontWeight: i === 0 ? 700 : 400,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ═══════════════ SUB-HEADER ═══════════════ */}
      <table
        style={{
          borderCollapse: "collapse",
          marginBottom: "6pt",
          fontSize: "8.5pt",
        }}
      >
        <tbody>
          <tr>
            <td style={{ padding: "2pt 0", whiteSpace: "nowrap", paddingRight: "6pt" }}>
              <b>Hari / Tanggal</b>
            </td>
            <td style={{ padding: "2pt 0" }}>
              : {formatDateID(group.date)}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "2pt 0", whiteSpace: "nowrap", paddingRight: "6pt" }}>
              <b>Departemen</b>
            </td>
            <td style={{ padding: "2pt 0" }}>
              : {group.departement}
            </td>
          </tr>
          <tr>
            <td style={{ padding: "2pt 0", whiteSpace: "nowrap", paddingRight: "6pt" }}>
              <b>Mesin</b>
            </td>
            <td style={{ padding: "2pt 0" }}>
              : {group.machineName.toUpperCase()}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ═══════════════ DATA TABLE ═══════════════ */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "7.5pt",
          tableLayout: "fixed",
        }}
      >
        {/* Column widths — mirrors the original PDF */}
        <colgroup><col style={{ width: "3%" }} /><col style={{ width: "8%" }} /><col style={{ width: "8%" }} /><col style={{ width: "17%" }} /><col style={{ width: "4%" }} /><col style={{ width: "5%" }} /><col style={{ width: "4%" }} /><col style={{ width: "13%" }} /><col style={{ width: "6%" }} /><col style={{ width: "6%" }} /><col style={{ width: "6%" }} /><col style={{ width: "5.5%" }} /><col style={{ width: "5.5%" }} /><col style={{ width: "5%" }} /><col style={{ width: "9%" }} /></colgroup>

        <thead>
          {/* ── Group header row ── */}
          <tr>
            <th
              colSpan={8}
              style={{
                border: Bh,
                padding: "4pt 4pt",
                textAlign: "center",
                fontWeight: 900,
                fontSize: "8pt",
                backgroundColor: "#d5c7a3", // tan / gold
                letterSpacing: "0.5pt",
              }}
            >
              DETAIL PRO
            </th>
            <th
              colSpan={3}
              style={{
                border: Bh,
                padding: "4pt 4pt",
                textAlign: "center",
                fontWeight: 900,
                fontSize: "8pt",
                backgroundColor: "#d5c7a3",
                letterSpacing: "0.5pt",
              }}
            >
              TANGGAL PRODUKSI
            </th>
            <th
              colSpan={4}
              style={{
                border: Bh,
                padding: "4pt 4pt",
                textAlign: "center",
                fontWeight: 900,
                fontSize: "8pt",
                backgroundColor: "#d5c7a3",
                letterSpacing: "0.5pt",
              }}
            >
              OUTPUT
            </th>
          </tr>

          {/* ── Column header row ── */}
          <tr>
            {[
              "NO",
              "PART NUMBER",
              "PRO",
              "NAMA PRODUK",
              "UP/CAV",
              "QTY. PRO",
              "UoM",
              "MATERIAL",
              "DEADLINE",
              "TANGGAL",
              "SHIFT",
              "TARGET",
              "OUTPUT",
              "SELISIH",
              "STATUS",
            ].map((col) => (
              <th
                key={col}
                style={{
                  border: Bh,
                  padding: "3pt 3pt",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "7pt",
                  backgroundColor: "#e8dfc8", // lighter tan
                  whiteSpace: "nowrap",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {group.rows.map((row, idx) => (
            <tr key={idx}>
              <td style={{ border: B, padding: "4pt 3pt", textAlign: "center" }}>
                {row.no}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 3pt",
                  textAlign: "center",
                  fontFamily: "monospace",
                  fontSize: "7pt",
                }}
              >
                {row.partNumber}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 3pt",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {row.proNumber}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 4pt",
                  wordBreak: "break-word",
                  textTransform: "uppercase",
                  fontSize: "7pt",
                }}
              >
                {row.productName}
              </td>
              <td style={{ border: B, padding: "4pt 3pt", textAlign: "center" }}>
                {row.upCav}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 3pt",
                  textAlign: "center",
                  fontWeight: 600,
                }}
              >
                {row.qtyPro.toLocaleString("id-ID")}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 3pt",
                  textAlign: "center",
                  textTransform: "uppercase",
                }}
              >
                {row.uom}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 4pt",
                  fontSize: "6.5pt",
                  wordBreak: "break-word",
                  textTransform: "uppercase",
                }}
              >
                {row.material}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 3pt",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {row.deadline}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 3pt",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {row.tanggal}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 3pt",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {row.shift}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 3pt",
                  textAlign: "center",
                  fontWeight: 700,
                }}
              >
                {row.target.toLocaleString("id-ID")}
              </td>
              <td style={{ border: B, padding: "4pt 3pt", textAlign: "center" }}>
                {row.output > 0 ? row.output.toLocaleString("id-ID") : ""}
              </td>
              <td style={{ border: B, padding: "4pt 3pt", textAlign: "center" }}>
                {row.output > 0 ? row.selisih.toLocaleString("id-ID") : ""}
              </td>
              <td
                style={{
                  border: B,
                  padding: "4pt 3pt",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "6pt",
                  wordBreak: "break-word",
                  lineHeight: "1.2",
                }}
              >
                {row.status === "IN_PROGRESS"
                  ? "IN-PROG"
                  : row.status === "CANCELLED"
                    ? "CANCEL"
                    : row.status === "COMPLETE"
                      ? "DONE"
                      : row.status}
              </td>
            </tr>
          ))}

          {/* Empty rows to pad the table (minimum 5 rows like original) */}
          {group.rows.length < 5 &&
            Array.from({ length: 5 - group.rows.length }).map((_, i) => (
              <tr key={`e-${i}`}>
                {Array.from({ length: 15 }).map((__, j) => (
                  <td
                    key={j}
                    style={{ border: B, padding: "5pt 3pt" }}
                  />
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {/* ═══════════════ SIGNATURE ═══════════════ */}
      <div style={{ marginTop: "16pt" }}>
        <div style={{ fontSize: "8pt", marginBottom: "2pt" }}>Menyetujui,</div>
        <div style={{ height: "24pt" }} /> {/* space for signature */}
        <div style={{ width: "160pt" }}>
          <div
            style={{
              borderBottom: "1px solid #000",
              marginBottom: "2pt",
              fontSize: "8pt",
              fontWeight: 700,
              textDecoration: "underline",
              color: "#1a1aff",
            }}
          >
            {/* Name will be hand-signed */}
            &nbsp;
          </div>
          <div style={{ fontSize: "7.5pt", fontWeight: 700 }}>{spvLabel}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export Component ────────────────────────────────────────────────
export function SchedulePdfExport({
  open,
  onOpenChange,
  items,
  weekLabel,
  weekStart,
  weekEnd,
  proType,
}: Props) {
  const printRef = React.useRef<HTMLDivElement>(null);

  const filtered = React.useMemo(
    () => items.filter((p) => p.type === proType),
    [items, proType],
  );

  const groups = React.useMemo(() => {
    const rangeStart = new Date(weekStart);
    rangeStart.setHours(0, 0, 0, 0);
    const rangeEnd = new Date(weekEnd);
    rangeEnd.setHours(23, 59, 59, 999);
    return buildMachineGroups(filtered, rangeStart, rangeEnd);
  }, [filtered, weekStart, weekEnd]);

  const handlePrint = () => {
    const style = document.createElement("style");
    style.id = "pdf-print-styles";
    style.textContent = `
      @media print {
        /* Hide everything except print clone */
        body > * { display: none !important; }
        body > #schedule-print-clone { display: block !important; }

        #schedule-print-clone {
          margin: 0;
          padding: 0;
        }

        #schedule-print-clone .pdf-page {
          width: 297mm !important;
          height: 210mm !important;
          max-height: 210mm !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
          page-break-after: always !important;
          break-after: page !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          display: block !important;
        }

        #schedule-print-clone .pdf-page:last-child {
          page-break-after: auto !important;
          break-after: auto !important;
        }

        @page {
          size: A4 landscape;
          margin: 0;
        }
      }
    `;
    // Clone the print area to body root so it's not nested inside hidden elements
    const printArea = printRef.current;
    if (!printArea) return;
    const clone = printArea.cloneNode(true) as HTMLElement;
    clone.id = "schedule-print-clone";
    document.head.appendChild(style);
    document.body.appendChild(clone);
    window.print();
    setTimeout(() => {
      document.head.removeChild(style);
      document.body.removeChild(clone);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[95vh] w-[98vw] !max-w-none flex-col overflow-hidden p-0" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between border-b px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <FileText className="h-5 w-5 text-blue-500" />
            Preview — Persiapan Pergantian Produksi ({proType})
          </DialogTitle>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{weekLabel}</span>
            <Button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print / Save PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Preview area */}
        <div className="flex-1 overflow-y-auto bg-gray-100">
          {groups.length === 0 ? (
            <div className="flex h-48 items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Tidak ada data jadwal di minggu ini untuk tipe {proType}.
              </p>
            </div>
          ) : (
            <div id="schedule-print-area" ref={printRef}>
              {groups.map((group, idx) => (
                <div key={idx} className="mb-4 shadow-lg">
                  <PdfPage
                    group={group}
                    pageNum={idx + 1}
                    totalPages={groups.length}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t px-6 py-3 text-xs text-gray-500">
          {groups.length} halaman • dikelompokkan per mesin per hari •{" "}
          <span className="font-medium">Klik "Print / Save PDF"</span> lalu pilih "Save as PDF" di dialog print browser
        </div>
      </DialogContent>
    </Dialog>
  );
}
