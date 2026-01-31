"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Clock,
  HardDrive,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { id } from "date-fns/locale";

import { TaskDetailView } from "./task-detail-view";

export function ScheduleList() {
  const [mounted, setMounted] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [selectedTask, setSelectedTask] = React.useState<any>(null);

  React.useEffect(() => {
    setMounted(true);
    setDate(new Date()); // Ensure it's correct on client
  }, []);

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const schedule = api.pros.getSchedule.useQuery(
    { start: startOfDay, end: endOfDay },
    { enabled: mounted },
  );

  const nextDay = () => setDate((prev) => addDays(prev, 1));
  const prevDay = () => setDate((prev) => subDays(prev, 1));
  const goToToday = () => setDate(new Date());

  // Generate 7 days for the picker (3 before, current, 3 after)
  const days = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(date, i - 3));
  }, [date]);

  if (selectedTask) {
    return (
      <TaskDetailView
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
      />
    );
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 dark:bg-slate-950/50">
      {/* Header with Glassmorphism */}
      <div className="sticky top-0 z-30 border-b border-white/20 bg-white/70 pt-5 shadow-sm backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/70">
        <div className="px-5 pb-4">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-2xl font-black tracking-tight text-transparent">
              gatau diisi apa
            </h1>
            <div className="flex items-center gap-2">
              {!isSameDay(date, new Date()) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToToday}
                  className="h-7 px-2 text-[10px] font-bold text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                >
                  HARI INI
                </Button>
              )}
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/5 text-primary px-2 py-0 font-mono text-[10px]"
              >
                OPERATOR
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevDay}
              className="h-8 w-8 rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-xs font-bold tracking-tighter uppercase">
                {format(date, "MMMM yyyy", { locale: id })}
              </span>
              <span className="text-sm font-black">
                {format(date, "EEEE, dd", { locale: id })}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextDay}
              className="h-8 w-8 rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Horizontal Date Picker */}
        <div className="no-scrollbar flex items-center justify-between overflow-x-auto scroll-smooth px-2 pb-3">
          {days.map((d, i) => {
            const active = isSameDay(d, date);
            const isToday = isSameDay(d, new Date());
            return (
              <button
                key={i}
                onClick={() => setDate(d)}
                className={`flex min-w-[14.28%] flex-col items-center py-2 transition-all duration-300 ${
                  active ? "scale-110" : "opacity-50"
                }`}
              >
                <span
                  className={`text-[10px] font-bold tracking-tighter uppercase ${active ? "text-blue-600" : ""}`}
                >
                  {format(d, "EEE", { locale: id })}
                </span>
                <div
                  className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                      : isToday
                        ? "border-2 border-blue-600 text-blue-600"
                        : ""
                  }`}
                >
                  {format(d, "d")}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6 p-4">
        {schedule.isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        )}

        {schedule.data?.length === 0 && (
          <div className="text-muted-foreground/50 flex flex-col items-center justify-center py-24">
            <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-900">
              <CalendarIcon className="h-12 w-12 opacity-20" />
            </div>
            <p className="text-sm font-medium">Belum ada tugas hari ini</p>
          </div>
        )}

        <div className="space-y-4">
          {schedule.data
            ?.flatMap((pro) =>
              pro.steps.map((step) => {
                const stepDate = step.startDate
                  ? new Date(step.startDate)
                  : null;
                if (!stepDate || stepDate < startOfDay || stepDate > endOfDay)
                  return null;
                const shift = getShift(stepDate);

                return { pro, step, shift };
              }),
            )
            .filter(Boolean)
            .sort((a, b) => (a?.shift ?? 0) - (b?.shift ?? 0))
            .map((item, idx) => {
              if (!item) return null;
              const { pro, step, shift } = item;

              return (
                <Card
                  key={`${pro.id}-${step.id}-${idx}`}
                  className="group relative overflow-hidden rounded-[2rem] border-none bg-white shadow-xl ring-1 shadow-slate-200/50 ring-slate-200/50 dark:bg-slate-900 dark:shadow-none dark:ring-slate-800"
                >
                  {/* Visual Accent */}
                  <div
                    className={`absolute top-0 left-0 h-full w-2 ${
                      shift === 1
                        ? "bg-amber-400"
                        : shift === 2
                          ? "bg-blue-500"
                          : "bg-indigo-600"
                    }`}
                  />

                  <CardContent className="p-6">
                    <div className="mb-6 flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`rounded px-2 py-0.5 text-[10px] font-black tracking-widest uppercase ${
                              shift === 1
                                ? "bg-amber-100 text-amber-700"
                                : shift === 2
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            Shift {shift}
                          </div>
                          <span className="text-muted-foreground font-mono text-xs">
                            {format(new Date(step.startDate!), "HH:mm")}
                          </span>
                        </div>
                        <h3 className="mt-1 text-xl leading-tight font-black tracking-tight">
                          {pro.productName}
                        </h3>
                        <div className="text-muted-foreground/60 text-[10px] font-bold tracking-wider">
                          NO. PRO: {pro.proNumber}
                        </div>
                      </div>
                      <Badge className="rounded-full px-3 py-1 text-[10px] font-bold">
                        {pro.status}
                      </Badge>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase">
                          <HardDrive className="h-3 w-3" /> Mesin
                        </span>
                        <span className="truncate text-sm font-black">
                          {step.machine?.name ?? "-"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                        <span className="text-muted-foreground flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase">
                          <Package className="h-3 w-3" /> Target
                        </span>
                        <span className="truncate text-sm font-black">
                          {pro.qtyPoPcs.toLocaleString("id-ID")} pcs
                        </span>
                      </div>
                    </div>

                    <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                          <span className="text-[10px] font-black text-blue-600 uppercase">
                            P
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-[8px] leading-none font-bold uppercase">
                            Proses
                          </span>
                          <span className="text-xs font-black">
                            {pro.process?.name}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-100 px-3 py-1 text-[10px] font-black uppercase dark:bg-slate-800">
                        UP: {step.up ?? "-"}
                      </div>
                    </div>

                    {/* Materials Section */}
                    <div className="space-y-2">
                      <div className="text-muted-foreground mb-1 px-1 text-[9px] font-bold tracking-widest uppercase">
                        Bahan Baku
                      </div>
                      <div className="space-y-1.5">
                        {(step as any).materials &&
                        (step as any).materials.length > 0 ? (
                          (step as any).materials.map(
                            (m: any, mIdx: number) => (
                              <div
                                key={mIdx}
                                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950/50"
                              >
                                <span className="truncate pr-2 text-xs font-bold">
                                  {m.material?.name}
                                </span>
                                <div className="rounded-md bg-white px-2 py-0.5 text-xs font-black whitespace-nowrap shadow-sm dark:bg-slate-900">
                                  {Number(m.qtyReq).toLocaleString("id-ID")}{" "}
                                  <span className="text-muted-foreground text-[10px] font-bold">
                                    {m.material?.uom}
                                  </span>
                                </div>
                              </div>
                            ),
                          )
                        ) : (
                          <div className="text-muted-foreground/50 px-1 text-[10px] italic">
                            Tidak ada kebutuhan bahan baku khusus
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        onClick={() => setSelectedTask({ pro, step, shift })}
                        className="h-12 w-full rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-200/50 transition-all hover:bg-blue-700 active:scale-95"
                      >
                        + Input Laporan Produksi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function getShift(d: Date) {
  const h = d.getHours();
  if (h >= 16) return 3;
  if (h >= 11) return 2;
  return 1;
}
