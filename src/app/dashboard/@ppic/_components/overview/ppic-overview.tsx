"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { ArrowRight, CalendarDays, FilePlus2 } from "lucide-react";

type Props = {
  userName: string;
};

type PeriodMode = "month" | "week";

function getGreeting(hour: number): string {
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}

function fmtNum(n: number) {
  return n.toLocaleString("id-ID");
}

function toDateInputValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toMonthInputValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getMonthRange(monthValue: string) {
  const [yRaw, mRaw] = monthValue.split("-");
  const y = yRaw ? Number(yRaw) : Number.NaN;
  const m = mRaw ? Number(mRaw) : Number.NaN;
  const year = Number.isFinite(y) ? y : new Date().getFullYear();
  const month = Number.isFinite(m) ? m - 1 : new Date().getMonth();

  const start = new Date(year, month, 1, 0, 0, 0, 0);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

function getWeekRangeByDate(dateValue: string) {
  const base = new Date(dateValue);
  if (Number.isNaN(base.getTime())) {
    return getWeekRangeByDate(toDateInputValue(new Date()));
  }

  const day = base.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(base);
  start.setDate(base.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export default function PPICOverview({ userName }: Props) {
  const router = useRouter();
  const greeting = getGreeting(new Date().getHours());
  const [periodMode, setPeriodMode] = React.useState<PeriodMode>("month");
  const [monthValue, setMonthValue] = React.useState(() =>
    toMonthInputValue(new Date()),
  );
  const [weekDateValue, setWeekDateValue] = React.useState(() =>
    toDateInputValue(new Date()),
  );

  const range = React.useMemo(() => {
    return periodMode === "month"
      ? getMonthRange(monthValue)
      : getWeekRangeByDate(weekDateValue);
  }, [periodMode, monthValue, weekDateValue]);

  const summary = api.pros.dashboardSummary.useQuery(
    {
      start: range.start,
      end: range.end,
    },
    { staleTime: 30_000, refetchOnWindowFocus: false },
  );
  const quantityByPro = api.pros.dashboardQuantityByPro.useQuery(
    {
      start: range.start,
      end: range.end,
      take: 300,
    },
    { staleTime: 30_000, refetchOnWindowFocus: false },
  );

  const donePct = Math.max(0, Math.min(summary.data?.donePct ?? 0, 100));

  const doneQty = summary.data?.doneQtyPo ?? 0;
  const activeQty = summary.data?.activeQtyPo ?? 0;
  const cancelledQty = summary.data?.cancelledQtyPo ?? 0;
  const totalQty = summary.data?.totalQtyPo ?? 0;

  const statusRows = summary.data?.byStatus ?? [];

  return (
    <div className="grid gap-6">
      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-xl">
            {greeting}, {userName}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Ringkasan PRO
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-muted flex rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => setPeriodMode("month")}
                  className={`rounded px-3 py-1 text-xs font-semibold transition ${
                    periodMode === "month"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Per Bulan
                </button>
                <button
                  type="button"
                  onClick={() => setPeriodMode("week")}
                  className={`rounded px-3 py-1 text-xs font-semibold transition ${
                    periodMode === "week"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground"
                  }`}
                >
                  Per Minggu
                </button>
              </div>
              {periodMode === "month" ? (
                <input
                  type="month"
                  value={monthValue}
                  onChange={(e) => setMonthValue(e.target.value)}
                  className="border-input bg-background h-9 rounded-md border px-2 text-xs"
                />
              ) : (
                <input
                  type="date"
                  value={weekDateValue}
                  onChange={(e) => setWeekDateValue(e.target.value)}
                  className="border-input bg-background h-9 rounded-md border px-2 text-xs"
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quantity PRO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
              {quantityByPro.isLoading ? (
                <p className="text-muted-foreground text-sm">Memuat data...</p>
              ) : quantityByPro.error ? (
                <p className="text-destructive text-sm">{quantityByPro.error.message}</p>
              ) : (
                <>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-muted-foreground text-xs">Total Qty PO</p>
                      <p className="text-2xl font-bold">{fmtNum(totalQty)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground text-xs">
                        Progress Selesai
                      </p>
                      <p className="text-sm font-semibold">{donePct.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                    {(quantityByPro.data ?? []).length === 0 ? (
                      <p className="text-muted-foreground rounded border p-3 text-sm">
                        Tidak ada PRO pada periode ini.
                      </p>
                    ) : (
                      (quantityByPro.data ?? []).map((pro) => (
                        <div key={pro.id} className="rounded border p-2">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold">
                                {pro.proNumber} - {pro.productName}
                              </p>
                              <p className="text-muted-foreground text-[11px]">
                                Target {fmtNum(pro.targetQty)} | Output {fmtNum(pro.outputQty)} | Gap {fmtNum(pro.gapQty)}
                              </p>
                            </div>
                            <span className="text-xs font-semibold">
                              {pro.progressPct.toFixed(1)}%
                            </span>
                          </div>
                          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                            <div
                              className={`h-2 rounded-full ${
                                pro.status === "COMPLETE" || pro.status === "CLOSED"
                                  ? "bg-emerald-500"
                                  : pro.status === "CANCELLED"
                                    ? "bg-rose-500"
                                    : "bg-amber-500"
                              }`}
                              style={{ width: `${Math.max(0, Math.min(pro.progressPct, 100))}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded border p-2">
                      <p className="text-muted-foreground">Done</p>
                      <p className="font-semibold">{fmtNum(doneQty)}</p>
                    </div>
                    <div className="rounded border p-2">
                      <p className="text-muted-foreground">Active</p>
                      <p className="font-semibold">{fmtNum(activeQty)}</p>
                    </div>
                    <div className="rounded border p-2">
                      <p className="text-muted-foreground">Cancel</p>
                      <p className="font-semibold">{fmtNum(cancelledQty)}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Status Semua PRO</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {summary.isLoading ? (
                <p className="text-muted-foreground text-sm">Memuat data...</p>
              ) : summary.error ? (
                <p className="text-destructive text-sm">{summary.error.message}</p>
              ) : (
                <div className="space-y-2">
                  <div className="mb-2 rounded border p-2 text-sm">
                    <span className="text-muted-foreground">Total PRO: </span>
                    <span className="font-semibold">
                      {fmtNum(summary.data?.totalPro ?? 0)}
                    </span>
                  </div>
                  {statusRows.map((row) => (
                    <div
                      key={row.status}
                      className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{row.status}</span>
                      <span className="font-semibold">{fmtNum(row.totalPro)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">Worklist</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          <Button 
            variant="outline" 
            className="h-auto flex-col items-start gap-2 p-4 text-left hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            onClick={() => router.push("/dashboard/planning/paper")}
          >
            <div className="flex w-full items-center justify-between">
                <FilePlus2 className="h-5 w-5 text-slate-400" />
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
                <span className="font-semibold block">Membuat PRO</span>
                <span className="text-xs text-muted-foreground font-normal">Buka perencanaan PRO untuk mulai input kebutuhan produksi.</span>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto flex-col items-start gap-2 p-4 text-left hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
            onClick={() => router.push("/dashboard/schedule")}
          >
            <div className="flex w-full items-center justify-between">
                <CalendarDays className="h-5 w-5 text-slate-400" />
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div>
                <span className="font-semibold block">Membuat Schedule</span>
                <span className="text-xs text-muted-foreground font-normal">Atur jadwal produksi supaya urutan proses tetap aman.</span>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
