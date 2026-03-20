"use client";

import { Calendar, History, User } from "lucide-react";

type OperatorTab = "schedule" | "history" | "settings";

export function OperatorNav({
  activeTab,
  onNavigate,
}: {
  activeTab: OperatorTab;
  onNavigate: (tab: OperatorTab) => void;
}) {
  return (
    <nav className="bg-background/80 fixed right-0 bottom-0 left-0 z-50 border-t backdrop-blur-lg lg:hidden">
      <div className="flex h-16 items-center justify-around px-4">
        <button
          type="button"
          onClick={() => onNavigate("schedule")}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === "schedule" ? "text-primary scale-110" : "text-muted-foreground"}`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-[10px] font-bold">Jadwal</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("history")}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === "history" ? "text-primary scale-110" : "text-muted-foreground"}`}
        >
          <History className="h-5 w-5" />
          <span className="text-[10px] font-bold">Riwayat</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate("settings")}
          className={`flex flex-col items-center gap-1 transition-all ${activeTab === "settings" ? "text-primary scale-110" : "text-muted-foreground"}`}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold">Akun</span>
        </button>
      </div>
    </nav>
  );
}
