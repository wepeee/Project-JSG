"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { format } from "date-fns";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

// Reuse constants from parent if possible, or redefine.
// For simplicity and self-containment, I'll redefine the crucial ones or just iterate over keys if dynamic.
// But the keys are specific strings. I'll copy the constants to be safe.

const PAPER_REJECT_COLUMNS = [
  "Bintik",
  "Warna",
  "Baret",
  "Bercak",
  "Bold",
  "Petal",
  "Laminasi",
  "UV Spot",
  "Hot Print",
  "Emboss",
  "Creasing",
  "Sobek",
  "Lem",
  "Kotor",
  "Lain-lain",
];

const INJECTION_REJECT_BB = ["Gilingan / Purge", "PT / Runner"];

const INJECTION_REJECT_PROD = [
  "Bintik Hitam",
  "P/S Deformasi",
  "Warna # Std",
  "Appearance # Std",
  "Dimensi # Std",
  "Kotor Fet",
  "Proses",
  "Baret",
];

const PRINTING_REJECT_COLUMNS = [
  "B. Spot/Cekung",
  "Kotor Vat",
  "Blobor/Cembung",
  "Print Pethal",
  "Mbayang/Tebal Tipis",
  "Print Geser",
  "Warna # Std",
  "Baret",
  "Botol Bertekstur",
  "Tidak Press",
  "Pecah",
  "Lain-lain",
];

const PACKING_REJECT_SPLIT = [
  [
    "B. Spot",
    "Cekung",
    "Baret",
    "Buble",
    "Print Pethal",
    "Print Miring",
    "Print Blobor",
    "Pecah",
    "Acrylic Mix Up",
    "Lengket",
    "Botol Bertekstur",
    "Tertempel Sticker",
    "Konstaminasi",
    "Warna Tidak Standart",
    "Buram",
    "Kotor Fat",
  ],
  [
    "B. Spot 3",
    "Pecah 2",
    "Warna # Std",
    "Short Shoot",
    "Menempel Pada Botol",
    "Kotor Fat 2",
  ],
  [
    "B. Spot 5",
    "Print Pethal",
    "Pecah 6",
    "Warna # Std 7",
    "Baret 8",
    "Kotor Fat 9",
  ],
  ["B. Spot 10", "Warna # Std 11", "Kotor Fat 12"],
  ["B. Spot 13", "Warna # Std 14", "Kotor Fat 15"],
  [
    "Stiker Halal",
    "Stiker BB & Derma",
    "Stiker BB & WCD",
    "Sticker BB",
    "STICKER WCD",
    "Stiker Barcode",
    "Stiker Toner",
    "Sticker Bottom",
    "Sticker Bottom Baru",
    "Other",
  ],
];

interface Report {
  id: string;
  reportDate: Date | string;
  shift: number;
  operatorName: string;
  checkedBy?: { username: string };
  proses: {
    pro: {
      proNumber: string;
      productName: string;
    };
    partNumber?: string;
    machine?: {
      name: string;
    };
  };
  batchNo?: string;
  startTime?: Date | string;
  endTime?: Date | string;
  qtyGood: number | null;
  qtyReject: number | null;
  qtyPassOn: number | null;
  qtyHold: number | null;
  qtyWip: number | null;
  notes?: string;
  downtimeBreakdown?: any;
  rejectBreakdown?: any;
  metaData?: any;
  totalDowntime: number;
  stdSpeed?: number | null;
  manPowerStd?: number | null;
  manPowerAct?: number | null;
  cavityStd?: number | null;
  cycleTimeStd?: number | null;
  materialPurgeQty?: number | null;
  materialRunnerQty?: number | null;
}

export function ReportDetailDialog({
  report,
  category,
  isOpen,
  onOpenChange,
}: {
  report: Report | null;
  category: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!report) return null;

  const isMoulding = category === "INJECTION" || category === "BLOW_MOULDING";
  const isPrinting = category === "PRINTING";
  const isPacking = category === "PACKING_ASSEMBLY";
  const isPaper = category === "PAPER";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] sm:max-w-6xl flex-col gap-0 overflow-hidden outline-none p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0 bg-background/95 backdrop-blur z-10">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>Detail Laporan Harian</span>
              <Badge variant="outline" className="font-mono font-normal">
                {report.proses.pro.proNumber}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
              <span>{format(new Date(report.reportDate), "dd MMM yyyy")}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 ml-2 text-muted-foreground hover:text-foreground rounded-full"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* FIXED UPPER SECTION: Info & Stats */}
        <div className="px-6 py-4 bg-muted/5 border-b shrink-0 space-y-6">
            {/* 1. Main Info Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4 lg:grid-cols-5">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Mesin & Operator
                </span>
                <div className="text-sm font-medium text-blue-600">
                  {report.proses.machine?.name || "-"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {report.operatorName} (Shift {report.shift})
                </div>
              </div>
              
              <div className="space-y-1 col-span-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Produk
                </span>
                 <div className="text-sm font-medium truncate" title={report.proses.pro.productName}>
                  {report.proses.pro.productName}
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  {report.proses.partNumber || "-"}
                </div>
              </div>

               {/* Dynamic Params Compact */}
               <div className="space-y-1">
                 <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Running Params</span>
                 <div className="text-xs font-mono">
                    {isPaper && (
                       <span>
                         Avg: {(() => {
                           if (!report.startTime || !report.endTime) return "-";
                           const start = new Date(report.startTime).getTime();
                           const end = new Date(report.endTime).getTime();
                           const diffMinutes = (end - start) / (1000 * 60);
                           if (diffMinutes <= 0) return "-";
                           const totalOutput = Number(report.qtyGood||0)+Number(report.qtyPassOn||0)+Number(report.qtyHold||0)+Number(report.qtyWip||0);
                           const speed = totalOutput / diffMinutes;
                           return isFinite(speed) ? `${speed.toFixed(0)}/m` : "-";
                         })()}
                         <span className="text-muted-foreground mx-1">|</span> 
                         Std: {report.stdSpeed ? `${Number(report.stdSpeed)}/m` : "-"}
                       </span>
                    )}
                    {isMoulding && (
                       <span>Cycle: {report.cycleTimeStd ? `${Number(report.cycleTimeStd)}s` : "-"}</span>
                    )}
                 </div>
               </div>
               
               {/* Notes moved here */}
               <div className="space-y-1">
                 <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Catatan</span>
                 <div className="text-xs italic text-muted-foreground truncate" title={report.notes || "Tidak ada catatan"}>
                    {report.notes || "-"}
                 </div>
               </div>
            </div>

            {/* 2. Production Stats Banner */}
            <div className="rounded-lg border bg-card p-3 shadow-sm">
               <div className="grid grid-cols-3 gap-4 divide-x md:grid-cols-6 lg:grid-cols-7">
                  <div className="px-2">
                    <span className="text-[10px] uppercase text-muted-foreground">Waktu</span>
                    <div className="mt-1 font-mono text-sm font-medium">
                      {report.startTime ? format(new Date(report.startTime), "HH:mm") : "-"} - {report.endTime ? format(new Date(report.endTime), "HH:mm") : "-"}
                    </div>
                  </div>
                  <div className="px-2 pl-4">
                    <span className="text-[10px] uppercase text-muted-foreground">Good</span>
                    <div className="mt-1 font-mono text-lg font-bold text-emerald-600">
                      {Number(report.qtyGood || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="px-2 pl-4">
                    <span className="text-[10px] uppercase text-muted-foreground">Reject</span>
                    <div className="mt-1 font-mono text-lg font-bold text-red-600">
                      {Number(report.qtyReject || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="px-2 pl-4">
                    <span className="text-[10px] uppercase text-muted-foreground">WIP</span>
                    <div className="mt-1 font-mono text-lg font-medium">
                      {Number(report.qtyWip || 0).toLocaleString()}
                    </div>
                  </div>
                   <div className="px-2 pl-4">
                    <span className="text-[10px] uppercase text-muted-foreground">Hold</span>
                    <div className="mt-1 font-mono text-lg font-medium">
                      {Number(report.qtyHold || 0).toLocaleString()}
                    </div>
                  </div>
                   <div className="px-2 pl-4">
                    <span className="text-[10px] uppercase text-muted-foreground">Pass On</span>
                    <div className="mt-1 font-mono text-lg font-medium">
                      {Number(report.qtyPassOn || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="col-span-3 mt-2 flex items-center justify-between rounded bg-slate-100 px-3 py-1 dark:bg-slate-800 md:col-span-1 md:mt-0 md:flex-col md:items-start md:justify-center md:border-l-0">
                     <span className="text-[10px] font-bold uppercase text-slate-500">TOTAL OUTPUT</span>
                     <div className="font-mono text-xl font-black text-slate-700 dark:text-slate-200">
                        {(() => {
                          let total = Number(report.qtyGood||0) + Number(report.qtyPassOn||0) + Number(report.qtyHold||0) + Number(report.qtyWip||0);
                          let rejectVal = Number(report.qtyReject||0);
                          if (category !== "PAPER") {
                            const pw = Number((report.metaData as any)?.productWeight);
                            if (pw > 0) rejectVal = Math.round((rejectVal * 1000) / pw);
                          }
                          return (total + rejectVal).toLocaleString();
                        })()}
                     </div>
                  </div>
               </div>
            </div>
        </div>

        {/* SCROLLABLE LOWER SECTION: Tables */}
        <div className="overflow-y-auto p-6 scrollbar-thin bg-muted/5">
            {/* 3. Rejects & Downtime */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                 {/* Rejects */}
                 <div className="flex flex-col gap-3">
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      Rincian Reject
                    </h3>
                    <div className="overflow-hidden rounded-md border bg-card shadow-sm">
                       <Table>
                         <TableHeader>
                           <TableRow className="bg-muted/50 hover:bg-muted/50">
                             <TableHead className="h-9 text-xs font-semibold">Jenis Reject</TableHead>
                             <TableHead className="h-9 text-right text-xs font-semibold">Jumlah</TableHead>
                           </TableRow>
                         </TableHeader>
                         <TableBody>
                            {(() => {
                              const items: { label: string; value: any; unit?: string }[] = [];
                              const breakdown = (report.rejectBreakdown || {}) as any;
                               // Reuse existing reject logic
                               if (category === "PAPER") {
                                  PAPER_REJECT_COLUMNS.forEach((col) => {
                                    const val = breakdown[col];
                                    if (val > 0) items.push({ label: col, value: val });
                                  });
                                } else if (category === "PRINTING") {
                                  PRINTING_REJECT_COLUMNS.forEach((col) => {
                                    const val = breakdown[col];
                                    if (val > 0) items.push({ label: col, value: val });
                                  });
                                } else if (category === "PACKING_ASSEMBLY") {
                                  PACKING_REJECT_SPLIT.flat().forEach((col) => {
                                    const val = breakdown[col];
                                    if (val > 0) items.push({ label: col, value: val });
                                  });
                                } else if (isMoulding) {
                                  INJECTION_REJECT_BB.forEach((col) => {
                                    let val;
                                    if (col === "Gilingan / Purge") val = report.materialPurgeQty;
                                    else if (col === "PT / Runner") val = report.materialRunnerQty;
                                    else val = breakdown[`REJECT:BAHAN_BAKU:${col}`] || breakdown[col];
                                    if (val > 0) items.push({ label: `BB - ${col}`, value: val, unit: "Kg" }); 
                                  });
                                  INJECTION_REJECT_PROD.forEach((col) => {
                                    const val = breakdown[`REJECT:PRODUK:${col}`] || breakdown[col];
                                    if (val > 0) items.push({ label: col, value: val });
                                  });
                                }
                              
                              if (items.length === 0) {
                                return (
                                  <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground text-xs py-8 opacity-50">Tidak ada data reject</TableCell>
                                  </TableRow>
                                )
                              }

                              return items.map((item, idx) => (
                                <TableRow key={idx} className="hover:bg-muted/50">
                                  <TableCell className="py-2.5 text-xs font-medium">{item.label}</TableCell>
                                  <TableCell className="py-2.5 text-right text-xs font-mono font-bold text-red-600">{Number(item.value).toLocaleString()} <span className="text-[10px] text-muted-foreground font-normal ml-0.5">{item.unit}</span></TableCell>
                                </TableRow>
                              ));
                            })()}
                         </TableBody>
                       </Table>
                    </div>
                 </div>

                 {/* Downtime */}
                 <div className="flex flex-col gap-3">
                    <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                       <span className="h-2 w-2 rounded-full bg-amber-500" />
                       Rincian Downtime
                    </h3>
                     <div className="overflow-hidden rounded-md border bg-card shadow-sm">
                       <Table>
                         <TableHeader>
                           <TableRow className="bg-muted/50 hover:bg-muted/50">
                             <TableHead className="h-9 text-xs font-semibold">Keterangan</TableHead>
                             <TableHead className="h-9 text-right text-xs font-semibold">Durasi</TableHead>
                           </TableRow>
                         </TableHeader>
                         <TableBody>
                            {(() => {
                               const breakdown = (report.downtimeBreakdown || {}) as any;
                               const keys = Object.keys(breakdown);
                               const items = keys.map(k => ({ label: k, value: Number(breakdown[k]) })).filter(i => i.value > 0);

                               if (items.length === 0) {
                                  return (
                                    <TableRow>
                                      <TableCell colSpan={2} className="text-center text-muted-foreground text-xs py-8 opacity-50">Tidak ada data downtime</TableCell>
                                    </TableRow>
                                  )
                                }

                               return items.map((item, idx) => (
                                  <TableRow key={idx} className="hover:bg-muted/50">
                                     <TableCell className="py-2.5 text-xs font-medium capitalize truncate max-w-[200px]" title={item.label}>
                                        {item.label.replace('PLANNED:', '').replace('UNPLANNED:', '').replace(/_/g, ' ').toLowerCase()}
                                     </TableCell>
                                     <TableCell className="py-2.5 text-right text-xs font-mono font-bold text-amber-600">{item.value}m</TableCell>
                                  </TableRow>
                               ));
                            })()}
                         </TableBody>
                       </Table>
                     </div>
                 </div>
            </div>
            
        </div>
      </DialogContent>
    </Dialog>
  );
}
