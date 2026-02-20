"use client";

import * as React from "react";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
import { Download, Loader2, Search } from "lucide-react";
import ReportsListDialog from "./reports-list-dialog";

export default function WipMatrix({
  userDepartment,
}: {
  userDepartment?: string;
}) {
  const [status, setStatus] = React.useState<string>("ALL");
  const [type, setType] = React.useState<string>(() => {
    if (userDepartment === "PAPER") return "PAPER";
    if (userDepartment === "RIGID") return "RIGID";
    return "ALL";
  });
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");

  // Drill-down State
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedCell, setSelectedCell] = React.useState<{
    proId: number;
    proNumber: string;
    machineId?: number;
    machineName?: string;
  } | null>(null);

  // View Mode
  const [viewMode, setViewMode] = React.useState<"INVENTORY" | "PROGRESS">(
    "PROGRESS",
  );

  const queryInput = React.useMemo(() => {
    const sDate = startDate ? new Date(startDate) : undefined;
    const eDate = endDate ? new Date(endDate) : undefined;

    // Status logic
    let statFilter: "OPEN" | "IN_PROGRESS" | "CLOSED" | undefined = undefined;
    if (status !== "ALL") {
      statFilter = status as any;
    }

    return {
      startDate: sDate,
      endDate: eDate,
      status: statFilter,
      type: type !== "ALL" ? (type as "PAPER" | "RIGID") : undefined,
      mode: viewMode,
    };
  }, [startDate, endDate, status, type, viewMode]);

  const { data, isLoading } = api.inventory.getWipMatrix.useQuery(queryInput);

  const handleExport = () => {
    if (!data) return;
    const headers = [
      "PRO Number",
      "Product Name",
      "Qty PO",
      "Type",
      "Status",
      ...data.columns.map((c) => c.name),
      viewMode === "INVENTORY" ? "FG On-Hand" : "FG Received",
      "% Fulfillment",
    ];

    const csvRows = data.rows.map((row) => {
      const machineVals = data.columns.map((col) => row.matrix[col.id] || 0);
      return [
        row.proNumber,
        `"${row.productName.replace(/"/g, '""')}"`,
        row.qtyPoPcs,
        row.type,
        row.status,
        ...machineVals,
        row.fgReceived,
        row.fulfillment.toFixed(2) + "%",
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `wip_matrix_${viewMode.toLowerCase()}_${format(new Date(), "yyyyMMdd")}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCellClick = (
    row: NonNullable<typeof data>["rows"][0],
    colId?: number,
    colName?: string,
  ) => {
    // Disable drilldown for INVENTORY mode as it's not based on Production Reports directly
    if (viewMode === "INVENTORY") return;

    setSelectedCell({
      proId: row.id,
      proNumber: row.proNumber,
      machineId: colId,
      machineName: colName,
    });
    setDialogOpen(true);
  };

  return (
    <Card className="flex h-full min-w-0 flex-col border-none shadow-none">
      {/* Filters Toolbar */}
      <div className="border-border bg-card mb-4 flex flex-col gap-3 rounded-lg border p-3 shadow-sm sm:flex-row sm:items-center">
        {/* View Mode Toggle - Modern Segmented Control */}
        <div className="border-border bg-muted/50 flex items-center rounded-lg border p-1">
          <button
            onClick={() => setViewMode("PROGRESS")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "PROGRESS"
                ? "bg-background ring-border text-emerald-600 shadow-sm ring-1 dark:text-emerald-400"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            Progress (Flow)
          </button>
          <button
            onClick={() => setViewMode("INVENTORY")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "INVENTORY"
                ? "bg-background text-primary ring-border shadow-sm ring-1"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            Inventory (Stock)
          </button>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[180px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses (Open/Closed)</SelectItem>
              <SelectItem value="OPEN">Open Only</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETE">Complete (Done)</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          {!userDepartment && (
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="h-9 w-[120px] text-xs">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="PAPER">Paper</SelectItem>
                <SelectItem value="RIGID">Rigid</SelectItem>
              </SelectContent>
            </Select>
          )}

          <div className="border-input bg-background flex items-center gap-1 rounded-md border px-2 py-1">
            <span className="text-muted-foreground mr-1 text-[10px] font-bold uppercase">
              Range
            </span>
            <Input
              type="date"
              className="h-6 w-auto border-none p-0 text-xs shadow-none focus-visible:ring-0"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="date"
              className="h-6 w-auto border-none p-0 text-xs shadow-none focus-visible:ring-0"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 border-dashed"
          onClick={handleExport}
          disabled={!data}
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Matrix Table */}
      {/* Matrix Table */}
      <div className="border-border bg-card flex-1 overflow-auto rounded-md border shadow-sm">
        <Table className="relative w-full min-w-[1200px] border-collapse">
          <TableHeader className="bg-muted sticky top-0 z-40">
            <TableRow className="border-border border-b hover:bg-transparent">
              <TableHead className="border-border bg-muted text-muted-foreground sticky left-0 z-50 w-[140px] max-w-[140px] min-w-[140px] border-r px-2 py-2 text-xs font-bold tracking-wider uppercase shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                PRO Number
              </TableHead>
              <TableHead className="border-border bg-muted text-muted-foreground sticky left-[140px] z-50 w-[250px] max-w-[250px] min-w-[250px] border-r px-2 py-2 text-xs font-bold tracking-wider uppercase shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Product Name
              </TableHead>
              <TableHead className="border-border bg-muted text-muted-foreground z-40 w-[100px] min-w-[100px] border-r px-2 py-2 text-right text-xs font-bold tracking-wider uppercase">
                Qty PO
              </TableHead>
              {data?.columns.map((col) => (
                <TableHead
                  key={col.id}
                  className="border-border bg-muted text-muted-foreground z-40 min-w-[120px] border-r px-2 py-2 text-right text-xs font-bold tracking-wider uppercase"
                >
                  <span className="line-clamp-2">{col.name}</span>
                </TableHead>
              ))}
              <TableHead className="border-border bg-muted text-muted-foreground sticky right-0 z-50 w-[120px] border-l px-2 py-2 text-right text-xs font-bold tracking-wider uppercase shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                {viewMode === "INVENTORY" ? "FG On-Hand" : "FG Received"}
              </TableHead>
              <TableHead className="bg-muted text-muted-foreground z-40 w-[120px] px-2 py-2 text-right text-xs font-bold tracking-wider uppercase">
                % Fulfilled
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-32 text-center">
                  <Loader2 className="text-primary mx-auto h-8 w-8 animate-spin" />
                </TableCell>
              </TableRow>
            ) : !data || data.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={100} className="h-64 text-center">
                  <div className="text-muted-foreground flex flex-col items-center justify-center">
                    <Search className="mb-4 h-12 w-12 opacity-20" />
                    <p className="text-lg font-medium">
                      Matrix Produksi Kosong
                    </p>
                    <p className="text-sm opacity-80">
                      Tidak ada data produksi yang sesuai dengan filter.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className="group hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="border-border bg-card group-hover:bg-muted/50 sticky left-0 z-30 w-[140px] max-w-[140px] min-w-[140px] truncate border-r p-2 align-top text-xs font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <div className="flex flex-col gap-0.5 truncate">
                      <span className="text-foreground truncate font-mono font-bold">
                        {row.proNumber}
                      </span>
                      <Badge
                        variant="outline"
                        className="w-fit scale-90 px-1 py-0 text-[8px] opacity-70"
                      >
                        {row.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell
                    className="border-border bg-card text-muted-foreground group-hover:bg-muted/50 sticky left-[140px] z-30 w-[250px] max-w-[250px] min-w-[250px] border-r p-2 align-top text-xs font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]"
                    title={row.productName}
                  >
                    <span className="line-clamp-2 leading-tight break-words">
                      {row.productName}
                    </span>
                  </TableCell>
                  <TableCell className="border-border text-foreground w-[100px] min-w-[100px] border-r p-2 text-right font-mono text-xs font-bold">
                    {row.qtyPoPcs.toLocaleString("id-ID")}
                  </TableCell>

                  {data.columns.map((col) => {
                    const val = row.matrix[col.id];
                    return (
                      <TableCell
                        key={col.id}
                        className={`border-border cursor-pointer border-r p-2 text-right text-xs transition-all duration-200 ${
                          val
                            ? "bg-muted/50 text-foreground hover:bg-muted font-bold"
                            : "text-muted-foreground/30"
                        }`}
                        onClick={() =>
                          val
                            ? handleCellClick(row, col.id, col.name)
                            : undefined
                        }
                      >
                        {val ? val.toLocaleString("id-ID") : "-"}
                      </TableCell>
                    );
                  })}

                  <TableCell className="border-border bg-card group-hover:bg-muted/50 sticky right-0 z-30 border-l p-2 text-right text-xs font-bold shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    {row.fgReceived > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {row.fgReceived.toLocaleString("id-ID")}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/30">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.fulfillment > 0 && (
                      <Badge
                        variant={row.fulfillment >= 98 ? "default" : "outline"}
                        className="h-5 px-1.5 text-[10px]"
                      >
                        {row.fulfillment.toFixed(1)}%
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedCell && (
        <ReportsListDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          proId={selectedCell.proId}
          proNumber={selectedCell.proNumber}
          machineId={selectedCell.machineId}
          machineName={selectedCell.machineName}
        />
      )}
    </Card>
  );
}
