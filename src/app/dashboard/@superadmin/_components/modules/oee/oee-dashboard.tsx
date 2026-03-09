"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Loader2, TrendingUp, Zap, Target, Activity, RefreshCw } from "lucide-react";

const OEE_WORLD_CLASS = 85;
const AVAIL_TARGET = 90;
const PERF_TARGET = 95;
const QUAL_TARGET = 99;
const COLOR_AVAIL = "var(--chart-1)";
const COLOR_PERF = "var(--chart-2)";
const COLOR_QUAL = "var(--chart-3)";
const COLOR_WARN = "var(--chart-3)";
const COLOR_GOOD = "var(--primary)";
const COLOR_BAD = "var(--destructive)";
const COLOR_TARGET_LINE = "var(--ring)";
const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
type OeeProType = "PAPER" | "RIGID" | "ALL";

type OeeDashboardProps = {
  defaultProType?: OeeProType;
  showProTypeFilter?: boolean;
};

function getDateRange(preset: string): { start: Date; end: Date } {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  const start = new Date();
  if (preset === "7d") start.setDate(end.getDate() - 7);
  else if (preset === "30d") start.setDate(end.getDate() - 30);
  else if (preset === "90d") start.setDate(end.getDate() - 90);
  else start.setDate(end.getDate() - 30);
  start.setHours(0, 0, 0, 0);
  return { start, end };
}

function oeeColor(val: number) {
  if (val >= OEE_WORLD_CLASS) return COLOR_GOOD;
  if (val >= 65) return COLOR_WARN;
  return COLOR_BAD;
}

function GaugeMeter({ value, label, color, size = 120 }: { value: number; label: string; color: string; size?: number }) {
  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -210;
  const sweepAngle = 240;
  const pct = Math.min(100, Math.max(0, value));
  const arcAngle = (sweepAngle * pct) / 100;

  function polarToXY(angle: number, radius: number) {
    const a = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  }

  function describeArc(start: number, sweep: number, rad: number) {
    const s = polarToXY(start, rad);
    const e = polarToXY(start + sweep, rad);
    const large = sweep > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${rad} ${rad} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={describeArc(startAngle, sweepAngle, r)} fill="none" stroke="currentColor" strokeWidth={size * 0.08} strokeLinecap="round" className="text-muted-foreground/20" />
      {pct > 0 && <path d={describeArc(startAngle, arcAngle, r)} fill="none" stroke={color} strokeWidth={size * 0.08} strokeLinecap="round" />}
      <text x={cx} y={cy - 4} textAnchor="middle" dominantBaseline="middle" fontSize={size * 0.18} fontWeight="800" fill={color}>{value.toFixed(1)}%</text>
      <text x={cx} y={cy + size * 0.14} textAnchor="middle" fontSize={size * 0.1} fill="currentColor" className="fill-muted-foreground">{label}</text>
    </svg>
  );
}

function StatCard({ label, value, icon, color, sub }: { label: string; value: string; icon: React.ReactNode; color: string; sub?: string }) {
  return (
    <div className="bg-card border-border rounded-xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{label}</span>
        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-lg">
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <div className="text-foreground text-2xl font-black">{value}</div>
      {sub && <div className="text-muted-foreground mt-1 text-xs">{sub}</div>}
    </div>
  );
}

function OeeTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border-border rounded-lg border p-3 shadow-xl text-xs">
      <p className="text-foreground mb-2 font-bold">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="text-foreground font-semibold">{Number(p.value).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
}

export default function OeeDashboard({
  defaultProType = "PAPER",
  showProTypeFilter = false,
}: OeeDashboardProps) {
  const [datePreset, setDatePreset] = React.useState("30d");
  const [groupBy, setGroupBy] = React.useState<"day" | "week" | "month">("week");
  const [proType, setProType] = React.useState<OeeProType>(defaultProType);

  const { start, end } = React.useMemo(() => getDateRange(datePreset), [datePreset]);

  const { data, isLoading, refetch, isRefetching } = api.oee.getMachineOee.useQuery({ startDate: start, endDate: end, groupBy, proType });
  const { data: rejectData } = api.oee.getRejectBreakdown.useQuery({ startDate: start, endDate: end, proType });
  const { data: downtimeData } = api.oee.getDowntimeBreakdown.useQuery({ startDate: start, endDate: end, proType });

  const summary = data?.summary;
  const oeeVal = summary?.oee ?? 0;
  const oeeGauge = oeeColor(oeeVal);

  const radarData = data?.machineOee.map((m) => ({
    machine: m.machineName.length > 12 ? m.machineName.slice(0, 12) + "â€¦" : m.machineName,
    OEE: m.oee, Availability: m.availability, Performance: m.performance, Quality: m.quality,
  })) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-foreground text-xl font-bold">
            OEE Analytics -{" "}
            {proType === "PAPER"
              ? "Paper"
              : proType === "RIGID"
                ? "Rigid"
                : "Semua Departemen"}
          </h2>
          <p className="text-muted-foreground text-sm">Overall Equipment Effectiveness - Availability x Performance x Quality</p>
        </div>
        <div className="flex items-center gap-2">
          {showProTypeFilter ? (
            <Select value={proType} onValueChange={(v) => setProType(v as OeeProType)}>
              <SelectTrigger className="h-8 w-[145px] text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua</SelectItem>
                <SelectItem value="PAPER">Paper</SelectItem>
                <SelectItem value="RIGID">Rigid</SelectItem>
              </SelectContent>
            </Select>
          ) : null}
          <Select value={datePreset} onValueChange={setDatePreset}>
            <SelectTrigger className="h-8 w-[110px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Hari</SelectItem>
              <SelectItem value="30d">30 Hari</SelectItem>
              <SelectItem value="90d">90 Hari</SelectItem>
            </SelectContent>
          </Select>
          <Select value={groupBy} onValueChange={(v) => setGroupBy(v as any)}>
            <SelectTrigger className="h-8 w-[110px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Per Hari</SelectItem>
              <SelectItem value="week">Per Minggu</SelectItem>
              <SelectItem value="month">Per Bulan</SelectItem>
            </SelectContent>
          </Select>
          <button onClick={() => { void refetch(); }} disabled={isLoading || isRefetching} className="border-border hover:bg-muted flex h-8 w-8 items-center justify-center rounded-md border" title="Refresh">
            <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center"><Loader2 className="text-muted-foreground h-8 w-8 animate-spin" /></div>
      ) : !data || data.summary.totalReports === 0 ? (
        <div className="text-muted-foreground flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed">
          <Activity className="h-10 w-10 opacity-20" />
          <p className="text-sm">Belum ada data laporan produksi yang diapprove.</p>
        </div>
      ) : (
        <>
          {/* OEE Gauges */}
          <div className="bg-card border-border rounded-xl border p-6">
            <div className="mb-4 flex items-center gap-2">
              <Target className="text-primary h-5 w-5" />
              <h3 className="font-bold">OEE Keseluruhan</h3>
              <span className="text-muted-foreground ml-auto text-xs">{summary!.totalReports} laporan Â· Target world-class: {OEE_WORLD_CLASS}%</span>
            </div>
            <div className="flex flex-wrap items-center justify-around gap-6">
              <div className="flex flex-col items-center gap-2">
                <GaugeMeter value={oeeVal} label="OEE" color={oeeGauge} size={160} />
                <div className="bg-muted rounded-full border px-3 py-1 text-xs font-bold" style={{ color: oeeGauge, borderColor: oeeGauge }}>
                  {oeeVal >= OEE_WORLD_CLASS ? "âœ“ World Class" : oeeVal >= 65 ? "âš  Perlu Perbaikan" : "âœ• Di bawah Standar"}
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <GaugeMeter value={summary!.availability} label="Availability" color={COLOR_AVAIL} size={110} />
                  <span className="text-muted-foreground text-[10px]">Target: {AVAIL_TARGET}%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <GaugeMeter value={summary!.performance} label="Performance" color={COLOR_PERF} size={110} />
                  <span className="text-muted-foreground text-[10px]">Target: {PERF_TARGET}%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <GaugeMeter value={summary!.quality} label="Quality" color={COLOR_QUAL} size={110} />
                  <span className="text-muted-foreground text-[10px]">Target: {QUAL_TARGET}%</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-muted/40 rounded-lg p-3 text-center">
                  <div className="text-muted-foreground text-xs">Total Output</div>
                  <div className="text-foreground text-lg font-bold">{summary!.totalGoodOutput.toLocaleString("id-ID")}</div>
                  <div className="text-muted-foreground text-[10px]">pcs good</div>
                </div>
                <div className="bg-muted/40 rounded-lg p-3 text-center">
                  <div className="text-muted-foreground text-xs">Downtime</div>
                  <div className="text-lg font-bold" style={{ color: COLOR_WARN }}>{Math.round(summary!.totalDowntimeMinutes / 60)}j</div>
                  <div className="text-muted-foreground text-[10px]">{summary!.totalDowntimeMinutes} menit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="OEE" value={`${oeeVal.toFixed(1)}%`} icon={<Target className="h-4 w-4" />} color={oeeGauge} sub={`World class: ${OEE_WORLD_CLASS}%`} />
            <StatCard label="Availability" value={`${summary!.availability.toFixed(1)}%`} icon={<Zap className="h-4 w-4" />} color={COLOR_AVAIL} sub={`Downtime: ${summary!.totalDowntimeMinutes} mnt`} />
            <StatCard label="Performance" value={`${summary!.performance.toFixed(1)}%`} icon={<TrendingUp className="h-4 w-4" />} color={COLOR_PERF} sub="Output vs Std Kapasitas" />
            <StatCard label="Quality" value={`${summary!.quality.toFixed(1)}%`} icon={<Activity className="h-4 w-4" />} color={COLOR_QUAL} sub={`Total good: ${summary!.totalGoodOutput.toLocaleString("id-ID")} pcs`} />
          </div>

          {/* Trend Chart */}
          <div className="bg-card border-border rounded-xl border p-5">
            <h3 className="mb-4 font-bold">Tren OEE</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.trend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gOee" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLOR_WARN} stopOpacity={0.3} /><stop offset="95%" stopColor={COLOR_WARN} stopOpacity={0} /></linearGradient>
                  <linearGradient id="gAvail" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLOR_AVAIL} stopOpacity={0.15} /><stop offset="95%" stopColor={COLOR_AVAIL} stopOpacity={0} /></linearGradient>
                  <linearGradient id="gPerf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLOR_PERF} stopOpacity={0.15} /><stop offset="95%" stopColor={COLOR_PERF} stopOpacity={0} /></linearGradient>
                  <linearGradient id="gQual" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLOR_QUAL} stopOpacity={0.15} /><stop offset="95%" stopColor={COLOR_QUAL} stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.4} />
                <XAxis dataKey="label" className="text-muted-foreground" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="text-muted-foreground" unit="%" />
                <Tooltip content={<OeeTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={OEE_WORLD_CLASS} stroke={COLOR_TARGET_LINE} strokeDasharray="4 4" label={{ value: `WC ${OEE_WORLD_CLASS}%`, fill: COLOR_TARGET_LINE, fontSize: 10 }} />
                <Area type="monotone" dataKey="oee" name="OEE" stroke={COLOR_WARN} fill="url(#gOee)" strokeWidth={2.5} dot={{ r: 3, fill: COLOR_WARN }} />
                <Area type="monotone" dataKey="availability" name="Availability" stroke={COLOR_AVAIL} fill="url(#gAvail)" strokeWidth={1.5} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="performance" name="Performance" stroke={COLOR_PERF} fill="url(#gPerf)" strokeWidth={1.5} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="quality" name="Quality" stroke={COLOR_QUAL} fill="url(#gQual)" strokeWidth={1.5} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Per Machine + Breakdown */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* OEE per mesin */}
            <div className="bg-card border-border col-span-1 rounded-xl border p-5">
              <h3 className="mb-4 font-bold">OEE per Mesin</h3>
              <div className="space-y-3">
                {data.machineOee.sort((a, b) => b.oee - a.oee).map((m) => (
                  <div key={m.machineId}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-foreground truncate font-medium">{m.machineName}</span>
                      <span className="font-bold" style={{ color: oeeColor(m.oee) }}>{m.oee.toFixed(1)}%</span>
                    </div>
                    <div className="bg-muted h-2 overflow-hidden rounded-full">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.oee}%`, background: oeeColor(m.oee) }} />
                    </div>
                    <div className="text-muted-foreground mt-0.5 flex gap-3 text-[10px]">
                      <span>A:{m.availability.toFixed(0)}%</span>
                      <span>P:{m.performance.toFixed(0)}%</span>
                      <span>Q:{m.quality.toFixed(0)}%</span>
                      <span className="ml-auto">{m.totalReports} LPH</span>
                    </div>
                  </div>
                ))}
                {data.machineOee.length === 0 && <p className="text-muted-foreground text-center text-sm">Tidak ada data mesin</p>}
              </div>
            </div>

            {/* Top Reject */}
            <div className="bg-card border-border rounded-xl border p-5">
              <h3 className="mb-4 font-bold">Top Reject</h3>
              {!rejectData || rejectData.breakdown.length === 0 ? (
                <p className="text-muted-foreground text-center text-sm py-8">Tidak ada data reject</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={rejectData.breakdown} layout="vertical" margin={{ left: 4, right: 30, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.4} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                    <YAxis type="category" dataKey="reason" width={80} tick={{ fontSize: 10 }} className="text-muted-foreground" />
                    <Tooltip formatter={(v: any) => [`${v} pcs`, "Qty"]} contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="qty" radius={[0, 4, 4, 0]}>
                      {rejectData.breakdown.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              {rejectData && <p className="text-muted-foreground mt-2 text-center text-xs">Total reject: <b className="text-destructive">{rejectData.totalReject.toLocaleString("id-ID")} pcs</b></p>}
            </div>

            {/* Top Downtime */}
            <div className="bg-card border-border rounded-xl border p-5">
              <h3 className="mb-4 font-bold">Top Downtime</h3>
              {!downtimeData || downtimeData.breakdown.length === 0 ? (
                <p className="text-muted-foreground text-center text-sm py-8">Tidak ada data downtime</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={downtimeData.breakdown} layout="vertical" margin={{ left: 4, right: 40, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.4} horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} className="text-muted-foreground" unit="m" />
                    <YAxis type="category" dataKey="reason" width={80} tick={{ fontSize: 10 }} className="text-muted-foreground" />
                    <Tooltip formatter={(v: any) => [`${v} menit`, "Durasi"]} contentStyle={{ fontSize: 11 }} />
                    <Bar dataKey="minutes" radius={[0, 4, 4, 0]}>
                      {downtimeData.breakdown.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              {downtimeData && <p className="text-muted-foreground mt-2 text-center text-xs">Total downtime: <b style={{ color: COLOR_WARN }}>{downtimeData.totalDowntime} menit</b></p>}
            </div>
          </div>

          {/* Radar Chart â€” Per Mesin Individual */}
          {data.machineOee.length > 0 && (
            <div className="bg-card border-border rounded-xl border p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Profil OEE per Mesin</h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">Radar komponen A Ã— P Ã— Q tiap mesin Â· Ring target {OEE_WORLD_CLASS}%</p>
                </div>
                <div className="flex gap-3 text-[10px]">
                  <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ background: COLOR_AVAIL }} /> Availability</span>
                  <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ background: COLOR_PERF }} /> Performance</span>
                  <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ background: COLOR_QUAL }} /> Quality</span>
                </div>
              </div>
              <div className={`grid gap-4 ${data.machineOee.length === 1 ? "grid-cols-1" : data.machineOee.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"}`}>
                {data.machineOee.sort((a, b) => b.oee - a.oee).map((m) => {
                  const mColor = oeeColor(m.oee);
                  const radarItems = [
                    { metric: "Availability", value: m.availability, target: AVAIL_TARGET, color: COLOR_AVAIL },
                    { metric: "Performance", value: m.performance, target: PERF_TARGET, color: COLOR_PERF },
                    { metric: "Quality", value: m.quality, target: QUAL_TARGET, color: COLOR_QUAL },
                  ];
                  return (
                    <div
                      key={m.machineId}
                      className="border-border bg-muted/20 rounded-xl border p-4 transition-colors hover:bg-muted/40"
                    >
                      {/* Mesin header */}
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-foreground truncate text-sm font-bold">{m.machineName}</h4>
                        <div
                          className="bg-muted rounded-full border px-2.5 py-0.5 text-[11px] font-bold"
                          style={{ color: mColor, borderColor: mColor }}
                        >
                          OEE {m.oee.toFixed(1)}%
                        </div>
                      </div>

                      {/* Radar */}
                      <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={radarItems} cx="50%" cy="50%" outerRadius="70%">
                          <PolarGrid
                            gridType="polygon"
                            stroke="currentColor"
                            className="text-border"
                            opacity={0.5}
                          />
                          <PolarAngleAxis
                            dataKey="metric"
                            tick={({ x, y, payload }: any) => (
                              <text
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize={10}
                                fontWeight={600}
                                fill={radarItems.find((r) => r.metric === payload.value)?.color ?? "var(--muted-foreground)"}
                              >
                                {payload.value}
                              </text>
                            )}
                          />
                          {/* Target ring (dashed) */}
                          <Radar
                            name="Target"
                            dataKey="target"
                            stroke="var(--muted-foreground)"
                            fill="none"
                            strokeWidth={1}
                            strokeDasharray="3 3"
                            dot={false}
                          />
                          {/* Actual values */}
                          <Radar
                            name="Aktual"
                            dataKey="value"
                            stroke={mColor}
                            fill={mColor}
                            fillOpacity={0.25}
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: mColor, stroke: "var(--background)", strokeWidth: 1.5 }}
                          />
                          <Tooltip
                            content={({ active, payload }: any) => {
                              if (!active || !payload?.length) return null;
                              const item = payload[0]?.payload;
                              if (!item) return null;
                              const diff = item.value - item.target;
                              return (
                                <div className="bg-popover border-border rounded-lg border px-3 py-2 shadow-xl text-xs">
                                  <p className="font-bold" style={{ color: item.color }}>{item.metric}</p>
                                  <div className="mt-1 space-y-0.5">
                                    <div className="flex justify-between gap-4">
                                      <span className="text-muted-foreground">Aktual:</span>
                                      <span className="font-bold">{item.value.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-muted-foreground">Target:</span>
                                      <span>{item.target}%</span>
                                    </div>
                                    <div className="flex justify-between gap-4">
                                      <span className="text-muted-foreground">Gap:</span>
                                      <span
                                        className="font-semibold"
                                        style={{ color: diff >= 0 ? COLOR_GOOD : COLOR_BAD }}
                                      >
                                        {diff >= 0 ? "+" : ""}{diff.toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>

                      {/* Value bars di bawah radar */}
                      <div className="mt-1 space-y-1.5">
                        {radarItems.map((r) => {
                          const pct = Math.min(100, r.value);
                          const gap = r.value - r.target;
                          return (
                            <div key={r.metric} className="flex items-center gap-2 text-[10px]">
                              <span className="w-[72px] truncate font-medium" style={{ color: r.color }}>
                                {r.metric}
                              </span>
                              <div className="bg-muted relative h-1.5 flex-1 overflow-hidden rounded-full">
                                <div
                                  className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                                  style={{ width: `${pct}%`, background: r.color }}
                                />
                                {/* Target marker */}
                                <div
                                  className="absolute top-0 h-full w-px"
                                  style={{ left: `${r.target}%`, background: "var(--border)" }}
                                />
                              </div>
                              <span className="text-foreground w-[40px] text-right font-bold">{r.value.toFixed(1)}%</span>
                              <span
                                className="w-[38px] text-right font-semibold"
                                style={{ color: gap >= 0 ? COLOR_GOOD : COLOR_BAD }}
                              >
                                {gap >= 0 ? "+" : ""}{gap.toFixed(0)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className="text-muted-foreground mt-2 flex items-center justify-between border-t border-dashed pt-2 text-[10px]">
                        <span>{m.totalReports} LPH Â· {m.totalOutput.toLocaleString("id-ID")} pcs</span>
                        <span
                          className="bg-muted rounded border px-1.5 py-0.5 text-[9px] font-bold"
                          style={{ color: mColor, borderColor: mColor }}
                        >
                          {m.oee >= OEE_WORLD_CLASS ? "WORLD CLASS" : m.oee >= 65 ? "ACCEPTABLE" : "NEEDS IMPROVEMENT"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

