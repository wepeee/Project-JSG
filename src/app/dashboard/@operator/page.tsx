"use client";

import * as React from "react";
import { ScheduleList } from "./_components/schedule-list";
import { HistoryList } from "./_components/history-list";
import { OperatorNav } from "./_components/operator-nav";
import { SettingsTab } from "./_components/settings-tab";

export default function OperatorDashboard() {
  const [activeTab, setActiveTab] = React.useState<
    "schedule" | "history" | "settings"
  >("schedule");

  return (
    <main className="relative min-h-screen">
      {activeTab === "schedule" && <ScheduleList />}
      {activeTab === "history" && <HistoryList />}
      {activeTab === "settings" && <SettingsTab />}
      <OperatorNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}
