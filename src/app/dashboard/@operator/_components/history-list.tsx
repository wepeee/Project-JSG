"use client";

import { Card, CardContent } from "~/components/ui/card";
import { History, Search, HardDrive, Package, AlertTriangle, Calendar } from "lucide-react";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function HistoryList() {
  const { data: session } = useSession();
  
  // Get all production reports (not filtered by user)
  const { data: history, isLoading } = api.production.getHistory.useQuery(
    { 
      // Don't filter by createdById to show all reports
      // This allows operators to see all production reports
    },
    { 
      enabled: !!session?.user?.id,
    }
  );

  // Debug logging
  useEffect(() => {
    if (history) {
      console.log("📊 History data:", history);
      console.log("👤 Current user ID:", session?.user?.id);
    }
  }, [history, session?.user?.id]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950/50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50 p-5 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Riwayat Laporan
        </h1>
        
        {/* Search/Filter Placeholder */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Cari mesin atau produk..." 
            className="w-full h-11 pl-10 pr-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border-none text-sm focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            disabled // todo: implement filters
          />
        </div>
      </div>

      {!isLoading && (!history || history.length === 0) && (
        <div className="p-4 flex flex-col items-center justify-center py-32 text-muted-foreground/50">
           <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-full mb-4">
               <History className="h-12 w-12 opacity-20" />
           </div>
           <p className="text-sm font-bold uppercase tracking-widest">Belum Ada Riwayat</p>
           <p className="text-xs mt-1">Laporan produksi yang disimpan akan muncul di sini.</p>
        </div>
      )}

      {/* Real Data Cards */}
      <div className="px-4 py-4 space-y-4">
        {history?.map((report) => (
          <Card key={report.id} className="rounded-[2rem] border-none shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-900">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                 <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                       <HardDrive className="h-6 w-6" />
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                          {report.step.pro.productName}
                       </h3>
                       <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                           <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                              {report.step.pro.proNumber}
                           </span>
                           <span>&bull;</span>
                           <span>{report.step.machine?.name}</span>
                       </div>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Shift {report.shift}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                       <Calendar className="h-3 w-3" />
                       {format(new Date(report.reportDate), "dd MMM yyyy", { locale: id })}
                    </div>
                 </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950/50 rounded-xl p-3 border border-slate-100 dark:border-slate-800/50">
                 <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Good / Pass</span>
                    <div className="flex items-center gap-1.5 font-bold text-emerald-500">
                        <Package className="h-3.5 w-3.5" />
                        {(Number(report.qtyGood) + Number(report.qtyPassOn)).toLocaleString()}
                    </div>
                 </div>
                 <div className="space-y-1 border-l border-slate-200 dark:border-slate-800 pl-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Reject</span>
                    <div className="flex items-center gap-1.5 font-bold text-red-500">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {Number(report.qtyReject).toLocaleString()}
                    </div>
                 </div>
                 <div className="space-y-1 border-l border-slate-200 dark:border-slate-800 pl-3">
                     <span className="text-[10px] text-slate-400 uppercase font-bold">Downtime</span>
                     <div className="font-bold text-amber-500">
                        {report.totalDowntime} <span className="text-[10px] font-normal">mnt</span>
                     </div>
                 </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                 <div>
                    Opr: <span className="font-bold text-slate-600 dark:text-slate-300">{report.operatorName}</span>
                 </div>
                 <div>
                    {report.reportType.replace("_", " ")}
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
