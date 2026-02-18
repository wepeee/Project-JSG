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
  const [status, setStatus] = React.useState<string>("ACTIVE"); // OPEN/IN_PROGRESS
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

  const queryInput = React.useMemo(() => {
    const sDate = startDate ? new Date(startDate) : undefined;
    const eDate = endDate ? new Date(endDate) : undefined;

    // Status logic
    let statFilter: "OPEN" | "IN_PROGRESS" | "CLOSED" | undefined = undefined;
    if (status !== "ALL" && status !== "ACTIVE") {
      statFilter = status as any;
    }

    return {
      startDate: sDate,
      endDate: eDate,
      status: statFilter,
      type: type !== "ALL" ? (type as "PAPER" | "RIGID") : undefined,
    };
  }, [startDate, endDate, status, type]);

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
      "FG Received",
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
      `wip_matrix_${format(new Date(), "yyyyMMdd")}.csv`,
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
      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2 p-1">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Active (Open/Prog/Comp)</SelectItem>
            <SelectItem value="OPEN">Open Only</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETE">Complete (Done)</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>

        {!userDepartment && (
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="h-8 w-[100px] text-xs">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="PAPER">Paper</SelectItem>
              <SelectItem value="RIGID">Rigid</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Input
          type="date"
          className="h-8 w-[130px] text-xs"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="Start Date"
        />
        <Input
          type="date"
          className="h-8 w-[130px] text-xs"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 gap-2"
          onClick={handleExport}
          disabled={!data}
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Matrix Table */}
      <div className="flex-1 overflow-auto rounded-md border bg-white dark:bg-slate-950">
        <Table className="relative w-full min-w-[1200px] border-collapse">
          <TableHeader className="sticky top-0 z-40 shadow-sm">
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <TableHead className="sticky left-0 z-50 w-[140px] border-r bg-gray-100 font-semibold text-gray-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:bg-slate-800 dark:text-gray-200">
                PRO Number
              </TableHead>
              <TableHead className="z-40 w-[250px] bg-gray-100 font-semibold text-gray-700 dark:bg-slate-800 dark:text-gray-200">
                Product Name
              </TableHead>
              <TableHead className="z-40 w-[100px] border-r bg-gray-100 text-right font-semibold text-gray-700 dark:bg-slate-800 dark:text-gray-200">
                Qty PO
              </TableHead>
              {data?.columns.map((col) => (
                <TableHead
                  key={col.id}
                  className="z-40 min-w-[120px] border-r border-gray-200 bg-gray-100 text-right font-semibold text-gray-700 dark:border-gray-700 dark:bg-slate-800 dark:text-gray-200"
                >
                  {col.name}
                </TableHead>
              ))}
              <TableHead className="sticky right-0 z-50 w-[120px] border-l bg-gray-100 text-right font-semibold text-gray-700 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] dark:bg-slate-800 dark:text-gray-200">
                FG Received
              </TableHead>
              <TableHead className="z-40 w-[100px] bg-gray-100 text-right font-semibold text-gray-700 dark:bg-slate-800 dark:text-gray-200">
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
                  className="group transition-colors hover:bg-blue-50/50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="sticky left-0 z-30 border-r bg-white text-xs font-medium shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group-hover:bg-blue-50/50 dark:bg-slate-950 dark:group-hover:bg-slate-800/50">
                    {row.proNumber}
                    <div className="text-muted-foreground text-[10px] font-normal">
                      {row.status}
                    </div>
                  </TableCell>
                  <TableCell
                    className="max-w-[250px] truncate text-xs font-medium text-gray-700 dark:text-gray-300"
                    title={row.productName}
                  >
                    {row.productName}
                  </TableCell>
                  <TableCell className="border-r text-right font-mono text-xs">
                    {row.qtyPoPcs.toLocaleString("id-ID")}
                  </TableCell>

                  {data.columns.map((col) => {
                    const val = row.matrix[col.id];
                    return (
                      <TableCell
                        key={col.id}
                        className={`cursor-pointer border-r border-gray-100 text-right text-xs transition-all duration-200 dark:border-gray-800 ${
                          val
                            ? "bg-blue-50/30 font-semibold text-blue-700 hover:bg-blue-100/50 dark:bg-blue-900/10 dark:text-blue-300 dark:hover:bg-blue-900/30"
                            : "text-muted-foreground/20"
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

                  <TableCell className="sticky right-0 z-30 border-l bg-white text-right text-xs font-bold shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)] group-hover:bg-blue-50/50 dark:bg-slate-950 dark:group-hover:bg-slate-800/50">
                    {row.fgReceived > 0 ? (
                      <span className="text-green-600 dark:text-green-400">
                        {row.fgReceived.toLocaleString("id-ID")}
                      </span>
                    ) : (
                      "-"
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
