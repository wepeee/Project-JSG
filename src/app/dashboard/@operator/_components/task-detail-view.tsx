"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Info, History } from "lucide-react";
import { ProductionReportModal } from "./production-report-modal";
import { api } from "~/trpc/react";
import { format } from "date-fns";

interface TaskDetailViewProps {
  task: any;
  onBack: () => void;
}

export function TaskDetailView({ task, onBack }: TaskDetailViewProps) {
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [hasDraft, setHasDraft] = React.useState(false);
  const [editReport, setEditReport] = React.useState<any>(null);

  // Check for draft
  const draftKey = `pro_report_v2_${task.step.id}`;

  const checkDraft = React.useCallback(() => {
    const saved = localStorage.getItem(draftKey);
    setHasDraft(!!saved);
  }, [draftKey]);

  React.useEffect(() => {
    checkDraft();
    // Listen for storage events (if draft is cleared elsewhere)
    window.addEventListener("storage", checkDraft);
    // Custom event for when modal saves/clears draft
    window.addEventListener("draft-update", checkDraft);

    return () => {
      window.removeEventListener("storage", checkDraft);
      window.removeEventListener("draft-update", checkDraft);
    };
  }, [checkDraft]); // Re-check when modal closes

  // Fetch real reports
  const { data: reports } = api.production.getHistory.useQuery({
    proStepId: task.step.id,
    limit: 50,
  });

  const totalGood = React.useMemo(() => {
    if (!reports) return 0;
    return reports.reduce(
      (acc, curr) => acc + Number(curr.qtyGood) + Number(curr.qtyPassOn),
      0,
    );
  }, [reports]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950/50">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/20 bg-white/70 px-4 pt-5 pb-4 shadow-sm backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/70">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="-ml-2 h-9 w-9 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg leading-tight font-black">
              Laporan Produksi
            </h1>
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              {task.pro.proNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-4">
        {/* Task Info Card */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-1 text-xl font-black">{task.pro.productName}</h2>
          <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
            <span className="font-bold">{task.step.machine?.name}</span>
            <span>•</span>
            <span className="font-bold">{task.pro.process?.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
              <div className="text-muted-foreground mb-1 text-[9px] font-bold tracking-widest uppercase">
                Target
              </div>
              <div className="text-lg font-black">
                {task.pro.qtyPoPcs.toLocaleString("id-ID")}
              </div>
            </div>
            <div className="rounded-2xl bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="mb-1 text-[9px] font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                Total Good
              </div>
              <div className="text-lg font-black text-blue-700 dark:text-blue-300">
                {totalGood.toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => {
            setEditReport(null);
            setShowAddModal(true);
          }}
          className="h-14 w-full rounded-2xl bg-blue-600 text-base font-black text-white shadow-lg shadow-blue-200/50 hover:bg-blue-700 dark:shadow-none"
        >
          + Tambah Laporan Baru
        </Button>

        {/* Reports List */}
        <div>
          <h3 className="text-muted-foreground mb-3 flex items-center gap-2 px-1 text-xs font-bold tracking-widest uppercase">
            <History className="h-3 w-3" /> Riwayat Laporan
          </h3>

          <div className="space-y-3">
            {/* DRAFT CARD */}
            {hasDraft && (
              <div
                onClick={() => {
                  setEditReport(null);
                  setShowAddModal(true);
                }}
                className="group cursor-pointer rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-4 transition-colors hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/30 dark:hover:bg-amber-900/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400">
                      <span className="text-xs font-black">!</span>
                    </div>
                    <div>
                      <div className="font-bold text-amber-700 dark:text-amber-400">
                        Draft Belum Disimpan
                      </div>
                      <div className="text-[10px] text-amber-600/70">
                        Klik untuk melanjutkan pengisian...
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-amber-600 hover:bg-amber-200 hover:text-amber-800"
                  >
                    Lanjut &rarr;
                  </Button>
                </div>
              </div>
            )}

            {reports?.map((rpt) => (
              <div
                key={rpt.id}
                className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 dark:bg-slate-900 ${
                  rpt.status === "REJECTED"
                    ? "border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/10"
                    : "border-slate-100 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-muted-foreground mb-1 flex items-center gap-1 text-[10px] font-bold uppercase">
                      <span>{rpt.operatorName}</span>
                      <span className="opacity-50">•</span>
                      <span>
                        {format(rpt.reportDate, "HH:mm") !== "00:00"
                          ? format(rpt.reportDate, "HH:mm")
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
                      "
                      {rpt.rejectionNote ||
                        "Mohon perbaiki data sesuai arahan."}
                      "
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

            {!hasDraft && reports?.length === 0 && (
              <div className="text-muted-foreground py-8 text-center text-sm italic">
                Belum ada laporan masuk.
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductionReportModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        task={task}
        onDraftChange={checkDraft}
        editReport={editReport}
      />
    </div>
  );
}
