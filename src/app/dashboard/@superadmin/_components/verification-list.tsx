"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { format } from "date-fns";
import { Check, X, Eye, Loader2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";

type ReportStatus = "PENDING" | "APPROVED" | "REJECTED";

export default function VerificationList() {
  const [activeCategory, setActiveCategory] = React.useState<"PAPER" | "RIGID">(
    "PAPER",
  );
  const [activeTab, setActiveTab] = React.useState<ReportStatus>("PENDING");
  const [rejectId, setRejectId] = React.useState<string | null>(null);
  const [rejectNote, setRejectNote] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const utils = api.useUtils();

  const { data: reports, isLoading } = api.verification.getReports.useQuery({
    status: activeTab,
    category: activeCategory,
    limit: 50,
  });

  const approveMutation = api.verification.approveReport.useMutation({
    onSuccess: () => {
      utils.verification.getReports.invalidate();
    },
  });

  const rejectMutation = api.verification.rejectReport.useMutation({
    onSuccess: () => {
      utils.verification.getReports.invalidate();
      setRejectId(null);
      setRejectNote("");
    },
  });

  const handleApprove = (id: string) => {
    if (confirm("Setujui laporan ini?")) {
      approveMutation.mutate({ id });
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectId || !rejectNote.trim()) return;
    rejectMutation.mutate({ id: rejectId, note: rejectNote });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Verifikasi Laporan</h2>

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

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as ReportStatus)}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="PENDING" className="gap-2">
            Perlu Verifikasi
            {activeTab === "PENDING" && reports?.length ? (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-600">
                {reports.length}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="APPROVED">Disetujui</TabsTrigger>
          <TabsTrigger value="REJECTED">Ditolak</TabsTrigger>
        </TabsList>

        <div className="grid gap-4">
          {isLoading && (
            <div className="py-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-400" />
            </div>
          )}

          {!isLoading && reports?.length === 0 && (
            <div className="rounded-xl border border-dashed py-12 text-center text-sm text-slate-500">
              Tidak ada laporan{" "}
              {activeTab === "PENDING" ? "baru" : "pada status ini"}.
            </div>
          )}

          {reports?.map((rpt) => (
            <div
              key={rpt.id}
              className="group flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-blue-200 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold tracking-wider text-slate-600 uppercase">
                      {rpt.step.pro.proNumber}
                    </span>
                    <span className="text-sm font-bold">
                      {rpt.step.pro.productName}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Operator: {rpt.operatorName}
                    </span>
                    <span>•</span>
                    <span>{rpt.step.machine?.name}</span>
                    <span>•</span>
                    <span>Shift {rpt.shift}</span>
                    <span>•</span>
                    <span>
                      {format(new Date(rpt.reportDate), "dd MMM yyyy")}
                    </span>
                  </div>
                </div>

                {activeTab === "PENDING" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 text-green-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                      onClick={() => handleApprove(rpt.id)}
                      disabled={approveMutation.isPending}
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 gap-1 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        setRejectId(rpt.id);
                        setRejectNote("");
                      }}
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
                {activeTab === "APPROVED" && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-700">
                      <Check className="h-3 w-3" /> Disetujui
                    </span>
                    <div className="text-[10px] text-slate-400">
                      by {rpt.checkedBy?.username || "Admin"}
                    </div>
                  </div>
                )}
                {activeTab === "REJECTED" && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                      <X className="h-3 w-3" /> Ditolak
                    </span>
                    <div className="text-[10px] text-slate-400">
                      by {rpt.checkedBy?.username || "Admin"}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-2 rounded-lg bg-slate-50 p-3 text-xs dark:bg-slate-950/50">
                <div className="col-span-2">
                  <div className="font-semibold text-slate-500">
                    Pass On / Good
                  </div>
                  <div className="text-lg font-bold text-slate-700 dark:text-slate-200">
                    {(
                      Number(rpt.qtyGood) + Number(rpt.qtyPassOn)
                    ).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-red-500">Reject</span>
                  <div className="text-lg font-bold text-red-600">
                    {Number(rpt.qtyReject).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-500">Downtime</div>
                  <div className="text-lg font-bold text-slate-700 dark:text-slate-200">
                    {rpt.totalDowntime}m
                  </div>
                </div>
              </div>

              {/* Notes Display */}
              {rpt.notes && (
                <div className="rounded-lg border border-yellow-100 bg-yellow-50/50 p-2.5 text-xs text-yellow-800 dark:border-yellow-900/20 dark:bg-yellow-900/10 dark:text-yellow-200">
                  <span className="font-bold">Catatan Op:</span> "{rpt.notes}"
                </div>
              )}

              {/* Rejection Note Display */}
              {rpt.status === "REJECTED" && rpt.rejectionNote && (
                <div className="rounded-lg border border-red-100 bg-red-50/50 p-2.5 text-xs text-red-800 dark:border-red-900/20 dark:bg-red-900/10 dark:text-red-200">
                  <span className="font-bold">Alasan Penolakan:</span> "
                  {rpt.rejectionNote}"
                </div>
              )}

              {/* View Detail Button */}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-slate-400"
                onClick={() =>
                  setExpandedId(expandedId === rpt.id ? null : rpt.id)
                }
              >
                {expandedId === rpt.id
                  ? "Sembunyikan Detail"
                  : "Lihat Detail Lengkap"}
              </Button>

              {expandedId === rpt.id && (
                <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4 text-xs dark:bg-slate-950/30">
                  <div className="space-y-1">
                    <div className="font-bold text-slate-700 dark:text-slate-300">
                      Waktu
                    </div>
                    <div>
                      Start:{" "}
                      {rpt.startTime
                        ? format(new Date(rpt.startTime), "HH:mm")
                        : "-"}
                    </div>
                    <div>
                      End:{" "}
                      {rpt.endTime
                        ? format(new Date(rpt.endTime), "HH:mm")
                        : "-"}
                    </div>
                  </div>

                  {activeCategory === "RIGID" && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-700 dark:text-slate-300">
                        Resources
                      </div>
                      <div>
                        MP: {rpt.manPowerAct ?? "-"} (Std:{" "}
                        {rpt.manPowerStd ?? "-"})
                      </div>
                      <div>
                        CT: {rpt.cycleTimeAct?.toString() ?? "-"}s (Std:{" "}
                        {rpt.cycleTimeStd?.toString() ?? "-"}s)
                      </div>
                      <div>
                        Cavity: {rpt.cavityAct ?? "-"} (Std:{" "}
                        {rpt.cavityStd ?? "-"})
                      </div>
                    </div>
                  )}

                  {activeCategory === "RIGID" && (
                    <div className="space-y-1">
                      <div className="font-bold text-slate-700 dark:text-slate-300">
                        Material
                      </div>
                      <div>
                        Input: {rpt.inputMaterialQty?.toString() ?? "-"}
                      </div>
                      <div>
                        Runner: {rpt.materialRunnerQty?.toString() ?? "-"}
                      </div>
                      <div>
                        Purge: {rpt.materialPurgeQty?.toString() ?? "-"}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="font-bold text-slate-700 dark:text-slate-300">
                      Output Lain
                    </div>
                    <div>WIP: {rpt.qtyWip?.toString() ?? "-"}</div>
                    <div>Hold: {rpt.qtyHold?.toString() ?? "-"}</div>
                  </div>

                  {/* Breakdown - Only show if has data */}
                  {rpt.rejectBreakdown &&
                    Object.keys(rpt.rejectBreakdown as object).length > 0 && (
                      <div className="col-span-2 space-y-1 border-t pt-2">
                        <div className="font-bold text-red-600">
                          Rincian Reject
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {Object.entries(
                            rpt.rejectBreakdown as Record<string, number>,
                          ).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span>{k}</span>
                              <span className="font-mono font-bold">{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {rpt.downtimeBreakdown &&
                    Object.keys(rpt.downtimeBreakdown as object).length > 0 && (
                      <div className="col-span-2 space-y-1 border-t pt-2">
                        <div className="font-bold text-slate-600">
                          Rincian Downtime
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                          {Object.entries(
                            rpt.downtimeBreakdown as Record<string, number>,
                          ).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span>{k}</span>
                              <span className="font-mono font-bold">{v}m</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={!!rejectId} onOpenChange={(o) => !o && setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Laporan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>
                Laporan akan dikembalikan ke status <strong>REJECTED</strong>.
                Operator wajib memperbaiki data dan mengirim ulang.
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Catatan Revisi (Wajib)
              </label>
              <Textarea
                id="note"
                placeholder="Contoh: Jumlah reject tidak sesuai dengan fisik..."
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectId(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectNote.trim() || rejectMutation.isPending}
              onClick={handleRejectSubmit}
            >
              {rejectMutation.isPending ? "Memproses..." : "Tolak Laporan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
