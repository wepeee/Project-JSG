"use client";

import { useState } from "react";

import { api } from "../../../../../../trpc/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Loader2, TrendingUp, AlertCircle, Clock, CheckCircle } from "lucide-react";
import DowntimeWeeksChart from "./downtime-weeks-chart";

type Props = {
  department?: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export default function DashboardOverview({ department }: Props) {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const safeDepartment =
    typeof department === "string" ? department : undefined;

  const { data, isLoading, error } = api.dashboard.getStats.useQuery(
    safeDepartment ? { department: safeDepartment } : {},
  );

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-red-500">
        Error loading dashboard data: {error.message}
      </div>
    );
  }

  if (!data) return null;

  const { summary, dailyProduction, weeklyProduction, downtimeTypes, rejectTypes } = data;

  const chartData = viewMode === "daily" ? dailyProduction : weeklyProduction;

  // Calculate Efficiency (Simple: Good / Total * 100) or similar
  const efficiency =
    summary.totalOutput > 0
      ? ((summary.totalGood / summary.totalOutput) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Output"
          value={summary.totalOutput.toLocaleString()}
          description="PCS (30 Hari Terakhir)"
          icon={<TrendingUp className="h-4 w-4 text-blue-500" />}
          trend="Total Produksi"
        />
        <StatsCard
          title="Produk Baik"
          value={summary.totalGood.toLocaleString()}
          description="PCS (30 Hari Terakhir)"
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
          trend={`${efficiency}% Efisiensi`}
          trendColor="text-green-500"
        />
        <StatsCard
          title="Total Reject"
          value={summary.totalReject.toLocaleString()}
          description="PCS (30 Hari Terakhir)"
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
          trend={`${((summary.totalReject / (summary.totalOutput || 1)) * 100).toFixed(1)}% Rate Reject`}
          trendColor="text-red-500"
        />
        <StatsCard
          title="Downtime"
          value={`${Math.round(summary.totalDowntime / 60)} Jam`}
          description="Total Waktu Hilang"
          icon={<Clock className="h-4 w-4 text-orange-500" />}
          trend={`${summary.totalDowntime.toLocaleString()} Menit`}
          trendColor="text-orange-500"
          breakdown={[
              { label: "Planned", value: `${Math.round(summary.totalPlannedDowntime / 60)}h` },
              { label: "Unplanned", value: `${Math.round(summary.totalUnplannedDowntime / 60)}h` }
          ]}
        />
      </div>

      {/* 2. Charts Row 1: Production Trend */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Tren Produksi {viewMode === "daily" ? "Harian" : "Mingguan"}</CardTitle>
                <CardDescription>
                    Perbandingan output Baik vs Reject seiring waktu.
                </CardDescription>
            </div>
            <Select
                value={viewMode}
                onValueChange={(val: string) => setViewMode(val as "daily" | "weekly")}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Pilih Tampilan" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="daily">Harian</SelectItem>
                    <SelectItem value="weekly">Mingguan</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey={viewMode === "daily" ? "date" : "week"} 
                tick={{ fontSize: 12 }} 
                tickFormatter={(val) => 
                    viewMode === "daily" 
                        ? new Date(val).toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })
                        : val
                }
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                labelFormatter={(label) => 
                    viewMode === "daily"
                        ? new Date(label).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        : label
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="good"
                stroke="#10b981" // green-500
                strokeWidth={2}
                name="Jml Baik"
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="reject"
                stroke="#ef4444" // red-500
                strokeWidth={2}
                name="Jml Reject"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Charts Row 2: Breakdowns */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Downtime Breakdown (Planned) */}
        <DowntimeWeeksChart 
            title="PLAN DOWNTIME"
            description="Analisa mingguan Plan Downtime per kategori"
            weeklyData={data.weeklyPlanned} 
            downtimeTypes={downtimeTypes.filter((d) => {
              const k = d.type.toUpperCase();
              return k.startsWith("PLANNED:") ||
                ["ISTIRAHAT","TROUBLE PLN","TROUBLE_PLN","TRIAL","PREVENTIVE"].some((kw) => k.includes(kw));
            })} 
            maxCategories={5}
        />

        {/* Downtime Breakdown (Unplanned) */}
        <DowntimeWeeksChart 
            title="UNPLAN DOWNTIME"
            description="Analisa mingguan Unplan Downtime per kategori"
            weeklyData={data.weeklyUnplanned} 
            downtimeTypes={downtimeTypes.filter((d) => {
              const k = d.type.toUpperCase();
              return k.startsWith("UNPLANNED:") ||
                ["OPERATOR","TUNGGU","MACHINE PROBLEM","MACHINE_PROBLEM",
                 "SET UP","SETUP","CHANGE OVER","MENCARI","ADJUSTMENT","RUNNING IN","RUNIN","LAIN"]
                  .some((kw) => k.includes(kw));
            })} 
            maxCategories={10}
        />

        {/* Reject Breakdown */}
        <Card>
            <CardHeader>
                <CardTitle>Analisa Reject</CardTitle>
                <CardDescription>Penyebab reject terbesar berdasarkan jumlah.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={rejectTypes.slice(0, 5)}
                            dataKey="qty"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        >
                             {rejectTypes.slice(0, 5).map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

      {/* 4. Planned vs Unplanned Downtime */}
      <Card>
          <CardHeader>
              <CardTitle>Perbandingan Planned vs Unplanned Downtime</CardTitle>
              <CardDescription>Total durasi dalam menit dan persentase.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <Pie
                          data={[
                              { name: "Unplanned", value: summary.totalUnplannedDowntime },
                              { name: "Planned", value: summary.totalPlannedDowntime },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? "Unknown"} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                          <Cell fill="#ef4444" /> {/* Unplanned - Red */}
                          <Cell fill="#3b82f6" /> {/* Planned - Blue */}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${Math.round((value || 0) / 60)} Jam (${value || 0} m)`, "Durasi"] as [string, string]} />
                      <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
              </ResponsiveContainer>
          </CardContent>
      </Card>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendColor = "text-muted-foreground",
  breakdown,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendColor?: string;
  breakdown?: { label: string; value: string }[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
            <p className={`mt-2 text-xs font-medium ${trendColor}`}>
                {trend}
            </p>
        )}
        {breakdown && (
            <div className="mt-4 flex gap-4 border-t pt-2 text-xs">
                {breakdown.map((item, i) => (
                    <div key={i}>
                        <span className="text-muted-foreground">{item.label}: </span>
                        <span className="font-semibold">{item.value}</span>
                    </div>
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
