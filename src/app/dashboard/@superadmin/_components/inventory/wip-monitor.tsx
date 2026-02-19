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
    proNumber?: string;
    siblings: any[];
    currentIndex: number;
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

  const handleOpenCard = (item: WipMonitorItem, siblings: WipMonitorItem[], index: number) => {
    setSelectedRow({
      itemId: item.itemId,
      locationId: item.locationId,
      locationName: item.locationName ?? "Unknown",
      proNumber: item.proNumber,
      siblings,
      currentIndex: index,
    });
    setCardOpen(true);
  };

  const handleNextItem = () => {
      setSelectedRow((prev) => {
        if (!prev || !prev.siblings) return prev;
        const nextIdx = prev.currentIndex + 1;
        
        // Boundary check
        if (nextIdx >= prev.siblings.length) return prev;

        const nextItem = prev.siblings[nextIdx];
        return {
            ...prev,
            itemId: nextItem.itemId,
            locationId: nextItem.locationId,
            locationName: nextItem.locationName ?? "Unknown",
            proNumber: nextItem.proNumber,
            currentIndex: nextIdx,
        };
      });
  };

  const handlePrevItem = () => {
      setSelectedRow((prev) => {
        if (!prev || !prev.siblings) return prev;
        const prevIdx = prev.currentIndex - 1;

        // Boundary check
        if (prevIdx < 0) return prev;

        const prevItem = prev.siblings[prevIdx];
        return {
            ...prev,
            itemId: prevItem.itemId,
            locationId: prevItem.locationId,
            locationName: prevItem.locationName ?? "Unknown",
            proNumber: prevItem.proNumber,
            currentIndex: prevIdx,
        };
      });
  };

  const prevItemLabel = selectedRow && selectedRow.currentIndex > 0 
    ? (selectedRow.siblings[selectedRow.currentIndex - 1]?.itemId ?? "Prev") 
    : undefined;

  const nextItemLabel = selectedRow && selectedRow.siblings && selectedRow.currentIndex < selectedRow.siblings.length - 1
    ? (selectedRow.siblings[selectedRow.currentIndex + 1]?.itemId ?? "Next")
    : undefined;

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
            {/* Category Switcher - Only show if NO department restriction */}
            {!userDepartment && (
              <div className="mr-2 flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                <button
                  onClick={() => setActiveCategory("PAPER")}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                    activeCategory === "PAPER"
                      ? "bg-white shadow dark:bg-slate-700"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  PAPER
                </button>
                <button
                  onClick={() => setActiveCategory("RIGID")}
                  className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                    activeCategory === "RIGID"
                      ? "bg-white shadow dark:bg-slate-700"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
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
                    return (a.machineName ?? "").localeCompare(b.machineName ?? "");
                });

                const totalQty = items.reduce((acc, curr) => acc + curr.qty, 0);

                return (
                  <div key={key} className="bg-muted/20 rounded-md border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-lg font-semibold">
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
                        <span className="text-sm font-medium text-slate-500">
                          Total:
                        </span>
                        <span className="text-lg font-bold">
                          {totalQty.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[400px]">
                            {groupMode === "PRO"
                              ? "Machine / Location"
                              : groupMode === "MACHINE"
                                ? "PRO Number"
                                : "Machine / Location"}
                          </TableHead>
                          <TableHead className="w-[300px]">
                            {groupMode === "ITEM" ? "PRO Number" : "Item Name"}
                          </TableHead>
                          <TableHead className="w-[150px] text-right">
                            Qty (Stok)
                          </TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item, idx) => (
                          <TableRow
                            key={`${item.proId}-${item.locationId}-${item.itemId}-${idx}`}
                          >
                            <TableCell>
                              {groupMode === "PRO"
                                ? item.machineName
                                : groupMode === "MACHINE"
                                  ? `${item.proNumber} (${item.proType})`
                                  : item.machineName}
                            </TableCell>
                            <TableCell className="font-medium">
                              {groupMode === "ITEM"
                                ? item.proNumber
                                : item.itemId}
                            </TableCell>
                            <TableCell className="text-right text-base font-semibold">
                              {item.qty.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleOpenCard(item, items, idx)}
                                title="Lihat Kartu Stok"
                              >
                                <FileText className="h-4 w-4" />
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
          proNumber={selectedRow.proNumber}
          // Navigation Props (Check stock-card-dialog.tsx for types)
          onNextItem={selectedRow.siblings && selectedRow.currentIndex < selectedRow.siblings.length - 1 ? handleNextItem : undefined}
          onPrevItem={selectedRow.siblings && selectedRow.currentIndex > 0 ? handlePrevItem : undefined}
          nextItemLabel={nextItemLabel}
          prevItemLabel={prevItemLabel}
          currentItemIndex={selectedRow.currentIndex}
          totalItems={selectedRow.siblings?.length}
        />
      )}
    </div>
  );
}
