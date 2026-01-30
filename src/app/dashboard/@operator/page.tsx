"use client";

import * as React from "react";
import { ScheduleList } from "./_components/schedule-list";
import { HistoryList } from "./_components/history-list";
import { OperatorNav } from "./_components/operator-nav";

export default function OperatorDashboard() {
  const [activeTab, setActiveTab] = React.useState<'schedule' | 'history'>('schedule');

  return (
    <main className="relative min-h-screen">
      {activeTab === 'schedule' ? <ScheduleList /> : <HistoryList />}
      <OperatorNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </main>
  );
}
