"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, FileDown, Search } from "lucide-react";
import { Card } from "~/components/ui/card";

import { api, type RouterOutputs } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Input } from "~/components/ui/input";
import { SchedulePdfExport } from "~/app/dashboard/@ppic/_components/schedule/schedule-pdf-export";

type ScheduleItem = RouterOutputs["pros"]["getSchedule"][number];

type ShiftNo = 1 | 2 | 3;

const SHIFTS: Array<{
  no: ShiftNo;
  label: string;
  time: string;
  startHour: number;
}> = [
  { no: 1, label: "Shift 1", time: "06:00 - 11:00", startHour: 6 },
  { no: 2, label: "Shift 2", time: "11:00 - 16:00", startHour: 11 },
  { no: 3, label: "Shift 3", time: "16:00 - 21:00", startHour: 16 },
];

function dateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

function startOfCalendar(d: Date) {
  const first = startOfMonth(d);
  const day = first.getDay();
  const mondayIndex = day === 0 ? 6 : day - 1;
  first.setDate(first.getDate() - mondayIndex);
  return startOfDay(first);
}

function endOfCalendar(d: Date) {
  const last = endOfMonth(d);
  const day = last.getDay();
  const add = day === 0 ? 0 : 7 - day;
  last.setDate(last.getDate() + add);
  last.setHours(23, 59, 59, 999);
  return last;
}

function startOfWeekMonday(d: Date) {
  const x = new Date(d);
  const day = x.getDay();
  const diff = x.getDate() - day + (day === 0 ? -6 : 1);
  x.setDate(diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function shiftFromDate(d: Date): ShiftNo {
  const h = d.getHours();
  if (h >= 16) return 3;
  if (h >= 11) return 2;
  return 1;
}

function applyShiftStart(dateOnly: Date, shift: ShiftNo) {
  const h = SHIFTS.find((s) => s.no === shift)?.startHour ?? 6;
  const x = new Date(dateOnly);
  x.setHours(h, 0, 0, 0);
  return x;
}

type SlotItem = {
  key: string;
  proId: number;
  stepId?: number;
  shiftIndex?: number;
  proNumber: string;
  productName: string;
  status: string;
  orderNo: number;
  processCode: string;
  processName: string;
  machineName: string | null;
  up: number;
  qtyPoPcs: number;
  startDate: Date | null;
  materials: any[];
  productionReports: any[];
};

// ─── Tooltip ────────────────────────────────────────────────────────
function PROTooltipContent({
  proNumber,
  productName,
  orderNo,
  processCode,
  processName,
  machineName,
  up,
  qtyPoPcs,
  status,
  startDate,
  materials,
}: {
  proNumber: string;
  productName: string;
  orderNo: number;
  processCode: string;
  processName: string;
  machineName: string | null;
  up: number;
  qtyPoPcs: number;
  status: string;
  startDate: Date | null;
  materials: any[];
}) {
  return (
    <div className="space-y-2 text-xs">
      <div>
        <div className="text-primary font-semibold">{proNumber}</div>
        <div className="text-muted-foreground text-[11px] opacity-80">
          {productName}
        </div>
      </div>
      <div className="border-border space-y-1 border-t pt-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground opacity-70">Proses:</span>
          <span className="font-medium">#{orderNo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground opacity-70">Process:</span>
          <span className="font-medium">
            {processCode} - {processName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground opacity-70">Machine:</span>
          <span className="font-medium">🔧 {machineName ?? "No Machine"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground opacity-70">UP:</span>
          <span className="font-medium">{up}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground opacity-70">Qty PO:</span>
          <span className="font-medium">{qtyPoPcs.toLocaleString()} pcs</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground opacity-70">Status:</span>
          <Badge
            variant="outline"
            className={`h-5 border px-2 text-[10px] font-bold ${
              status === "OPEN"
                ? "border-primary/20 bg-primary/10 text-primary"
                : ""
            } ${
              status === "IN_PROGRESS"
                ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : ""
            } ${
              status === "COMPLETE"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : ""
            } ${
              status === "CLOSED"
                ? "border-muted bg-muted text-muted-foreground"
                : ""
            } ${
              status === "CANCELLED"
                ? "border-destructive/20 bg-destructive/10 text-destructive"
                : ""
            } `}
          >
            {status}
          </Badge>
        </div>
        {startDate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground opacity-70">Start:</span>
            <span className="font-medium">
              {startDate.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
      </div>
      {materials && materials.length > 0 && (
        <div className="border-border border-t pt-2">
          <div className="mb-1 font-medium">Materials:</div>
          <div className="space-y-0.5">
            {materials.filter((m: any) => m?.itemMaster).map((m: any, idx: number) => (
              <div
                key={idx}
                className="text-muted-foreground text-[10px] opacity-80"
              >
                • {m.itemMaster?.name ?? "-"}: {m.qtyReq?.toString() ?? "?"} {m.itemMaster?.baseUom ?? ""}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Build shift slots ──────────────────────────────────────────────
function buildShiftSlots(
  items: ScheduleItem[],
  range: { start: Date; end: Date },
) {
  const map = new Map<string, SlotItem[]>();

  for (const pro of items) {
    for (const process of pro.proses ?? []) {
      const stepStartVal = (process as any).startDate ?? pro.startDate;
      if (!stepStartVal) continue;

      const actualDay = startOfDay(new Date(stepStartVal));
      const actualShift = shiftFromDate(new Date(stepStartVal));

      if (actualDay >= range.start && actualDay <= range.end) {
        const slotId = `${dateKey(actualDay)}::${actualShift}`;

        const arr = map.get(slotId) ?? [];
        arr.push({
          key: String(process.id),
          proId: pro.id,
          stepId: process.id,
          proNumber: pro.proNumber,
          productName: pro.productName,
          status: pro.status,
          orderNo: process.orderNo,
          processCode: pro.proPrefix?.code ?? "??",
          processName: pro.proPrefix?.name ?? "(tanpa nama)",
          machineName: process.machine?.name ?? null,
          up: process.up ?? 1,
          qtyPoPcs: pro.qtyPoPcs,
          startDate: applyShiftStart(actualDay, actualShift as ShiftNo),
          materials: (process as any).materials ?? [],
          productionReports: (process as any).productionReports ?? [],
        });
        map.set(slotId, arr);
      }
    }
  }

  return map;
}

// ─── Static Chip (no drag) ──────────────────────────────────────────
function StaticChip({
  children,
  tooltip,
}: {
  children: React.ReactNode;
  tooltip?: React.ReactNode;
}) {
  const chip = (
    <div className="bg-card hover:ring-primary/30 cursor-default rounded-lg border p-2 shadow-sm transition-all hover:shadow-md hover:ring-1">
      {children}
    </div>
  );

  if (!tooltip) return chip;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{chip}</TooltipTrigger>
      <TooltipContent
        side="right"
        className="bg-popover text-popover-foreground max-w-xs rounded-xl border p-3 shadow-lg"
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Static Cell (no drop) ──────────────────────────────────────────
function StaticCell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

// ═════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════
export default function PublicSchedule() {
  const [tab, setTab] = React.useState<"shift" | "month" | "day">("shift");
  const [viewMode, setViewMode] = React.useState<"shift" | "machine">("shift");
  const [proType, setProType] = React.useState<"PAPER" | "RIGID">("PAPER");

  const machines = api.machines.list.useQuery({ type: proType });

  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [weekCursor, setWeekCursor] = React.useState(new Date());
  const [dayCursor, setDayCursor] = React.useState(new Date());
  const [pdfOpen, setPdfOpen] = React.useState(false);

  const calStart = React.useMemo(
    () => startOfCalendar(currentMonth),
    [currentMonth],
  );
  const calEnd = React.useMemo(
    () => endOfCalendar(currentMonth),
    [currentMonth],
  );

  const weekStart = React.useMemo(
    () => startOfWeekMonday(weekCursor),
    [weekCursor],
  );
  const weekEnd = React.useMemo(() => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [weekStart]);

  const dayStart = React.useMemo(() => startOfDay(dayCursor), [dayCursor]);
  const dayEnd = React.useMemo(() => {
    const d = new Date(dayStart);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [dayStart]);

  const monthSchedule = api.pros.getSchedule.useQuery(
    { start: calStart, end: calEnd },
    { enabled: tab === "month" },
  );

  const weekSchedule = api.pros.getSchedule.useQuery(
    { start: weekStart, end: weekEnd },
    { enabled: tab === "shift" },
  );

  const daySchedule = api.pros.getSchedule.useQuery(
    { start: dayStart, end: dayEnd },
    { enabled: tab === "day" },
  );

  const monthLabel = currentMonth.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const weekLabel = `${weekStart.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} - ${weekEnd.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`;

  const dayLabel = dayCursor.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const weekDays = React.useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [weekStart]);

  const monthDays = React.useMemo(() => {
    const result: Date[] = [];
    const d = new Date(calStart);
    while (d <= calEnd) {
      result.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    return result;
  }, [calStart, calEnd]);

  const monthWeeks = React.useMemo(() => {
    const rows: Date[][] = [];
    for (let i = 0; i < monthDays.length; i += 7)
      rows.push(monthDays.slice(i, i + 7));
    return rows;
  }, [monthDays]);

  const itemsByDay = React.useMemo(() => {
    const map = new Map<
      string,
      Array<{
        stepId: number;
        proId: number;
        proNumber: string;
        productName: string;
        machineName: string;
        processCode: string;
        processName: string;
        orderNo: number;
        up: number;
        qtyPoPcs: number;
        status: string;
        startDate: Date;
        materials: Array<{
          material: { name: string; uom: string };
          materialId: number;
          qtyReq: any;
        }>;
      }>
    >();

    const data = monthSchedule.data ?? [];
    const q = searchQuery.toLowerCase().trim();
    const filtered = data
      .filter((pro) => pro.type === proType)
      .filter((pro) =>
        q
          ? pro.proNumber.toLowerCase().includes(q) ||
            pro.productName.toLowerCase().includes(q)
          : true,
      );

    for (const pro of filtered) {
      for (const process of pro.proses ?? []) {
        const stepStartVal = (process as any).startDate ?? pro.startDate;
        if (!stepStartVal) continue;

        const actualDay = startOfDay(new Date(stepStartVal));
        const dateStr = dateKey(actualDay);

        const arr = map.get(dateStr) ?? [];
        arr.push({
          stepId: process.id,
          proId: pro.id,
          proNumber: pro.proNumber,
          productName: pro.productName,
          machineName: process.machine?.name ?? "No Machine",
          processCode: pro.proPrefix?.code ?? "",
          processName: pro.proPrefix?.name ?? "",
          orderNo: process.orderNo,
          up: process.up ?? 1,
          qtyPoPcs: pro.qtyPoPcs,
          status: pro.status,
          startDate: actualDay,
          materials: (process as any).materials ?? [],
        });
        map.set(dateStr, arr);
      }
    }
    return map;
  }, [monthSchedule.data, searchQuery, proType]);

  // Shift grid data (week)
  const shiftSlotMap = React.useMemo(() => {
    const data = weekSchedule.data ?? [];
    const q = searchQuery.toLowerCase().trim();
    const filtered = data
      .filter((pro) => pro.type === proType)
      .filter((pro) =>
        q
          ? pro.proNumber.toLowerCase().includes(q) ||
            pro.productName.toLowerCase().includes(q)
          : true,
      );
    return buildShiftSlots(filtered, { start: weekStart, end: weekEnd });
  }, [weekSchedule.data, weekStart, weekEnd, searchQuery, proType]);

  // Day grid data (single day)
  const daySlotMap = React.useMemo(() => {
    const data = daySchedule.data ?? [];
    const q = searchQuery.toLowerCase().trim();
    const filtered = data
      .filter((pro) => pro.type === proType)
      .filter((pro) =>
        q
          ? pro.proNumber.toLowerCase().includes(q) ||
            pro.productName.toLowerCase().includes(q)
          : true,
      );
    return buildShiftSlots(filtered, { start: dayStart, end: dayEnd });
  }, [daySchedule.data, dayStart, dayEnd, searchQuery, proType]);

  // Machine grid data (week)
  const machineSlotData = React.useMemo(() => {
    const data = weekSchedule.data ?? [];
    const q = searchQuery.toLowerCase().trim();
    const filtered = data
      .filter((pro) => pro.type === proType)
      .filter((pro) =>
        q
          ? pro.proNumber.toLowerCase().includes(q) ||
            pro.productName.toLowerCase().includes(q)
          : true,
      );

    const items = filtered;
    const range = { start: weekStart, end: weekEnd };
    const itemsMap = new Map<string, SlotItem[]>();
    const usageMap = new Map<string, number>();

    for (const pro of items) {
      for (const process of pro.proses ?? []) {
        if (!process.machine?.id) continue;
        const stepStartVal = (process as any).startDate ?? pro.startDate;
        if (!stepStartVal) continue;

        const actualDay = startOfDay(new Date(stepStartVal));
        const actualShift = shiftFromDate(new Date(stepStartVal));

        if (actualDay >= range.start && actualDay <= range.end) {
          const detailedSlotId = `${dateKey(actualDay)}::${process.machine.id}::${actualShift}`;

          const arr = itemsMap.get(detailedSlotId) ?? [];
          arr.push({
            key: String(process.id),
            proId: pro.id,
            stepId: process.id,
            proNumber: pro.proNumber,
            productName: pro.productName,
            status: pro.status,
            orderNo: process.orderNo,
            processCode: pro.proPrefix?.code ?? "",
            processName: pro.proPrefix?.name ?? "",
            machineName: process.machine?.name ?? null,
            up: process.up ?? 1,
            qtyPoPcs: pro.qtyPoPcs,
            startDate: applyShiftStart(actualDay, actualShift as ShiftNo),
            materials: (process as any).materials ?? [],
            productionReports: (process as any).productionReports ?? [],
          });
          itemsMap.set(detailedSlotId, arr);

          const mats = (process as any).materials ?? [];
          const sheetMat = mats.find(
            (m: any) => m.material?.uom?.toLowerCase() === "sheet",
          );
          if (sheetMat) {
            const current = usageMap.get(detailedSlotId) ?? 0;
            usageMap.set(detailedSlotId, current + Number(sheetMat.qtyReq));
          }
        }
      }
    }
    return { itemsMap, usageMap };
  }, [weekSchedule.data, weekStart, weekEnd, searchQuery, proType]);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-6 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Jadwal Produksi</h1>
        <p className="text-muted-foreground text-sm">
          Lihat jadwal produksi harian, mingguan (per shift/mesin), atau bulanan.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "shift" | "month")}
        className="space-y-4"
      >
        {/* Toolbar */}
        <div className="border-border bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          {/* Left Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <TabsList className="border-border bg-muted/50 flex h-auto w-fit items-center rounded-lg border p-1">
              <TabsTrigger
                value="shift"
                className="text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:ring-border rounded-md px-3 py-1.5 text-xs font-bold data-[state=active]:shadow-sm data-[state=active]:ring-1"
              >
                Mingguan
              </TabsTrigger>
              <TabsTrigger
                value="day"
                className="text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:ring-border rounded-md px-3 py-1.5 text-xs font-bold data-[state=active]:shadow-sm data-[state=active]:ring-1"
              >
                Harian
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:ring-border rounded-md px-3 py-1.5 text-xs font-bold data-[state=active]:shadow-sm data-[state=active]:ring-1"
              >
                Bulanan
              </TabsTrigger>
            </TabsList>

            <div className="bg-border hidden h-6 w-px sm:block" />

            <div className="border-border bg-muted/50 flex items-center rounded-lg border p-1">
              <button
                onClick={() => setProType("PAPER")}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                  proType === "PAPER"
                    ? "bg-background text-primary ring-border shadow-sm ring-1"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Paper Box
              </button>
              <button
                onClick={() => setProType("RIGID")}
                className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                  proType === "RIGID"
                    ? "bg-background text-primary ring-border shadow-sm ring-1"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                Rigid Box
              </button>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {tab === "shift" && (
              <div className="border-border bg-muted/50 flex items-center rounded-lg border p-1">
                <button
                  onClick={() => setViewMode("shift")}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                    viewMode === "shift"
                      ? "bg-background text-foreground ring-border shadow-sm ring-1"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Per Shift
                </button>
                <button
                  onClick={() => setViewMode("machine")}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                    viewMode === "machine"
                      ? "bg-background text-foreground ring-border shadow-sm ring-1"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  Per Mesin
                </button>
              </div>
            )}

            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Cari No. PRO / Produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background placeholder:text-muted-foreground focus:ring-ring h-9 w-[250px] pl-9 text-xs font-medium"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-2 text-xs font-bold"
              onClick={() => setPdfOpen(true)}
            >
              <FileDown className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-none shadow-md">
          <TooltipProvider delayDuration={300}>
            {/* ════ SHIFT / WEEK TAB ════ */}
            <TabsContent value="shift" className="m-0 p-0">
              {/* Week Navigation */}
              <div className="bg-muted/20 flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const d = new Date(weekCursor);
                      d.setDate(d.getDate() - 7);
                      setWeekCursor(d);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="w-32 text-center text-sm font-medium">
                    {weekLabel}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const d = new Date(weekCursor);
                      d.setDate(d.getDate() + 7);
                      setWeekCursor(d);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setWeekCursor(new Date())}
                  className="h-8 text-xs"
                >
                  Minggu Ini
                </Button>
              </div>

              {/* Week Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[1200px]">
                  <div className="bg-muted/30 grid grid-cols-[140px_repeat(7,minmax(0,1fr))]">
                    {/* HEADER ROW */}
                    <div className="text-muted-foreground flex items-center justify-center border-r border-b p-3 text-[10px] font-bold tracking-wider uppercase">
                      {viewMode === "shift" ? "SHIFT" : "MESIN"}
                    </div>
                    {weekDays.map((d) => (
                      <div
                        key={dateKey(d)}
                        className="border-r border-b p-3 text-center"
                      >
                        <div className="text-foreground text-sm font-bold">
                          {d.toLocaleDateString("id-ID", { weekday: "long" })}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {d.getDate()}{" "}
                          {d.toLocaleDateString("id-ID", { month: "short" })}
                        </div>
                      </div>
                    ))}

                    {/* CONTENT ROWS */}
                    {viewMode === "shift"
                      ? // SHIFT VIEW
                        SHIFTS.map((s) => (
                          <React.Fragment key={s.no}>
                            <div className="bg-muted/10 border-r border-b p-3">
                              <div className="text-primary text-sm font-bold">
                                {s.label}
                              </div>
                              <div className="text-muted-foreground mt-1 text-[10px]">
                                {s.time}
                              </div>
                            </div>
                            {weekDays.map((d) => {
                              const slotId = `${dateKey(d)}::${s.no}`;
                              const slotItems =
                                shiftSlotMap.get(slotId) ?? [];
                              return (
                                <StaticCell
                                  key={slotId}
                                  className="bg-background hover:bg-muted/5 vertical-top min-h-[140px] border-r border-b p-2 transition-colors"
                                >
                                  {weekSchedule.isLoading ? (
                                    <div className="text-muted-foreground flex h-full animate-pulse items-center justify-center text-[10px]">
                                      Loading...
                                    </div>
                                  ) : slotItems.length === 0 ? (
                                    <div className="text-muted-foreground/10 flex h-full items-center justify-center text-2xl font-bold select-none"></div>
                                  ) : (
                                    <div className="space-y-2">
                                      {slotItems.map((it) => {
                                        const { key, ...rest } = it;
                                        return (
                                          <StaticChip
                                            key={it.key}
                                            tooltip={
                                              <PROTooltipContent {...rest} />
                                            }
                                          >
                                            <div className="flex flex-col gap-1.5">
                                              <div className="flex items-center justify-between gap-2">
                                                <div className="text-primary truncate text-xs font-bold">
                                                  {it.proNumber}
                                                </div>
                                                <Badge
                                                  variant="outline"
                                                  className={`h-4 border px-1 text-[9px] ${
                                                    it.status === "OPEN"
                                                      ? "border-primary/20 bg-primary/10 text-primary"
                                                      : ""
                                                  } ${
                                                    it.status === "IN_PROGRESS"
                                                      ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                                      : ""
                                                  } ${
                                                    it.status === "COMPLETE"
                                                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                                      : ""
                                                  } ${
                                                    it.status === "CLOSED"
                                                      ? "border-muted bg-muted text-muted-foreground"
                                                      : ""
                                                  } ${
                                                    it.status === "CANCELLED"
                                                      ? "border-destructive/20 bg-destructive/10 text-destructive"
                                                      : ""
                                                  } `}
                                                >
                                                  {it.status}
                                                </Badge>
                                              </div>
                                              <div className="truncate text-[10px] font-medium opacity-90">
                                                {it.productName}
                                              </div>
                                              <div className="flex flex-wrap gap-1">
                                                <span className="bg-muted text-muted-foreground inline-flex items-center rounded-sm border px-1 py-0.5 text-[9px] font-medium">
                                                  {it.processCode} -{" "}
                                                  {it.processName}
                                                </span>
                                                {it.machineName && (
                                                  <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center rounded-sm border px-1 py-0.5 text-[9px] font-medium">
                                                    🔧 {it.machineName}
                                                  </span>
                                                )}
                                              </div>

                                              {/* Progress Bar */}
                                              {(() => {
                                                const totalAchieved =
                                                  it.productionReports?.reduce(
                                                    (acc: number, r: any) =>
                                                      acc +
                                                      (r.status === "APPROVED"
                                                        ? Number(
                                                            r.qtyPassOn,
                                                          ) || 0
                                                        : 0),
                                                    0,
                                                  ) ?? 0;
                                                const percentage = Math.min(
                                                  100,
                                                  Math.round(
                                                    (totalAchieved /
                                                      (it.qtyPoPcs || 1)) *
                                                      100,
                                                  ),
                                                );

                                                return (
                                                  <div className="mt-1 w-full space-y-1">
                                                    <div className="text-muted-foreground flex justify-between text-[8px]">
                                                      <span>
                                                        {percentage}%
                                                      </span>
                                                      <span>
                                                        {totalAchieved.toLocaleString()}{" "}
                                                        /{" "}
                                                        {it.qtyPoPcs.toLocaleString()}
                                                      </span>
                                                    </div>
                                                    <div className="bg-secondary h-1.5 w-full overflow-hidden rounded-full">
                                                      <div
                                                        className={`h-full rounded-full transition-all ${
                                                          percentage >= 100
                                                            ? "bg-emerald-500"
                                                            : "bg-blue-500"
                                                        }`}
                                                        style={{
                                                          width: `${percentage}%`,
                                                        }}
                                                      />
                                                    </div>
                                                  </div>
                                                );
                                              })()}
                                            </div>
                                          </StaticChip>
                                        );
                                      })}
                                    </div>
                                  )}
                                </StaticCell>
                              );
                            })}
                          </React.Fragment>
                        ))
                      : // MACHINE VIEW
                        (machines.data ?? []).map((m) => {
                          return (
                            <React.Fragment key={m.id}>
                              <div className="bg-muted/5 border-r border-b p-3">
                                <div
                                  className="truncate text-sm font-semibold"
                                  title={m.name}
                                >
                                  {m.name}
                                </div>
                                <div className="text-muted-foreground mt-0.5 text-[10px]">
                                  Shift 1-3
                                </div>
                              </div>

                              {weekDays.map((d) => (
                                <div
                                  key={dateKey(d)}
                                  className="bg-background border-r border-b"
                                >
                                  {[1, 2, 3].map((shiftNo) => {
                                    const slotId = `${dateKey(d)}::${m.id}::${shiftNo}`;
                                    const slotItems =
                                      machineSlotData.itemsMap.get(slotId) ??
                                      [];
                                    const used =
                                      machineSlotData.usageMap.get(slotId) ??
                                      0;
                                    const cap = m.stdOutputPerShift ?? 0;
                                    const isOverload = cap > 0 && used > cap;

                                    return (
                                      <StaticCell
                                        key={slotId}
                                        className={`hover:bg-accent/5 flex min-h-[60px] flex-col border-b p-1.5 transition-colors last:border-b-0 ${isOverload ? "bg-destructive/10" : shiftNo === 1 ? "bg-primary/5" : shiftNo === 2 ? "bg-primary/10" : "bg-primary/15"}`}
                                      >
                                        <div
                                          className={`mb-1 flex items-center justify-between text-[9px] font-medium ${isOverload ? "text-destructive" : "text-muted-foreground"}`}
                                        >
                                          <span className="font-mono opacity-50">
                                            S{shiftNo}
                                          </span>
                                          {cap > 0 && (
                                            <span
                                              className={
                                                isOverload
                                                  ? "text-destructive font-bold"
                                                  : "opacity-70"
                                              }
                                            >
                                              {used > 0
                                                ? `${used.toLocaleString()} / `
                                                : ""}
                                              {cap.toLocaleString()}
                                              {isOverload && " ⚠️"}
                                            </span>
                                          )}
                                        </div>
                                        {weekSchedule.isLoading ? (
                                          <div className="text-[9px] opacity-40">
                                            ...
                                          </div>
                                        ) : (
                                          <div className="space-y-1">
                                            {slotItems.map((it) => {
                                              const { key, ...rest } = it;
                                              return (
                                                <StaticChip
                                                  key={it.key}
                                                  tooltip={
                                                    <PROTooltipContent
                                                      {...rest}
                                                    />
                                                  }
                                                >
                                                  <div className="flex items-center justify-between gap-1">
                                                    <div className="truncate text-[10px] font-semibold text-blue-700">
                                                      {it.proNumber}
                                                    </div>
                                                  </div>
                                                  <div
                                                    className="truncate text-[9px] opacity-80"
                                                    title={it.productName}
                                                  >
                                                    {it.productName}
                                                  </div>
                                                </StaticChip>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </StaticCell>
                                    );
                                  })}
                                </div>
                              ))}
                            </React.Fragment>
                          );
                        })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* ════ DAY TAB ════ */}
            <TabsContent value="day" className="m-0 p-0">
              {/* Day Navigation */}
              <div className="bg-muted/20 flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const d = new Date(dayCursor);
                      d.setDate(d.getDate() - 1);
                      setDayCursor(d);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="w-64 text-center text-sm font-medium capitalize">
                    {dayLabel}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const d = new Date(dayCursor);
                      d.setDate(d.getDate() + 1);
                      setDayCursor(d);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDayCursor(new Date())}
                  className="h-8 text-xs"
                >
                  Hari Ini
                </Button>
              </div>

              {/* Day Content — 3 shift sections */}
              <div className="space-y-4 p-4">
                {SHIFTS.map((s) => {
                  const slotId = `${dateKey(dayStart)}::${s.no}`;
                  const slotItems = daySlotMap.get(slotId) ?? [];
                  return (
                    <div key={s.no} className="overflow-hidden rounded-xl border">
                      {/* Shift Header */}
                      <div className="bg-muted/30 flex items-center gap-3 border-b px-4 py-3">
                        <div>
                          <div className="text-primary text-sm font-bold">{s.label}</div>
                          <div className="text-muted-foreground text-xs">{s.time}</div>
                        </div>
                        <span className="text-muted-foreground ml-auto text-xs">
                          {slotItems.length} item
                        </span>
                      </div>
                      {/* Items Grid */}
                      <div className="bg-background p-4">
                        {daySchedule.isLoading ? (
                          <div className="text-muted-foreground animate-pulse py-6 text-center text-xs">
                            Loading...
                          </div>
                        ) : slotItems.length === 0 ? (
                          <div className="text-muted-foreground/40 py-6 text-center text-xs italic">
                            Tidak ada jadwal
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {slotItems.map((it) => {
                              const { key, ...rest } = it;
                              return (
                                <StaticChip
                                  key={it.key}
                                  tooltip={<PROTooltipContent {...rest} />}
                                >
                                  <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="text-primary truncate text-xs font-bold">
                                        {it.proNumber}
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className={`h-4 border px-1 text-[9px] ${
                                          it.status === "OPEN"
                                            ? "border-primary/20 bg-primary/10 text-primary"
                                            : ""
                                        } ${
                                          it.status === "IN_PROGRESS"
                                            ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            : ""
                                        } ${
                                          it.status === "COMPLETE"
                                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                            : ""
                                        } ${
                                          it.status === "CLOSED"
                                            ? "border-muted bg-muted text-muted-foreground"
                                            : ""
                                        } ${
                                          it.status === "CANCELLED"
                                            ? "border-destructive/20 bg-destructive/10 text-destructive"
                                            : ""
                                        }`}
                                      >
                                        {it.status}
                                      </Badge>
                                    </div>
                                    <div className="truncate text-[10px] font-medium opacity-90">
                                      {it.productName}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      <span className="bg-muted text-muted-foreground inline-flex items-center rounded-sm border px-1 py-0.5 text-[9px] font-medium">
                                        {it.processCode} - {it.processName}
                                      </span>
                                      {it.machineName && (
                                        <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center rounded-sm border px-1 py-0.5 text-[9px] font-medium">
                                          🔧 {it.machineName}
                                        </span>
                                      )}
                                    </div>
                                    {(() => {
                                      const totalAchieved =
                                        it.productionReports?.reduce(
                                          (acc: number, r: any) =>
                                            acc +
                                            (r.status === "APPROVED"
                                              ? Number(r.qtyPassOn) || 0
                                              : 0),
                                          0,
                                        ) ?? 0;
                                      const percentage = Math.min(
                                        100,
                                        Math.round(
                                          (totalAchieved / (it.qtyPoPcs || 1)) * 100,
                                        ),
                                      );
                                      return (
                                        <div className="mt-1 w-full space-y-1">
                                          <div className="text-muted-foreground flex justify-between text-[8px]">
                                            <span>{percentage}%</span>
                                            <span>
                                              {totalAchieved.toLocaleString()} /{" "}
                                              {it.qtyPoPcs.toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="bg-secondary h-1.5 w-full overflow-hidden rounded-full">
                                            <div
                                              className={`h-full rounded-full transition-all ${
                                                percentage >= 100
                                                  ? "bg-emerald-500"
                                                  : "bg-blue-500"
                                              }`}
                                              style={{ width: `${percentage}%` }}
                                            />
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                </StaticChip>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* ════ MONTH TAB ════ */}
            <TabsContent value="month" className="m-0 p-0">
              {/* Month Navigation */}
              <div className="bg-muted/20 flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const d = new Date(currentMonth);
                      d.setMonth(d.getMonth() - 1);
                      setCurrentMonth(d);
                    }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="w-40 text-center text-sm font-medium">
                    {monthLabel}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const d = new Date(currentMonth);
                      d.setMonth(d.getMonth() + 1);
                      setCurrentMonth(d);
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setCurrentMonth(new Date())}
                >
                  Bulan Ini
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="bg-background">
                <div className="text-muted-foreground bg-muted/5 grid grid-cols-7 gap-0 border-b text-[10px] font-bold tracking-wider uppercase">
                  {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map(
                    (d) => (
                      <div
                        key={d}
                        className="border-r py-3 text-center last:border-r-0"
                      >
                        {d}
                      </div>
                    ),
                  )}
                </div>

                <div className="max-h-[70vh] overflow-y-auto">
                  {monthWeeks.map((row, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-7 gap-0 border-b last:border-b-0"
                    >
                      {row.map((day) => {
                        const k = dateKey(day);
                        const items = itemsByDay.get(k) ?? [];
                        const isThisMonth =
                          day.getMonth() === currentMonth.getMonth();

                        return (
                          <StaticCell
                            key={k}
                            className={`hover:bg-muted/5 min-h-[140px] border-r p-2 transition-colors last:border-r-0 ${!isThisMonth ? "bg-muted/20 text-muted-foreground" : "bg-background"}`}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                                  dateKey(day) === dateKey(new Date())
                                    ? "bg-primary text-primary-foreground"
                                    : !isThisMonth
                                      ? "opacity-50"
                                      : ""
                                }`}
                              >
                                {day.getDate()}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              {monthSchedule.isLoading ? (
                                <div className="py-4 text-center text-[10px] opacity-40">
                                  Loading...
                                </div>
                              ) : items.length === 0 ? (
                                <div className="py-4 text-center text-[10px] italic opacity-20">
                                  -
                                </div>
                              ) : (
                                items.map((stepInfo) => (
                                  <StaticChip
                                    key={String(stepInfo.stepId)}
                                    tooltip={
                                      <PROTooltipContent {...stepInfo} />
                                    }
                                  >
                                    <div className="flex items-start justify-between gap-1">
                                      <div className="min-w-0 flex-1">
                                        <div className="text-primary truncate text-[10px] font-bold">
                                          {stepInfo.proNumber}
                                        </div>
                                        <div className="text-muted-foreground truncate text-[9px]">
                                          {stepInfo.productName}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1">
                                      <Badge
                                        variant="outline"
                                        className="border-primary/20 bg-primary/5 text-primary h-3.5 px-1 text-[8px] font-medium"
                                      >
                                        🔧 {stepInfo.machineName}
                                      </Badge>
                                    </div>
                                  </StaticChip>
                                ))
                              )}
                            </div>
                          </StaticCell>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </TooltipProvider>
        </Card>
      </Tabs>
      <SchedulePdfExport
        open={pdfOpen}
        onOpenChange={setPdfOpen}
        items={
          tab === "shift"
            ? (weekSchedule.data ?? [])
            : tab === "day"
              ? (daySchedule.data ?? [])
              : (monthSchedule.data ?? [])
        }
        weekLabel={
          tab === "shift" ? weekLabel : tab === "day" ? dayLabel : monthLabel
        }
        weekStart={
          tab === "shift" ? weekStart : tab === "day" ? dayStart : calStart
        }
        weekEnd={
          tab === "shift" ? weekEnd : tab === "day" ? dayEnd : calEnd
        }
        proType={proType}
      />
    </div>
  );
}
