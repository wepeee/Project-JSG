"use client";

import { Card, CardContent } from "~/components/ui/card";
import { History, Search, HardDrive } from "lucide-react";

export function HistoryList() {
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
            disabled
          />
        </div>
      </div>

      <div className="p-4 flex flex-col items-center justify-center py-32 text-muted-foreground/50">
        <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-full mb-4">
          <History className="h-12 w-12 opacity-20" />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest">Belum Ada Riwayat</p>
        <p className="text-xs mt-1">Data laporan per mesin akan muncul di sini.</p>
      </div>

      {/* Draft Style Placeholder Cards */}
      <div className="px-4 space-y-4 opacity-30 grayscale pointer-events-none">
        {[1, 2].map((i) => (
          <Card key={i} className="rounded-[2rem] border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                   <HardDrive className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                  <div className="h-3 w-32 bg-slate-100 rounded mt-1" />
                </div>
              </div>
              <div className="h-16 bg-slate-50 rounded-2xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
