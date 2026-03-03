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
  if (val >= OEE_WORLD_CLASS) return "#22c55e";
  if (val >= 65) return "#f59e0b";
  return "#ef4444";
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
        <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${color}20` }}>
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

export default function OeeDashboard() {
  const [datePreset, setDatePreset] = React.useState("30d");
  const [groupBy, setGroupBy] = React.useState<"day" | "week" | "month">("week");

  const { start, end } = React.useMemo(() => getDateRange(datePreset), [datePreset]);

  const { data, isLoading, refetch, isRefetching } = api.oee.getMachineOee.useQuery({ startDate: start, endDate: end, groupBy });
  const { data: rejectData } = api.oee.getRejectBreakdown.useQuery({ startDate: start, endDate: end });
  const { data: downtimeData } = api.oee.getDowntimeBreakdown.useQuery({ startDate: start, endDate: end });

  const summary = data?.summary;
  const oeeVal = summary?.oee ?? 0;
  const oeeGauge = oeeColor(oeeVal);

  const radarData = data?.machineOee.map((m) => ({
    machine: m.machineName.length > 12 ? m.machineName.slice(0, 12) + "…" : m.machineName,
    OEE: m.oee, Availability: m.availability, Performance: m.performance, Quality: m.quality,
  })) ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-foreground text-xl font-bold">OEE Analytics — Paper</h2>
          <p className="text-muted-foreground text-sm">Overall Equipment Effectiveness · Availability × Performance × Quality</p>
        </div>
        <div className="flex items-center gap-2">
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
              <span className="text-muted-foreground ml-auto text-xs">{summary!.totalReports} laporan · Target world-class: {OEE_WORLD_CLASS}%</span>
            </div>
            <div className="flex flex-wrap items-center justify-around gap-6">
              <div className="flex flex-col items-center gap-2">
                <GaugeMeter value={oeeVal} label="OEE" color={oeeGauge} size={160} />
                <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: `${oeeGauge}20`, color: oeeGauge }}>
                  {oeeVal >= OEE_WORLD_CLASS ? "✓ World Class" : oeeVal >= 65 ? "⚠ Perlu Perbaikan" : "✕ Di bawah Standar"}
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <GaugeMeter value={summary!.availability} label="Availability" color="#3b82f6" size={110} />
                  <span className="text-muted-foreground text-[10px]">Target: {AVAIL_TARGET}%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <GaugeMeter value={summary!.performance} label="Performance" color="#a855f7" size={110} />
                  <span className="text-muted-foreground text-[10px]">Target: {PERF_TARGET}%</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <GaugeMeter value={summary!.quality} label="Quality" color="#22c55e" size={110} />
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
                  <div className="text-lg font-bold text-amber-500">{Math.round(summary!.totalDowntimeMinutes / 60)}j</div>
                  <div className="text-muted-foreground text-[10px]">{summary!.totalDowntimeMinutes} menit</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="OEE" value={`${oeeVal.toFixed(1)}%`} icon={<Target className="h-4 w-4" />} color={oeeGauge} sub={`World class: ${OEE_WORLD_CLASS}%`} />
            <StatCard label="Availability" value={`${summary!.availability.toFixed(1)}%`} icon={<Zap className="h-4 w-4" />} color="#3b82f6" sub={`Downtime: ${summary!.totalDowntimeMinutes} mnt`} />
            <StatCard label="Performance" value={`${summary!.performance.toFixed(1)}%`} icon={<TrendingUp className="h-4 w-4" />} color="#a855f7" sub="Output vs Std Kapasitas" />
            <StatCard label="Quality" value={`${summary!.quality.toFixed(1)}%`} icon={<Activity className="h-4 w-4" />} color="#22c55e" sub={`Total good: ${summary!.totalGoodOutput.toLocaleString("id-ID")} pcs`} />
          </div>

          {/* Trend Chart */}
          <div className="bg-card border-border rounded-xl border p-5">
            <h3 className="mb-4 font-bold">Tren OEE</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.trend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="gOee" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} /><stop offset="95%" stopColor="#f59e0b" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gAvail" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gPerf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.15} /><stop offset="95%" stopColor="#a855f7" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gQual" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" opacity={0.4} />
                <XAxis dataKey="label" className="text-muted-foreground" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="text-muted-foreground" unit="%" />
                <Tooltip content={<OeeTooltip />} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <ReferenceLine y={OEE_WORLD_CLASS} stroke="#22c55e" strokeDasharray="4 4" label={{ value: `WC ${OEE_WORLD_CLASS}%`, fill: "#22c55e", fontSize: 10 }} />
                <Area type="monotone" dataKey="oee" name="OEE" stroke="#f59e0b" fill="url(#gOee)" strokeWidth={2.5} dot={{ r: 3, fill: "#f59e0b" }} />
                <Area type="monotone" dataKey="availability" name="Availability" stroke="#3b82f6" fill="url(#gAvail)" strokeWidth={1.5} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="performance" name="Performance" stroke="#a855f7" fill="url(#gPerf)" strokeWidth={1.5} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="quality" name="Quality" stroke="#22c55e" fill="url(#gQual)" strokeWidth={1.5} strokeDasharray="4 2" />
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
                      {rejectData.breakdown.map((_, i) => <Cell key={i} fill={`hsl(${i * 15}, 75%, 55%)`} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              {rejectData && <p className="text-muted-foreground mt-2 text-center text-xs">Total reject: <b className="text-red-400">{rejectData.totalReject.toLocaleString("id-ID")} pcs</b></p>}
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
                      {downtimeData.breakdown.map((_, i) => <Cell key={i} fill={`hsl(${30 + i * 18}, 80%, 55%)`} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
              {downtimeData && <p className="text-muted-foreground mt-2 text-center text-xs">Total downtime: <b className="text-amber-400">{downtimeData.totalDowntime} menit</b></p>}
            </div>
          </div>

          {/* Radar Chart */}
          {radarData.length > 1 && (
            <div className="bg-card border-border rounded-xl border p-5">
              <h3 className="mb-4 font-bold">Radar OEE Komponen per Mesin</h3>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={radarData}>
                  <PolarGrid className="stroke-border" />
                  <PolarAngleAxis dataKey="machine" tick={{ fontSize: 11 }} className="text-muted-foreground fill-muted-foreground" />
                  <Radar name="OEE" dataKey="OEE" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="Availability" dataKey="Availability" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} strokeWidth={1.5} />
                  <Radar name="Performance" dataKey="Performance" stroke="#a855f7" fill="#a855f7" fillOpacity={0.1} strokeWidth={1.5} />
                  <Radar name="Quality" dataKey="Quality" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} strokeWidth={1.5} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 11 }} formatter={(v: any) => `${Number(v).toFixed(1)}%`} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}
