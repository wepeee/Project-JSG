"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
} from "~/components/ui/card";
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

interface Props {
  userDepartment: "PAPER" | "RIGID";
}

export default function StdOutput({ userDepartment }: Props) {
  const [search, setSearch] = useState("");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(
    new Set(),
  );
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Month filter — default to current month (YYYY-MM)
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);

  const [selYear, selMonth] = selectedMonth.split("-").map(Number) as [number, number];

  const { data, isLoading, refetch } = api.stdOutput.getStdOutput.useQuery(
    {
      department: userDepartment,
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
    onSuccess: (data) => {
      void refetch();
      if (data.success) {
        alert(
          `Std Speed berhasil dihitung & disimpan ke ${data.updatedCount} laporan.\nNilai: ${data.stdSpeed?.toFixed(1)} /jam`,
        );
      } else {
        alert("Tidak ada data laporan dengan jam mulai & selesai yang valid.");
      }
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
    const speed = parseFloat(editValue);
    if (isNaN(speed) || speed <= 0) return;
    setManualSpeed.mutate({ productName, manualSpeed: speed });
  };

  const handleResetManualSpeed = (productName: string) => {
    setManualSpeed.mutate({ productName, manualSpeed: null });
  };

  const formatSpeed = (speed: number) => {
    if (speed === 0) return "-";
    return speed.toFixed(1);
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  // Summary stats
  const totalProducts = data?.length ?? 0;
  const totalPros = data?.reduce((acc, p) => acc + p.proEntries.length, 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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

      {/* Search & Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Month Picker */}
        <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent text-sm font-medium outline-none"
          />
        </div>

        {/* Search */}
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          <span className="text-muted-foreground ml-3">Menghitung speed...</span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && data && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Gauge className="text-muted-foreground/30 mb-4 h-16 w-16" />
          <p className="text-muted-foreground text-lg font-medium">
            Tidak ada data
          </p>
          <p className="text-muted-foreground/60 text-sm">
            Belum ada laporan produksi dengan jam mulai & selesai
          </p>
        </div>
      )}

      {/* Product Groups */}
      {data && data.length > 0 && (
        <div className="space-y-3">
          {data.map((product) => {
            const isExpanded = expandedProducts.has(product.productName);
            const isEditing = editingProduct === product.productName;
            const activeSpeed = product.manualSpeed ?? product.avgSpeed;

            return (
              <Card
                key={product.productName}
                className="overflow-hidden transition-all duration-200"
              >
                {/* Product Header */}
                <div className="flex w-full items-center gap-4 px-5 py-4">
                  {/* Toggle expand */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(product.productName)}
                    className="text-muted-foreground shrink-0 hover:text-foreground transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>

                  {/* Product Name (clickable to expand) */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(product.productName)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">
                        {product.productName}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[10px]"
                      >
                        {product.proEntries.length} PRO
                      </Badge>
                    </div>
                  </button>

                  {/* Speed Display + Actions */}
                  <div className="flex shrink-0 items-center gap-3">
                    {/* Speed Value */}
                    <div className="text-right">
                      <div className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                        {product.manualSpeed !== null
                          ? "Manual Speed"
                          : "Avg Std Speed"}
                      </div>
                      <div
                        className={`text-lg font-bold tabular-nums ${
                          product.manualSpeed !== null
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {formatSpeed(activeSpeed)}
                        <span className="text-muted-foreground ml-0.5 text-xs font-normal">
                          /hour
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing ? (
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
                              month: selMonth,
                              year: selYear,
                            });
                          }}
                          disabled={computeStdSpeed.isPending}
                          title="Hitung otomatis std speed dan simpan ke semua laporan"
                        >
                          <Calculator className="h-3 w-3" />
                          <span className="hidden sm:inline">Hitung Otomatis</span>
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
                    )}
                  </div>
                </div>

                {/* PRO Entries (expanded) */}
                {isExpanded && (
                  <div className="border-t">
                    <div className="bg-muted/20 divide-y">
                      {product.proEntries.map((pro) => (
                        <div
                          key={pro.proNumber}
                          className="flex flex-wrap items-center gap-3 px-5 py-3 pl-14 md:flex-nowrap"
                        >
                          {/* PRO Number & Machine */}
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

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-xs">
                            <div className="text-muted-foreground flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              <span>
                                {pro.totalOutput.toLocaleString()} out
                              </span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatHours(pro.totalLeadtimeHours)}
                              </span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1">
                              <span>{pro.reportCount} laporan</span>
                            </div>
                          </div>

                          {/* PRO Speed (read-only) */}
                          <div className="ml-auto text-right">
                            <div className="text-muted-foreground text-[10px] uppercase">
                              Speed
                            </div>
                            <div className="font-mono text-base font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                              {formatSpeed(pro.avgSpeed)}
                              <span className="text-muted-foreground ml-0.5 text-[10px] font-normal">
                                /hour
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Product Footer Summary */}
                    <div className="bg-muted/40 flex items-center justify-between border-t px-5 py-2.5">
                      <div className="text-muted-foreground text-xs">
                        Total {product.proEntries.length} PRO ·{" "}
                        {product.proEntries
                          .reduce((a, p) => a + p.reportCount, 0)}{" "}
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
