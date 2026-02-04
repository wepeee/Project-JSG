"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import {
  Loader2,
  Download,
  Search,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

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

const PAPER_DOWNTIME_COLUMNS = [
  "Trouble PLN",
  "Trial",
  "Preventive Maintenance",
  "Istirahat",
  "Tunggu Approval",
  "Tunggu Material",
  "Set Up & Change Over",
  "Machine Problem",
  "Mencari Tools",
  "Running In",
  "Operator Issue",
  "Adjustment Process",
  "Lain-lain",
];

export default function ProductionArchive() {
  const [activeCategory, setActiveCategory] = React.useState<"PAPER" | "RIGID">(
    "PAPER",
  );
  const [showRejectDetails, setShowRejectDetails] = React.useState(false);
  const [showDowntimeDetails, setShowDowntimeDetails] = React.useState(false);

  // Fetch APPROVED reports
  const { data: reports, isLoading } = api.verification.getReports.useQuery({
    status: "APPROVED",
    category: activeCategory,
    limit: 100, // Higher limit for list view, maybe implement pagination later
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Daftar Laporan Produksi
          </h2>
          <p className="text-sm text-slate-500">
            Arsip laporan yang telah disetujui.
          </p>
        </div>

        {/* Category Switcher */}
        <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveCategory("PAPER")}
            className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${activeCategory === "PAPER" ? "bg-white shadow dark:bg-slate-700" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"}`}
          >
            PAPER
          </button>
          <button
            onClick={() => setActiveCategory("RIGID")}
            className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${activeCategory === "RIGID" ? "bg-white shadow dark:bg-slate-700" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"}`}
          >
            RIGID
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-slate-900">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
          </div>
        ) : reports?.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Belum ada laporan {activeCategory} yang disetujui.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-slate-800 bg-slate-950">
                <TableRow className="hover:bg-slate-900/50">
                  <TableHead className="w-[120px] text-slate-300">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-slate-300">No. PRO</TableHead>
                  <TableHead className="text-slate-300">Part Number</TableHead>
                  <TableHead className="min-w-[200px] text-slate-300">
                    Produk
                  </TableHead>
                  <TableHead className="text-slate-300">Mesin</TableHead>
                  {activeCategory === "PAPER" && (
                    <>
                      <TableHead className="text-right text-slate-300">
                        Speed
                      </TableHead>
                      <TableHead className="text-right text-slate-300">
                        Std Speed
                      </TableHead>
                    </>
                  )}
                  <TableHead className="text-slate-300">Shift</TableHead>
                  <TableHead className="text-slate-300">Operator</TableHead>
                  <TableHead className="text-slate-300">Mulai</TableHead>
                  <TableHead className="text-slate-300">Selesai</TableHead>
                  <TableHead className="text-right text-slate-300">
                    Pass On
                  </TableHead>
                  <TableHead className="text-right text-slate-300">
                    Hold
                  </TableHead>
                  <TableHead className="text-right text-slate-300">
                    WIP
                  </TableHead>
                  <TableHead className="text-right text-slate-300">
                    <div className="flex items-center justify-end gap-1">
                      <span>Reject</span>
                      {activeCategory === "PAPER" && (
                        <button
                          onClick={() =>
                            setShowRejectDetails(!showRejectDetails)
                          }
                          className="rounded p-0.5 hover:bg-slate-800"
                        >
                          {showRejectDetails ? (
                            <ChevronLeft className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </TableHead>
                  {activeCategory === "PAPER" &&
                    showRejectDetails &&
                    PAPER_REJECT_COLUMNS.map((col) => (
                      <TableHead
                        key={col}
                        className="text-right text-xs whitespace-nowrap text-slate-300"
                      >
                        {col}
                      </TableHead>
                    ))}
                  <TableHead className="text-right text-slate-300">
                    Total Output
                  </TableHead>
                  <TableHead className="text-right text-slate-300">
                    <div className="flex items-center justify-end gap-1">
                      <span>Downtime</span>
                      {activeCategory === "PAPER" && (
                        <button
                          onClick={() =>
                            setShowDowntimeDetails(!showDowntimeDetails)
                          }
                          className="rounded p-0.5 hover:bg-slate-800"
                        >
                          {showDowntimeDetails ? (
                            <ChevronLeft className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </TableHead>
                  {activeCategory === "PAPER" &&
                    showDowntimeDetails &&
                    PAPER_DOWNTIME_COLUMNS.map((col) => (
                      <TableHead
                        key={col}
                        className="text-right text-xs whitespace-nowrap text-slate-300"
                      >
                        {col}
                      </TableHead>
                    ))}
                  {activeCategory === "RIGID" && (
                    <>
                      <TableHead className="text-right text-slate-300">
                        MP
                      </TableHead>
                      <TableHead className="text-right text-slate-300">
                        CT
                      </TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports?.map((rpt) => (
                  <TableRow
                    key={rpt.id}
                    className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50"
                  >
                    <TableCell className="text-xs font-medium">
                      <div>
                        {format(new Date(rpt.reportDate), "dd MMM yyyy")}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        by {rpt.checkedBy?.username || "Admin"}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold">
                      {rpt.step.pro.proNumber}
                    </TableCell>
                    <TableCell className="text-xs">
                      {rpt.step.partNumber || "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="line-clamp-2 font-semibold">
                        {rpt.step.pro.productName}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {rpt.step.machine?.name}
                    </TableCell>
                    {activeCategory === "PAPER" && (
                      <TableCell className="text-right font-mono text-xs text-slate-500">
                        {(() => {
                          if (!rpt.startTime || !rpt.endTime) return "-";

                          const start = new Date(rpt.startTime).getTime();
                          const end = new Date(rpt.endTime).getTime();
                          const diffMinutes = (end - start) / (1000 * 60);

                          if (diffMinutes <= 0) return "0";

                          // Total Output = Good + PassOn + Wip + Hold
                          const totalOutput =
                            Number(rpt.qtyGood || 0) +
                            Number(rpt.qtyPassOn || 0) +
                            Number(rpt.qtyWip || 0) +
                            Number(rpt.qtyHold || 0);

                          const speed = totalOutput / diffMinutes;
                          return isFinite(speed)
                            ? `${speed.toFixed(0)}/m`
                            : "-";
                        })()}
                      </TableCell>
                    )}
                    {activeCategory === "PAPER" && (
                      <TableCell className="text-right text-xs text-slate-500">
                        {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                          (rpt as any).stdSpeed
                            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                              `${Math.round((rpt as any).stdSpeed as number)}/m`
                            : "-"
                        }
                      </TableCell>
                    )}
                    <TableCell className="text-center text-xs font-bold">
                      {rpt.shift}
                    </TableCell>
                    <TableCell className="text-xs">
                      {rpt.operatorName}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-slate-500">
                      {rpt.startTime
                        ? format(new Date(rpt.startTime), "dd MMM HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-slate-500">
                      {rpt.endTime
                        ? format(new Date(rpt.endTime), "dd MMM HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold text-green-600">
                      {(
                        Number(rpt.qtyGood) + Number(rpt.qtyPassOn)
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400">
                      {Number(rpt.qtyHold) > 0
                        ? Number(rpt.qtyHold).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400">
                      {Number(rpt.qtyWip) > 0
                        ? Number(rpt.qtyWip).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold text-red-600">
                      {Number(rpt.qtyReject) > 0
                        ? Number(rpt.qtyReject).toLocaleString()
                        : "-"}
                    </TableCell>
                    {activeCategory === "PAPER" &&
                      showRejectDetails &&
                      PAPER_REJECT_COLUMNS.map((col) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        const val = (rpt.rejectBreakdown as any)?.[col];
                        return (
                          <TableCell
                            key={col}
                            className="text-right text-xs text-slate-500"
                          >
                            {val ? Number(val).toLocaleString() : "-"}
                          </TableCell>
                        );
                      })}
                    <TableCell className="text-right text-xs font-black text-slate-800 dark:text-slate-100">
                      {(
                        Number(rpt.qtyGood) +
                        Number(rpt.qtyPassOn) +
                        Number(rpt.qtyHold) +
                        Number(rpt.qtyWip)
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold text-amber-600">
                      {rpt.totalDowntime > 0 ? `${rpt.totalDowntime}m` : "-"}
                    </TableCell>
                    {activeCategory === "PAPER" &&
                      showDowntimeDetails &&
                      PAPER_DOWNTIME_COLUMNS.map((col) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        const val = (rpt.downtimeBreakdown as any)?.[col];
                        return (
                          <TableCell
                            key={col}
                            className="text-right text-xs text-slate-500"
                          >
                            {val ? `${val}m` : "-"}
                          </TableCell>
                        );
                      })}
                    {activeCategory === "RIGID" && (
                      <>
                        <TableCell className="text-right text-xs">
                          {rpt.manPowerAct ?? "-"}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {rpt.cycleTimeAct?.toString() ?? "-"}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
