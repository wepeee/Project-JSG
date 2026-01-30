"use client";

import { Calendar, User, LogOut, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function OperatorNav({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: 'schedule' | 'history',
  setActiveTab: (tab: 'schedule' | 'history') => void
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg lg:hidden">
      <div className="flex h-16 items-center justify-around px-4">
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'schedule' ? 'text-blue-600 scale-110' : 'text-muted-foreground'}`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] font-bold">Jadwal</span>
        </button>

        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'history' ? 'text-blue-600 scale-110' : 'text-muted-foreground'}`}
        >
          <History className="h-5 w-5" />
          <span className="text-[10px] font-bold">Riwayat</span>
        </button>

        <button 
          onClick={() => signOut()}
          className="flex flex-col items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-[10px] font-bold">Keluar</span>
        </button>
      </div>
    </nav>
  );
}
