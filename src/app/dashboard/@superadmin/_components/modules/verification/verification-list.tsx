"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { format } from "date-fns";
import {
  Check,
  X,
  Eye,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { useAppAlert } from "~/components/ui/app-alert";

type ReportStatus = "PENDING" | "APPROVED" | "REJECTED";

export default function VerificationList({
  userDepartment,
}: {
  userDepartment?: string;
}) {
  const [activeCategory, setActiveCategory] = React.useState<
    "PAPER" | "INJECTION" | "BLOW_MOULDING" | "PRINTING" | "PACKING_ASSEMBLY"
  >(() => {
    if (userDepartment === "RIGID") return "INJECTION";
    return "PAPER";
  });
  const [activeTab, setActiveTab] = React.useState<ReportStatus>("PENDING");
  const [rejectId, setRejectId] = React.useState<string | null>(null);
  const [rejectNote, setRejectNote] = React.useState("");
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const { showAlert, showConfirm } = useAppAlert();

  // Collapsed PROs state
  const [collapsedPros, setCollapsedPros] = React.useState<Set<string>>(
    new Set(),
  );

  const togglePro = (proId: string) => {
    setCollapsedPros((prev) => {
      const next = new Set(prev);
      if (next.has(proId)) {
        next.delete(proId);
      } else {
        next.add(proId);
      }
      return next;
    });
  };

  const utils = api.useUtils();

  // Auto-recover from "RIGID" state (HMR legacy)
  React.useEffect(() => {
    if (activeCategory === ("RIGID" as any)) {
      setActiveCategory("INJECTION");
    }
  }, [activeCategory]);

  const safeCategory =
    activeCategory === ("RIGID" as any) ? "INJECTION" : activeCategory;

  const { data: reports, isLoading } = api.verification.getReports.useQuery({
    status: activeTab,
    category: safeCategory,
    limit: 50,
  });

  const rigidSubCategories = [
    { id: "INJECTION", label: "INJECTION" },
    { id: "BLOW_MOULDING", label: "BLOW MOLD" },
    { id: "PRINTING", label: "PRINTING" },
    { id: "PACKING_ASSEMBLY", label: "PACKING" },
  ] as const;

  const isRigidActive = activeCategory !== "PAPER";

  const approveMutation = api.verification.approveReport.useMutation({
    onSuccess: () => {
      utils.verification.getReports.invalidate();
      // Auto-refresh WIP Monitor & Matrix after inventory changes
      utils.inventory.invalidate();
    },
    onError: (error) => {
      void showAlert({
        title: "Gagal Menyetujui Laporan",
        message: error.message,
        variant: "error",
      });
    },
  });

  const rejectMutation = api.verification.rejectReport.useMutation({
    onSuccess: () => {
      utils.verification.getReports.invalidate();
      setRejectId(null);
      setRejectNote("");
    },
  });

  const handleApprove = async (id: string) => {
    const ok = await showConfirm({
      title: "Setujui Laporan?",
      message: "Laporan akan disetujui dan inventory akan diperbarui. Tindakan ini tidak dapat dibatalkan.",
      variant: "success",
      confirmLabel: "Ya, Setujui",
    });
    if (ok) {
      approveMutation.mutate({ id });
    }
  };

  const handleRejectSubmit = () => {
    if (!rejectId || !rejectNote.trim()) return;
    rejectMutation.mutate({ id: rejectId, note: rejectNote });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <h2 className="text-xl font-bold tracking-tight">Verifikasi Laporan</h2>

        {/* Category Switcher */}
        <div className="flex flex-col items-end gap-2">
          {/* Main Level */}
          {!userDepartment && (
            <div className="bg-muted flex rounded-lg p-1">
              <button
                onClick={() => setActiveCategory("PAPER")}
                className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                  !isRigidActive
                    ? "bg-background text-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                PAPER
              </button>
              <button
                onClick={() => {
                  if (!isRigidActive) setActiveCategory("INJECTION");
                }}
                className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                  isRigidActive
                    ? "bg-background text-foreground shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                RIGID
              </button>
            </div>
          )}

          {/* Sub Level for Rigid */}
          {isRigidActive && (
            <div className="no-scrollbar bg-muted flex overflow-x-auto rounded-lg p-1">
              {rigidSubCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-md px-3 py-1 text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-background text-foreground shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
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
              <span className="bg-destructive/10 text-destructive flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
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
            <div className="border-border text-muted-foreground rounded-xl border border-dashed py-12 text-center text-sm">
              Tidak ada laporan{" "}
              {activeTab === "PENDING" ? "baru" : "pada status ini"}.
            </div>
          )}

          {Object.values(
            (reports || []).reduce(
              (acc, rpt) => {
                const proId = rpt.proses.pro.id;
                const prosesId = rpt.proses.id;

                if (!acc[proId]) {
                  acc[proId] = {
                    pro: rpt.proses.pro,
                    processes: {},
                  };
                }

                if (!acc[proId]!.processes[prosesId]) {
                  acc[proId]!.processes[prosesId] = {
                    process: rpt.proses,
                    reports: [],
                  };
                }

                acc[proId]!.processes[prosesId]!.reports.push(rpt);
                return acc;
              },
              {} as Record<
                string,
                {
                  pro: any;
                  processes: Record<string, { process: any; reports: any[] }>;
                }
              >,
            ),
          ).map((group) => {
            const proId = group.pro.id;
            const isCollapsed = collapsedPros.has(proId);

            // Calculate total reports for this PRO
            const totalReports = Object.values(group.processes).reduce(
              (sum, p) => sum + p.reports.length,
              0,
            );

            return (
              <div
                key={proId}
                className="border-border bg-card overflow-hidden rounded-xl border shadow-sm"
              >
                {/* PRO Header */}
                <div
                  role="button"
                  onClick={() => togglePro(proId)}
                  className="border-border bg-muted/20 hover:bg-muted/50 cursor-pointer border-b px-4 py-3 transition-colors select-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground h-6 w-6 shrink-0"
                      >
                        {isCollapsed ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </Button>
                      <span className="bg-primary/10 text-primary rounded px-2.5 py-1 text-xs font-bold tracking-wider uppercase">
                        {group.pro.proNumber}
                      </span>
                      <span className="text-foreground text-sm font-bold">
                        {group.pro.productName}
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-4 text-xs">
                      <div>Qty PO: {group.pro.qtyPoPcs}</div>
                      <div className="font-semibold">
                        {totalReports} Laporan
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reports List - Grouped by Process */}
                {!isCollapsed && (
                  <div className="flex flex-col gap-6 p-4">
                    {Object.values(group.processes)
                      .sort((a, b) => a.process.orderNo - b.process.orderNo)
                      .map((procGroup) => (
                        <div key={procGroup.process.id} className="space-y-3">
                          {/* Process Header */}
                          <div className="border-border bg-muted/30 text-foreground flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-bold">
                            <span className="bg-background flex h-5 w-5 items-center justify-center rounded-full text-[10px] shadow-sm">
                              {procGroup.process.orderNo}
                            </span>
                            <span>
                              {procGroup.process.machine?.name ??
                                "Mesin Tidak Dikenal"}
                            </span>
                            <span className="text-muted-foreground ml-auto text-[10px] font-normal">
                              {procGroup.reports.length} Laporan
                            </span>
                          </div>

                          {/* Reports Grid */}
                          <div className="flex flex-col gap-3 pl-2 sm:pl-4">
                            {procGroup.reports
                              .sort(
                                (a, b) =>
                                  new Date(a.createdAt).getTime() -
                                  new Date(b.createdAt).getTime(),
                              )
                              .map((rpt) => (
                                <div
                                  key={rpt.id}
                                  className="group border-border bg-card hover:border-primary/50 flex flex-col gap-4 rounded-xl border p-4 shadow-sm transition-all"
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      {/* Operator & Shift */}
                                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                        <span className="text-foreground font-semibold">
                                          {rpt.operatorName}
                                        </span>
                                        <span>•</span>
                                        <span>Shift {rpt.shift}</span>
                                        <span>•</span>
                                        <span>
                                          {format(
                                            new Date(rpt.reportDate),
                                            "dd MMM yyyy",
                                          )}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {activeTab === "PENDING" && (
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="h-8 gap-1 text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
                                          onClick={() => handleApprove(rpt.id)}
                                          disabled={approveMutation.isPending}
                                        >
                                          <Check className="h-4 w-4" />
                                          Approve
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-destructive hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive h-8 gap-1"
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
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                          <Check className="h-3 w-3" />{" "}
                                          Disetujui
                                        </span>
                                        <div className="text-muted-foreground text-[10px]">
                                          by{" "}
                                          {rpt.checkedBy?.username || "Admin"}
                                        </div>
                                      </div>
                                    )}
                                    {activeTab === "REJECTED" && (
                                      <div className="flex flex-col items-end gap-1">
                                        <span className="bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold">
                                          <X className="h-3 w-3" /> Ditolak
                                        </span>
                                        <div className="text-muted-foreground text-[10px]">
                                          by{" "}
                                          {rpt.checkedBy?.username || "Admin"}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Stats Grid */}
                                  <div className="bg-muted/30 grid grid-cols-4 gap-2 rounded-lg p-3 text-xs">
                                    <div
                                      className={
                                        rpt.reportType === "PAPER" ||
                                        Number(rpt.qtyWip) > 0
                                          ? "col-span-1"
                                          : "col-span-2"
                                      }
                                    >
                                      <div className="text-muted-foreground font-semibold">
                                        {rpt.reportType === "PAPER"
                                          ? "Pass On / FG"
                                          : "Pass On / Good"}
                                      </div>
                                      <div className="text-foreground text-lg font-bold">
                                        {Number(rpt.qtyPassOn).toLocaleString(
                                          "id-ID",
                                        )}
                                        <span className="text-muted-foreground ml-1 text-xs font-normal">
                                          {rpt.reportType === "PAPER"
                                            ? "(Pcs)"
                                            : ""}
                                        </span>
                                      </div>
                                    </div>

                                    {(rpt.reportType === "PAPER" ||
                                      Number(rpt.qtyWip) > 0) && (
                                      <div className="col-span-1">
                                        <div className="font-semibold text-blue-600 dark:text-blue-400">
                                          WIP (Current)
                                        </div>
                                        <div className="text-lg font-bold text-blue-700 dark:text-blue-500">
                                          {Number(rpt.qtyWip).toLocaleString(
                                            "id-ID",
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    <div className="col-span-1">
                                      <span className="text-destructive font-semibold">
                                        Reject
                                      </span>
                                      <div className="text-destructive text-lg font-bold">
                                        {Number(rpt.qtyReject).toLocaleString(
                                          "id-ID",
                                        )}{" "}
                                        <span className="text-muted-foreground text-xs font-normal">
                                          {rpt.reportType !== "PAPER"
                                            ? "Gram"
                                            : "Pcs"}
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground font-semibold">
                                        Downtime
                                      </div>
                                      <div className="text-foreground text-lg font-bold">
                                        {(() => {
                                          let calculatedTotal = 0;
                                          const hasBreakdown =
                                            rpt.downtimeBreakdown &&
                                            Object.keys(
                                              rpt.downtimeBreakdown as object,
                                            ).length > 0;

                                          if (hasBreakdown) {
                                            const values = Object.values(
                                              rpt.downtimeBreakdown as Record<
                                                string,
                                                number
                                              >,
                                            );
                                            const sum = values.reduce(
                                              (acc, val) =>
                                                acc + Number(val || 0),
                                              0,
                                            );

                                            if (rpt.reportType !== "PAPER") {
                                              calculatedTotal = sum;
                                            } else {
                                              calculatedTotal = sum / 60;
                                            }
                                          } else {
                                            calculatedTotal =
                                              Number(rpt.totalDowntime || 0) /
                                              60;
                                          }

                                          return calculatedTotal.toLocaleString(
                                            "id-ID",
                                            {
                                              maximumFractionDigits: 2,
                                            },
                                          );
                                        })()}{" "}
                                        Jam
                                      </div>
                                    </div>
                                  </div>

                                  {/* Notes & Detail Toggle */}
                                  {rpt.notes && (
                                    <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2.5 text-xs text-amber-600 dark:text-amber-400">
                                      <span className="font-bold">
                                        Catatan Op:
                                      </span>{" "}
                                      "{rpt.notes}"
                                    </div>
                                  )}

                                  {rpt.status === "REJECTED" &&
                                    rpt.rejectionNote && (
                                      <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border p-2.5 text-xs">
                                        <span className="font-bold">
                                          Alasan Penolakan:
                                        </span>{" "}
                                        "{rpt.rejectionNote}"
                                      </div>
                                    )}

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground w-full text-xs"
                                    onClick={() =>
                                      setExpandedId(
                                        expandedId === rpt.id ? null : rpt.id,
                                      )
                                    }
                                  >
                                    {expandedId === rpt.id
                                      ? "Sembunyikan Detail"
                                      : "Lihat Detail Lengkap"}
                                  </Button>

                                  {/* Expanded Details */}
                                  {expandedId === rpt.id && (
                                    <div className="bg-muted/30 grid grid-cols-2 gap-4 rounded-lg p-4 text-xs">
                                      <div className="space-y-1">
                                        <div className="text-foreground font-bold">
                                          Waktu
                                        </div>
                                        <div>
                                          Start:{" "}
                                          {rpt.startTime
                                            ? format(
                                                new Date(rpt.startTime),
                                                "HH:mm",
                                              )
                                            : "-"}
                                        </div>
                                        <div>
                                          End:{" "}
                                          {rpt.endTime
                                            ? format(
                                                new Date(rpt.endTime),
                                                "HH:mm",
                                              )
                                            : "-"}
                                        </div>
                                      </div>

                                      {activeCategory !== "PAPER" && (
                                        <div className="space-y-1">
                                          <div className="text-foreground font-bold">
                                            Resources
                                          </div>
                                          <div>
                                            MP: {rpt.manPowerAct ?? "-"} (Std:{" "}
                                            {rpt.manPowerStd ?? "-"})
                                          </div>
                                          <div>
                                            CT:{" "}
                                            {rpt.cycleTimeAct?.toString() ??
                                              "-"}{" "}
                                            s (Std:{" "}
                                            {rpt.cycleTimeStd?.toString() ??
                                              "-"}{" "}
                                            s)
                                          </div>
                                          <div>
                                            Cavity: {rpt.cavityAct ?? "-"} (Std:{" "}
                                            {rpt.cavityStd ?? "-"})
                                          </div>
                                        </div>
                                      )}

                                      {activeCategory !== "PAPER" && (
                                        <div className="space-y-1">
                                          <div className="text-foreground font-bold">
                                            Material
                                          </div>
                                          <div>
                                            Input:{" "}
                                            {rpt.inputMaterialQty?.toString() ??
                                              "-"}
                                          </div>
                                          <div>
                                            Runner:{" "}
                                            {rpt.materialRunnerQty?.toString() ??
                                              "-"}
                                          </div>
                                          <div>
                                            Purge:{" "}
                                            {rpt.materialPurgeQty?.toString() ??
                                              "-"}
                                          </div>
                                        </div>
                                      )}

                                      <div className="space-y-1">
                                        <div className="text-foreground font-bold">
                                          Output Lain
                                        </div>
                                        <div>
                                          WIP: {rpt.qtyWip?.toString() ?? "-"}
                                        </div>
                                        <div>
                                          Hold: {rpt.qtyHold?.toString() ?? "-"}
                                        </div>
                                      </div>

                                      {rpt.rejectBreakdown &&
                                        Object.keys(
                                          rpt.rejectBreakdown as object,
                                        ).length > 0 && (
                                          <div className="border-border col-span-2 space-y-1 border-t pt-2">
                                            <div className="text-destructive font-bold">
                                              Rincian Reject
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                              {Object.entries(
                                                rpt.rejectBreakdown as Record<
                                                  string,
                                                  number
                                                >,
                                              ).map(([k, v]) => (
                                                <div
                                                  key={k}
                                                  className="flex justify-between"
                                                >
                                                  <span>{k}</span>
                                                  <span className="font-mono font-bold">
                                                    {v}
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                      {rpt.downtimeBreakdown &&
                                        Object.keys(
                                          rpt.downtimeBreakdown as object,
                                        ).length > 0 && (
                                          <div className="border-border col-span-2 space-y-1 border-t pt-2">
                                            <div className="text-muted-foreground font-bold">
                                              Rincian Downtime
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                              {Object.entries(
                                                rpt.downtimeBreakdown as Record<
                                                  string,
                                                  number
                                                >,
                                              ).map(([k, v]) => {
                                                const valInHours =
                                                  rpt.reportType === "PAPER"
                                                    ? Number(v) / 60
                                                    : Number(v);
                                                return (
                                                  <div
                                                    key={k}
                                                    className="flex justify-between"
                                                  >
                                                    <span>{k}</span>
                                                    <span className="font-mono font-bold">
                                                      {valInHours.toLocaleString(
                                                        "id-ID",
                                                        {
                                                          minimumFractionDigits: 0,
                                                          maximumFractionDigits: 2,
                                                        },
                                                      )}{" "}
                                                      Jam
                                                    </span>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={!!rejectId} onOpenChange={(o) => !o && setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Laporan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 p-3 text-sm text-amber-600 dark:text-amber-400">
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
