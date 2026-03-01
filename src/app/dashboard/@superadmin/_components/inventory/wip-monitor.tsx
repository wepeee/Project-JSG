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
import { Loader2, RefreshCw, FileText } from "lucide-react";
import type { WipMonitorItem } from "~/server/api/routers/ppic/inventory";
import StockCardDialog from "../modules/inventory/stock-card-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import WipMatrix from "../modules/inventory/wip-matrix";

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
  const [includeZero, setIncludeZero] = React.useState(false);

  // Dialog State
  const [cardOpen, setCardOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<{
    itemId: string;
    locationId: number;
    locationName: string;
    proId?: number;
    proNumber?: string;
  } | null>(null);

  // Queries
  const { data: filters } = api.inventory.getFilterOptions.useQuery();

  const queryInput = React.useMemo(() => {
    const pVal = filterProId !== "ALL" ? parseInt(filterProId, 10) : undefined;
    const mVal =
      filterMachineId !== "ALL" ? parseInt(filterMachineId, 10) : undefined;

    return {
      proId: pVal && !isNaN(pVal) ? pVal : undefined,
      machineId: mVal && !isNaN(mVal) ? mVal : undefined,
      includeZero,
      locationTypes:
        filterType === "ALL"
          ? ["WIP", "HOLD", "SCRAP", "FG", "RAW"]
          : [filterType as any],
      type: activeCategory as any,
    };
  }, [filterProId, filterMachineId, includeZero, filterType, activeCategory]);

  const { data, isLoading, refetch, isRefetching } =
    api.inventory.getWipMonitor.useQuery(queryInput);

  // Client-side grouping (Visual Only)
  const groupedData = React.useMemo(() => {
    if (!data) return null;
    if (groupMode === "PRO") {
      return groupBy(data, (item) => `${item.proNumber} (${item.proType})`);
    } else if (groupMode === "MACHINE") {
      return groupBy(data, (item) => item.machineName || "Unassigned");
    } else {
      return groupBy(data, (item) => item.itemId);
    }
  }, [data, groupMode]);

  const sortedKeys = React.useMemo(() => {
    if (!groupedData) return [];
    return Array.from(groupedData.keys()).sort();
  }, [groupedData]);

  const handleOpenCard = (item: WipMonitorItem) => {
    setSelectedRow({
      itemId: item.itemId,
      locationId: item.locationId,
      locationName: item.locationName ?? "Unknown",
      proId: item.proId ?? undefined,
      proNumber: item.proNumber,
    });
    setCardOpen(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col items-start justify-between space-y-2 pb-2 lg:flex-row lg:items-center lg:space-y-0">
          <div className="space-y-1">
            <CardTitle>Inventory WIP (Saldo IN - OUT)</CardTitle>
            <CardDescription>
              Data ini adalah saldo real-time (IN - OUT) per lokasi dan Item.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Switcher - Modern Segmented Control */}
            {!userDepartment && (
              <div className="border-border bg-muted/50 mr-2 flex items-center rounded-lg border p-1">
                <button
                  onClick={() => setActiveCategory("PAPER")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === "PAPER"
                      ? "bg-background text-foreground ring-border shadow-sm ring-1"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  PAPER
                </button>
                <button
                  onClick={() => setActiveCategory("RIGID")}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeCategory === "RIGID"
                      ? "bg-background text-foreground ring-border shadow-sm ring-1"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
            </div>

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
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => refetch()}
              disabled={isLoading || isRefetching}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
          ) : !data || data.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-4 h-12 w-12 opacity-20" />
              <p className="text-lg font-medium">Data Inventory Kosong</p>
              <p className="text-sm opacity-80">
                Belum ada transaksi yang sesuai dengan filter lokasi/PRO ini.
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
                    className="border-border bg-card overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="border-border bg-muted/20 flex items-center justify-between border-b px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="secondary"
                          className={`rounded-md px-2 py-1 font-mono text-xs font-bold ${
                            groupMode === "PRO"
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : groupMode === "MACHINE"
                                ? "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 dark:text-indigo-400"
                                : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
                          }`}
                        >
                          {groupMode === "PRO"
                            ? "PRO"
                            : groupMode === "MACHINE"
                              ? "MACHINE"
                              : "ITEM"}
                        </Badge>
                        <span className="text-foreground text-sm font-semibold">
                          {key}
                        </span>
                        {groupMode === "PRO" && items[0]?.proQty ? (
                          <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                            Target: {items[0].proQty.toLocaleString("id-ID")}
                          </span>
                        ) : null}
                      </div>

                      <div className="bg-background ring-border flex items-center gap-2 rounded-lg px-3 py-1 shadow-sm ring-1">
                        <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                          Total Stok
                        </span>
                        <div className="bg-border h-4 w-px" />
                        <span className="text-primary text-base font-bold">
                          {totalQty.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="border-border border-b hover:bg-transparent">
                          <TableHead className="text-muted-foreground w-[400px] text-xs font-semibold tracking-wider uppercase">
                            {groupMode === "PRO"
                              ? "Step"
                              : groupMode === "MACHINE"
                                ? "PRO Number"
                                : "Step"}
                          </TableHead>
                          <TableHead className="text-muted-foreground w-[300px] text-xs font-semibold tracking-wider uppercase">
                            {groupMode === "ITEM" ? "PRO Number" : "Mesin / PRO"}
                          </TableHead>
                          <TableHead className="text-muted-foreground w-[150px] text-right text-xs font-semibold tracking-wider uppercase">
                            Qty (Stok)
                          </TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, idx) => (
                          <TableRow
                            key={`${item.proId}-${item.locationId}-${item.itemId}-${idx}`}
                            className="border-border hover:bg-muted/50 border-b last:border-0"
                          >
                            <TableCell className="py-2">
                              {groupMode === "PRO"
                                ? (item.stepOrder ?? 999) >= 999 ? "FG (Selesai)" : `Step ${item.stepOrder}`
                                : groupMode === "MACHINE"
                                  ? `${item.proNumber} (${item.proType})`
                                  : (item.stepOrder ?? 999) >= 999 ? "FG (Selesai)" : `Step ${item.stepOrder}`}
                            </TableCell>
                            <TableCell className="text-foreground py-2 font-medium">
                              {groupMode === "ITEM"
                                ? item.proNumber
                                : [item.machineName, item.productName].filter(Boolean).join(" - ") || item.itemId}
                            </TableCell>
                            <TableCell className="text-primary py-2 text-right text-sm font-bold">
                              {item.qty.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="py-2 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:bg-primary/10 hover:text-primary h-7 w-7 rounded-full p-0"
                                onClick={() => handleOpenCard(item)}
                                title="Lihat Kartu Stok"
                              >
                                <FileText className="h-3.5 w-3.5" />
                              </Button>
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
        />
      )}
    </div>
  );
}
