"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "../../../../../../trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  AlertCircle,
  BarChart2,
  CheckCircle,
  Clock,
  Loader2,
  Package,
  Table as TableIcon,
  TrendingDown,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DowntimeWeeksChart from "./downtime-weeks-chart";

type ReportTypeFilter =
  | "ALL"
  | "INJECTION"
  | "BLOW_MOULDING"
  | "PRINTING"
  | "PACKING_ASSEMBLY";
type MatrixMetric = "output" | "passOn" | "rejectPcs" | "rejectRate";
type OverviewDepartment = "PAPER" | "RIGID";

const DATE_RANGE_OPTIONS = [
  { value: "7D", label: "7 Hari Terakhir" },
  { value: "14D", label: "14 Hari Terakhir" },
  { value: "30D", label: "30 Hari Terakhir" },
  { value: "3M", label: "3 Bulan Terakhir" },
  { value: "6M", label: "6 Bulan Terakhir" },
  { value: "1Y", label: "1 Tahun Terakhir" },
] as const;
type DateRangeType = (typeof DATE_RANGE_OPTIONS)[number]["value"];

const INTERVAL_OPTIONS = [
  { value: "DAY", label: "Harian" },
  { value: "WEEK", label: "Mingguan" },
  { value: "MONTH", label: "Bulanan" },
  { value: "YEAR", label: "Tahunan" },
] as const;
type IntervalType = (typeof INTERVAL_OPTIONS)[number]["value"];

const REPORT_TYPE_OPTIONS: { value: ReportTypeFilter; label: string }[] = [
  { value: "ALL", label: "Semua Proses" },
  { value: "INJECTION", label: "Injection" },
  { value: "BLOW_MOULDING", label: "Blow Moulding" },
  { value: "PRINTING", label: "Printing" },
  { value: "PACKING_ASSEMBLY", label: "Packing & Assembly" },
];

const MATRIX_METRICS: {
  value: MatrixMetric;
  label: string;
  format: (v: number) => string;
}[] = [
  {
    value: "output",
    label: "Total Output (PCS)",
    format: (v: number) => v.toLocaleString("id-ID"),
  },
  {
    value: "passOn",
    label: "Pass On (PCS)",
    format: (v: number) => v.toLocaleString("id-ID"),
  },
  {
    value: "rejectPcs",
    label: "Reject (PCS)",
    format: (v: number) => v.toLocaleString("id-ID"),
  },
  {
    value: "rejectRate",
    label: "Reject Rate (%)",
    format: (v: number) => `${v.toFixed(2)}%`,
  },
];

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const PLANNED_KEYWORDS = [
  "ISTIRAHAT",
  "TROUBLE PLN",
  "TROUBLE_PLN",
  "TROUBLEPLN",
  "TRIAL",
  "PREVENTIVE",
  "PREV MAINTE",
];

const UNPLANNED_KEYWORDS = [
  "OPERATOR",
  "TUNGGU APPROVAL",
  "TUNGGU_APPROVAL",
  "TUNGGU MATERIAL",
  "TUNGGU_MATERIAL",
  "MACHINE PROBLEM",
  "MACHINE_PROBLEM",
  "SET UP",
  "SETUP",
  "CHANGE OVER",
  "CHANGE_OVER",
  "MENCARI",
  "ADJUSTMENT",
  "RUNNING IN",
  "RUNNING_IN",
  "RUN IN",
  "RUNIN",
  "LAIN",
];

function getGreetingByHour(hour: number): string {
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}

const DAY_MOOD: Record<number, { emoji: string; note: string }> = {
  0: { emoji: "🌤️", note: "Awal minggu baru, tetap santai tapi fokus." },
  1: { emoji: "💪", note: "Senin produktif, gas pelan tapi konsisten." },
  2: { emoji: "🚀", note: "Selasa ngebut, ritme kerja dijaga." },
  3: { emoji: "🔥", note: "Rabu on fire, jaga momentum." },
  4: { emoji: "⚡", note: "Kamis solid, tinggal push sedikit lagi." },
  5: { emoji: "🎯", note: "Jumat tuntas, bereskan target utama." },
  6: { emoji: "😎", note: "Sabtu santuy, tetap cek performa penting." },
};

function getDateRangeBounds(dateRange: DateRangeType): {
  startDate: Date;
  endDate: Date;
} {
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  if (dateRange === "7D") startDate.setDate(startDate.getDate() - 7);
  else if (dateRange === "14D") startDate.setDate(startDate.getDate() - 14);
  else if (dateRange === "30D") startDate.setDate(startDate.getDate() - 30);
  else if (dateRange === "3M") startDate.setMonth(startDate.getMonth() - 3);
  else if (dateRange === "6M") startDate.setMonth(startDate.getMonth() - 6);
  else if (dateRange === "1Y") startDate.setFullYear(startDate.getFullYear() - 1);
  startDate.setHours(0, 0, 0, 0);

  return { startDate, endDate };
}

function isPlannedDowntimeKey(rawKey: string): boolean {
  const key = rawKey.toUpperCase();
  if (key.startsWith("PLANNED:")) return true;
  if (key.startsWith("UNPLANNED:")) return false;
  return PLANNED_KEYWORDS.some((k) => key.includes(k));
}

function isUnplannedDowntimeKey(rawKey: string): boolean {
  const key = rawKey.toUpperCase();
  if (key.startsWith("UNPLANNED:")) return true;
  if (key.startsWith("PLANNED:")) return false;
  return UNPLANNED_KEYWORDS.some((k) => key.includes(k));
}

export default function RigidOverview({ department }: { department?: string }) {
  const { data: session } = useSession();
  const [dateRange, setDateRange] = useState<DateRangeType>("14D");
  const [interval, setIntervalVal] = useState<IntervalType>("DAY");
  const [reportType, setReportType] = useState<ReportTypeFilter>("ALL");
  const [matrixMetric, setMatrixMetric] = useState<MatrixMetric>("output");
  const normalizedDepartment: OverviewDepartment =
    department?.toUpperCase() === "RIGID" ? "RIGID" : "PAPER";
  const isRigid = normalizedDepartment === "RIGID";

  const { startDate, endDate } = useMemo(
    () => getDateRangeBounds(dateRange),
    [dateRange],
  );

  const {
    data: rigidData,
    isLoading: isRigidLoading,
    error: rigidError,
  } = api.dashboard.getRigidDashboard.useQuery({
    dateRange,
    interval,
    department: normalizedDepartment,
    reportType: reportType === "ALL" ? undefined : reportType,
  });

  const {
    data: statsData,
    isLoading: isStatsLoading,
    error: statsError,
  } = api.dashboard.getStats.useQuery({
    department: normalizedDepartment,
    startDate,
    endDate,
  });

  if (isRigidLoading || isStatsLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="text-muted-foreground animate-spin" size={40} />
      </div>
    );
  }

  if (rigidError || statsError) {
    return (
      <div className="text-destructive flex h-64 w-full items-center justify-center text-sm">
        Error: {rigidError?.message ?? statsError?.message}
      </div>
    );
  }

  if (!rigidData || !statsData) return null;

  const { timeIntervals, productRows, divisionRows } = rigidData;
  const hasOverallData = productRows.length > 0 && timeIntervals.length > 0;

  const activeMetricFormat =
    MATRIX_METRICS.find((m) => m.value === matrixMetric)?.format ??
    ((v: number) => String(v));

  const topRejectReasons = statsData.rejectTypes
    .slice(0, 8)
    .map((r) => ({ name: r.type, value: Number(r.qty ?? 0) }));

  const topRejectByProduct = productRows
    .map((row) => ({
      name: row.productName,
      value: Number(row.totals.rejectPcs ?? 0),
    }))
    .filter((r) => r.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const topDowntimeReasons = statsData.downtimeTypes
    .slice(0, 8)
    .map((d) => ({ name: d.type, value: Number(d.minutes ?? 0) }));

  const hasRejectReasonData = topRejectReasons.length > 0;
  const hasRejectProductData = topRejectByProduct.length > 0;
  const hasRejectData = hasRejectReasonData || hasRejectProductData;

  const plannedDowntimeTypes = statsData.downtimeTypes.filter((d) => {
    const key = d.type.toUpperCase();
    return isPlannedDowntimeKey(key) && !key.startsWith("UNPLANNED:");
  });

  const unplannedDowntimeTypes = statsData.downtimeTypes.filter((d) => {
    const key = d.type.toUpperCase();
    return isUnplannedDowntimeKey(key) || key.startsWith("UNPLANNED:");
  });

  const hasDowntimeBreakdownData =
    plannedDowntimeTypes.length > 0 ||
    unplannedDowntimeTypes.length > 0 ||
    topDowntimeReasons.length > 0;
  const hasDowntimeTotalData = Number(statsData.summary.totalDowntime ?? 0) > 0;
  const hasDowntimeData = hasDowntimeTotalData || hasDowntimeBreakdownData;

  const greeting = getGreetingByHour(new Date().getHours());
  const dayMood = DAY_MOOD[new Date().getDay()] ?? DAY_MOOD[1]!;
  const displayName = session?.user?.name ?? session?.user?.email ?? "User";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>
            {greeting}, {displayName} {dayMood.emoji}
          </CardTitle>
          <CardDescription>{dayMood.note}</CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">
                Dashboard Metrics - {isRigid ? "Rigid" : "Paper"}
              </CardTitle>
              <CardDescription>
                Dashboard dibagi 3 bagian: Overall, Analisis Reject, dan Analisis Downtime
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={dateRange}
                onValueChange={(v) => setDateRange(v as DateRangeType)}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={interval}
                onValueChange={(v) => setIntervalVal(v as IntervalType)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Tampilan" />
                </SelectTrigger>
                <SelectContent>
                  {INTERVAL_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {isRigid ? (
                <Select
                  value={reportType}
                  onValueChange={(v) => setReportType(v as ReportTypeFilter)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Jenis Proses" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}
            </div>
          </div>
        </CardHeader>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TableIcon className="h-4 w-4" />
          <h2 className="text-base font-semibold">Overall</h2>
        </div>

        {!hasOverallData ? (
          <Card>
            <CardContent className="flex min-h-40 flex-col items-center justify-center gap-2 text-center">
              <h3 className="text-sm font-semibold">Belum Ada Data Overall</h3>
              <p className="text-muted-foreground max-w-md text-xs">
                Belum ada laporan produksi{" "}
                {isRigid ? "rigid" : "paper"} yang disetujui pada filter yang dipilih.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={<Package className="h-4 w-4" style={{ color: "var(--chart-1)" }} />}
                title="Total Output"
                value={productRows
                  .reduce((s: number, r: any) => s + r.totals.output, 0)
                  .toLocaleString("id-ID")}
                sub={`${timeIntervals.length} interval • ${productRows.length} produk`}
              />
              <SummaryCard
                icon={<CheckCircle className="h-4 w-4" style={{ color: "var(--chart-2)" }} />}
                title="Total Pass On"
                value={productRows
                  .reduce((s: number, r: any) => s + r.totals.passOn, 0)
                  .toLocaleString("id-ID")}
                sub="PCS disetujui lanjut"
              />
              <SummaryCard
                icon={
                  <AlertCircle className="h-4 w-4" style={{ color: "var(--destructive)" }} />
                }
                title="Total Reject"
                value={productRows
                  .reduce((s: number, r: any) => s + r.totals.rejectPcs, 0)
                  .toLocaleString("id-ID")}
                sub="PCS reject"
              />
              <SummaryCard
                icon={<TrendingDown className="h-4 w-4" style={{ color: "var(--chart-4)" }} />}
                title="Avg Reject Rate Divisi"
                value={`${
                  divisionRows.length > 0
                    ? (
                        divisionRows.reduce((s: number, r: any) => s + r.rejectRate, 0) /
                        divisionRows.length
                      ).toFixed(2)
                    : "0.00"
                }%`}
                sub="Rata-rata rentang"
              />
            </div>

            <MetricCard
              title={`Kinerja Produksi Divisi (${INTERVAL_OPTIONS.find((o) => o.value === interval)?.label})`}
              description="Agregasi rata-rata data seluruh produk rigid per interval"
            >
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="px-3 py-2 text-left font-medium">Interval Waktu</th>
                      <th className="px-3 py-2 text-right font-medium">Total Output</th>
                      <th className="px-3 py-2 text-right font-medium">Reject PCS</th>
                      <th className="px-3 py-2 text-right font-medium">Reject Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {divisionRows.map((row: any, i: number) => (
                      <tr key={row.timeKey} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                        <td className="px-3 py-2 font-medium">{row.label}</td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {row.output.toLocaleString("id-ID")}
                        </td>
                        <td className="text-destructive px-3 py-2 text-right tabular-nums">
                          {row.rejectPcs.toLocaleString("id-ID")}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums font-semibold">
                          <span
                            className={
                              row.rejectRate > 5
                                ? "text-destructive"
                                : row.rejectRate > 2
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }
                          >
                            {row.rejectRate.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </MetricCard>

            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base">
                    Matriks Evaluasi per Produk (
                    {INTERVAL_OPTIONS.find((o) => o.value === interval)?.label})
                  </CardTitle>
                  <CardDescription>
                    Pilih metrik untuk melihat persebaran data per produk pada tiap interval
                  </CardDescription>
                </div>
                <Select
                  value={matrixMetric}
                  onValueChange={(v) => setMatrixMetric(v as MatrixMetric)}
                >
                  <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Pilih Metrik" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATRIX_METRICS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full whitespace-nowrap border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-y">
                      <th className="bg-background sticky left-0 z-10 w-fit min-w-[200px] border-x px-3 py-2 text-left font-medium">
                        Produk
                      </th>
                      {timeIntervals.map((w: any) => (
                        <th key={w.key} className="border-x px-3 py-2 text-right font-medium">
                          {w.label}
                        </th>
                      ))}
                      <th className="bg-muted/20 border-x px-3 py-2 text-right font-medium">
                        Summary{" "}
                        {
                          MATRIX_METRICS.find((m) => m.value === matrixMetric)?.label.split(
                            " ",
                          )[0]
                        }
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.map((row: any, i: number) => (
                      <tr
                        key={row.productName}
                        className={i % 2 === 0 ? "border-b" : "bg-muted/10 border-b"}
                      >
                        <td
                          className="bg-background sticky left-0 z-10 max-w-[250px] truncate border-x px-3 py-2 font-medium"
                          title={row.productName}
                        >
                          {row.productName}
                        </td>
                        {timeIntervals.map((w: any) => {
                          const wd = row.timeData.find((d: any) => d.timeKey === w.key);
                          const val = wd ? (wd[matrixMetric] as number) : 0;

                          let colorClass = "";
                          if (matrixMetric === "rejectRate") {
                            if (val > 5) colorClass = "text-destructive font-semibold";
                            else if (val > 2) colorClass = "text-yellow-500 font-semibold";
                            else colorClass = "text-green-500";
                          } else if (matrixMetric === "rejectPcs" && val > 0) {
                            colorClass = "text-destructive";
                          }

                          return (
                            <td
                              key={w.key}
                              className={`border-x px-3 py-2 text-right tabular-nums ${colorClass}`}
                            >
                              {val === 0 && matrixMetric !== "rejectRate"
                                ? "-"
                                : activeMetricFormat(val)}
                            </td>
                          );
                        })}
                        <td className="bg-muted/20 border-x px-3 py-2 text-right tabular-nums font-bold">
                          {(() => {
                            const tVal = row.totals[matrixMetric];
                            let tClass = "";
                            if (matrixMetric === "rejectRate") {
                              if (tVal > 5) tClass = "text-destructive font-semibold";
                              else if (tVal > 2) tClass = "text-yellow-500 font-semibold";
                              else tClass = "text-green-500";
                            } else if (matrixMetric === "rejectPcs" && tVal > 0) {
                              tClass = "text-destructive";
                            }
                            return <span className={tClass}>{activeMetricFormat(tVal)}</span>;
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <h2 className="text-base font-semibold">Analisis Reject</h2>
        </div>

        {!hasRejectData ? (
          <Card>
            <CardContent className="flex min-h-32 items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Belum ada data reject pada periode ini.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Top Penyebab Reject</CardTitle>
                <CardDescription>Berdasarkan total kuantitas reject</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {hasRejectReasonData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topRejectReasons} layout="vertical" margin={{ left: 8, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                      <XAxis type="number" tickLine={false} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={140}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v: string) =>
                          v.length > 18 ? `${v.slice(0, 18)}...` : v
                        }
                      />
                      <Tooltip
                        formatter={(v: number | string | undefined) => [
                          `${Number(v ?? 0).toLocaleString("id-ID")} pcs`,
                          "Reject",
                        ]}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {topRejectReasons.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                    Belum ada breakdown reject per kategori.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Top Produk Reject</CardTitle>
                <CardDescription>Akumulasi reject per produk</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {hasRejectProductData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topRejectByProduct} layout="vertical" margin={{ left: 8, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                      <XAxis type="number" tickLine={false} axisLine={false} />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={160}
                        tick={{ fontSize: 11 }}
                        tickFormatter={(v: string) =>
                          v.length > 22 ? `${v.slice(0, 22)}...` : v
                        }
                      />
                      <Tooltip
                        formatter={(v: number | string | undefined) => [
                          `${Number(v ?? 0).toLocaleString("id-ID")} pcs`,
                          "Reject",
                        ]}
                      />
                      <Bar dataKey="value" fill="var(--destructive)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                    Belum ada reject pada produk untuk periode ini.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <h2 className="text-base font-semibold">Analisis Downtime</h2>
        </div>

        {!hasDowntimeData ? (
          <Card>
            <CardContent className="flex min-h-32 items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Belum ada data downtime pada periode ini.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <SummaryCard
                icon={<Clock className="h-4 w-4" style={{ color: "var(--chart-3)" }} />}
                title={isRigid ? "Total Loss Hour" : "Total Planned Downtime"}
                value={`${Math.round(statsData.summary.totalPlannedDowntime / 60).toLocaleString("id-ID")} Jam`}
                sub={`${statsData.summary.totalPlannedDowntime.toLocaleString("id-ID")} menit`}
              />
              <SummaryCard
                icon={<Clock className="h-4 w-4" style={{ color: "var(--destructive)" }} />}
                title={isRigid ? "Total Downtime" : "Total Unplanned Downtime"}
                value={`${Math.round(statsData.summary.totalUnplannedDowntime / 60).toLocaleString("id-ID")} Jam`}
                sub={`${statsData.summary.totalUnplannedDowntime.toLocaleString("id-ID")} menit`}
              />
            </div>

            <div className="grid gap-4">
              {hasDowntimeBreakdownData ? (
                <>
                  <DowntimeWeeksChart
                    title={isRigid ? "LOSS HOUR" : "PLANNED DOWNTIME"}
                    description={
                      isRigid
                        ? "Analisa mingguan loss hour per kategori"
                        : "Analisa mingguan planned downtime per kategori"
                    }
                    weeklyData={statsData.weeklyPlanned}
                    downtimeTypes={plannedDowntimeTypes}
                    maxCategories={6}
                  />
                  <DowntimeWeeksChart
                    title={isRigid ? "DOWNTIME" : "UNPLANNED DOWNTIME"}
                    description={
                      isRigid
                        ? "Analisa mingguan downtime per kategori"
                        : "Analisa mingguan unplanned downtime per kategori"
                    }
                    weeklyData={statsData.weeklyUnplanned}
                    downtimeTypes={unplannedDowntimeTypes}
                    maxCategories={8}
                  />
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Top Kategori Downtime</CardTitle>
                      <CardDescription>Berdasarkan akumulasi menit downtime</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topDowntimeReasons}
                          layout="vertical"
                          margin={{ left: 8, right: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                          <XAxis type="number" tickLine={false} axisLine={false} />
                          <YAxis
                            type="category"
                            dataKey="name"
                            width={170}
                            tick={{ fontSize: 11 }}
                            tickFormatter={(v: string) =>
                              v.length > 24 ? `${v.slice(0, 24)}...` : v
                            }
                          />
                          <Tooltip
                            formatter={(v: number | string | undefined) => [
                              `${Number(v ?? 0).toLocaleString("id-ID")} menit`,
                              "Durasi",
                            ]}
                          />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {topDowntimeReasons.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="flex min-h-32 items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                      Total downtime ada, tapi breakdown kategori belum terisi di laporan.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function MetricCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function SummaryCard({
  icon,
  title,
  value,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground mt-1 text-xs">{sub}</p>
      </CardContent>
    </Card>
  );
}
