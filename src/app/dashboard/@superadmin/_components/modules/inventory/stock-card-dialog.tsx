"use client";

import * as React from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Loader2,
  Package,
  Calendar,
  ArrowDownCircle,
  ArrowUpCircle,
  RotateCcw,
  Factory,
  CheckCircle2,
  Trash2,
  PauseCircle,
  Settings2,
  ExternalLink,
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

// ── Props ──────────────────────────────────────────────
type StockCardDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  locationId: number;
  locationName: string;
  proId?: number;
  proNumber?: string;
};

// ── Human-readable Transaction Label ──────────────────
function txnLabel(row: any): {
  text: string;
  icon: React.ReactNode;
  color: string;
} {
  const note: string = row.notes ?? "";
  const type: string = row.type;

  // ── VOID reversal ──
  // Notes format: "VOID Reversal for Report {reportId}: {reason}"
  // productionReportId is NULL on void txns, so parse from notes
  if (note.includes("VOID")) {
    const reportMatch = note.match(/Report\s+(\S+?):/);
    const reasonMatch = note.match(/:\s*(.+)$/);
    const reportRef = reportMatch?.[1]
      ? reportMatch[1].slice(-6).toUpperCase()
      : "";
    const reason = reasonMatch?.[1] ?? "";
    return {
      text: `VOID — Reversal${reportRef ? ` (Ref: ${reportRef})` : ""}${reason ? ` — ${reason}` : ""}`,
      icon: <RotateCcw className="h-3.5 w-3.5" />,
      color: "text-amber-600 dark:text-amber-400",
    };
  }

  if (type === "IN") {
    // Step 1 Auto-Refill: "Production Entry (Step 1 Auto-Refill)"
    if (note.includes("Auto-Refill")) {
      return {
        text: "Hasil Produksi (Input Awal)",
        icon: <Factory className="h-3.5 w-3.5" />,
        color: "text-blue-600 dark:text-blue-400",
      };
    }
    // PassOn from previous step: "Transfer to Step {orderNo}"
    // This IN txn means the item ARRIVED at this location (next step's WIP bin)
    if (note.includes("Transfer to Step")) {
      return {
        text: "Terima PassOn dari Step sebelumnya",
        icon: <ArrowDownCircle className="h-3.5 w-3.5" />,
        color: "text-emerald-600 dark:text-emerald-400",
      };
    }
    // FG Received: "Finished Goods Received"
    if (note.includes("Finished Goods")) {
      return {
        text: "Terima Barang Jadi (FG)",
        icon: <CheckCircle2 className="h-3.5 w-3.5" />,
        color: "text-emerald-600 dark:text-emerald-400",
      };
    }
    // Hold: "Production Hold (QA)"
    if (note.includes("Hold")) {
      return {
        text: "Masuk Hold (QA Check)",
        icon: <PauseCircle className="h-3.5 w-3.5" />,
        color: "text-amber-600 dark:text-amber-400",
      };
    }
    // Reject: "Production Reject/Scrap"
    if (note.includes("Reject") || note.includes("Scrap")) {
      return {
        text: "Masuk Reject / Scrap",
        icon: <Trash2 className="h-3.5 w-3.5" />,
        color: "text-red-600 dark:text-red-400",
      };
    }
    // Generic IN
    return {
      text: note || "Penerimaan",
      icon: <ArrowDownCircle className="h-3.5 w-3.5" />,
      color: "text-emerald-600 dark:text-emerald-400",
    };
  }

  if (type === "OUT") {
    // Transfer OUT: "Production Output (Transfer OUT)"
    // This OUT txn means items LEFT this location (consumed for next process)
    if (note.includes("Transfer OUT")) {
      return {
        text: "Konsumsi / Keluar Produksi",
        icon: <ArrowUpCircle className="h-3.5 w-3.5" />,
        color: "text-orange-600 dark:text-orange-400",
      };
    }
    // Generic OUT
    return {
      text: note || "Pengeluaran",
      icon: <ArrowUpCircle className="h-3.5 w-3.5" />,
      color: "text-red-600 dark:text-red-400",
    };
  }

  // ADJUST
  return {
    text: note || "Penyesuaian Stok",
    icon: <Settings2 className="h-3.5 w-3.5" />,
    color: "text-violet-600 dark:text-violet-400",
  };
}

// ── Main Component ────────────────────────────────────
export default function StockCardDialog({
  open,
  onOpenChange,
  itemId,
  locationId,
  locationName,
  proId,
  proNumber,
}: StockCardDialogProps) {
  const [page, setPage] = React.useState(1);
  const pageSize = 25;

  // Reset page when context changes
  React.useEffect(() => {
    setPage(1);
  }, [itemId, locationId, proId]);

  const { data, isLoading } = api.inventory.getStockCard.useQuery(
    {
      itemId,
      locationId,
      ...(proId ? { proId } : {}),
      page,
      pageSize,
    },
    { enabled: open && !!itemId },
  );

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] w-full max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:max-w-5xl">
        {/* ═══ Header ═══ */}
        <div className="bg-muted/10 space-y-3 border-b p-6 pb-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <Package className="text-primary h-5 w-5" />
              Kartu Stok —{" "}
              <span className="text-primary font-mono">{itemId}</span>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Riwayat pergerakan stok (IN/OUT) untuk item ini.
            </DialogDescription>
          </DialogHeader>

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              Lokasi: {locationName}
            </Badge>
            {proNumber && (
              <Badge variant="secondary" className="font-mono text-xs">
                Ref PRO: {proNumber}
              </Badge>
            )}
          </div>

          {/* On-hand balance card */}
          <div className="bg-background flex items-center justify-between rounded-lg border px-4 py-3">
            <span className="text-muted-foreground text-sm font-medium">
              Saldo Saat Ini (On-Hand)
            </span>
            <span className="text-primary text-2xl font-bold tabular-nums">
              {isLoading
                ? "..."
                : (data?.currentBalance ?? 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* ═══ Table ═══ */}
        <div className="bg-background relative flex-1 overflow-hidden">
          <div className="absolute inset-0 overflow-auto">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="text-muted-foreground w-[130px] font-semibold">
                    Tanggal &amp; Jam
                  </TableHead>
                  <TableHead className="text-muted-foreground w-[70px] text-center font-semibold">
                    Tipe
                  </TableHead>
                  <TableHead className="text-muted-foreground font-semibold">
                    Keterangan Transaksi
                  </TableHead>
                  <TableHead className="text-muted-foreground w-[100px] font-semibold">
                    Ref
                  </TableHead>
                  <TableHead className="w-[90px] text-right font-semibold text-emerald-600 dark:text-emerald-400">
                    Masuk
                  </TableHead>
                  <TableHead className="text-destructive w-[90px] text-right font-semibold">
                    Keluar
                  </TableHead>
                  <TableHead className="text-foreground w-[110px] text-right font-bold">
                    Saldo Akhir
                  </TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span>Memuat data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !data || data.rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-muted-foreground h-32 text-center"
                    >
                      Tidak ada transaksi ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {/* ── Opening Balance Row ── */}
                    <TableRow className="bg-muted/30 hover:bg-muted/30 border-muted border-b-2">
                      <TableCell
                        colSpan={4}
                        className="text-muted-foreground pl-4 font-medium"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Saldo Awal{" "}
                            {page > 1 ? "(Halaman Ini)" : "(Awal Periode)"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell colSpan={2} />
                      <TableCell className="text-right text-lg font-bold tabular-nums">
                        {data.rows.length > 0 && data.rows[0]
                          ? (
                              data.rows[0].runningBalance -
                              data.rows[0].signedQty
                            ).toLocaleString("id-ID")
                          : (data.openingBalance ?? 0).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell />
                    </TableRow>

                    {/* ── Transaction Rows ── */}
                    {data.rows.map((row) => {
                      const label = txnLabel(row);
                      const refShort = row.groupId
                        ? row.groupId.slice(-8).toUpperCase()
                        : "—";
                      const hasReport = !!row.productionReportId;

                      return (
                        <TableRow
                          key={row.id}
                          className="group hover:bg-muted/5"
                        >
                          {/* Date & Time */}
                          <TableCell className="text-muted-foreground font-mono text-xs">
                            {format(new Date(row.date), "dd MMM yyyy", {
                              locale: idLocale,
                            })}
                            <div className="text-[10px] opacity-70">
                              {format(new Date(row.date), "HH:mm:ss")}
                            </div>
                          </TableCell>

                          {/* Type Badge */}
                          <TableCell className="text-center">
                            {row.type === "IN" ? (
                              <Badge
                                variant="outline"
                                className="h-6 border-emerald-500/20 bg-emerald-500/10 px-2 py-0 text-emerald-600 dark:text-emerald-400"
                              >
                                IN
                              </Badge>
                            ) : row.type === "OUT" ? (
                              <Badge
                                variant="outline"
                                className="bg-destructive/10 text-destructive border-destructive/20 h-6 px-2 py-0"
                              >
                                OUT
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="h-6 border-violet-500/20 bg-violet-500/10 px-2 py-0 text-violet-600 dark:text-violet-400"
                              >
                                ADJ
                              </Badge>
                            )}
                          </TableCell>

                          {/* Human-readable Description */}
                          <TableCell>
                            <div className="flex max-w-[360px] flex-col gap-0.5">
                              <div
                                className={`flex items-center gap-1.5 text-sm font-medium ${label.color}`}
                              >
                                {label.icon}
                                <span>{label.text}</span>
                              </div>
                              {/* Operator info */}
                              {row.productionReport && (
                                <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
                                  <span>
                                    Op: {row.productionReport.operatorName}
                                  </span>
                                  <span className="opacity-50">
                                    (Shift {row.productionReport.shift})
                                  </span>
                                </div>
                              )}
                            </div>
                          </TableCell>

                          {/* Ref (short groupId) */}
                          <TableCell>
                            <span
                              className="text-muted-foreground bg-muted truncate rounded px-1.5 py-0.5 font-mono text-[10px]"
                              title={row.groupId}
                            >
                              {refShort}
                            </span>
                          </TableCell>

                          {/* Masuk */}
                          <TableCell className="text-right font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                            {row.type === "IN"
                              ? `+${Number(row.qty).toLocaleString("id-ID")}`
                              : ""}
                          </TableCell>

                          {/* Keluar */}
                          <TableCell className="text-destructive text-right font-medium tabular-nums">
                            {row.type === "OUT"
                              ? `-${Number(row.qty).toLocaleString("id-ID")}`
                              : ""}
                          </TableCell>

                          {/* Running Balance */}
                          <TableCell className="text-right font-mono font-bold tabular-nums">
                            {row.runningBalance.toLocaleString("id-ID")}
                          </TableCell>

                          {/* CTA: Lihat Detail Report */}
                          <TableCell className="px-1">
                            {hasReport && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                                title="Lihat Detail Report"
                                onClick={() => {
                                  // TODO: Open report detail dialog
                                  alert(`Report ID: ${row.productionReportId}`);
                                }}
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ═══ Footer / Pagination ═══ */}
        <div className="bg-muted/10 flex items-center justify-between border-t px-6 py-3">
          <div className="text-muted-foreground text-sm">
            Total Transaksi:{" "}
            <span className="text-foreground font-medium">
              {data?.total ?? 0}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </Button>
            <span className="bg-background min-w-[3rem] rounded-md border px-3 py-1.5 text-center text-sm font-medium tabular-nums">
              {page} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>

          <div className="w-[120px]" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
