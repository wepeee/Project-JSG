"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Info, History } from "lucide-react";
import { ProductionReportModal } from "./production-report-modal";

interface TaskDetailViewProps {
  task: any;
  onBack: () => void;
}

export function TaskDetailView({ task, onBack }: TaskDetailViewProps) {
  const [showAddModal, setShowAddModal] = React.useState(false);

  // Mock data for existing reports
  const [reports, setReports] = React.useState([
    {
      id: 1,
      time: "08:30",
      good: 500,
      reject: 2,
      notes: "Aman",
      operator: "Budi",
    },
    {
      id: 2,
      time: "10:15",
      good: 450,
      reject: 5,
      notes: "Setting ulang",
      operator: "Ahmad",
    },
  ]);

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
                {reports
                  .reduce((a, b) => a + b.good, 0)
                  .toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => setShowAddModal(true)}
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
            {reports.map((rpt, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="text-muted-foreground mb-1 flex items-center gap-1 text-[10px] font-bold uppercase">
                    <span>{rpt.operator}</span>
                    <span className="opacity-50">•</span>
                    <span>{rpt.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded bg-green-100 px-2 py-0.5 text-xs font-black text-green-700">
                      Good: {rpt.good}
                    </div>
                    {rpt.reject > 0 && (
                      <div className="rounded bg-red-100 px-2 py-0.5 text-xs font-black text-red-700">
                        Reject: {rpt.reject}
                      </div>
                    )}
                  </div>
                  {rpt.notes && (
                    <div className="text-muted-foreground mt-1 text-xs italic">
                      "{rpt.notes}"
                    </div>
                  )}
                </div>
              </div>
            ))}

            {reports.length === 0 && (
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
      />
    </div>
  );
}
