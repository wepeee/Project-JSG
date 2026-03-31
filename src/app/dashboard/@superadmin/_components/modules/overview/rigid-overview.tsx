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
import { Loader2, Package, CheckCircle, AlertCircle, BarChart2, TrendingDown, Table as TableIcon } from "lucide-react";

type ReportTypeFilter = "ALL" | "INJECTION" | "BLOW_MOULDING" | "PRINTING" | "PACKING_ASSEMBLY";
type MatrixMetric = "output" | "passOn" | "rejectPcs" | "rejectRate";

const DATE_RANGE_OPTIONS = [
  { value: "7D", label: "7 Hari Terakhir" },
  { value: "14D", label: "14 Hari Terakhir" },
  { value: "30D", label: "30 Hari Terakhir" },
  { value: "3M", label: "3 Bulan Terakhir" },
  { value: "6M", label: "6 Bulan Terakhir" },
  { value: "1Y", label: "1 Tahun Terakhir" },
] as const;

type DateRangeType = typeof DATE_RANGE_OPTIONS[number]["value"];

const INTERVAL_OPTIONS = [
  { value: "DAY", label: "Harian" },
  { value: "WEEK", label: "Mingguan" },
  { value: "MONTH", label: "Bulanan" },
  { value: "YEAR", label: "Tahunan" },
] as const;

type IntervalType = typeof INTERVAL_OPTIONS[number]["value"];

const REPORT_TYPE_OPTIONS: { value: ReportTypeFilter; label: string }[] = [
  { value: "ALL", label: "Semua Proses" },
  { value: "INJECTION", label: "Injection" },
  { value: "BLOW_MOULDING", label: "Blow Moulding" },
  { value: "PRINTING", label: "Printing" },
  { value: "PACKING_ASSEMBLY", label: "Packing & Assembly" },
];

const MATRIX_METRICS: { value: MatrixMetric; label: string; format: (v: number) => string }[] = [
  { value: "output", label: "Total Output (PCS)", format: (v: number) => v.toLocaleString("id-ID") },
  { value: "passOn", label: "Pass On (PCS)", format: (v: number) => v.toLocaleString("id-ID") },
  { value: "rejectPcs", label: "Reject (PCS)", format: (v: number) => v.toLocaleString("id-ID") },
  { value: "rejectRate", label: "Reject Rate (%)", format: (v: number) => `${v.toFixed(2)}%` },
];

export default function RigidOverview() {
  const [dateRange, setDateRange] = useState<DateRangeType>("14D");
  const [interval, setIntervalVal] = useState<IntervalType>("DAY");
  const [reportType, setReportType] = useState<ReportTypeFilter>("ALL");
  const [matrixMetric, setMatrixMetric] = useState<MatrixMetric>("output");

  const { data, isLoading, error } = api.dashboard.getRigidDashboard.useQuery({
    dateRange,
    interval,
    reportType: reportType === "ALL" ? undefined : reportType,
  });

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive flex h-64 w-full items-center justify-center text-sm">
        Error: {error.message}
      </div>
    );
  }

  if (!data) return null;

  const { timeIntervals, productRows, divisionRows } = data;
  const hasData = productRows.length > 0 && timeIntervals.length > 0;

  const activeMetricFormat = MATRIX_METRICS.find((m) => m.value === matrixMetric)?.format ?? ((v: number) => String(v));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">Dashboard Metrics — Rigid</CardTitle>
              <CardDescription>
                Ringkasan data produksi Rigid dalam bentuk angka dan tabel struktural
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

              <Select
                value={reportType}
                onValueChange={(v) => setReportType(v as ReportTypeFilter)}
              >
                <SelectTrigger className="w-[160px]">
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
            </div>
          </div>
        </CardHeader>
      </Card>

      {!hasData ? (
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
            <div className="bg-muted rounded-full p-3">
              <TableIcon className="text-muted-foreground h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold">Belum Ada Data</h3>
            <p className="text-muted-foreground max-w-md text-sm">
              Belum ada laporan produksi Rigid yang disetujui dalam periode yang dipilih.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={<Package className="h-4 w-4" style={{ color: "var(--chart-1)" }} />}
              title="Total Output"
              value={productRows.reduce((s: number, r: any) => s + r.totals.output, 0).toLocaleString("id-ID")}
              sub={`${timeIntervals.length} interval · ${productRows.length} produk`}
            />
            <SummaryCard
              icon={<CheckCircle className="h-4 w-4" style={{ color: "var(--chart-2)" }} />}
              title="Total Pass On"
              value={productRows.reduce((s: number, r: any) => s + r.totals.passOn, 0).toLocaleString("id-ID")}
              sub="PCS disetujui lanjut"
            />
            <SummaryCard
              icon={<AlertCircle className="h-4 w-4" style={{ color: "var(--destructive)" }} />}
              title="Total Reject"
              value={productRows.reduce((s: number, r: any) => s + r.totals.rejectPcs, 0).toLocaleString("id-ID")}
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

          {/* Division Ringkasan Table */}
          <MetricCard
            title={`Kinerja Produksi Divisi (${INTERVAL_OPTIONS.find(o => o.value === interval)?.label})`}
            description="Agregasi rata-rata data seluruh produk Rigid per interval"
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
                      <td className="px-3 py-2 text-right tabular-nums text-destructive">
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

          {/* Detail Matrix Mingguan per Produk */}
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-base">Matriks Evaluasi per Produk ({INTERVAL_OPTIONS.find(o => o.value === interval)?.label})</CardTitle>
                <CardDescription>
                  Pilih metrik yang ingin ditampilkan untuk melihat persebaran data per produk setiap intervalnya
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
              <table className="w-full whitespace-nowrap text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-y">
                    <th className="px-3 py-2 text-left font-medium border-x sticky left-0 bg-background z-10 w-fit min-w-[200px]">
                      Produk
                    </th>
                    {timeIntervals.map((w: any) => (
                      <th key={w.key} className="px-3 py-2 text-right font-medium border-x">
                        {w.label}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-right font-medium border-x bg-muted/20">
                      Summary {MATRIX_METRICS.find((m) => m.value === matrixMetric)?.label.split(" ")[0]}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {productRows.map((row: any, i: number) => (
                    <tr key={row.productName} className={i % 2 === 0 ? "border-b" : "bg-muted/10 border-b"}>
                      <td className="px-3 py-2 font-medium border-x sticky left-0 bg-background z-10 truncate max-w-[250px]" title={row.productName}>
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
                          <td key={w.key} className={`px-3 py-2 text-right tabular-nums border-x ${colorClass}`}>
                            {val === 0 && matrixMetric !== "rejectRate" ? "-" : activeMetricFormat(val)}
                          </td>
                        );
                      })}
                      
                      {/* Row Total according to selected metric */}
                      <td className="px-3 py-2 text-right tabular-nums font-bold border-x bg-muted/20">
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

          {/* Tabel Ringkasan (Total Semua Keseluruhan) */}
          <MetricCard
            title="Rekapitulasi Total per Produk"
            description="Tabel ringkasan jumlah akumulasi seluruh rentang waktu yang difilter"
          >
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-3 py-2 text-left font-medium">Produk</th>
                    <th className="px-3 py-2 text-right font-medium">Total Output</th>
                    <th className="px-3 py-2 text-right font-medium">Pass On</th>
                    <th className="px-3 py-2 text-right font-medium">Reject PCS</th>
                    <th className="px-3 py-2 text-right font-medium">Reject Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {productRows.map((row: any, i: number) => (
                    <tr key={row.productName} className={i % 2 === 0 ? "" : "bg-muted/20"}>
                      <td className="px-3 py-2 font-medium">{row.productName}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {row.totals.output.toLocaleString("id-ID")}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {row.totals.passOn.toLocaleString("id-ID")}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-destructive">
                        {row.totals.rejectPcs.toLocaleString("id-ID")}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums font-semibold">
                        <span
                          className={
                            row.totals.rejectRate > 5
                              ? "text-destructive"
                              : row.totals.rejectRate > 2
                                ? "text-yellow-500"
                                : "text-green-500"
                          }
                        >
                          {row.totals.rejectRate.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </MetricCard>
        </>
      )}
    </div>
  );
}

// ─── Helper Components ────────────────────────────────────────────────

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
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      </CardContent>
    </Card>
  );
}
