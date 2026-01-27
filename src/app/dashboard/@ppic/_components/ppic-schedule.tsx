"use client";
import * as React from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { DndContext, useDraggable, useDroppable, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  onSelectPro?: (id: number) => void;
};

export default function PPICSchedule({ onSelectPro }: Props) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [viewMode, setViewMode] = React.useState<"week" | "day">("week");

  // Get start and end of week
  const startOfWeek = React.useMemo(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentDate]);

  const endOfWeek = React.useMemo(() => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + 6);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [startOfWeek]);

  const schedule = api.pros.getSchedule.useQuery({
    start: startOfWeek,
    end: endOfWeek,
  });

  const weekDays = React.useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [startOfWeek]);

  const next = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + (viewMode === "week" ? 7 : 1));
    setCurrentDate(d);
  };

  const prev = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - (viewMode === "week" ? 7 : 1));
    setCurrentDate(d);
  };

  // Helper untuk hitung total shift (sama seperti di ProList)
  const getShiftsNeeded = (item: any) => {
    const step = item.steps?.[0];
    const std = step?.machine?.stdOutputPerShift;
    const up = step?.up ?? 1;
    if (!std || std <= 0) return 1;
    return Math.ceil((item.qtyPoPcs / up) / std);
  };

  const utils = api.useUtils();
  const reschedule = api.pros.reschedule.useMutation({
    onSuccess: () => {
      void utils.pros.getSchedule.invalidate();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // Parse composite ID "123::2024-01-01..." -> 123
      const idStr = String(active.id);
      const proId = idStr.includes("::") ? Number(idStr.split("::")[0]) : Number(idStr);
      
      const newDate = new Date(over.id as string);
      reschedule.mutate({ id: proId, startDate: newDate });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">Production Calendar</h2>
          <div className="flex bg-muted p-1 rounded-md border">
            <button
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 text-xs rounded ${viewMode === "week" ? "bg-background shadow-sm font-bold" : "opacity-60"}`}
            >
              Mingguan
            </button>
            <button
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 text-xs rounded ${viewMode === "day" ? "bg-background shadow-sm font-bold" : "opacity-60"}`}
            >
              Harian
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium w-48 text-center bg-muted/50 py-1.5 rounded-md border">
            {viewMode === "week" 
              ? `${startOfWeek.toLocaleDateString("id-ID", { day: "numeric" })} - ${endOfWeek.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
              : currentDate.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
            }
          </div>
          <Button variant="outline" size="sm" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())}>
            Hari Ini
          </Button>
        </div>
      </div>

      {viewMode === "week" ? (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => (
              <DroppableDay key={day.toISOString()} day={day} isToday={new Date().toDateString() === day.toDateString()}>
                {schedule.isLoading ? (
                  <div className="text-[10px] opacity-40">Loading...</div>
                ) : (
                  schedule.data
                    ?.filter((item) => {
                      const start = new Date(item.startDate!);
                      start.setHours(0, 0, 0, 0);

                      const shifts = getShiftsNeeded(item);
                      const daysDuration = Math.ceil(shifts / 3);
                      
                      const end = new Date(start);
                      end.setDate(end.getDate() + daysDuration - 1);
                      end.setHours(23, 59, 59, 999);
                      
                      const current = new Date(day);
                      current.setHours(0, 0, 0, 0);
                      
                      return current >= start && current <= end;
                    })
                    .map((item) => (
                      <DraggablePro 
                        // Use a unique composite ID for each day instance to avoid dnd-kit collisions
                        id={`${item.id}::${day.toISOString()}`}
                        key={`${item.id}-${day.toISOString()}`} 
                        item={item} 
                        onSelect={() => onSelectPro?.(item.id)} 
                        shiftsNeeded={getShiftsNeeded(item)}
                      />
                    ))
                )}
                {!schedule.isLoading && schedule.data?.filter((item) => {
                      const start = new Date(item.startDate!);
                      start.setHours(0, 0, 0, 0);
                      const shifts = getShiftsNeeded(item);
                      const daysDuration = Math.ceil(shifts / 3);
                      const end = new Date(start);
                      end.setDate(end.getDate() + daysDuration - 1);
                      end.setHours(23, 59, 59, 999);
                      const current = new Date(day);
                      current.setHours(0, 0, 0, 0);
                      return current >= start && current <= end;
                }).length === 0 && (
                  <div className="text-[10px] opacity-20 italic text-center pt-8 font-medium">No Schedule</div>
                )}
              </DroppableDay>
            ))}
          </div>
        </DndContext>
      ) : (
        /* DAILY SHIFT VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((shiftNum) => (
            <div key={shiftNum} className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-t-lg border-b-2 border-primary">
                <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                  {shiftNum}
                </div>
                <h3 className="font-bold text-sm">SHIFT {shiftNum}</h3>
                <span className="ml-auto text-[10px] opacity-60">
                  {shiftNum === 1 ? "06:00 - 11:00" : shiftNum === 2 ? "11:00 - 16:00" : "16:00 - 21:00"}
                </span>
              </div>
              
              <div className="space-y-3 min-h-[400px] p-3 border rounded-b-lg bg-slate-50/30">
                {schedule.data?.filter(item => {
                  const start = new Date(item.startDate!);
                  if (start.toDateString() !== currentDate.toDateString()) return false;
                  
                  // Logic sederhana: jika PRO butuh > 1 shift, tampilkan di shift berikutnya juga
                  // Untuk demo, kita tampilkan di Shift 1 jika itu hari mulainya
                  // Nanti bisa dikembangkan untuk durasi yang lebih akurat
                  const needed = getShiftsNeeded(item);
                  if (shiftNum === 1) return true;
                  if (shiftNum === 2 && needed >= 2) return true;
                  if (shiftNum === 3 && needed >= 3) return true;
                  return false;
                }).map(item => (
                  <Card 
                    key={`${shiftNum}-${item.id}`} 
                    className="cursor-pointer hover:border-primary transition-all shadow-sm overflow-hidden"
                    onClick={() => onSelectPro?.(item.id)}
                  >
                    <div className="bg-blue-600 h-1 w-full" />
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.proNumber}</p>
                          <h4 className="text-sm font-semibold leading-tight">{item.productName}</h4>
                        </div>
                        <Badge variant="outline" className="text-[9px] h-5">
                          {item.status}
                        </Badge>
                      </div>
                      <Separator className="my-2" />
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <p className="opacity-60 text-[9px] uppercase font-bold">Mesin</p>
                          <p className="font-medium truncate">{item.steps?.[0]?.machine?.name ?? "-"}</p>
                        </div>
                        <div className="text-right">
                          <p className="opacity-60 text-[9px] uppercase font-bold">Target Qty</p>
                          <p className="font-bold">{item.qtyPoPcs.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="opacity-60 text-[9px] uppercase font-bold mb-1">List Proses</p>
                        <div className="flex flex-wrap gap-1">
                          {item.steps?.map((step: any) => (
                            <Badge key={step.id} variant="secondary" className="text-[8px] py-0 px-1.5 h-4">
                              {step.process?.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  <div className="flex items-center justify-center h-40 text-xs opacity-30 italic">
                    Tidak ada jadwal
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-muted/30 p-4 rounded-lg border text-xs opacity-70 flex items-center gap-2">
        <span className="bg-primary/20 p-1 rounded text-primary font-bold">💡 TIPS</span>
        <p>Gunakan tombol <b>Harian</b> untuk melihat detail pembagian kerja per shift dan jam operasional.</p>
      </div>
    </div>
  );
}

function DroppableDay({ day, isToday, children }: { day: Date; isToday: boolean; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: day.toISOString(),
  });

  return (
    <Card 
      ref={setNodeRef} 
      className={`transition-colors ${isToday ? "border-primary border-2 shadow-sm" : ""} ${isOver ? "bg-primary/5 border-primary border-dashed" : ""}`}
    >
      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-bold opacity-60 uppercase">
            {day.toLocaleDateString("id-ID", { weekday: "short" })}
          </span>
          <span className={`text-sm font-bold ${isToday ? "text-primary" : ""}`}>
            {day.getDate()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-2 min-h-[150px] space-y-2">
        {children}
      </CardContent>
    </Card>
  );
}

function DraggablePro({ item, onSelect, shiftsNeeded, id }: { item: any; onSelect: () => void; shiftsNeeded: number; id?: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: id ?? item.id.toString(),
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        // Prevent drag triggers from firing when just clicking
        if (transform && (Math.abs(transform.x) > 5 || Math.abs(transform.y) > 5)) return;
        onSelect();
      }}
      className="text-[10px] p-2 rounded bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 cursor-grab active:cursor-grabbing hover:bg-blue-100 transition-colors shadow-sm mb-2"
    >
      <div className="font-bold truncate text-blue-700 dark:text-blue-300">{item.proNumber}</div>
      <div className="opacity-80 truncate mb-1">{item.productName}</div>
      <div className="flex justify-between items-center">
        <span className="font-medium">{item.qtyPoPcs.toLocaleString()}</span>
        <span className="bg-blue-200 dark:bg-blue-800 px-1 rounded text-[9px]">
          {shiftsNeeded} S
        </span>
      </div>
    </div>
  );
}
