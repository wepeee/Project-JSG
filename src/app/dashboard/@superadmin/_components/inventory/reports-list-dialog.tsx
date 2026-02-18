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
            <TableHeader className="bg-secondary sticky top-0 z-10">
              <TableRow>
                <TableHead>Tgl Laporan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Step</TableHead>
                <TableHead>Mesin</TableHead>
                <TableHead className="text-right">Qty Pass</TableHead>
                <TableHead className="text-right">WIP</TableHead>
                <TableHead className="text-right">Hold</TableHead>
                <TableHead className="text-right">Qty Reject</TableHead>
                <TableHead>Notes</TableHead>
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
                  <TableRow key={report.id}>
                    <TableCell>
                      {format(new Date(report.reportDate), "dd MMM yyyy", {
                        locale: idLocale,
                      })}
                    </TableCell>
                    <TableCell>
                      {report.status === "APPROVED" && (
                        <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                          APPROVED
                        </span>
                      )}
                      {report.status === "PENDING" && (
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          PENDING
                        </span>
                      )}
                      {report.status === "REJECTED" && (
                        <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          REJECTED
                        </span>
                      )}
                      {report.status === "VOID" && (
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          VOID
                        </span>
                      )}
                    </TableCell>
                    <TableCell>Shift {report.shift}</TableCell>
                    <TableCell>{report.operatorName}</TableCell>
                    <TableCell>#{report.proses?.orderNo}</TableCell>
                    <TableCell>
                      {report.proses?.orderNo
                        ? report.proses.machine?.name
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {Number(report.qtyPassOn).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-600">
                      {Number(report.qtyWip).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right font-bold text-amber-600">
                      {Number(report.qtyHold).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      {Number(report.qtyReject).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate text-xs">
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
