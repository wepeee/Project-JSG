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
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

// TxnType is usually globally available or from generated/prisma
// I'll assume string enum for now or import from client type

type StockCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  locationId: number;
  locationName: string;
  proNumber?: string;
};

export default function StockCardDialog({
  open,
  onOpenChange,
  itemId,
  locationId,
  locationName,
  proNumber,
}: StockCardDialogProps) {
  const [page, setPage] = React.useState(1);
  const pageSize = 20;

  const { data, isLoading } = api.inventory.getStockCard.useQuery(
    {
      itemId,
      locationId,
      page,
      pageSize,
    },
    { enabled: open && !!itemId },
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[80vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle>Stock Card: {itemId}</DialogTitle>
          <div className="text-muted-foreground flex gap-4 text-sm">
            <span>Lokasi: {locationName}</span>
            {proNumber && <span>Ref PRO: {proNumber}</span>}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto rounded-md border">
          <Table>
            <TableHeader className="bg-secondary sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[140px]">Tanggal</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Ref / Note</TableHead>
                <TableHead className="text-right">Masuk</TableHead>
                <TableHead className="text-right">Keluar</TableHead>
                <TableHead className="text-right">Stok</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : !data || data.rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Tidak ada transaksi pada halaman ini.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={5}>
                      Stok Awal {page > 1 ? "(Halaman Ini)" : "(Awal Periode)"}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {data.rows.length > 0 && data.rows[0]
                        ? (
                            data.rows[0].runningBalance - data.rows[0].signedQty
                          ).toLocaleString("id-ID")
                        : (data.openingBalance ?? 0).toLocaleString("id-ID")}
                    </TableCell>
                  </TableRow>

                  {data.rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>
                        {format(new Date(row.date), "dd MMM HH:mm", {
                          locale: idLocale,
                        })}
                      </TableCell>
                      <TableCell>
                        {row.type === "IN" ? (
                          <span className="font-bold text-green-600">IN</span>
                        ) : row.type === "OUT" ? (
                          <span className="font-bold text-red-600">OUT</span>
                        ) : (
                          row.type
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs">
                            {row.groupId.slice(0, 8)}...
                          </span>
                          {row.notes && (
                            <span className="text-xs italic">{row.notes}</span>
                          )}
                          {row.productionReport && (
                            <span className="text-muted-foreground text-xs">
                              Op: {row.productionReport.operatorName} (S
                              {row.productionReport.shift})
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {row.type === "IN"
                          ? Number(row.qty).toLocaleString("id-ID")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {row.type === "OUT"
                          ? Number(row.qty).toLocaleString("id-ID")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {row.runningBalance.toLocaleString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-muted-foreground text-sm">
            Total Transaksi: {data?.total ?? 0}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="flex items-center px-2 text-sm font-medium">
              Halaman {page}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={isLoading || (data && data.rows.length < pageSize)}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
