"use client";

import { Card, CardContent } from "~/components/ui/card";
import {
  History,
  Search,
  HardDrive,
  Package,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ProductionReportModal } from "./production-report-modal";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function HistoryList() {
  const { data: session } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editReport, setEditReport] = useState<any>(null);

  // Get all production reports (not filtered by user)
  const {
    data: history,
    isLoading,
    refetch,
  } = api.production.getHistory.useQuery(
    {
      // Don't filter by createdById to show all reports
      // This allows operators to see all production reports
    },
    {
      enabled: !!session?.user?.id,
    },
  );

  // Debug logging
  useEffect(() => {
    if (history) {
      console.log("📊 History data:", history);
      console.log("👤 Current user ID:", session?.user?.id);
    }
  }, [history, session?.user?.id]);

  // Construct task object for modal when editing
  const getTaskFromReport = (report: any) => {
    return {
      pro: report.step.pro,
      step: report.step,
      shift: report.shift,
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 dark:bg-slate-950/50">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/20 bg-white/70 p-5 shadow-sm backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/70">
        <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-black tracking-tight text-transparent">
          Riwayat Laporan
        </h1>

        {/* Search/Filter Placeholder */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari mesin atau produk..."
            className="h-11 w-full rounded-2xl border-none bg-slate-100 pr-4 pl-10 text-sm font-medium transition-all focus:ring-2 focus:ring-blue-500 dark:bg-slate-800"
            disabled // todo: implement filters
          />
        </div>
      </div>

      {!isLoading && (!history || history.length === 0) && (
        <div className="text-muted-foreground/50 flex flex-col items-center justify-center p-4 py-32">
          <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-900">
            <History className="h-12 w-12 opacity-20" />
          </div>
          <p className="text-sm font-bold tracking-widest uppercase">
            Belum Ada Riwayat
          </p>
          <p className="mt-1 text-xs">
            Laporan produksi yang disimpan akan muncul di sini.
          </p>
        </div>
      )}

      {/* Real Data Cards - Styled like TaskDetailView */}
      <div className="space-y-4 px-4 py-4">
        {history?.map((rpt) => (
          <div
            key={rpt.id}
            className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 dark:bg-slate-900 ${
              rpt.status === "REJECTED"
                ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/10"
                : "border-slate-100 dark:border-slate-800"
            }`}
          >
            {/* Context Info (Only needed in general list) */}
            <div className="mb-2 flex items-center gap-2 border-b border-dashed border-slate-200 pb-2 dark:border-slate-800">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {rpt.step.pro.proNumber}
              </span>
              <span className="line-clamp-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                {rpt.step.pro.productName}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-1 text-[10px] font-bold uppercase">
                  <span>{rpt.operatorName}</span>
                  <span className="opacity-50">•</span>
                  <span>
                    {format(new Date(rpt.reportDate), "dd MMM")},{" "}
                    {format(new Date(rpt.reportDate), "HH:mm") !== "00:00"
                      ? format(new Date(rpt.reportDate), "HH:mm")
                      : "Shift " + rpt.shift}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded bg-green-100 px-2 py-0.5 text-xs font-black text-green-700">
                    Good:{" "}
                    {(
                      Number(rpt.qtyGood) + Number(rpt.qtyPassOn)
                    ).toLocaleString()}
                  </div>
                  {Number(rpt.qtyReject) > 0 && (
                    <div className="rounded bg-red-100 px-2 py-0.5 text-xs font-black text-red-700">
                      Reject: {Number(rpt.qtyReject)}
                    </div>
                  )}
                  {rpt.totalDowntime > 0 && (
                    <div className="rounded bg-amber-100 px-2 py-0.5 text-xs font-black text-amber-700">
                      Down: {rpt.totalDowntime}m
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex flex-col items-end gap-2">
                {rpt.status === "APPROVED" && (
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Disetujui
                  </span>
                )}
                {rpt.status === "PENDING" && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-bold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                    Menunggu
                  </span>
                )}
                {rpt.status === "REJECTED" && (
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      Ditolak
                    </span>
                  </div>
                )}
              </div>
            </div>

            {rpt.notes && (
              <div className="text-muted-foreground text-xs italic">
                "{rpt.notes}"
              </div>
            )}

            {/* Rejection Details & Action */}
            {rpt.status === "REJECTED" && (
              <div className="mt-2 rounded-xl border border-red-200 bg-red-100/50 p-3 dark:border-red-900/30 dark:bg-red-950/20">
                <p className="mb-2 text-xs font-bold text-red-600 dark:text-red-400">
                  Catatan Revisi:
                </p>
                <p className="mb-3 text-sm text-red-800 dark:text-red-300">
                  "{rpt.rejectionNote || "Mohon perbaiki data sesuai arahan."}"
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditReport(rpt);
                    setShowAddModal(true);
                  }}
                  className="w-full bg-red-600 font-bold text-white hover:bg-red-700"
                >
                  Revisi Laporan
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editReport && (
        <ProductionReportModal
          open={showAddModal}
          onOpenChange={(v) => {
            setShowAddModal(v);
            if (!v) {
              setEditReport(null);
              refetch();
            }
          }}
          task={getTaskFromReport(editReport)}
          editReport={editReport}
          // onDraftChange={checkDraft} // No draft context here ideally, or implement if needed
        />
      )}
    </div>
  );
}
