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
import { ChevronLeft, ChevronRight } from "lucide-react";

import { api, type RouterOutputs } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

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
  stepId?: number; // Add this
  shiftIndex?: number; // Add this for per-shift tracking
  proNumber: string;
  productName: string;
  status: string;
  orderNo: number;
  processCode: string;
  processName: string;
  machineName: string | null;
};

function buildShiftSlots(items: ScheduleItem[], range: { start: Date; end: Date }) {
  const map = new Map<string, SlotItem[]>();

  for (const pro of items) {
    const steps = (pro.steps ?? []).slice().sort((a, b) => a.orderNo - b.orderNo);

    // Initial cursor based on PRO start
    let cursorDate = pro.startDate ? new Date(pro.startDate) : null;
    let cursorDay = cursorDate ? startOfDay(cursorDate) : null;
    let cursorShift: ShiftNo = cursorDate ? shiftFromDate(cursorDate) : 1;

    for (const step of steps) {
       // Check if step has specific start
       const stepStart = (step as any).startDate;
       if (stepStart) {
          const d = new Date(stepStart);
          cursorDay = startOfDay(d);
          cursorShift = shiftFromDate(d);
       }
       
       if (!cursorDay) continue;

       const need = shiftsNeededForStep({
          qtyPoPcs: pro.qtyPoPcs,
          up: step.up ?? null,
          stdOutputPerShift: step.machine?.stdOutputPerShift,
       });

       // Check if step has custom shift scheduling
       const customShifts = (step as any).shifts ?? [];
       const shiftMap = new Map<number, Date>(
         customShifts.map((s: any) => [s.shiftIndex, new Date(s.scheduledDate)] as [number, Date])
       );

       for (let i = 0; i < need; i++) {
          // Use custom shift date if available, otherwise use calculated cursor
          let actualDay: Date;
          let actualShift: ShiftNo;
          
          const customDate = shiftMap.get(i);
          if (customDate) {
             actualDay = startOfDay(customDate);
             actualShift = shiftFromDate(customDate);
          } else {
             actualDay = cursorDay;
             actualShift = cursorShift;
          }

          const slotId = `${dateKey(actualDay)}::${actualShift}`;

          if (actualDay >= range.start && actualDay <= range.end) {
             const arr = map.get(slotId) ?? [];
             arr.push({
                key: `${step.id}::${i}::${slotId}`, // stepId::shiftIndex::slotId
                proId: pro.id,
                stepId: step.id,
                shiftIndex: i, // Add shift index
                proNumber: pro.proNumber,
                productName: pro.productName,
                status: pro.status,
                orderNo: step.orderNo,
                processCode: step.process?.code ?? "??",
                processName: step.process?.name ?? "(tanpa nama)",
                machineName: step.machine?.name ?? null,
             });
             map.set(slotId, arr);
          }

          // Advance cursor for next iteration (if no custom date)
          if (!shiftMap.has(i + 1)) {
             if (cursorShift < 3) {
                cursorShift = (cursorShift + 1) as ShiftNo;
             } else {
                cursorShift = 1;
                cursorDay = new Date(cursorDay);
                cursorDay.setDate(cursorDay.getDate() + 1);
             }
          }
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

  // Month state
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  // Week state
  const [weekCursor, setWeekCursor] = React.useState(new Date());

  const utils = api.useUtils();
  const reschedule = api.pros.reschedule.useMutation({
    onSuccess: () => {
      // Invalidate all PRO queries for auto-refresh across all pages
      void utils.pros.invalidate();
    },
  });

  const rescheduleStep = api.pros.rescheduleStep.useMutation({
    onSuccess: () => {
      void utils.pros.invalidate();
    },
  });

  const rescheduleShift = api.pros.rescheduleShift.useMutation({
    onSuccess: () => {
      void utils.pros.invalidate();
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
    // ID format: 
    // Shift view: "proId::dateKey::shift" (actually just proId originally, but I changed it?) 
    // Wait, original shift logic used "proId::...". My recent update to buildMachineSlots uses "stepId::slotId::i".
    
    // Let's parse carefully.
    // If viewMode === "machine", the ID is `stepId::slotId::i` -> `stepId::date::machineId::i`
    // BUT `handleDragEnd` needs to know WHAT we are dragging.
    
    // In buildMachineSlots: key: `${step.id}::${slotId}::${i}` where slotId = `${dateKey(day)}::${step.machine.id}`
    // So key = `stepId::date::machineId::i`
    
    if (viewMode === "machine") {
       const [stepIdStr, dateStr, machineIdStr] = partsActive;
       const stepId = Number(stepIdStr);
       
       const overStr = String(over.id); 
       // over.id is slotId = `date::machineId`
       const overParts = overStr.split("::");
       const overDateStr = overParts[0];
       // const overMachineId = overParts[1];
       
       const dOver = keyToDate(overDateStr ?? "");
       if (!dOver || !Number.isFinite(stepId)) return;
       
       rescheduleStep.mutate({ stepId, startDate: dOver });
       return;
    }

    // SHIFT VIEW LOGIC - Per-Shift Granular Scheduling
    if (viewMode === "shift") {
       const activeStr = String(active.id);
       
       // New format from buildShiftSlots: stepId::shiftIndex::slotId
       // slotId = dateKey::shift
       // So total: stepId::shiftIndex::date::shift (4 parts)
       
       if (activeStr.includes("::")) {
          const parts = activeStr.split("::");
          
          // Check if it's the new per-shift format (4+ parts)
          if (parts.length >= 4) {
             const stepId = Number(parts[0]);
             const shiftIndex = Number(parts[1]);
             
             // Target slot: date::shift
             const overStr = String(over.id);
             const overParts = overStr.split("::");
             const dateStr = overParts[0] ?? "";
             const shiftStr = overParts[1];
             
             const d0 = keyToDate(dateStr);
             if (d0 && Number.isFinite(stepId) && Number.isFinite(shiftIndex)) {
                const shift: ShiftNo = (() => {
                  const s = shiftStr ? Number(shiftStr) : 1;
                  if (s === 2) return 2;
                  if (s === 3) return 3;
                  return 1;
                })();
                
                const scheduledDate = applyShiftStart(d0, shift);
                
                // Use the new per-shift mutation
                rescheduleShift.mutate({ stepId, shiftIndex, scheduledDate });
                return;
             }
          }
       }

       // Fallback (shouldn't happen with new format, but kept for safety)
       const proIdStr = activeStr.includes("::") ? activeStr.split("::")[0] : activeStr;
       const proId = Number(proIdStr);
       
       const overStr = String(over.id);
       const parts = overStr.split("::");
       const dateStr = parts[0] ?? "";
       const shiftStr = parts[1];
       
       const d0 = keyToDate(dateStr);
       
       if (d0 && Number.isFinite(proId)) {
          const shift: ShiftNo = (() => {
            const s = shiftStr ? Number(shiftStr) : 1;
            if (s === 2) return 2;
            if (s === 3) return 3;
            return 1;
          })();

          const newStart = applyShiftStart(d0, shift);
          reschedule.mutate({ id: proId, startDate: newStart });
       }
    }
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
    const map = new Map<string, ScheduleItem[]>();
    for (const item of monthSchedule.data ?? []) {
      if (!item.startDate) continue;
      const key = dateKey(new Date(item.startDate));
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    }
    return map;
  }, [monthSchedule.data]);

  // Shift grid data (week)
  const shiftSlotMap = React.useMemo(() => {
    return buildShiftSlots(weekSchedule.data ?? [], { start: weekStart, end: weekEnd });
  }, [weekSchedule.data, weekStart, weekEnd]);

  // Machine grid data (week)
  const machineSlotMap = React.useMemo(() => {
    const items = weekSchedule.data ?? [];
    const range = { start: weekStart, end: weekEnd };
    const map = new Map<string, SlotItem[]>();

    for (const pro of items) {
      // For machine view, we look at STEPS, not just the PRO start date.
      const steps = (pro.steps ?? []).slice().sort((a, b) => a.orderNo - b.orderNo);
      
      for (const step of steps) {
        // We need a machine to show in machine view
        if (!step.machine?.id) continue;

        // Determine start date for this STEP
        // If step has startDate, use it. Else fallback to pro.startDate?
        const stepStartVal = (step as any).startDate ?? pro.startDate; // Cast to any if types are stale
        if (!stepStartVal) continue;

        const start = new Date(stepStartVal);
        let day = startOfDay(start);
        let shift = shiftFromDate(start);

        const need = shiftsNeededForStep({
          qtyPoPcs: pro.qtyPoPcs,
          up: step.up ?? null,
          stdOutputPerShift: step.machine?.stdOutputPerShift,
        });

        for (let i = 0; i < need; i++) {
          const slotId = `${dateKey(day)}::${step.machine.id}`;
          
          if (day >= range.start && day <= range.end) {
             const arr = map.get(slotId) ?? [];
             arr.push({
                key: `${step.id}::${slotId}::${i}`, // Use STEP ID
                proId: pro.id,
                stepId: step.id, // Add stepId
                proNumber: pro.proNumber,
                productName: pro.productName,
                status: pro.status,
                orderNo: step.orderNo,
                processCode: step.process?.code ?? "??",
                processName: step.process?.name ?? "(tanpa nama)",
                machineName: step.machine?.name ?? null,
             });
             map.set(slotId, arr);
          }

          // Advance logic
          if (shift < 3) {
             shift = (shift + 1) as ShiftNo;
             // Date stays same
          } else {
             shift = 1;
             day = new Date(day);
             day.setDate(day.getDate() + 1);
          }
        }
      }
    }
    return map;
  }, [weekSchedule.data, weekStart, weekEnd]);

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
                                     {slotItems.map((it) => (
                                       <DraggableChip key={it.key} id={it.key} onSelect={() => onSelectPro?.(it.proId)}>
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
                                     ))}
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
                            
                            {weekDays.map((d) => {
                               const slotId = `${dateKey(d)}::${m.id}`;
                               const slotItems = machineSlotMap.get(slotId) ?? [];
                               
                               return (
                                 <DroppableCell
                                   key={slotId}
                                   id={slotId}
                                   className="border-b border-r p-2 min-h-[100px]"
                                 >
                                    {weekSchedule.isLoading ? (
                                       <div className="text-[10px] opacity-40">Loading...</div>
                                    ) : slotItems.length === 0 ? (
                                       <div className="text-[10px] italic opacity-25">-</div>
                                    ) : (
                                       <div className="space-y-2">
                                          {slotItems.map((it) => (
                                            <DraggableChip key={it.key} id={it.key} onSelect={() => onSelectPro?.(it.proId)}>
                                               <div className="flex items-center justify-between gap-2">
                                                  <div className="truncate font-semibold text-blue-700">{it.proNumber}</div>
                                               </div>
                                               <div className="truncate text-[11px] opacity-80" title={it.productName}>
                                                  {it.productName}
                                               </div>
                                               <div className="mt-1">
                                                   <Badge variant="outline" className="h-4 max-w-full text-[9px]">
                                                      <span className="truncate">{it.processCode} {it.processName}</span>
                                                   </Badge>
                                               </div>
                                            </DraggableChip>
                                          ))}
                                       </div>
                                    )}
                                 </DroppableCell>
                               );
                            })}
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
                            {items.length ? (
                              <Badge variant="secondary" className="h-5 text-[10px]">
                                {items.length} PRO
                              </Badge>
                            ) : null}
                          </div>

                          <div className="mt-2 space-y-2">
                            {monthSchedule.isLoading ? (
                              <div className="text-[10px] opacity-40">Loading...</div>
                            ) : items.length === 0 ? (
                              <div className="text-[10px] italic opacity-25">No Schedule</div>
                            ) : (
                              items.map((item) => (
                                <DraggableChip
                                  key={`${item.id}::${k}`}
                                  id={`${item.id}::${k}`}
                                  onSelect={() => onSelectPro?.(item.id)}
                                >
                                  <div className="truncate font-semibold text-blue-700">
                                    {item.proNumber}
                                  </div>
                                  <div className="truncate text-[11px] opacity-80">{item.productName}</div>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {(item.steps ?? []).map((st) => (
                                      <Badge key={st.id} variant="outline" className="h-4 max-w-full text-[9px]">
                                        <span className="truncate">
                                          {st.process?.code} {st.process?.name}
                                        </span>
                                      </Badge>
                                    ))}
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
}: {
  id: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.6 : undefined,
  };

  return (
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
}
