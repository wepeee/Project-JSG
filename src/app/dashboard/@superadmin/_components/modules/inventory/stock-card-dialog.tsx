"use client";

import * as React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { 
  Loader2, ArrowLeft, ArrowRight, Package, Calendar, 
  ArrowRightCircle, CheckCircle2, Factory, Trash2, PauseCircle,
  ChevronsLeft, ChevronsRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";

type StockCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  locationId: number;
  locationName: string;
  proNumber?: string;
  onNextItem?: () => void;
  onPrevItem?: () => void;
  nextItemLabel?: string;
  prevItemLabel?: string;
  currentItemIndex?: number;
  totalItems?: number;
};

// --- Helper Component untuk Keterangan Transaksi ---
const TransactionNote = ({ row }: { row: any }) => {
  const note = row.notes || "";
  const type = row.type;

  let display = note;
  let icon = null;
  let color = "text-foreground";

  if (type === "IN") {
    if (note.includes("Auto-Refill")) {
      display = "Hasil Produksi";
      icon = <Factory className="h-3.5 w-3.5" />;
      color = "text-blue-600";
    } else if (note.includes("Transfer to Step")) {
        // Example: Transfer to Step 2
      const step = note.match(/Step (\d+)/)?.[1] ?? "";
      display = `Transfer ke Step ${step}`;
      // Logic: IN should mean "Receive FROM prev step" but currently note says "Transfer to Step X".
      // Let's keep it consistent with what happened.
      icon = <ArrowRightCircle className="h-3.5 w-3.5" />;
      color = "text-green-600";
    } else if(note.includes("Finished Goods Received")){
       display = "Terima Barang Jadi (FG)";
       icon = <CheckCircle2 className="h-3.5 w-3.5" />;
       color = "text-emerald-600";
    }
  } else if (type === "OUT") {
    if (note.includes("Transfer OUT")) {
      display = "Dikirim ke Proses Lanjut";
      icon = <ArrowRightCircle className="h-3.5 w-3.5" />;
      color = "text-orange-600";
    }
  }

  // Reject / Hold (Usually IN transactions to specific bins)
  if (note.includes("Reject") || row.location?.type === "SCRAP") {
    display = "Reject / Dibuang";
    icon = <Trash2 className="h-3.5 w-3.5" />;
    color = "text-red-600";
  } else if (note.includes("Hold") || row.location?.type === "HOLD") {
    display = "Hold (QA Check)";
    icon = <PauseCircle className="h-3.5 w-3.5" />;
    color = "text-yellow-600";
  }

  return (
    <div className={`flex items-center gap-1.5 font-medium ${color}`}>
      {icon}
      <span>{display}</span>
    </div>
  );
};

export default function StockCardDialog({
  open,
  onOpenChange,
  itemId,
  locationId,
  locationName,
  proNumber,
  onNextItem,
  onPrevItem,
  nextItemLabel,
  prevItemLabel,
  currentItemIndex,
  totalItems,
}: StockCardDialogProps) {
  const [page, setPage] = React.useState(1);
  const pageSize = 20;

  // Reset page when itemId changes
  React.useEffect(() => {
    setPage(1);
  }, [itemId]);

  const { data, isLoading } = api.inventory.getStockCard.useQuery(
    {
      itemId,
      locationId,
      page,
      pageSize,
    },
    { enabled: open && !!itemId },
  );

  // Logic for Smart Pagination
  const hasNextPage = data && data.rows.length === pageSize;

  const handlePrevClick = () => {
      if (page > 1) {
          setPage(p => p - 1);
      } else if (onPrevItem) {
          onPrevItem();
      }
  };

  const handleNextClick = () => {
      if (hasNextPage) {
          setPage(p => p + 1);
      } else if (onNextItem) {
          onNextItem();
      }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] w-full max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        {/* Header Section */}
        <div className="p-6 pb-2 border-b bg-muted/10">
            <DialogHeader className="space-y-4">
              <div className="flex flex-col gap-4">
                {/* Dedicated Navigation Bar */}
                <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border border-dashed">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onPrevItem} 
                        disabled={!onPrevItem}
                        className="flex items-center gap-2 h-8"
                        title={prevItemLabel || "Tidak ada proses sebelumnya di list"}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span className="text-xs font-medium hidden sm:inline-block">
                            {prevItemLabel ? `Prev: ${prevItemLabel}` : "Proses Sebelumnya"}
                        </span>
                    </Button>

                    <span className="text-xs font-mono text-muted-foreground font-medium select-none bg-background px-2 py-1 rounded border">
                        {typeof totalItems === 'number' && totalItems > 0 
                            ? `Posisi: ${currentItemIndex !== undefined ? currentItemIndex + 1 : '-'}/${totalItems}`
                            : "Single Item"
                        }
                    </span>

                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onNextItem} 
                        disabled={!onNextItem}
                        className="flex items-center gap-2 h-8"
                        title={nextItemLabel || "Tidak ada proses selanjutnya di list"}
                    >
                        <span className="text-xs font-medium hidden sm:inline-block">
                            {nextItemLabel ? `Next: ${nextItemLabel}` : "Proses Selanjutnya"}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-start justify-between">
                    <div>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            Kartu Stok: <span className="font-mono text-primary">{itemId}</span>
                        </DialogTitle>
                        <DialogDescription className="mt-1">
                            Riwayat pergerakan stok barang secara real-time.
                        </DialogDescription>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline" className="font-mono">
                            Lokasi: {locationName}
                        </Badge>
                        {proNumber && (
                            <Badge variant="secondary" className="font-mono">
                                Ref PRO: {proNumber}
                            </Badge>
                        )}
                    </div>
                </div>
              </div>
            </DialogHeader>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-hidden bg-background relative">
             <div className="absolute inset-0 overflow-auto">
                <Table>
                    <TableHeader className="bg-muted sticky top-0 z-10 shadow-sm">
                    <TableRow>
                        <TableHead className="w-[140px] font-semibold">Tanggal</TableHead>
                        <TableHead className="w-[100px] font-semibold text-center">Tipe</TableHead>
                        <TableHead className="font-semibold">Keterangan Transaksi</TableHead>
                        <TableHead className="text-right w-[100px] font-semibold text-green-600">Masuk</TableHead>
                        <TableHead className="text-right w-[100px] font-semibold text-red-600">Keluar</TableHead>
                        <TableHead className="text-right w-[120px] font-bold">Saldo Akhir</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {isLoading ? (
                        <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span>Memuat data...</span>
                            </div>
                        </TableCell>
                        </TableRow>
                    ) : !data || data.rows.length === 0 ? (
                        <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                            Tidak ada transaksi pada halaman ini.
                        </TableCell>
                        </TableRow>
                    ) : (
                        <>
                        {/* Opening Balance Row */}
                        <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-2 border-muted">
                            <TableCell colSpan={3} className="font-medium text-muted-foreground pl-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Saldo Awal {page > 1 ? "(Hal. Ini)" : "(Awal Periode)"}</span>
                                </div>
                            </TableCell>
                            <TableCell colSpan={2}></TableCell>
                            <TableCell className="text-right font-bold text-lg">
                            {data.rows.length > 0 && data.rows[0]
                                ? (
                                    data.rows[0].runningBalance - data.rows[0].signedQty
                                ).toLocaleString("id-ID")
                                : (data.openingBalance ?? 0).toLocaleString("id-ID")}
                            </TableCell>
                        </TableRow>

                        {data.rows.map((row) => (
                            <TableRow key={row.id} className="group hover:bg-muted/5">
                            <TableCell className="font-mono text-xs text-muted-foreground">
                                {format(new Date(row.date), "dd MMM yyyy", { locale: idLocale })}
                                <div className="text-[10px] opacity-70">
                                    {format(new Date(row.date), "HH:mm")}
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                {row.type === "IN" ? (
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-2 py-0 h-6">
                                    IN
                                </Badge>
                                ) : row.type === "OUT" ? (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 px-2 py-0 h-6">
                                    OUT
                                </Badge>
                                ) : (
                                <Badge variant="secondary">{row.type}</Badge>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1 max-w-[400px]">
                                    {/* Smart Note Display */}
                                    <TransactionNote row={row} />

                                    {/* Metadata (Operator, ID) */}
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded truncate" title={row.groupId}>
                                            Ref: {row.groupId.slice(-8)}
                                        </span>
                                        {row.productionReport && (
                                            <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                <span>• Op: {row.productionReport.operatorName}</span>
                                                <span className="opacity-50">(Shift {row.productionReport.shift})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-700">
                                {row.type === "IN"
                                ? `+${Number(row.qty).toLocaleString("id-ID")}`
                                : ""}
                            </TableCell>
                            <TableCell className="text-right font-medium text-red-700">
                                {row.type === "OUT"
                                ? `-${Number(row.qty).toLocaleString("id-ID")}`
                                : ""}
                            </TableCell>
                            <TableCell className="text-right font-bold font-mono">
                                {row.runningBalance.toLocaleString("id-ID")}
                            </TableCell>
                            </TableRow>
                        ))}
                        </>
                    )}
                    </TableBody>
                </Table>
             </div>
        </div>

        {/* Footer Pagination */}
        <div className="border-t p-4 bg-muted/10 flex items-center justify-between">
            <div className="text-sm text-muted-foreground w-[200px]">
                Total Transaksi: <span className="font-medium text-foreground">{data?.total ?? 0}</span>
            </div>
            
            <div className="flex items-center gap-2 justify-center flex-1">
                <Button
                variant="outline"
                size="sm"
                onClick={handlePrevClick}
                disabled={page === 1 && !onPrevItem}
                className="px-4 min-w-[100px]"
                title={page === 1 && onPrevItem ? `Ke Proses Sebelumnya: ${prevItemLabel}` : "Halaman Sebelumnya"}
                >
                <ArrowLeft className="mr-2 h-4 w-4" /> Prev
                </Button>

                <div className="text-sm font-medium px-4 py-1.5 bg-background border rounded-md min-w-[3rem] text-center">
                {page}
                </div>

                <Button
                variant="outline"
                size="sm"
                onClick={handleNextClick}
                disabled={!hasNextPage && !onNextItem}
                className="px-4 min-w-[100px]"
                title={!hasNextPage && onNextItem ? `Ke Proses Selanjutnya: ${nextItemLabel}` : "Halaman Berikutnya"}
                >
                Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
            
            <div className="w-[200px] text-right">
                {/* Info Posisi Proses (Optional, biar balance layout) */}
                {(typeof totalItems === 'number' && totalItems > 1) && (
                    <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
                        Posisi: {currentItemIndex !== undefined ? currentItemIndex + 1 : '-'}/{totalItems}
                    </span>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
