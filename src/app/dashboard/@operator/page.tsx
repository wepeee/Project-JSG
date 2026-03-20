"use client";

import * as React from "react";
import { Calendar, History, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { ScheduleList } from "./_components/schedule-list";
import { HistoryList } from "./_components/history-list";
import { OperatorNav } from "./_components/operator-nav";
import { SettingsTab } from "./_components/settings-tab";

type OperatorTab = "schedule" | "history" | "settings";

const OPERATOR_PATH_BY_TAB: Record<OperatorTab, string> = {
  schedule: "/dashboard/schedule",
  history: "/dashboard/history",
  settings: "/dashboard/settings",
};

function resolveOperatorTab(pathname: string): OperatorTab {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/schedule")) {
    return "schedule";
  }
  if (pathname.startsWith("/dashboard/history")) {
    return "history";
  }
  if (pathname.startsWith("/dashboard/settings")) {
    return "settings";
  }
  return "schedule";
}

export default function OperatorDashboard() {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = React.useMemo(
    () => resolveOperatorTab(pathname || "/dashboard"),
    [pathname],
  );

  const navigate = React.useCallback(
    (tab: OperatorTab) => {
      const nextPath = OPERATOR_PATH_BY_TAB[tab];
      if (pathname !== nextPath) {
        router.push(nextPath);
      }
    },
    [pathname, router],
  );

  const tabs: Array<{
    key: OperatorTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { key: "schedule", label: "Jadwal", icon: Calendar },
    { key: "history", label: "Riwayat", icon: History },
    { key: "settings", label: "Akun", icon: User },
  ];

  return (
    <main className="relative min-h-screen lg:flex">
      <aside className="bg-background hidden w-64 shrink-0 border-r lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="px-5 py-5">
          <h1 className="text-lg font-semibold">Dashboard Operator</h1>
          <p className="text-muted-foreground mt-1 text-xs">
            Input laporan harian produksi
          </p>
        </div>

        <nav className="space-y-1 px-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => navigate(tab.key)}
                className={[
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0 flex-1">
        {activeTab === "schedule" && <ScheduleList />}
        {activeTab === "history" && <HistoryList />}
        {activeTab === "settings" && <SettingsTab />}
      </section>

      <OperatorNav activeTab={activeTab} onNavigate={navigate} />
    </main>
  );
}
