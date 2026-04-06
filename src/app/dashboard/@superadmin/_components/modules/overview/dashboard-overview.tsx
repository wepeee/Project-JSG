"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

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
import {
  Loader2,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  Activity,
} from "lucide-react";
import DowntimeWeeksChart from "./downtime-weeks-chart";

type Props = {
  department?: string;
};

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
const COLOR_GOOD = "var(--chart-1)";
const COLOR_REJECT = "var(--destructive)";
const COLOR_DOWNTIME = "var(--chart-3)";
const DAY_MOOD: Record<number, { emoji: string; note: string }> = {
  0: { emoji: "🌤️", note: "Awal minggu baru, tetap santai tapi fokus." }, // Minggu
  1: { emoji: "💪", note: "Senin produktif, gas pelan tapi konsisten." },
  2: { emoji: "🚀", note: "Selasa ngebut, ritme kerja dijaga." },
  3: { emoji: "🔥", note: "Rabu on fire, jaga momentum." },
  4: { emoji: "⚡", note: "Kamis solid, tinggal push sedikit lagi." },
  5: { emoji: "🎯", note: "Jumat tuntas, bereskan target utama." },
  6: { emoji: "😎", note: "Sabtu santuy, tetap cek performa penting." },
};

export default function DashboardOverview({ department }: Props) {
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const { data: session } = useSession();
  const safeDepartment =
    typeof department === "string" ? department : undefined;
  const isRigidDepartment = safeDepartment?.toUpperCase() === "RIGID";

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
      <div className="text-destructive flex h-64 w-full items-center justify-center">
        Error loading dashboard data: {error.message}
      </div>
    );
  }

  if (!data) return null;

  const { summary, dailyProduction, weeklyProduction, downtimeTypes, rejectTypes } = data;
  const hasData =
    summary.totalOutput > 0 ||
    summary.totalGood > 0 ||
    summary.totalReject > 0 ||
    summary.totalDowntime > 0 ||
    dailyProduction.length > 0 ||
    weeklyProduction.length > 0 ||
    downtimeTypes.length > 0 ||
    rejectTypes.length > 0;

  const chartData = (viewMode === "daily" ? dailyProduction : weeklyProduction) as any[];

  // Calculate Efficiency (Simple: Good / Total * 100) or similar
  const efficiency =
    summary.totalOutput > 0
      ? ((summary.totalGood / summary.totalOutput) * 100).toFixed(1)
      : "0.0";

  const hour = new Date().getHours();
  const dayIndex = new Date().getDay();
  const dayMood = DAY_MOOD[dayIndex] ?? DAY_MOOD[1]!;
  const greeting =
    hour < 11
      ? "Selamat pagi"
      : hour < 15
        ? "Selamat siang"
        : hour < 19
          ? "Selamat sore"
          : "Selamat malam";
  const displayName =
    session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>
            {greeting}, {displayName} {dayMood.emoji}
          </CardTitle>
          <CardDescription>
            {dayMood.note}
          </CardDescription>
        </CardHeader>
      </Card>

      {!hasData ? (
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
            <div className="bg-muted rounded-full p-3">
              <Activity className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold">Belum Ada Data Produksi</h3>
            <p className="text-muted-foreground max-w-md text-sm">
              Dashboard akan otomatis terisi setelah laporan produksi mulai masuk
              dan diproses pada periode berjalan.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
      {/* 1. Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Output"
          value={summary.totalOutput.toLocaleString()}
          description="PCS (30 Hari Terakhir)"
          icon={<TrendingUp className="h-4 w-4" style={{ color: COLOR_GOOD }} />}
          trend="Total Produksi"
        />
        <StatsCard
          title="Produk Baik"
          value={summary.totalGood.toLocaleString()}
          description="PCS (30 Hari Terakhir)"
          icon={<CheckCircle className="h-4 w-4" style={{ color: COLOR_GOOD }} />}
          trend={`${efficiency}% Efisiensi`}
          trendColor={COLOR_GOOD}
        />
        <StatsCard
          title="Total Reject"
          value={summary.totalReject.toLocaleString()}
          description="PCS (30 Hari Terakhir)"
          icon={<AlertCircle className="h-4 w-4" style={{ color: COLOR_REJECT }} />}
          trend={`${((summary.totalReject / (summary.totalOutput || 1)) * 100).toFixed(1)}% Rate Reject`}
          trendColor={COLOR_REJECT}
        />
        <StatsCard
          title="Downtime"
          value={`${Math.round(summary.totalDowntime / 60)} Jam`}
          description="Total Waktu Hilang"
          icon={<Clock className="h-4 w-4" style={{ color: COLOR_DOWNTIME }} />}
          trend={`${summary.totalDowntime.toLocaleString()} Menit`}
          trendColor={COLOR_DOWNTIME}
          breakdown={[
              {
                label: isRigidDepartment ? "Loss Hour" : "Planned",
                value: `${Math.round(summary.totalPlannedDowntime / 60)}h`,
              },
              {
                label: isRigidDepartment ? "Downtime" : "Unplanned",
                value: `${Math.round(summary.totalUnplannedDowntime / 60)}h`,
              }
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
                contentStyle={{ borderRadius: "8px", border: "1px solid var(--border)", background: "var(--popover)" }}
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
                stroke={COLOR_GOOD}
                strokeWidth={2}
                name="Jml Baik"
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="reject"
                stroke={COLOR_REJECT}
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
            title={isRigidDepartment ? "LOSS HOUR" : "PLANNED DOWNTIME"}
            description={
              isRigidDepartment
                ? "Analisa mingguan Loss Hour per kategori"
                : "Analisa mingguan Planned Downtime per kategori"
            }
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
            title={isRigidDepartment ? "DOWNTIME" : "UNPLANNED DOWNTIME"}
            description={
              isRigidDepartment
                ? "Analisa mingguan Downtime per kategori"
                : "Analisa mingguan Unplanned Downtime per kategori"
            }
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
                            fill="var(--chart-4)"
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
              <CardTitle>
                {isRigidDepartment
                  ? "Perbandingan Loss Hour vs Downtime"
                  : "Perbandingan Planned vs Unplanned Downtime"}
              </CardTitle>
              <CardDescription>Total durasi dalam menit dan persentase.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                      <Pie
                          data={[
                              {
                                name: isRigidDepartment ? "Downtime" : "Unplanned",
                                value: summary.totalUnplannedDowntime,
                              },
                              {
                                name: isRigidDepartment ? "Loss Hour" : "Planned",
                                value: summary.totalPlannedDowntime,
                              },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ name, percent }: { name?: string; percent?: number }) => `${name ?? "Unknown"} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                          <Cell fill={COLOR_REJECT} />
                          <Cell fill={COLOR_GOOD} />
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${Math.round((value || 0) / 60)} Jam (${value || 0} m)`, "Durasi"] as [string, string]} />
                      <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
              </ResponsiveContainer>
          </CardContent>
      </Card>
      </div>
        </>
      )}
    </div>
  );
}

function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendColor = "var(--muted-foreground)",
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
            <p className="mt-2 text-xs font-medium" style={{ color: trendColor }}>
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
