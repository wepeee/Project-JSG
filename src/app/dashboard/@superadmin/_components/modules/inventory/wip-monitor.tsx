"use client";

import * as React from "react";
import { api } from "~/trpc/react";
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
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Loader2, RefreshCw, FileText, Zap, Search } from "lucide-react";
import type { WipMonitorItem } from "~/server/api/routers/ppic/inventory";
import StockCardDialog from "./stock-card-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import WipMatrix from "./wip-matrix";

export default function InventoryDashboard({
  userDepartment,
}: {
  userDepartment?: string;
}) {
  return (
    <Tabs
      defaultValue="monitor"
      className="flex h-[calc(100vh-8rem)] flex-col gap-4"
    >
      <div className="flex flex-none items-center justify-between">
        <TabsList>
          <TabsTrigger value="monitor">WIP Monitor (Audit)</TabsTrigger>
          <TabsTrigger value="matrix">Production Matrix</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        value="monitor"
        className="min-h-0 flex-1 overflow-auto data-[state=inactive]:hidden"
      >
        <WipMonitorContent userDepartment={userDepartment} />
      </TabsContent>

      <TabsContent
        value="matrix"
        className="flex min-h-0 flex-1 flex-col overflow-hidden data-[state=inactive]:hidden"
      >
        <WipMatrix userDepartment={userDepartment} />
      </TabsContent>
    </Tabs>
  );
}

// Grouping Helper
function groupBy<T>(list: T[], keyGetter: (item: T) => string) {
  const map = new Map<string, T[]>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

function formatItemGroupLabel(item: WipMonitorItem) {
  const code = (item.itemId ?? "").trim();
  const name = (item.itemName ?? item.productName ?? "").trim();

  if (code && name && code.toLowerCase() !== name.toLowerCase()) {
    return `${code} - ${name}`;
  }
  if (code) return code;
  if (name) return name;
  return "Unknown Item";
}

function WipMonitorContent({ userDepartment }: { userDepartment?: string }) {
  const [groupMode, setGroupMode] = React.useState<"PRO" | "MACHINE" | "ITEM">(
    "PRO",
  );

  // Filters
  const [activeCategory, setActiveCategory] = React.useState<"PAPER" | "RIGID">(
    () => {
      if (userDepartment === "RIGID") return "RIGID";
      return "PAPER";
    },
  );
  const [filterProId, setFilterProId] = React.useState<string>("ALL");
  const [filterMachineId, setFilterMachineId] = React.useState<string>("ALL");
  const [filterType, setFilterType] = React.useState<string>("WIP");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [includeZero, setIncludeZero] = React.useState(false);
  const [autoRefresh, setAutoRefresh] = React.useState(false);
  const [countdown, setCountdown] = React.useState(30);
  const REFRESH_INTERVAL = 30;

  // Dialog State
  const [cardOpen, setCardOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<{
    itemId: string;
    locationId: number;
    locationName: string;
    proId?: number;
    proNumber?: string;
    siblings: WipMonitorItem[];
    currentIndex: number;
  } | null>(null);

  // Queries
  const { data: filters } = api.inventory.getFilterOptions.useQuery();

  // View Mode
  const [viewMode, setViewMode] = React.useState<"INVENTORY" | "PROGRESS">(
    "INVENTORY",
  );

  const queryInput = React.useMemo(() => {
    const pVal = filterProId !== "ALL" ? parseInt(filterProId, 10) : undefined;
    const mVal =
      filterMachineId !== "ALL" ? parseInt(filterMachineId, 10) : undefined;

    return {
      proId: pVal && !isNaN(pVal) ? pVal : undefined,
      machineId: mVal && !isNaN(mVal) ? mVal : undefined,
      includeZero: viewMode === "INVENTORY" ? includeZero : true, // Progress usually wants to see non-zero output
      locationTypes:
        filterType === "ALL"
          ? ["WIP", "HOLD", "SCRAP", "FG", "RAW"]
          : [filterType as any],
      type: activeCategory as any,
      mode: viewMode,
    };
  }, [
    filterProId,
    filterMachineId,
    includeZero,
    filterType,
    activeCategory,
    viewMode,
  ]);

  const { data, isLoading, refetch, isRefetching } =
    api.inventory.getWipMonitor.useQuery(queryInput, {
      refetchInterval: autoRefresh ? REFRESH_INTERVAL * 1000 : false,
    });

  // Countdown timer
  React.useEffect(() => {
    if (!autoRefresh) {
      setCountdown(REFRESH_INTERVAL);
      return;
    }
    setCountdown(REFRESH_INTERVAL);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return REFRESH_INTERVAL;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, isRefetching]);

  // Client-side grouping (Visual Only)
  const filteredData = React.useMemo(() => {
    if (!data) return null;
    const needle = searchTerm.trim().toLowerCase();
    if (!needle) return data;

    return data.filter((item) => {
      const haystack = [
        item.proNumber,
        item.productName,
        item.machineName,
        item.itemId,
        item.itemName,
        item.proType,
        item.locationName,
        item.locationTypeName,
        item.stepOrder != null ? `step ${item.stepOrder}` : "",
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(needle);
    });
  }, [data, searchTerm]);

  const groupedData = React.useMemo(() => {
    if (!filteredData) return null;
    if (groupMode === "PRO") {
      return groupBy(filteredData, (item) => `${item.proNumber} (${item.proType})`);
    } else if (groupMode === "MACHINE") {
      return groupBy(filteredData, (item) => item.machineName || "Unassigned");
    } else {
      return groupBy(filteredData, (item) => formatItemGroupLabel(item));
    }
  }, [filteredData, groupMode]);

  const sortedKeys = React.useMemo(() => {
    if (!groupedData) return [];
    return Array.from(groupedData.keys()).sort();
  }, [groupedData]);

  const handleOpenCard = (
    item: WipMonitorItem,
    siblings: WipMonitorItem[],
    index: number,
  ) => {
    if (viewMode === "PROGRESS" && item.locationId <= 0) return;

    setSelectedRow({
      itemId: item.itemId,
      locationId: item.locationId,
      locationName: item.locationName ?? "Unknown",
      proId: item.proId ?? undefined,
      proNumber: item.proNumber,
      siblings,
      currentIndex: index,
    });
    setCardOpen(true);
  };

  const handleNextItem = () => {
    setSelectedRow((prev) => {
      if (!prev || prev.currentIndex >= prev.siblings.length - 1) return prev;
      const nextIdx = prev.currentIndex + 1;
      const next = prev.siblings[nextIdx]!;
      return {
        ...prev,
        itemId: next.itemId,
        locationId: next.locationId,
        locationName: next.locationName ?? "Unknown",
        proId: next.proId ?? undefined,
        proNumber: next.proNumber,
        currentIndex: nextIdx,
      };
    });
  };

  const handlePrevItem = () => {
    setSelectedRow((prev) => {
      if (!prev || prev.currentIndex <= 0) return prev;
      const prevIdx = prev.currentIndex - 1;
      const prevItem = prev.siblings[prevIdx]!;
      return {
        ...prev,
        itemId: prevItem.itemId,
        locationId: prevItem.locationId,
        locationName: prevItem.locationName ?? "Unknown",
        proId: prevItem.proId ?? undefined,
        proNumber: prevItem.proNumber,
        currentIndex: prevIdx,
      };
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="border-border bg-muted/20 flex flex-col items-start justify-between space-y-2 border-b pb-4 lg:flex-row lg:items-center lg:space-y-0">
          <div className="space-y-1">
            <CardTitle>
              {viewMode === "INVENTORY"
                ? "Inventory Monitor (On-Hand)"
                : "Production Progress (Output)"}
            </CardTitle>
            <CardDescription>
              {viewMode === "INVENTORY"
                ? "Saldo real-time (IN - OUT) di setiap lokasi produksi / mesin."
                : "Total akumulasi output yang APPROVED per step/mesin."}
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-muted mr-4 flex rounded-lg p-1">
              <button
                onClick={() => setViewMode("INVENTORY")}
                className={`flex items-center gap-2 rounded-md px-3 py-1 text-xs font-bold transition-all ${
                  viewMode === "INVENTORY"
                    ? "bg-background text-primary shadow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Inventory (Stock)
              </button>
              <button
                onClick={() => setViewMode("PROGRESS")}
                className={`flex items-center gap-2 rounded-md px-3 py-1 text-xs font-bold transition-all ${
                  viewMode === "PROGRESS"
                    ? "bg-background text-emerald-600 shadow dark:text-emerald-400"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Progress (Produced)
              </button>
            </div>

            {/* Category Switcher - Only show if NO department restriction */}
            {!userDepartment && (
              <div className="bg-muted mr-2 flex rounded-lg p-1">
                <button
                  onClick={() => setActiveCategory("PAPER")}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                    activeCategory === "PAPER"
                      ? "bg-background shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  PAPER
                </button>
                <button
                  onClick={() => setActiveCategory("RIGID")}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                    activeCategory === "RIGID"
                      ? "bg-background shadow"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  RIGID
                </button>
              </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={filterProId} onValueChange={setFilterProId}>
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <SelectValue placeholder="Semua PRO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua PRO</SelectItem>
                  {filters?.pros.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.proNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterMachineId}
                onValueChange={setFilterMachineId}
              >
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <SelectValue placeholder="Semua Mesin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Mesin</SelectItem>
                  {filters?.machines.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari PRO/mesin/produk/PN..."
                  className="h-8 w-[210px] pl-7 text-xs"
                />
              </div>
            </div>

            {viewMode === "INVENTORY" && (
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="h-8 w-[110px] text-xs">
                  <SelectValue placeholder="Tipe Lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WIP">WIP</SelectItem>
                  <SelectItem value="HOLD">HOLD (QA)</SelectItem>
                  <SelectItem value="SCRAP">SCRAP</SelectItem>
                  <SelectItem value="FG">FG</SelectItem>
                  <SelectItem value="RAW">RAW</SelectItem>
                  <SelectItem value="ALL">Semua</SelectItem>
                </SelectContent>
              </Select>
            )}

            {viewMode === "INVENTORY" && (
              <div className="flex items-center space-x-2 px-2">
                <input
                  type="checkbox"
                  id="includeZero"
                  checked={includeZero}
                  onChange={(e) => setIncludeZero(e.target.checked)}
                  className="text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded border-gray-300"
                />
                <label
                  htmlFor="includeZero"
                  className="cursor-pointer text-xs leading-none font-medium select-none"
                >
                  Include Zero
                </label>
              </div>
            )}

            <div className="bg-border mx-1 h-6 w-px" />

            <Select
              value={groupMode}
              onValueChange={(v) => setGroupMode(v as any)}
            >
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue placeholder="Group By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRO">View by PRO</SelectItem>
                <SelectItem value="MACHINE">View by Machine</SelectItem>
                <SelectItem value="ITEM">View by Item</SelectItem>
              </SelectContent>
            </Select>
            {/* Auto-refresh toggle + manual refresh */}
            <div className="flex items-center gap-1">
              {autoRefresh && (
                <span
                  className="text-muted-foreground tabular-nums text-xs min-w-[28px] text-right"
                  title="Refresh berikutnya dalam..."
                >
                  {countdown}s
                </span>
              )}
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                className={`h-8 gap-1.5 px-2 text-xs ${
                  autoRefresh
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
                onClick={() => setAutoRefresh((v) => !v)}
                title={autoRefresh ? "Auto-refresh Aktif (klik untuk mematikan)" : "Aktifkan Auto-refresh"}
              >
                <Zap className="h-3.5 w-3.5" />
                {autoRefresh ? "Live" : "Auto"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => { void refetch(); setCountdown(REFRESH_INTERVAL); }}
                disabled={isLoading || isRefetching}
                title="Refresh sekarang"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          ) : !filteredData || filteredData.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 opacity-20" />
              <p className="text-lg font-medium">Data Kosong</p>
              <p className="text-sm opacity-80">
                Belum ada data yang sesuai filter{searchTerm.trim() ? " / pencarian" : ""}.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedKeys.map((key) => {
                const itemsRaw = groupedData!.get(key)!;
                // Sort items by Step Order (Ascending)
                const items = [...itemsRaw].sort((a, b) => {
                  const orderA = (a as any).stepOrder ?? 999;
                  const orderB = (b as any).stepOrder ?? 999;
                  if (orderA !== orderB) return orderA - orderB;
                  return (a.machineName ?? "").localeCompare(
                    b.machineName ?? "",
                  );
                });

                const totalQty = items.reduce((acc, curr) => acc + curr.qty, 0);

                return (
                  <div
                    key={key}
                    className="bg-muted/20 border-border rounded-md border p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-foreground flex items-center gap-2 text-lg font-semibold">
                        <Badge variant="outline">
                          {groupMode === "PRO"
                            ? "PRO"
                            : groupMode === "MACHINE"
                              ? "Machine"
                              : "Item"}
                        </Badge>
                        {key}
                        {groupMode === "PRO" && items[0]?.proQty ? (
                          <span className="text-muted-foreground ml-2 text-sm font-normal">
                            (Target: {items[0].proQty.toLocaleString("id-ID")})
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm font-medium">
                          Total {viewMode === "INVENTORY" ? "Stok" : "Output"}:
                        </span>
                        <span
                          className={`text-lg font-bold ${viewMode === "INVENTORY" ? "text-primary" : "text-emerald-600 dark:text-emerald-400"}`}
                        >
                          {totalQty.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow className="border-border border-b hover:bg-transparent">
                          <TableHead className="text-muted-foreground w-[180px] text-xs font-bold tracking-wider uppercase">
                            {groupMode === "PRO"
                              ? "Step"
                              : groupMode === "MACHINE"
                                ? "PRO Number"
                                : "Step"}
                          </TableHead>
                          <TableHead className="text-muted-foreground w-[300px] text-xs font-bold tracking-wider uppercase">
                            {groupMode === "PRO"
                              ? "Mesin / Produk"
                              : groupMode === "ITEM"
                                ? "PRO Number"
                                : "Mesin / PRO"}
                          </TableHead>
                          <TableHead className="text-muted-foreground w-[150px] text-right text-xs font-bold tracking-wider uppercase">
                            {viewMode === "INVENTORY"
                              ? "Qty (On-Hand)"
                              : "Qty (Produced)"}
                          </TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, idx) => (
                          <TableRow
                            key={`${item.proId}-${item.locationId}-${item.itemId}-${idx}`}
                            className="border-border hover:bg-muted/50 border-b"
                          >
                            <TableCell className="w-[180px]">
                              <div className="flex items-center gap-2">
                                <span>
                                  {groupMode === "PRO"
                                    ? (item.stepOrder ?? 999) >= 999 ? "FG (Selesai)" : `Step ${item.stepOrder}`
                                    : groupMode === "MACHINE"
                                      ? `${item.proNumber} (${item.proType})`
                                      : (item.stepOrder ?? 999) >= 999 ? "FG (Selesai)" : `Step ${item.stepOrder}`}
                                </span>
                                {/* Badge tipe lokasi: Stok / Reject / Hold */}
                                {(() => {
                                  const locType = item.locationTypeName;
                                  const locName = (item.locationName ?? "").toLowerCase();
                                  const isScrap = locType === "SCRAP" || locName.includes("scrap");
                                  const isFG = locType === "FG" || locName.includes("finish good") || locName.includes("fg warehouse") || locName.includes("warehouse fg");
                                  const isHold = locType === "HOLD" || locName.includes("hold") || locName.includes("qa");
                                  if (!isScrap && !isFG && !isHold) return null;
                                  return (
                                    <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${
                                      isScrap
                                        ? "border-red-500/40 bg-red-500/20 text-red-400"
                                        : isFG
                                          ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-400"
                                          : "border-amber-500/40 bg-amber-500/20 text-amber-400"
                                    }`}>
                                      {isScrap ? "✕ Reject" : isFG ? "✓ Stok" : "⏸ Hold"}
                                    </span>
                                  );
                                })()}
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground font-medium">
                              {(() => {
                                const label =
                                  groupMode === "PRO"
                                    ? [item.machineName, item.productName]
                                        .filter(Boolean)
                                        .join(" - ") || item.itemId
                                    : groupMode === "ITEM"
                                      ? item.proNumber
                                      : [item.machineName, item.productName]
                                          .filter(Boolean)
                                          .join(" - ") || item.itemId;

                                return (
                                  <div className="max-w-[420px] truncate" title={label}>
                                    {label}
                                  </div>
                                );
                              })()}
                            </TableCell>
                            <TableCell
                              className={`text-right text-base font-semibold ${viewMode === "INVENTORY" ? "text-primary" : "text-emerald-600 dark:text-emerald-400"}`}
                            >
                              {item.qty.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="text-right">
                              {(viewMode === "INVENTORY" ||
                                item.locationId > 0) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleOpenCard(item, items, idx)}
                                  title="Lihat Kartu Stok"
                                >
                                  <FileText className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRow && (
        <StockCardDialog
          open={cardOpen}
          onOpenChange={setCardOpen}
          itemId={selectedRow.itemId}
          locationId={selectedRow.locationId}
          locationName={selectedRow.locationName}
          proId={selectedRow.proId}
          proNumber={selectedRow.proNumber}
          onNextItem={
            selectedRow.currentIndex < selectedRow.siblings.length - 1
              ? handleNextItem
              : undefined
          }
          onPrevItem={
            selectedRow.currentIndex > 0 ? handlePrevItem : undefined
          }
          nextItemLabel={
            selectedRow.siblings[selectedRow.currentIndex + 1]?.itemId
          }
          prevItemLabel={
            selectedRow.siblings[selectedRow.currentIndex - 1]?.itemId
          }
          currentItemIndex={selectedRow.currentIndex}
          totalItems={selectedRow.siblings.length}
        />
      )}
    </div>
  );
}
