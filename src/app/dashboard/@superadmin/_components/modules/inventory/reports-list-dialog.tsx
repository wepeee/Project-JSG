"use client";

import * as React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";

type ReportsListDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proId: number;
  proNumber: string;
  machineId?: number;
  machineName?: string;
};

export default function ReportsListDialog({
  open,
  onOpenChange,
  proId,
  proNumber,
  machineId,
  machineName,
}: ReportsListDialogProps) {
  const { data, isLoading } = api.inventory.getReportsByContext.useQuery(
    { proId, machineId },
    { enabled: open && !!proId },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Production Reports</DialogTitle>
          <div className="text-muted-foreground flex gap-4 text-xs">
            <span>PRO: {proNumber}</span>
            {machineName && <span>Mesin: {machineName}</span>}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="border-border border-b hover:bg-transparent">
                <TableHead className="text-muted-foreground w-[120px] px-4 py-3 text-xs font-bold tracking-wider uppercase">
                  Tgl Laporan
                </TableHead>
                <TableHead className="text-muted-foreground w-[100px] px-4 py-3 text-xs font-bold tracking-wider uppercase">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground w-[80px] px-4 py-3 text-xs font-bold tracking-wider uppercase">
                  Shift
                </TableHead>
                <TableHead className="text-muted-foreground px-4 py-3 text-xs font-bold tracking-wider uppercase">
                  Operator
                </TableHead>
                <TableHead className="text-muted-foreground w-[80px] px-4 py-3 text-xs font-bold tracking-wider uppercase">
                  Step
                </TableHead>
                <TableHead className="text-muted-foreground px-4 py-3 text-xs font-bold tracking-wider uppercase">
                  Mesin
                </TableHead>
                <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                  Qty Pass
                </TableHead>
                <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                  WIP
                </TableHead>
                <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                  Hold
                </TableHead>
                <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                  Reject
                </TableHead>
                <TableHead className="text-muted-foreground px-4 py-3 text-xs font-bold tracking-wider uppercase">
                  Notes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : !data || data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Tidak ada laporan produksi ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                data.map((report) => (
                  <TableRow
                    key={report.id}
                    className="border-border hover:bg-muted/50 border-b"
                  >
                    <TableCell className="text-foreground px-4 py-3 text-xs">
                      {format(new Date(report.reportDate), "dd MMM yyyy", {
                        locale: idLocale,
                      })}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {report.status === "APPROVED" && (
                        <span className="inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-emerald-600 dark:text-emerald-400">
                          APPROVED
                        </span>
                      )}
                      {report.status === "PENDING" && (
                        <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-amber-600 dark:text-amber-400">
                          PENDING
                        </span>
                      )}
                      {report.status === "REJECTED" && (
                        <span className="bg-destructive/10 text-destructive border-destructive/20 inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                          REJECTED
                        </span>
                      )}
                      {report.status === "VOID" && (
                        <span className="bg-muted text-muted-foreground border-border inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide">
                          VOID
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground px-4 py-3 text-xs">
                      Shift {report.shift}
                    </TableCell>
                    <TableCell className="text-foreground px-4 py-3 text-xs font-medium">
                      {report.operatorName}
                    </TableCell>
                    <TableCell className="text-muted-foreground px-4 py-3 text-xs">
                      #{report.proses?.orderNo}
                    </TableCell>
                    <TableCell className="text-muted-foreground px-4 py-3 text-xs">
                      {report.proses?.orderNo
                        ? report.proses.machine?.name
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {Number(report.qtyPassOn).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {Number(report.qtyWip).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      {Number(report.qtyHold).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-destructive px-4 py-3 text-right font-mono text-xs font-bold">
                      {Number(report.qtyReject).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate px-4 py-3 text-xs italic">
                      {report.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
