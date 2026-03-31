"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Pencil,
  ChevronDown,
  ChevronRight,
  Search,
  Loader2,
  Gauge,
  Package,
  Clock,
  TrendingUp,
  Check,
  X,
  RotateCcw,
  Calculator,
  CalendarDays,
} from "lucide-react";

const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const RIGID_PROCESS_TABS = [
  { value: "INJECTION", label: "Injection" },
  { value: "BLOW_MOULDING", label: "Blow Moulding" },
  { value: "PRINTING", label: "Printing" },
  { value: "PACKING_ASSEMBLY", label: "Packing" },
] as const;

type RigidProcessType = (typeof RIGID_PROCESS_TABS)[number]["value"];
type ProStdField = "manPowerStd" | "cycleTimeStd" | "cavityStd";

interface Props {
  userDepartment: "PAPER" | "RIGID";
  readOnly?: boolean;
}

export default function StdOutput({ userDepartment, readOnly = false }: Props) {
  const [search, setSearch] = useState("");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editingGroupStdKey, setEditingGroupStdKey] = useState<string | null>(
    null,
  );
  const [editingGroupStdValue, setEditingGroupStdValue] = useState("");
  const [selectedRigidProcess, setSelectedRigidProcess] =
    useState<RigidProcessType>("INJECTION");

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const [selYear, selMonth] = selectedMonth.split("-").map(Number) as [
    number,
    number,
  ];
  const reportTypeFilter =
    userDepartment === "RIGID" ? selectedRigidProcess : undefined;
  const isMouldingProcess =
    selectedRigidProcess === "INJECTION" ||
    selectedRigidProcess === "BLOW_MOULDING";

  const { data, isLoading, refetch } = api.stdOutput.getStdOutput.useQuery(
    {
      department: userDepartment,
      reportType: reportTypeFilter,
      search: search || undefined,
      month: selMonth,
      year: selYear,
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const setManualSpeed = api.stdOutput.setManualSpeed.useMutation({
    onSuccess: () => {
      void refetch();
      setEditingProduct(null);
      setEditValue("");
    },
  });

  const computeStdSpeed = api.stdOutput.computeAndSaveStdSpeed.useMutation({
    onSuccess: (result) => {
      void refetch();
      if (result.success) {
        alert(
          `Std Speed berhasil dihitung dan disimpan ke ${result.updatedCount} laporan.\nNilai: ${result.stdSpeed?.toFixed(1)} /jam`,
        );
      } else {
        alert("Tidak ada data laporan dengan jam mulai dan selesai yang valid.");
      }
    },
  });

  const setProductStandards = api.stdOutput.setProductStandards.useMutation({
    onSuccess: () => {
      void refetch();
      setEditingGroupStdKey(null);
      setEditingGroupStdValue("");
    },
  });

  const toggleExpand = (productName: string) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productName)) {
        next.delete(productName);
      } else {
        next.add(productName);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (data) {
      setExpandedProducts(new Set(data.map((p) => p.productName)));
    }
  };

  const collapseAll = () => {
    setExpandedProducts(new Set());
  };

  const handleSaveManualSpeed = (productName: string) => {
    const speed = Number.parseFloat(editValue);
    if (!isFinite(speed) || speed <= 0) return;

    setManualSpeed.mutate({
      productName,
      manualSpeed: speed,
      department: userDepartment,
      reportType: reportTypeFilter,
      month: selMonth,
      year: selYear,
    });
  };

  const handleResetManualSpeed = (productName: string) => {
    setManualSpeed.mutate({
      productName,
      manualSpeed: null,
      department: userDepartment,
      reportType: reportTypeFilter,
      month: selMonth,
      year: selYear,
    });
  };

  const formatSpeed = (speed: number) => {
    if (speed <= 0) return "-";
    return speed.toFixed(1);
  };

  const formatNullableNumber = (value: number | null | undefined, digits = 2) => {
    if (value === null || value === undefined || !isFinite(value) || value <= 0)
      return "-";
    return value.toFixed(digits);
  };

  const formatStdOutput = (value: number) => {
    if (value <= 0 || !isFinite(value)) return "-";
    return value.toLocaleString("id-ID", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  const toPerDay = (speedPerHour: number) => speedPerHour * HOURS_PER_DAY;
  const toPerWeek = (speedPerHour: number) =>
    speedPerHour * HOURS_PER_DAY * DAYS_PER_WEEK;

  const getProStdLabel = (field: ProStdField) => {
    if (field === "manPowerStd") return "MP";
    if (field === "cycleTimeStd") return "CT";
    return "CAV";
  };

  const getProStdUnit = (field: ProStdField) => {
    if (field === "cycleTimeStd") return "s";
    return "";
  };

  const getProStdDigits = (field: ProStdField) => {
    if (field === "cavityStd") return 0;
    if (field === "cycleTimeStd") return 2;
    return 1;
  };

  const getGroupStdValue = (
    product: {
      avgManPowerStd: number | null;
      avgCycleTimeStd: number | null;
      avgCavityStd: number | null;
    },
    field: ProStdField,
  ) => {
    if (field === "manPowerStd") return product.avgManPowerStd;
    if (field === "cycleTimeStd") return product.avgCycleTimeStd;
    return product.avgCavityStd;
  };

  const beginEditGroupStd = (
    product: {
      productName: string;
      avgManPowerStd: number | null;
      avgCycleTimeStd: number | null;
      avgCavityStd: number | null;
    },
    field: ProStdField,
  ) => {
    const current = getGroupStdValue(product, field);
    setEditingGroupStdKey(`${product.productName}:${field}`);
    setEditingGroupStdValue(
      current && current > 0 ? current.toFixed(getProStdDigits(field)) : "",
    );
  };

  const saveGroupStd = (productName: string, field: ProStdField) => {
    if (!reportTypeFilter) return;
    const parsed = Number(editingGroupStdValue);
    if (!isFinite(parsed) || parsed <= 0) return;

    const dataForUpdate: {
      productName: string;
      reportType:
        | "PAPER"
        | "INJECTION"
        | "BLOW_MOULDING"
        | "PRINTING"
        | "PACKING_ASSEMBLY";
      month: number;
      year: number;
      manPowerStd?: number;
      cycleTimeStd?: number;
      cavityStd?: number;
    } = {
      productName,
      reportType: reportTypeFilter,
      month: selMonth,
      year: selYear,
    };

    if (field === "manPowerStd") dataForUpdate.manPowerStd = parsed;
    if (field === "cycleTimeStd") dataForUpdate.cycleTimeStd = parsed;
    if (field === "cavityStd") dataForUpdate.cavityStd = Math.round(parsed);

    setProductStandards.mutate(dataForUpdate);
  };

  const totalProducts = data?.length ?? 0;
  const totalPros = data?.reduce((acc, p) => acc + p.proEntries.length, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-blue-600/10">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Total Produk
              </p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-emerald-600/10">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                Total PRO
              </p>
              <p className="text-2xl font-bold">{totalPros}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-sm font-medium outline-none"
          />
        </div>

        <div className="relative min-w-[240px] flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Cari nama produk atau kode PRO..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={expandAll}>
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={collapseAll}>
            Collapse All
          </Button>
        </div>
      </div>

      {userDepartment === "RIGID" && (
        <div className="space-y-4 rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex flex-wrap gap-2">
            {RIGID_PROCESS_TABS.map((tab) => {
              const active = selectedRigidProcess === tab.value;
              return (
                <Button
                  key={tab.value}
                  type="button"
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => setSelectedRigidProcess(tab.value)}
                  className={!active ? "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400" : ""}
                >
                  {tab.label}
                </Button>
              );
            })}
          </div>
          <div className="text-muted-foreground space-y-1.5 text-xs">
            <p className="font-semibold text-foreground">Rumus Kalkulasi Standar (Sesuai Daftar Laporan):</p>
            <ul className="list-inside list-disc space-y-1">
              {isMouldingProcess ? (
                <>
                  <li><strong>Standard:</strong> Menggunakan <strong>Cycle Time (CT)</strong> dan <strong>Cavity (CAV)</strong>.</li>
                  <li><strong>Std Output / Jam:</strong> <code className="bg-muted text-blue-500 rounded px-1.5 py-0.5">(3600 / CT Std) × Cavity Std</code></li>
                  {selectedRigidProcess === "BLOW_MOULDING" && (
                    <li><strong className="text-amber-600">Note Blow Moulding:</strong> Perhitungan Running Hour dalam OEE menggunakan fixed 7 Jam.</li>
                  )}
                </>
              ) : (
                <>
                  <li><strong>Standard:</strong> Menggunakan <strong>Cycle Time (CT)</strong> dan <strong>Man Power (MP)</strong>.</li>
                  <li><strong>Std Output / Jam:</strong> <code className="bg-muted text-blue-500 rounded px-1.5 py-0.5">(3600 / CT Std) × 0.8</code> <span className="text-[10px] opacity-70">(0.8 = Faktor Efisiensi 80%)</span></li>
                </>
              )}
              <li><strong>Output / Hari:</strong> Std per Jam × <span className="text-amber-500 font-bold">7</span> <span className="text-[10px] opacity-70">(Asumsi 1 Shift Efektif)</span> | <strong>Output / Minggu:</strong> Std per Hari × <span className="text-amber-500 font-bold">6</span></li>
            </ul>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          <span className="text-muted-foreground ml-3">Menghitung speed...</span>
        </div>
      )}

      {!isLoading && data && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Gauge className="text-muted-foreground/30 mb-4 h-16 w-16" />
          <p className="text-muted-foreground text-lg font-medium">
            Tidak ada data
          </p>
          <p className="text-muted-foreground/60 text-sm">
            Belum ada laporan produksi dengan jam mulai dan selesai
          </p>
        </div>
      )}

      {data && data.length > 0 && (
        <div className="space-y-3">
          {data.map((product) => {
            const isExpanded = expandedProducts.has(product.productName);
            const isEditing = editingProduct === product.productName;
            const activeSpeed = product.manualSpeed ?? product.avgSpeed;
            const primaryStdPerHour =
              userDepartment === "RIGID"
                ? Number(product.calculatedStdPerHour ?? 0)
                : activeSpeed;

            return (
              <Card
                key={product.productName}
                className="overflow-hidden transition-all duration-200"
              >
                <div className="flex w-full items-center gap-4 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => toggleExpand(product.productName)}
                    className="text-muted-foreground shrink-0 transition-colors hover:text-foreground"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleExpand(product.productName)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">
                        {product.productName}
                      </h3>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {product.proEntries.length} PRO
                      </Badge>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                        {userDepartment === "RIGID"
                          ? "Calculated Std Output"
                          : product.manualSpeed !== null
                            ? "Manual Speed"
                            : "Avg Std Speed"}
                      </div>
                      <div
                        className={`text-lg font-bold tabular-nums ${
                          userDepartment === "RIGID"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : product.manualSpeed !== null
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {formatSpeed(primaryStdPerHour)}
                        <span className="text-muted-foreground ml-0.5 text-xs font-normal">
                          /hour
                        </span>
                      </div>
                      {userDepartment === "RIGID" && (
                        <div className="text-muted-foreground mt-0.5 text-[10px]">
                          Avg aktual: {formatSpeed(product.avgSpeed)}/hour
                        </div>
                      )}
                      <div className="text-muted-foreground mt-0.5 space-y-0.5 text-[10px]">
                        <div>{formatStdOutput(toPerDay(primaryStdPerHour))} /day</div>
                        <div>{formatStdOutput(toPerWeek(primaryStdPerHour))} /week</div>
                      </div>
                    </div>

                    {userDepartment === "RIGID" && (
                      <div className="grid min-w-[300px] grid-cols-3 gap-2">
                        {(() => {
                          let activeFields: ProStdField[] = [];
                          if (selectedRigidProcess === "INJECTION" || selectedRigidProcess === "BLOW_MOULDING") {
                            activeFields = ["cycleTimeStd", "cavityStd"];
                          } else {
                            activeFields = ["manPowerStd", "cycleTimeStd"];
                          }
                          return activeFields;
                        })().map((field) => {
                          const key = `${product.productName}:${field}`;
                          const isEditingField = editingGroupStdKey === key;
                          const value = getGroupStdValue(product, field);
                          const digits = getProStdDigits(field);
                          const unit = getProStdUnit(field);

                          return (
                            <div
                              key={field}
                              className="bg-muted/40 rounded-md border px-2 py-1.5"
                            >
                              <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                                {getProStdLabel(field)}
                              </div>
                              {isEditingField ? (
                                <div className="mt-1 flex items-center gap-1">
                                  <Input
                                    type="number"
                                    step={field === "cavityStd" ? 1 : 0.1}
                                    min={1}
                                    value={editingGroupStdValue}
                                    onChange={(e) =>
                                      setEditingGroupStdValue(e.target.value)
                                    }
                                    className="h-7 text-xs"
                                    autoFocus
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        saveGroupStd(product.productName, field);
                                      }
                                      if (e.key === "Escape") {
                                        setEditingGroupStdKey(null);
                                        setEditingGroupStdValue("");
                                      }
                                    }}
                                  />
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30"
                                    onClick={() =>
                                      saveGroupStd(product.productName, field)
                                    }
                                    disabled={setProductStandards.isPending}
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                                    onClick={() => {
                                      setEditingGroupStdKey(null);
                                      setEditingGroupStdValue("");
                                    }}
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="mt-1 flex items-center justify-between gap-1">
                                  <div className="font-mono text-xs font-semibold tabular-nums">
                                    {formatNullableNumber(value, digits)}
                                    {value && value > 0 ? unit : ""}
                                  </div>
                                  {!readOnly && (
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-6 w-6 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
                                      onClick={() =>
                                        beginEditGroupStd(product, field)
                                      }
                                      disabled={setProductStandards.isPending}
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {!readOnly &&
                      userDepartment === "PAPER" &&
                      (isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <Input
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            placeholder="Speed /hr"
                            className="h-8 w-24 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                handleSaveManualSpeed(product.productName);
                              if (e.key === "Escape") {
                                setEditingProduct(null);
                                setEditValue("");
                              }
                            }}
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30"
                            onClick={() =>
                              handleSaveManualSpeed(product.productName)
                            }
                            disabled={setManualSpeed.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30"
                            onClick={() => {
                              setEditingProduct(null);
                              setEditValue("");
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          {product.manualSpeed !== null && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 gap-1.5 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/30"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResetManualSpeed(product.productName);
                              }}
                              disabled={setManualSpeed.isPending}
                              title="Reset ke hitung otomatis"
                            >
                              <RotateCcw className="h-3 w-3" />
                              <span className="hidden sm:inline">Auto</span>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1.5 text-xs text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              computeStdSpeed.mutate({
                                productName: product.productName,
                                reportType: reportTypeFilter,
                                month: selMonth,
                                year: selYear,
                              });
                            }}
                            disabled={computeStdSpeed.isPending}
                            title="Hitung otomatis std speed dan simpan ke semua laporan"
                          >
                            <Calculator className="h-3 w-3" />
                            <span className="hidden sm:inline">
                              Hitung Otomatis
                            </span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 gap-1.5 text-xs text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProduct(product.productName);
                              setEditValue(
                                product.manualSpeed?.toString() ??
                                  product.avgSpeed.toFixed(1),
                              );
                            }}
                            title="Edit manual speed"
                          >
                            <Pencil className="h-3 w-3" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t">
                    <div className="bg-muted/20 divide-y">
                      {product.proEntries.map((pro) => (
                        <div
                          key={pro.proNumber}
                          className="flex flex-wrap items-center gap-3 px-5 py-3 pl-14 md:flex-nowrap"
                        >
                          <div className="flex min-w-[180px] items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 dark:bg-slate-800">
                              <span className="text-[10px] font-bold text-slate-500">
                                PRO
                              </span>
                            </div>
                            <div>
                              <div className="font-mono text-sm font-semibold">
                                {pro.proNumber}
                              </div>
                              {pro.machineName && (
                                <div className="text-muted-foreground text-[11px]">
                                  {pro.machineName}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <div className="text-muted-foreground flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              <span>{pro.totalOutput.toLocaleString()} out</span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatHours(pro.totalLeadtimeHours)}</span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1">
                              <span>{pro.reportCount} laporan</span>
                            </div>
                          </div>

                          <div className="ml-auto text-right">
                            <div className="text-muted-foreground text-[10px] uppercase">
                              Speed
                            </div>
                            <div className="font-mono text-base font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                              {formatSpeed(
                                userDepartment === "RIGID"
                                  ? Number(pro.calculatedStdPerHour ?? 0)
                                  : pro.avgSpeed,
                              )}
                              <span className="text-muted-foreground ml-0.5 text-[10px] font-normal">
                                /hour
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-muted/40 flex items-center justify-between border-t px-5 py-2.5">
                      <div className="text-muted-foreground text-xs">
                        Total {product.proEntries.length} PRO |{" "}
                        {product.proEntries.reduce((a, p) => a + p.reportCount, 0)}{" "}
                        laporan
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Gauge className="h-3.5 w-3.5 text-blue-500" />
                        <span className="text-muted-foreground">Avg:</span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          {formatSpeed(product.avgSpeed)}/hour
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
