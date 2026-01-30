"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Calendar as CalendarIcon, Clock, HardDrive, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { id } from "date-fns/locale";

export function ScheduleList() {
  const [mounted, setMounted] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

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
    { enabled: mounted }
  );

  const nextDay = () => setDate(prev => addDays(prev, 1));
  const prevDay = () => setDate(prev => subDays(prev, 1));
  const goToToday = () => setDate(new Date());

  // Generate 7 days for the picker (3 before, current, 3 after)
  const days = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(date, i - 3));
  }, [date]);

  if (!mounted) return null;


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50 pb-24">
      {/* Header with Glassmorphism */}
      <div className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 pt-5 shadow-sm">
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              gatau diisi apa
            </h1>
            <div className="flex items-center gap-2">
               {!isSameDay(date, new Date()) && (
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={goToToday}
                   className="h-7 px-2 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                 >
                   HARI INI
                 </Button>
               )}
               <Badge variant="outline" className="font-mono text-[10px] px-2 py-0 border-primary/20 bg-primary/5 text-primary">
                 OPERATOR
               </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevDay} className="h-8 w-8 rounded-full">
               <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                {format(date, "MMMM yyyy", { locale: id })}
              </span>
              <span className="text-sm font-black">
                 {format(date, "EEEE, dd", { locale: id })}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={nextDay} className="h-8 w-8 rounded-full">
               <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Horizontal Date Picker */}
        <div className="flex items-center justify-between px-2 pb-3 overflow-x-auto no-scrollbar scroll-smooth">
          {days.map((d, i) => {
            const active = isSameDay(d, date);
            const isToday = isSameDay(d, new Date());
            return (
              <button
                key={i}
                onClick={() => setDate(d)}
                className={`flex flex-col items-center min-w-[14.28%] py-2 transition-all duration-300 ${
                  active ? 'scale-110' : 'opacity-50'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-tighter ${active ? 'text-blue-600' : ''}`}>
                  {format(d, "EEE", { locale: id })}
                </span>
                <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center text-sm font-black ${
                  active 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                    : isToday 
                    ? 'border-2 border-blue-600 text-blue-600'
                    : ''
                }`}>
                  {format(d, "d")}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {schedule.isLoading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        )}

        {schedule.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground/50">
            <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-full mb-4">
              <CalendarIcon className="h-12 w-12 opacity-20" />
            </div>
            <p className="text-sm font-medium">Belum ada tugas hari ini</p>
          </div>
        )}

        <div className="space-y-4">
          {schedule.data?.flatMap(pro => 
            pro.steps.map(step => {
               const stepDate = step.startDate ? new Date(step.startDate) : null;
               if (!stepDate || stepDate < startOfDay || stepDate > endOfDay) return null;
               const shift = getShift(stepDate);
               
               return { pro, step, shift };
            })
          )
          .filter(Boolean)
          .sort((a, b) => (a?.shift ?? 0) - (b?.shift ?? 0))
          .map((item, idx) => {
            if (!item) return null;
            const { pro, step, shift } = item;

            return (
              <Card 
                key={`${pro.id}-${step.id}-${idx}`} 
                className="group relative overflow-hidden rounded-[2rem] border-none bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/50 dark:ring-slate-800"
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-2 h-full ${
                  shift === 1 ? 'bg-amber-400' : shift === 2 ? 'bg-blue-500' : 'bg-indigo-600'
                }`} />

                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                         <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                           shift === 1 ? 'bg-amber-100 text-amber-700' : 
                           shift === 2 ? 'bg-blue-100 text-blue-700' : 
                           'bg-indigo-100 text-indigo-700'
                         }`}>
                           Shift {shift}
                         </div>
                         <span className="text-xs text-muted-foreground font-mono">
                           {format(new Date(step.startDate!), "HH:mm")}
                         </span>
                      </div>
                      <h3 className="text-xl font-black leading-tight tracking-tight mt-1">
                         {pro.productName}
                      </h3>
                      <div className="text-[10px] font-bold text-muted-foreground/60 tracking-wider">
                         NO. PRO: {pro.proNumber}
                      </div>
                    </div>
                    <Badge className="rounded-full px-3 py-1 font-bold text-[10px]">
                      {pro.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                           <HardDrive className="h-3 w-3" /> Mesin
                        </span>
                        <span className="text-sm font-black truncate">{step.machine?.name ?? "-"}</span>
                     </div>
                     <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                           <Package className="h-3 w-3" /> Target
                        </span>
                        <span className="text-sm font-black truncate">{pro.qtyPoPcs.toLocaleString("id-ID")} pcs</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mb-4">
                     <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                           <span className="text-[10px] font-black text-blue-600 uppercase">P</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[8px] font-bold text-muted-foreground uppercase leading-none">Proses</span>
                           <span className="text-xs font-black">{pro.process?.name}</span>
                        </div>
                     </div>
                     <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase">
                        UP: {step.up ?? "-"}
                     </div>
                  </div>

                  {/* Materials Section */}
                  <div className="space-y-2">
                     <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1 px-1">
                        Bahan Baku
                     </div>
                     <div className="space-y-1.5">
                        {(step as any).materials && (step as any).materials.length > 0 ? (
                           (step as any).materials.map((m: any, mIdx: number) => (
                              <div key={mIdx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                                 <span className="text-xs font-bold truncate pr-2">{m.material?.name}</span>
                                 <div className="text-xs font-black whitespace-nowrap bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm">
                                    {Number(m.qtyReq).toLocaleString("id-ID")} <span className="text-[10px] font-bold text-muted-foreground">{m.material?.uom}</span>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="text-[10px] text-muted-foreground/50 italic px-1">
                              Tidak ada kebutuhan bahan baku khusus
                           </div>
                        )}
                     </div>
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
