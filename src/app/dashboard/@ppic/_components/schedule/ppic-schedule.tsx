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

const SHIFTS: Array<{ no: ShiftNo; label: string; time: string; startHour: number }> = [
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
  materials 
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
          <span className="opacity-70">Step:</span>
          <span className="font-medium">#{orderNo}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Process:</span>
          <span className="font-medium">{processCode} - {processName}</span>
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
          <div className="font-medium mb-1">Materials:</div>
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

function buildShiftSlots(items: ScheduleItem[], range: { start: Date; end: Date }) {
  const map = new Map<string, SlotItem[]>();

  for (const pro of items) {
    const steps = (pro.steps ?? []).slice().sort((a, b) => a.orderNo - b.orderNo);

    for (const step of steps) {
       const stepStartVal = (step as any).startDate ?? pro.startDate;
       if (!stepStartVal) continue;

       const actualDay = startOfDay(new Date(stepStartVal));
       const actualShift = shiftFromDate(new Date(stepStartVal));

       // Check if in range
       if (actualDay >= range.start && actualDay <= range.end) {
           const slotId = `${dateKey(actualDay)}::${actualShift}`;
           const arr = map.get(slotId) ?? [];
           arr.push({
               key: `${step.id}::${slotId}`, 
               proId: pro.id,
               stepId: step.id,
               proNumber: pro.proNumber,
               productName: pro.productName,
               status: pro.status,
               orderNo: step.orderNo,
               processCode: pro.process?.code ?? "??",
               processName: pro.process?.name ?? "",
               machineName: step.machine?.name ?? null,
               up: step.up ?? 1,
               qtyPoPcs: pro.qtyPoPcs,
               startDate: applyShiftStart(actualDay, actualShift as ShiftNo),
               materials: (step as any).materials ?? [],
           });
           map.set(slotId, arr);
       }
    }
  }

  return map;
}

export default function PPICSchedule({ onSelectPro }: Props) {
  const [tab, setTab] = React.useState<"shift" | "month">("shift");

  // Machine data
  const machines = api.machines.list.useQuery();

  // View mode
  const [viewMode, setViewMode] = React.useState<"shift" | "machine">("shift");

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
        { start: tab === "month" ? calStart : weekStart, end: tab === "month" ? calEnd : weekEnd },
        (old) => {
          if (!old) return old;
          return old.map((pro) =>
            pro.id === variables.id
              ? { ...pro, startDate: variables.startDate }
              : pro
          );
        }
      );
      
      // Optimistically update detail cache
      if (previousDetail) {
        utils.pros.getById.setData(
          { id: variables.id },
          { ...previousDetail, startDate: variables.startDate }
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
                : pro
            ),
          }
        );
      }
      
      return { previousSchedule, previousDetail, previousList };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousSchedule) {
        utils.pros.getSchedule.setData(
          { start: tab === "month" ? calStart : weekStart, end: tab === "month" ? calEnd : weekEnd },
          context.previousSchedule
        );
      }
      if (context?.previousDetail) {
        utils.pros.getById.setData({ id: variables.id }, context.previousDetail);
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

  const rescheduleStep = api.pros.rescheduleStep.useMutation({
    onMutate: async (variables) => {
      await utils.pros.getSchedule.cancel();
      await utils.pros.getById.cancel();
      await utils.pros.list.cancel();
      
      const previousSchedule = utils.pros.getSchedule.getData();
      const previousList = utils.pros.list.getData({});
      
      // Find which PRO this step belongs to
      let affectedProId: number | undefined;
      if (previousSchedule) {
        for (const pro of previousSchedule) {
          if (pro.steps.some((s) => s.id === variables.stepId)) {
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
        { start: tab === "month" ? calStart : weekStart, end: tab === "month" ? calEnd : weekEnd },
        (old) => {
          if (!old) return old;
          return old.map((pro) => ({
            ...pro,
            steps: pro.steps.map((step) =>
              step.id === variables.stepId
                ? { ...step, startDate: variables.startDate }
                : step
            ),
          }));
        }
      );
      
      // Update detail cache
      if (affectedProId && previousDetail) {
        utils.pros.getById.setData(
          { id: affectedProId },
          {
            ...previousDetail,
            steps: previousDetail.steps.map((step) =>
              step.id === variables.stepId
                ? { ...step, startDate: variables.startDate }
                : step
            ),
          }
        );
      }
      
      // Update list cache (steps are included in list response)
      if (previousList) {
        utils.pros.list.setData(
          {},
          {
            ...previousList,
            items: previousList.items.map((pro) => ({
              ...pro,
              steps: pro.steps.map((step) =>
                step.id === variables.stepId
                  ? { ...step, startDate: variables.startDate }
                  : step
              ),
            })),
          }
        );
      }
      
      return { previousSchedule, previousDetail, previousList, affectedProId };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousSchedule) {
        utils.pros.getSchedule.setData(
          { start: tab === "month" ? calStart : weekStart, end: tab === "month" ? calEnd : weekEnd },
          context.previousSchedule
        );
      }
      if (context?.affectedProId && context?.previousDetail) {
        utils.pros.getById.setData({ id: context.affectedProId }, context.previousDetail);
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

  const calStart = React.useMemo(() => startOfCalendar(currentMonth), [currentMonth]);
  const calEnd = React.useMemo(() => endOfCalendar(currentMonth), [currentMonth]);

  const weekStart = React.useMemo(() => startOfWeekMonday(weekCursor), [weekCursor]);
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
    const partsActive = activeStr.split("::");
    
    // Format: stepId::dateStr or proId::...
    const id = Number(partsActive[0]);
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
    const shift: ShiftNo = (shiftVal === 2 || shiftVal === 3) ? shiftVal as ShiftNo : 1;

    const newStart = applyShiftStart(d0, shift);

    // Everything is now a step (1 step = 1 shift)
    rescheduleStep.mutate({ stepId: id, startDate: newStart });
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
    for (let i = 0; i < monthDays.length; i += 7) rows.push(monthDays.slice(i, i + 7));
    return rows;
  }, [monthDays]);

  const itemsByDay = React.useMemo(() => {
    const map = new Map<string, Array<{
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
    }>>();

    const data = monthSchedule.data ?? [];
    const q = searchQuery.toLowerCase().trim();
    const filtered = q 
      ? data.filter(pro => pro.proNumber.toLowerCase().includes(q) || pro.productName.toLowerCase().includes(q))
      : data;

    for (const pro of filtered) {
      for (const step of pro.steps ?? []) {
        const stepStartVal = (step as any).startDate ?? pro.startDate;
        if (!stepStartVal) continue;
        
        const actualDay = startOfDay(new Date(stepStartVal));
        const dateStr = dateKey(actualDay);
        
        const arr = map.get(dateStr) ?? [];
        arr.push({
          stepId: step.id,
          proId: pro.id,
          proNumber: pro.proNumber,
          productName: pro.productName,
          machineName: step.machine?.name ?? "No Machine",
          processCode: pro.process?.code ?? "",
          processName: pro.process?.name ?? "",
          orderNo: step.orderNo,
          up: step.up ?? 1,
          qtyPoPcs: pro.qtyPoPcs,
          status: pro.status,
          startDate: actualDay,
          materials: (step as any).materials ?? [],
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
    const filtered = q 
      ? data.filter(pro => pro.proNumber.toLowerCase().includes(q) || pro.productName.toLowerCase().includes(q))
      : data;
    return buildShiftSlots(filtered, { start: weekStart, end: weekEnd });
  }, [weekSchedule.data, weekStart, weekEnd, searchQuery]);

  // Machine grid data (week)
  const machineSlotData = React.useMemo(() => {
    const data = weekSchedule.data ?? [];
    const q = searchQuery.toLowerCase().trim();
    const filtered = q 
      ? data.filter(pro => pro.proNumber.toLowerCase().includes(q) || pro.productName.toLowerCase().includes(q))
      : data;
      
    const items = filtered;
    const range = { start: weekStart, end: weekEnd };
    const itemsMap = new Map<string, SlotItem[]>();
    const usageMap = new Map<string, number>();

    for (const pro of items) {
      for (const step of (pro.steps ?? [])) {
        if (!step.machine?.id) continue;
        const stepStartVal = (step as any).startDate;
        if (!stepStartVal) continue;

        const actualDay = startOfDay(new Date(stepStartVal));
        const actualShift = shiftFromDate(new Date(stepStartVal));

        const slotId = `${dateKey(actualDay)}::${step.machine.id}`;
        
        if (actualDay >= range.start && actualDay <= range.end) {
           // Key includes SHIFT now: date::machine::shift
           const slotId = `${dateKey(actualDay)}::${step.machine.id}::${actualShift}`;
           
           const arr = itemsMap.get(slotId) ?? [];
           arr.push({
              key: `${step.id}::${slotId}`, 
              proId: pro.id,
              stepId: step.id, 
              proNumber: pro.proNumber,
              productName: pro.productName,
              status: pro.status,
              orderNo: step.orderNo,
              processCode: pro.process?.code ?? "??",
              processName: pro.process?.name ?? "(tanpa nama)",
              machineName: step.machine?.name ?? null,
              up: step.up ?? 1,
              qtyPoPcs: pro.qtyPoPcs,
              startDate: applyShiftStart(actualDay, actualShift as ShiftNo),
              materials: (step as any).materials ?? [],
           });
           itemsMap.set(slotId, arr);

           // Calculate Usage
           const mats = (step as any).materials ?? [];
           const sheetMat = mats.find((m: any) => m.material?.uom?.toLowerCase() === 'sheet');
           if (sheetMat) {
              const current = usageMap.get(slotId) ?? 0;
              usageMap.set(slotId, current + Number(sheetMat.qtyReq));
           }
        }
      }
    }
    return { itemsMap, usageMap };
  }, [weekSchedule.data, weekStart, weekEnd, searchQuery]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">PPIC Schedule</h2>
          <p className="text-xs opacity-60">
             {tab === "shift" 
               ? (viewMode === "shift" ? "View per Shift (06-11, 11-16, 16-21)" : "View per Mesin (Schedule per PRO Step)") 
               : "Kalender Bulanan"
             }
          </p>
        </div>

        <div className="relative w-full sm:w-64">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input
             type="text"
             placeholder="Cari No. PRO / Produk..."
             className="pl-8"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "shift" | "month")}>
        <div className="flex items-center justify-between">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="shift">Mingguan</TabsTrigger>
            <TabsTrigger value="month">Bulanan</TabsTrigger>
          </TabsList>
          
          {tab === "shift" && (
            <div className="flex bg-muted rounded-md p-1">
               <button 
                 onClick={() => setViewMode("shift")}
                 className={`px-3 py-1 text-xs rounded-sm ${viewMode === "shift" ? "bg-background shadow font-medium" : "opacity-70 hover:opacity-100"}`}
               >
                 Shift
               </button>
               <button 
                 onClick={() => setViewMode("machine")}
                 className={`px-3 py-1 text-xs rounded-sm ${viewMode === "machine" ? "bg-background shadow font-medium" : "opacity-70 hover:opacity-100"}`}
               >
                 Mesin
               </button>
            </div>
          )}
        </div>

        <TooltipProvider delayDuration={300}>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <TabsContent value="shift" className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const d = new Date(weekCursor);
                  d.setDate(d.getDate() - 7);
                  setWeekCursor(d);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="bg-muted/50 w-56 rounded-md border py-1.5 text-center text-sm font-medium">
                {weekLabel}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const d = new Date(weekCursor);
                  d.setDate(d.getDate() + 7);
                  setWeekCursor(d);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setWeekCursor(new Date())}>
                Minggu Ini
              </Button>
            </div>

            <div className="rounded-lg border bg-card overflow-x-auto">
              <div className="min-w-[1100px]">
                <div className="grid grid-cols-[140px_repeat(7,minmax(0,1fr))]">
                  <div className="border-b border-r p-3 text-xs font-semibold opacity-60">
                    {viewMode === "shift" ? "SHIFT" : "MESIN"}
                  </div>
                  {weekDays.map((d) => (
                    <div key={dateKey(d)} className="border-b border-r p-3 text-center">
                      <div className="text-xs font-semibold">
                        {d.toLocaleDateString("id-ID", { weekday: "short" })}
                      </div>
                      <div className="text-xs opacity-70">{d.getDate()}</div>
                    </div>
                  ))}

                  {/* RENDER CONTENT BASED ON VIEW MODE */}
                  {viewMode === "shift" ? (
                    // SHIFT VIEW
                    SHIFTS.map((s) => (
                      <React.Fragment key={s.no}>
                        <div className="border-b border-r p-3">
                          <div className="text-sm font-semibold">{s.label}</div>
                          <div className="text-[11px] opacity-60">{s.time}</div>
                        </div>

                        {weekDays.map((d) => {
                          const slotId = `${dateKey(d)}::${s.no}`;
                          const slotItems = shiftSlotMap.get(slotId) ?? [];

                          return (
                            <DroppableCell
                              key={slotId}
                              id={slotId}
                              className="border-b border-r p-2 min-h-[140px]"
                            >
                               {/* Render items... reuse existing code */}
                               {weekSchedule.isLoading ? (
                                  <div className="text-[10px] opacity-40">Loading...</div>
                               ) : slotItems.length === 0 ? (
                                  <div className="text-[10px] italic opacity-25">-</div>
                               ) : (
                                  <div className="space-y-2">
                                     {slotItems.map((it) => {
                                       const { key, ...rest } = it;
                                       return (
                                         <DraggableChip 
                                           key={it.key} 
                                           id={it.key} 
                                           onSelect={() => onSelectPro?.(it.proId)}
                                           tooltip={<PROTooltipContent {...rest} />}
                                         >
                                           <div className="flex items-center justify-between gap-2">
                                              <div className="truncate font-semibold text-blue-700">{it.proNumber}</div>
                                              <Badge variant="secondary" className="h-5 text-[10px]">{it.status}</Badge>
                                           </div>
                                           <div className="truncate text-[11px] opacity-80">{it.productName}</div>
                                           <div className="mt-1 flex flex-wrap gap-1">
                                              <Badge variant="outline" className="h-4 max-w-full text-[9px]">
                                                <span className="truncate">{it.processCode} {it.processName}</span>
                                              </Badge>
                                              {it.machineName && (
                                                <Badge variant="outline" className="h-4 max-w-full text-[9px]">
                                                   <span className="truncate">M: {it.machineName}</span>
                                                </Badge>
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
                  ) : (
                    // MACHINE VIEW
                    (machines.data ?? []).map((m) => {
                       return (
                         <React.Fragment key={m.id}>
                            <div className="border-b border-r p-3">
                               <div className="text-sm font-semibold truncate" title={m.name}>{m.name}</div>
                            </div>
                            
                            {weekDays.map((d) => (
                               <div key={dateKey(d)} className="border-b border-r p-1">
                                 {[1, 2, 3].map((shiftNo) => {
                                      const slotId = `${dateKey(d)}::${m.id}::${shiftNo}`;
                                      const slotItems = machineSlotData.itemsMap.get(slotId) ?? [];
                                      const used = machineSlotData.usageMap.get(slotId) ?? 0;
                                      const cap = m.stdOutputPerShift ?? 0;
                                      const isOverload = cap > 0 && used > cap;
                                      
                                      return (
                                        <DroppableCell
                                          key={slotId}
                                          id={slotId}
                                          className={`mb-1 last:mb-0 rounded p-1.5 min-h-[60px] flex flex-col ${isOverload ? "bg-red-100/50" : "bg-muted/10 ring-1 ring-border/30"}`}
                                        >
                                           <div className={`text-[9px] mb-1 font-medium flex justify-between items-center ${isOverload ? "text-red-700" : "text-muted-foreground"}`}>
                                              <span>S{shiftNo}</span>
                                              {cap > 0 && (
                                                <span className={isOverload ? "text-red-600 font-bold" : "opacity-70"}>
                                                   {used > 0 ? `${used.toLocaleString()} / ` : ""}{cap.toLocaleString()}
                                                   {isOverload && " ⚠️"}
                                                </span>
                                              )}
                                           </div>
                                           {weekSchedule.isLoading ? (
                                              <div className="text-[9px] opacity-40">...</div>
                                           ) : (
                                              <div className="space-y-1">
                                                 {slotItems.map((it) => {
                                                   const { key, ...rest } = it;
                                                   return (
                                                     <DraggableChip 
                                                       key={it.key} 
                                                       id={it.key} 
                                                       onSelect={() => onSelectPro?.(it.proId)}
                                                       tooltip={<PROTooltipContent {...rest} />}
                                                     >
                                                        <div className="flex items-center justify-between gap-1">
                                                           <div className="truncate font-semibold text-blue-700 text-[10px]">{it.proNumber}</div>
                                                        </div>
                                                        <div className="truncate text-[9px] opacity-80" title={it.productName}>
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
                     })

                  )}
                </div>
              </div>
            </div>

            <div className="text-xs opacity-70">
              Catatan: untuk saat ini hanya PRO yang startDate-nya jatuh di minggu ini yang tampil.
            </div>
          </TabsContent>

          <TabsContent value="month" className="space-y-3">
             {/* Month view content (unchanged) */}
             <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const d = new Date(currentMonth);
                  d.setMonth(d.getMonth() - 1);
                  setCurrentMonth(d);
                }}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="bg-muted/50 w-56 rounded-md border py-1.5 text-center text-sm font-medium">
                {monthLabel}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const d = new Date(currentMonth);
                  d.setMonth(d.getMonth() + 1);
                  setCurrentMonth(d);
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date())}>
                Bulan Ini
              </Button>
            </div>

            <div className="rounded-lg border bg-card">
              <div className="grid grid-cols-7 gap-0 border-b text-[11px] font-semibold opacity-70">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div key={d} className="px-3 py-2 text-center">
                    {d}
                  </div>
                ))}
              </div>

              <div className="max-h-[70vh] overflow-y-auto">
                {monthWeeks.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-7 gap-0">
                    {row.map((day) => {
                      const k = dateKey(day);
                      const items = itemsByDay.get(k) ?? [];
                      const isThisMonth = day.getMonth() === currentMonth.getMonth();

                      return (
                        <DroppableCell
                          key={k}
                          id={k}
                          className={`min-h-[140px] border-r border-b p-2 ${!isThisMonth ? "bg-muted/40" : ""}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className={`text-xs font-semibold ${!isThisMonth ? "opacity-40" : ""}`}>
                              {day.getDate()}
                            </div>
                          </div>

                          <div className="mt-2 space-y-1.5">
                            {monthSchedule.isLoading ? (
                              <div className="text-[10px] opacity-40">Loading...</div>
                            ) : items.length === 0 ? (
                                <div className="text-[10px] italic opacity-25">-</div>
                            ) : (
                                items.map((stepInfo, idx) => (
                                  <DraggableChip
                                    key={`${stepInfo.stepId}::${k}::${idx}`}
                                    id={`${stepInfo.stepId}::${k}::${idx}`} // Unique ID for drag
                                    onSelect={() => onSelectPro?.(stepInfo.proId)}
                                    tooltip={
                                      <PROTooltipContent 
                                        {...stepInfo}
                                      />
                                    }
                                  >
                                    <div className="flex items-start justify-between gap-1">
                                      <div className="min-w-0 flex-1">
                                        <div className="truncate font-semibold text-blue-700 text-[11px]">
                                          {stepInfo.proNumber}
                                        </div>
                                        <div className="truncate text-[10px] opacity-70">
                                          {stepInfo.productName}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1">
                                      <Badge variant="secondary" className="h-4 text-[9px] font-medium">
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

            <div className="text-xs opacity-70">Drag PRO ke tanggal lain untuk mengubah startDate.</div>
          </TabsContent>
        </DndContext>
      </TooltipProvider>
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
        if (transform && (Math.abs(transform.x) > 4 || Math.abs(transform.y) > 4)) return;
        onSelect();
      }}
      className="overflow-hidden rounded border bg-background/50 p-2 text-[11px] cursor-grab active:cursor-grabbing hover:border-primary"
    >
      {children}
    </div>
  );

  if (!tooltip) return chipContent;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {chipContent}
      </TooltipTrigger>
      <TooltipContent side="right" className="max-w-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
