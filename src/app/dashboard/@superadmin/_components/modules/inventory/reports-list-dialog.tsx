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
            <TableHeader className="bg-slate-200 dark:bg-slate-800">
              <TableRow className="border-b border-slate-200 dark:border-slate-700 hover:bg-transparent">
                <TableHead className="w-[120px] px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Tgl Laporan</TableHead>
                <TableHead className="w-[100px] px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Status</TableHead>
                <TableHead className="w-[80px] px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Shift</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Operator</TableHead>
                <TableHead className="w-[80px] px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Step</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Mesin</TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Qty Pass</TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">WIP</TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Hold</TableHead>
                <TableHead className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Reject</TableHead>
                <TableHead className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">Notes</TableHead>
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
                  <TableRow key={report.id} className="border-b border-slate-100 hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                    <TableCell className="px-4 py-3 text-xs text-slate-700 dark:text-slate-300">
                      {format(new Date(report.reportDate), "dd MMM yyyy", {
                        locale: idLocale,
                      })}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {report.status === "APPROVED" && (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 tracking-wide border border-emerald-200">
                          APPROVED
                        </span>
                      )}
                      {report.status === "PENDING" && (
                        <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 tracking-wide border border-amber-200">
                          PENDING
                        </span>
                      )}
                      {report.status === "REJECTED" && (
                        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-[10px] font-bold text-red-700 tracking-wide border border-red-200">
                          REJECTED
                        </span>
                      )}
                      {report.status === "VOID" && (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 tracking-wide border border-slate-200">
                          VOID
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Shift {report.shift}</TableCell>
                    <TableCell className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">{report.operatorName}</TableCell>
                    <TableCell className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">#{report.proses?.orderNo}</TableCell>
                    <TableCell className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                      {report.proses?.orderNo
                        ? report.proses.machine?.name
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {Number(report.qtyPassOn).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {Number(report.qtyWip).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                      {Number(report.qtyHold).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right text-xs font-mono font-bold text-red-600 dark:text-red-400">
                      {Number(report.qtyReject).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-muted-foreground max-w-[200px] truncate text-xs italic">
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
