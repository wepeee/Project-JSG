"use client";

import * as React from "react";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
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

type Props = {
  onSelectPro?: (id: number) => void;
};

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

function keyToDate(key: string): Date | null {
  const [ys, ms, ds] = key.split("-");
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    return null;
  }

  return new Date(y, m - 1, d, 0, 0, 0, 0);
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

function shiftsNeededForStep(opts: {
  qtyPoPcs: number;
  up: number | null;
  stdOutputPerShift: number | null | undefined;
}) {
  const { qtyPoPcs, up, stdOutputPerShift } = opts;
  const std = stdOutputPerShift ?? null;
  if (!std || std <= 0) return 1;

  const actualQty = up && up > 0 ? qtyPoPcs / up : qtyPoPcs;
  return Math.max(1, Math.ceil(actualQty / std));
}

type SlotItem = {
  key: string; // composite draggable id
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
        <div className="font-semibold text-blue-600">{proNumber}</div>
        <div className="text-[11px] opacity-80">{productName}</div>
      </div>
      <div className="space-y-1 border-t pt-2">
        <div className="flex justify-between">
          <span className="opacity-70">Proses:</span>
          <span className="font-medium">#{orderNo}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Process:</span>
          <span className="font-medium">
            {processCode} - {processName}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Machine:</span>
          <span className="font-medium">🔧 {machineName ?? "No Machine"}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">UP:</span>
          <span className="font-medium">{up}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Qty PO:</span>
          <span className="font-medium">{qtyPoPcs.toLocaleString()} pcs</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Status:</span>
          <Badge variant="outline" className="h-5 text-[10px]">
            {status}
          </Badge>
        </div>
        {startDate && (
          <div className="flex justify-between">
            <span className="opacity-70">Start:</span>
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
        <div className="border-t pt-2">
          <div className="mb-1 font-medium">Materials:</div>
          <div className="space-y-0.5">
            {materials.map((m: any, idx: number) => (
              <div key={idx} className="text-[10px] opacity-80">
                • {m.material.name}: {m.qtyReq.toString()} {m.material.uom}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
        // Key is date::shift
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

export default function PPICSchedule({ onSelectPro }: Props) {
  const [tab, setTab] = React.useState<"shift" | "month">("shift");

  // View mode
  const [viewMode, setViewMode] = React.useState<"shift" | "machine">("shift");
  const [proType, setProType] = React.useState<"PAPER" | "RIGID">("PAPER");

  // Machine data
  const machines = api.machines.list.useQuery({ type: proType });

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");

  // Month state
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  // Week state
  const [weekCursor, setWeekCursor] = React.useState(new Date());

  const utils = api.useUtils();

  // Optimistic mutations with proper lifecycle hooks
  const reschedule = api.pros.reschedule.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches for all affected queries
      await utils.pros.getSchedule.cancel();
      await utils.pros.getById.cancel();
      await utils.pros.list.cancel();

      // Snapshot previous values
      const previousSchedule = utils.pros.getSchedule.getData();
      const previousDetail = utils.pros.getById.getData({ id: variables.id });
      const previousList = utils.pros.list.getData({});

      // Optimistically update schedule cache
      utils.pros.getSchedule.setData(
        {
          start: tab === "month" ? calStart : weekStart,
          end: tab === "month" ? calEnd : weekEnd,
        },
        (old) => {
          if (!old) return old;
          return old.map((pro) =>
            pro.id === variables.id
              ? { ...pro, startDate: variables.startDate }
              : pro,
          );
        },
      );

      // Optimistically update detail cache
      if (previousDetail) {
        utils.pros.getById.setData(
          { id: variables.id },
          { ...previousDetail, startDate: variables.startDate },
        );
      }

      // Optimistically update list cache
      if (previousList) {
        utils.pros.list.setData(
          {},
          {
            ...previousList,
            items: previousList.items.map((pro) =>
              pro.id === variables.id
                ? { ...pro, startDate: variables.startDate }
                : pro,
            ),
          },
        );
      }

      return { previousSchedule, previousDetail, previousList };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousSchedule) {
        utils.pros.getSchedule.setData(
          {
            start: tab === "month" ? calStart : weekStart,
            end: tab === "month" ? calEnd : weekEnd,
          },
          context.previousSchedule,
        );
      }
      if (context?.previousDetail) {
        utils.pros.getById.setData(
          { id: variables.id },
          context.previousDetail,
        );
      }
      if (context?.previousList) {
        utils.pros.list.setData({}, context.previousList);
      }
    },
    onSettled: () => {
      // Refetch to ensure sync with server
      void utils.pros.getSchedule.invalidate();
      void utils.pros.getById.invalidate();
      void utils.pros.list.invalidate();
    },
  });

  const rescheduleProses = api.pros.rescheduleProses.useMutation({
    onMutate: async (variables) => {
      await utils.pros.getSchedule.cancel();
      await utils.pros.getById.cancel();
      await utils.pros.list.cancel();

      const previousSchedule = utils.pros.getSchedule.getData();
      const previousList = utils.pros.list.getData({});

      // Find which PRO this process belongs to
      let affectedProId: number | undefined;
      if (previousSchedule) {
        for (const pro of previousSchedule) {
          if (pro.proses.some((s) => s.id === variables.prosesId)) {
            affectedProId = pro.id;
            break;
          }
        }
      }

      const previousDetail = affectedProId
        ? utils.pros.getById.getData({ id: affectedProId })
        : undefined;

      // Update schedule cache
      utils.pros.getSchedule.setData(
        {
          start: tab === "month" ? calStart : weekStart,
          end: tab === "month" ? calEnd : weekEnd,
        },
        (old) => {
          if (!old) return old;
          return old.map((pro) => ({
            ...pro,
            proses: pro.proses.map((process) =>
              process.id === variables.prosesId
                ? { ...process, startDate: variables.startDate }
                : process,
            ),
          }));
        },
      );

      // Update detail cache
      if (affectedProId && previousDetail) {
        utils.pros.getById.setData(
          { id: affectedProId },
          {
            ...previousDetail,
            proses: previousDetail.proses.map((process) =>
              process.id === variables.prosesId
                ? { ...process, startDate: variables.startDate }
                : process,
            ),
          },
        );
      }

      // Update list cache (processes are included in list response)
      if (previousList) {
        utils.pros.list.setData(
          {},
          {
            ...previousList,
            items: previousList.items.map((pro) => ({
              ...pro,
              proses: pro.proses.map((process) =>
                process.id === variables.prosesId
                  ? { ...process, startDate: variables.startDate }
                  : process,
              ),
            })),
          },
        );
      }

      return { previousSchedule, previousDetail, previousList, affectedProId };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSchedule) {
        utils.pros.getSchedule.setData(
          {
            start: tab === "month" ? calStart : weekStart,
            end: tab === "month" ? calEnd : weekEnd,
          },
          context.previousSchedule,
        );
      }
      if (context?.affectedProId && context?.previousDetail) {
        utils.pros.getById.setData(
          { id: context.affectedProId },
          context.previousDetail,
        );
      }
      if (context?.previousList) {
        utils.pros.list.setData({}, context.previousList);
      }
    },
    onSettled: () => {
      void utils.pros.getSchedule.invalidate();
      void utils.pros.getById.invalidate();
      void utils.pros.list.invalidate();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

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

  const monthSchedule = api.pros.getSchedule.useQuery(
    { start: calStart, end: calEnd },
    { enabled: tab === "month" },
  );

  const weekSchedule = api.pros.getSchedule.useQuery(
    { start: weekStart, end: weekEnd },
    { enabled: tab === "shift" },
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeStr = String(active.id);
    const id = Number(active.id);
    if (!Number.isFinite(id)) return;

    const overStr = String(over.id);
    const overParts = overStr.split("::");
    const dateStr = overParts[0] ?? "";

    // Check format: date::shift OR date::machine::shift
    let shiftVal = 1;

    if (overParts.length === 3) {
      // Machine View: date::machine::shift
      shiftVal = Number(overParts[2]);
    } else {
      // Shift View: date::shift
      shiftVal = Number(overParts[1]);
    }

    const d0 = keyToDate(dateStr);
    if (!d0) return;

    // determine shift
    const shift: ShiftNo =
      shiftVal === 2 || shiftVal === 3 ? (shiftVal as ShiftNo) : 1;

    const newStart = applyShiftStart(d0, shift);

    // Everything is now a step (1 step = 1 shift)
    rescheduleProses.mutate({ prosesId: id, startDate: newStart });
  };

  const monthLabel = currentMonth.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const weekLabel = `${weekStart.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })} - ${weekEnd.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}`;

  const weekDays = React.useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [weekStart]);

  // Month grid data
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
  }, [monthSchedule.data, searchQuery]);

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

        const slotId = `${dateKey(actualDay)}::${process.machine.id}`; // Base slot ID

        // We need detailed slot ID for unique items in the view
        // The View uses date::machine::shift for columns/cells?
        // Actually looking at handleDragEnd:
        // Machine View: date::machine::shift

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

          // Calculate Usage
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
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Jadwal Produksi</h1>
        <p className="text-muted-foreground text-sm">
          Kelola jadwal produksi mingguan (per shift/mesin) atau bulanan. Drag &
          Drop untuk mengubah jadwal.
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "shift" | "month")}
        className="space-y-4"
      >
        {/* Toolbar */}
        <Card className="border-none shadow-md">
          <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
            {/* Left Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <TabsList className="h-9 w-fit">
                <TabsTrigger value="shift" className="px-4 text-xs">
                  Mingguan
                </TabsTrigger>
                <TabsTrigger value="month" className="px-4 text-xs">
                  Bulanan
                </TabsTrigger>
              </TabsList>

              <div className="bg-muted flex h-9 items-center rounded-lg p-1">
                <button
                  onClick={() => setProType("PAPER")}
                  className={`flex-1 rounded-md px-3 py-1 text-xs font-medium transition-all ${proType === "PAPER" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                >
                  Paper Box
                </button>
                <button
                  onClick={() => setProType("RIGID")}
                  className={`flex-1 rounded-md px-3 py-1 text-xs font-medium transition-all ${proType === "RIGID" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                >
                  Rigid Box
                </button>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {tab === "shift" && (
                <div className="bg-muted flex h-9 items-center rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("shift")}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${viewMode === "shift" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                  >
                    Per Shift
                  </button>
                  <button
                    onClick={() => setViewMode("machine")}
                    className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${viewMode === "machine" ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-primary"}`}
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
                  className="bg-muted/50 focus:bg-background h-9 w-[250px] pl-9"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="overflow-hidden border-none shadow-md">
          <TooltipProvider delayDuration={300}>
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
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
                                  <DroppableCell
                                    key={slotId}
                                    id={slotId}
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
                                            <DraggableChip
                                              key={it.key}
                                              id={it.key}
                                              onSelect={() =>
                                                onSelectPro?.(it.proId)
                                              }
                                              tooltip={
                                                <PROTooltipContent {...rest} />
                                              }
                                            >
                                              <div className="flex items-center justify-between gap-2">
                                                <div className="text-primary truncate text-xs font-bold">
                                                  {it.proNumber}
                                                </div>
                                                <Badge
                                                  variant="outline"
                                                  className="border-primary/20 bg-primary/5 text-primary h-4 px-1 text-[9px]"
                                                >
                                                  {it.status}
                                                </Badge>
                                              </div>
                                              <div className="mt-0.5 truncate text-[10px] font-medium">
                                                {it.productName}
                                              </div>
                                              <div className="mt-1.5 flex flex-wrap gap-1">
                                                <span className="bg-muted text-muted-foreground inline-flex items-center rounded-sm border px-1 py-0.5 text-[9px] font-medium">
                                                  {it.processCode} -{" "}
                                                  {it.processName}
                                                </span>
                                                {it.machineName && (
                                                  <span className="inline-flex items-center rounded-sm border border-amber-200 bg-amber-100 px-1 py-0.5 text-[9px] font-medium text-amber-800">
                                                    🔧 {it.machineName}
                                                  </span>
                                                )}
                                              </div>
                                            </DraggableChip>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </DroppableCell>
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
                                        <DroppableCell
                                          key={slotId}
                                          id={slotId}
                                          className={`hover:bg-accent/5 flex min-h-[60px] flex-col border-b p-1.5 transition-colors last:border-b-0 ${isOverload ? "bg-red-50" : shiftNo === 1 ? "bg-blue-50/10" : shiftNo === 2 ? "bg-orange-50/10" : "bg-purple-50/10"}`}
                                        >
                                          <div
                                            className={`mb-1 flex items-center justify-between text-[9px] font-medium ${isOverload ? "text-red-700" : "text-muted-foreground"}`}
                                          >
                                            <span className="font-mono opacity-50">
                                              S{shiftNo}
                                            </span>
                                            {cap > 0 && (
                                              <span
                                                className={
                                                  isOverload
                                                    ? "font-bold text-red-600"
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
                                                  <DraggableChip
                                                    key={it.key}
                                                    id={it.key}
                                                    onSelect={() =>
                                                      onSelectPro?.(it.proId)
                                                    }
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
                                                  </DraggableChip>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </DroppableCell>
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
                <div className="text-muted-foreground bg-muted/10 border-t p-4 text-xs">
                  Catatan: Drag PRO ke tanggal lain untuk mengubah startDate.
                  Pastikan kapasitas mesin mencukupi.
                </div>
              </TabsContent>

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
                            <DroppableCell
                              key={k}
                              id={k}
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
                                  items.map((stepInfo, idx) => (
                                    <DraggableChip
                                      key={String(stepInfo.stepId)}
                                      id={String(stepInfo.stepId)}
                                      onSelect={() =>
                                        onSelectPro?.(stepInfo.proId)
                                      }
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
                                          className="h-3.5 border-amber-200 bg-amber-50 px-1 text-[8px] font-medium text-amber-800"
                                        >
                                          🔧 {stepInfo.machineName}
                                        </Badge>
                                      </div>
                                    </DraggableChip>
                                  ))
                                )}
                              </div>
                            </DroppableCell>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-muted-foreground bg-muted/10 border-t p-4 text-xs">
                  Catatan: Drag PRO ke tanggal lain untuk mengubah startDate.
                </div>
              </TabsContent>
            </DndContext>
          </TooltipProvider>
        </Card>
      </Tabs>
    </div>
  );
}

function DroppableCell({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${className ?? ""} ${isOver ? "bg-primary/5" : ""}`}
    >
      {children}
    </div>
  );
}

function DraggableChip({
  id,
  onSelect,
  children,
  tooltip,
}: {
  id: string;
  onSelect: () => void;
  children: React.ReactNode;
  tooltip?: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : undefined,
  };

  const chipContent = (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={() => {
        if (
          transform &&
          (Math.abs(transform.x) > 4 || Math.abs(transform.y) > 4)
        )
          return;
        onSelect();
      }}
      className="bg-background/50 hover:border-primary cursor-grab overflow-hidden rounded border p-2 text-[11px] active:cursor-grabbing"
    >
      {children}
    </div>
  );

  if (!tooltip) return chipContent;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{chipContent}</TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
