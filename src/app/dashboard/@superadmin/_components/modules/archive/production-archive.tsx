"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import {
  Loader2,
  Download,
  Search,
  ChevronRight,
  ChevronLeft,
  Ban,
  AlertCircle,
  CalendarDays,
  X,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { ReportDetailDialog } from "./report-detail-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

const PAPER_REJECT_COLUMNS = [
  "Bintik",
  "Warna",
  "Baret",
  "Bercak",
  "Bold",
  "Petal",
  "Laminasi",
  "UV Spot",
  "Hot Print",
  "Emboss",
  "Creasing",
  "Sobek",
  "Lem",
  "Kotor",
  "Reject Setup",
  "Reject Process",
  "Lain-lain",
];

const INJECTION_REJECT_BB = ["Gilingan / Purge", "PT / Runner"];

const INJECTION_REJECT_PROD = [
  "Bintik Hitam",
  "P/S Deformasi",
  "Warna # Std",
  "Appearance # Std",
  "Dimensi # Std",
  "Kotor Fet",
  "Proses",
  "Baret",
];

const PAPER_PLANNED_DT = [
  "Trouble PLN",
  "Trial",
  "Preventive Maintenance",
  "Istirahat",
];

const PAPER_UNPLANNED_DT = [
  "Tunggu Approval",
  "Tunggu Material",
  "Set Up & Change Over",
  "Machine Problem",
  "Mencari Tools",
  "Running In",
  "Operator Issue",
  "Adjustment Process",
  "Lain-lain",
];

const INJECTION_PLANNED_DT = [
  "No Order",
  "Istirahat",
  "Cil / Clean",
  "Trial",
  "Preventive",
];

const INJECTION_UNPLANNED_DT = [
  "Material",
  "Electrik",
  "Mesin",
  "Hydraulic",
  "Robot",
  "Utility",
  "Start Mesin",
  "Set Up",
  "Approve",
  "Mold/Tools",
  "Proses",
  "Material Habis",
  "Material Telat",
  "Man Power",
  "Others",
];

const PRINTING_REJECT_COLUMNS = [
  "B. Spot/Cekung",
  "Kotor Vat",
  "Blobor/Cembung",
  "Print Pethal",
  "Mbayang/Tebal Tipis",
  "Print Geser",
  "Warna # Std",
  "Baret",
  "Botol Bertekstur",
  "Tidak Press",
  "Pecah",
  "Lain-lain",
];

const PRINTING_PLANNED_DT = [
  "CLEAN",
  "NO ORDER",
  "ISTIRAHAT",
  "TRIAL",
  "PREVEN MESIN",
];

const PRINTING_UNPLANNED_DT = [
  "ELECTRIC",
  "MACHINE",
  "PNUMATIC",
  "UTILITY",
  "START MESIN",
  "SET UP",
  "APPROVAL",
  "SCREEN",
  "PROSES",
  "MATERIAL",
  "WARNA TIDAK STANDART",
  "TOOLS",
  "MAN",
  "OTHER",
];

const PACKING_REJECT_SPLIT = [
  [
    "B. Spot",
    "Cekung",
    "Baret",
    "Buble",
    "Print Pethal",
    "Print Miring",
    "Print Blobor",
    "Pecah",
    "Acrylic Mix Up",
    "Lengket",
    "Botol Bertekstur",
    "Tertempel Sticker",
    "Konstaminasi",
    "Warna Tidak Standart",
    "Buram",
    "Kotor Fat",
  ],
  [
    "B. Spot 3",
    "Pecah 2",
    "Warna # Std",
    "Short Shoot",
    "Menempel Pada Botol",
    "Kotor Fat 2",
  ],
  [
    "B. Spot 5",
    "Print Pethal",
    "Pecah 6",
    "Warna # Std 7",
    "Baret 8",
    "Kotor Fat 9",
  ],
  ["B. Spot 10", "Warna # Std 11", "Kotor Fat 12"],
  ["B. Spot 13", "Warna # Std 14", "Kotor Fat 15"],
  [
    "Stiker Halal",
    "Stiker BB & Derma",
    "Stiker BB & WCD",
    "Sticker BB",
    "STICKER WCD",
    "Stiker Barcode",
    "Stiker Toner",
    "Sticker Bottom",
    "Stiker Bottom Baru",
    "Other",
  ],
];

const PACKING_PLANNED_DT = ["CLEAN", "NO ORDER", "ISTIRAHAT", "TRIAL"];

const PACKING_UNPLANNED_DT = [
  "Material",
  "WARNA TIDAK STD",
  "Approve",
  "Set Up",
  "Airblow",
  "Proses",
  "Man",
  "Other",
];

export default function ProductionArchive({
  userDepartment,
  readOnly = false,
}: {
  userDepartment?: string;
  readOnly?: boolean;
}) {
  const [activeCategory, setActiveCategory] = React.useState<
    "PAPER" | "INJECTION" | "BLOW_MOULDING" | "PRINTING" | "PACKING_ASSEMBLY"
  >(() => {
    if (userDepartment === "RIGID") return "INJECTION";
    return "PAPER";
  });
  const [showRejectDetails, setShowRejectDetails] = React.useState(false);
  const [showDowntimeDetails, setShowDowntimeDetails] = React.useState(false);

  // Auto-recover from "RIGID" state (HMR legacy)
  React.useEffect(() => {
    if (activeCategory === ("RIGID" as any)) {
      setActiveCategory("INJECTION");
    }
  }, [activeCategory]);

  const safeCategory =
    activeCategory === ("RIGID" as any) ? "INJECTION" : activeCategory;

  const [search, setSearch] = React.useState("");
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");

  const { data: reports, isLoading } = api.verification.getReports.useQuery({
    status: "APPROVED",
    category: safeCategory,
    limit: 100,
    search: search || undefined,
    startDate: dateFrom ? new Date(dateFrom) : undefined,
    endDate: dateTo ? new Date(dateTo) : undefined,
  });

  const utils = api.useUtils();

  // --- Void Report ---
  const [voidId, setVoidId] = React.useState<string | null>(null);
  const [voidReason, setVoidReason] = React.useState("");

  const [selectedReport, setSelectedReport] = React.useState<any>(null);
  const [selectedReportIndex, setSelectedReportIndex] = React.useState<number>(0);

  const voidMutation = api.verification.voidReport.useMutation({
    onSuccess: () => {
      void utils.verification.getReports.invalidate();
      void utils.inventory.invalidate();
      setVoidId(null);
      setVoidReason("");
    },
    onError: (err) => {
      alert(`Gagal void: ${err.message}`);
    },
  });

  const handleVoidSubmit = () => {
    if (!voidId || !voidReason.trim()) return;
    voidMutation.mutate({ id: voidId, reason: voidReason });
  };

  const rigidSubCategories = [
    { id: "INJECTION", label: "INJECTION" },
    { id: "BLOW_MOULDING", label: "BLOW MOLD" },
    { id: "PRINTING", label: "PRINTING" },
    { id: "PACKING_ASSEMBLY", label: "PACKING" },
  ] as const;

  const isRigidActive = activeCategory !== "PAPER";
  const isMoulding =
    activeCategory === "INJECTION" || activeCategory === "BLOW_MOULDING";

  const getMouldingProductRejectOnly = React.useCallback((rpt: any) => {
    const breakdown = rpt?.rejectBreakdown as Record<string, unknown> | null;
    if (!breakdown || typeof breakdown !== "object") return 0;

    return INJECTION_REJECT_PROD.reduce((acc, col) => {
      const raw = (breakdown as any)?.[`REJECT:PRODUK:${col}`] ?? (breakdown as any)?.[col];
      const n = Number(raw ?? 0);
      if (!Number.isFinite(n) || n <= 0) return acc;
      return acc + n;
    }, 0);
  }, []);

  const getRejectPcsForCategory = React.useCallback(
    (rpt: any): number | null => {
      let rejectValue = Number(rpt?.qtyReject || 0);

      // For moulding, use reject PRODUCT only (exclude bahan baku).
      if (isMoulding) {
        rejectValue = getMouldingProductRejectOnly(rpt);
      }

      if (activeCategory !== "PAPER") {
        const pw = Number((rpt?.metaData as any)?.productWeight);
        if (pw > 0) {
          return Math.round((rejectValue * 1000) / pw);
        }
        if (isMoulding) return null;
      }

      return rejectValue;
    },
    [activeCategory, getMouldingProductRejectOnly, isMoulding],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              Daftar Laporan Produksi
            </h2>
            <p className="text-sm text-slate-500">
              Arsip laporan yang telah disetujui.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative md:ml-4">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Cari No. PRO..."
              className="w-full pl-9 md:w-[220px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-1.5">
            <CalendarDays className="text-muted-foreground h-4 w-4 shrink-0" />
            <Input
              type="date"
              className="w-[140px] text-xs"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              title="Dari tanggal"
            />
            <span className="text-muted-foreground text-xs">—</span>
            <Input
              type="date"
              className="w-[140px] text-xs"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              title="Sampai tanggal"
            />
            {(dateFrom || dateTo) && (
              <button
                onClick={() => { setDateFrom(""); setDateTo(""); }}
                className="text-muted-foreground hover:text-foreground ml-0.5 rounded p-1 transition-colors"
                title="Reset filter tanggal"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Switcher */}
        <div className="flex flex-col items-end gap-2">
          {/* Main Level */}
          {!userDepartment && (
            <div className="bg-muted flex rounded-lg p-1">
              <button
                onClick={() => setActiveCategory("PAPER")}
                className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                  !isRigidActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                }`}
              >
                PAPER
              </button>
              <button
                onClick={() => {
                  if (!isRigidActive) setActiveCategory("INJECTION");
                }}
                className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                  isRigidActive
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                }`}
              >
                RIGID
              </button>
            </div>
          )}

          {/* Sub Level for Rigid */}
          {isRigidActive && (
            <div className="no-scrollbar bg-muted flex overflow-x-auto rounded-lg p-1">
              {rigidSubCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-md px-3 py-1 text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-border bg-card overflow-hidden rounded-md border shadow-sm">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        ) : reports?.length === 0 ? (
          <div className="text-muted-foreground py-12 text-center text-sm">
            Belum ada laporan {activeCategory.replace("_", " ")} yang disetujui.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="hover:bg-transparent">
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground w-[120px] text-center font-medium"
                  >
                    Tanggal
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground font-medium"
                  >
                    No. PRO
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-slate-300"
                  >
                    Part Number
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground min-w-[200px] font-medium"
                  >
                    Produk
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground font-medium"
                  >
                    Mesin
                  </TableHead>
                  {activeCategory !== "PAPER" && (
                    <TableHead
                      rowSpan={
                        activeCategory === "PRINTING" ||
                        activeCategory === "PACKING_ASSEMBLY" ||
                        isMoulding
                          ? 2
                          : 1
                      }
                      className="text-muted-foreground font-medium"
                    >
                      Batch No
                    </TableHead>
                  )}
                  {activeCategory === "PAPER" && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Speed
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Std Speed
                      </TableHead>
                    </>
                  )}
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground text-center font-medium"
                  >
                    Shift
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground font-medium"
                  >
                    Operator
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground text-center font-medium"
                  >
                    Mulai
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground text-center font-medium"
                  >
                    Selesai
                  </TableHead>
                  {(activeCategory === "PRINTING" ||
                    activeCategory === "PACKING_ASSEMBLY") && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        MP STD
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        {activeCategory === "PACKING_ASSEMBLY"
                          ? "MP LPH"
                          : "MP ACT"}
                      </TableHead>
                      {activeCategory === "PACKING_ASSEMBLY" && (
                        <TableHead
                          rowSpan={2}
                          className="text-muted-foreground text-right font-medium"
                        >
                          MP ACT
                        </TableHead>
                      )}
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        CT STD
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        STD OUTPUT / H
                      </TableHead>
                    </>
                  )}
                  {isMoulding && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Cav Std
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        CT Std
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Std Output/Hour
                      </TableHead>
                    </>
                  )}
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground text-right font-medium"
                  >
                    Pass On
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground text-right font-medium"
                  >
                    Hold
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground text-right font-medium"
                  >
                    WIP
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground text-right font-medium"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Reject</span>
                      {(activeCategory === "PAPER" ||
                        activeCategory === "PRINTING" ||
                        activeCategory === "PACKING_ASSEMBLY" ||
                        isMoulding) && (
                        <button
                          onClick={() =>
                            setShowRejectDetails(!showRejectDetails)
                          }
                          className="hover:bg-muted rounded p-0.5"
                        >
                          {showRejectDetails ? (
                            <ChevronLeft className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </TableHead>
                  {activeCategory === "PAPER" &&
                    showRejectDetails &&
                    PAPER_REJECT_COLUMNS.map((col) => (
                      <TableHead
                        key={col}
                        rowSpan={2}
                        className="text-muted-foreground text-right text-xs whitespace-nowrap"
                      >
                        {col}
                      </TableHead>
                    ))}
                  {activeCategory === "PRINTING" &&
                    showRejectDetails &&
                    PRINTING_REJECT_COLUMNS.map((col) => (
                      <TableHead
                        key={col}
                        rowSpan={2}
                        className="text-muted-foreground text-right text-xs whitespace-nowrap"
                      >
                        {col}
                      </TableHead>
                    ))}
                  {activeCategory === "PACKING_ASSEMBLY" &&
                    showRejectDetails &&
                    PACKING_REJECT_SPLIT.map((group, idx) => (
                      <TableHead
                        key={`SECTION-${idx}`}
                        colSpan={group.length}
                        className="bg-slate-800 text-center text-xs font-bold text-slate-300 uppercase"
                      >
                        BAGIAN {idx + 1}
                      </TableHead>
                    ))}
                  {isMoulding && showRejectDetails && (
                    <>
                      <TableHead
                        colSpan={INJECTION_REJECT_BB.length}
                        className="bg-purple-900/20 text-center text-xs font-bold text-purple-400 uppercase"
                      >
                        BAHAN BAKU
                      </TableHead>
                      <TableHead
                        colSpan={INJECTION_REJECT_PROD.length}
                        className="bg-cyan-900/20 text-center text-xs font-bold text-cyan-400 uppercase"
                      >
                        PRODUK
                      </TableHead>
                    </>
                  )}
                  {activeCategory !== "PAPER" &&
                    activeCategory !== "PRINTING" &&
                    activeCategory !== "PACKING_ASSEMBLY" && (
                      <>
                        <TableHead
                          rowSpan={2}
                          className="text-muted-foreground text-right font-medium"
                        >
                          Berat Produk (gr)
                        </TableHead>
                        <TableHead
                          rowSpan={2}
                          className="text-muted-foreground text-right font-medium"
                        >
                          Total Reject (Pcs)
                        </TableHead>
                      </>
                    )}
                  {(isMoulding ||
                    activeCategory === "PRINTING" ||
                    activeCategory === "PACKING_ASSEMBLY") && (
                    <TableHead
                      rowSpan={2}
                      className="text-muted-foreground text-right font-medium"
                    >
                      Finish Good
                    </TableHead>
                  )}
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground text-right font-medium"
                  >
                    Total Output
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground text-right font-medium"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Downtime</span>
                      {(activeCategory === "PAPER" ||
                        activeCategory === "PRINTING" ||
                        activeCategory === "PACKING_ASSEMBLY" ||
                        isMoulding) && (
                        <button
                          onClick={() =>
                            setShowDowntimeDetails(!showDowntimeDetails)
                          }
                          className="hover:bg-muted rounded p-0.5"
                        >
                          {showDowntimeDetails ? (
                            <ChevronLeft className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </TableHead>

                  {/* GROUPED DOWNTIME HEADERS (ROW 1 - PAPER ONLY) */}
                  {activeCategory === "PAPER" && showDowntimeDetails && (
                    <>
                      <TableHead
                        colSpan={PAPER_PLANNED_DT.length}
                        className="bg-emerald-900/20 text-center text-xs font-bold text-emerald-400 uppercase"
                      >
                        PLANNED DOWNTIME
                      </TableHead>
                      <TableHead
                        colSpan={PAPER_UNPLANNED_DT.length}
                        className="bg-amber-900/20 text-center text-xs font-bold text-amber-400 uppercase"
                      >
                        UNPLANNED DOWNTIME
                      </TableHead>
                    </>
                  )}
                  {activeCategory === "PRINTING" && showDowntimeDetails && (
                    <>
                      <TableHead
                        colSpan={PRINTING_PLANNED_DT.length}
                        className="bg-pink-900/20 text-center text-xs font-bold text-pink-400 uppercase"
                      >
                        LOSS HOUR
                      </TableHead>
                      <TableHead
                        colSpan={PRINTING_UNPLANNED_DT.length}
                        className="bg-rose-900/20 text-center text-xs font-bold text-rose-400 uppercase"
                      >
                        DOWNTIME
                      </TableHead>
                    </>
                  )}
                  {activeCategory === "PACKING_ASSEMBLY" &&
                    showDowntimeDetails && (
                      <>
                        <TableHead
                          colSpan={PACKING_PLANNED_DT.length}
                          className="bg-purple-900/20 text-center text-xs font-bold text-purple-400 uppercase"
                        >
                          LOSS HOUR
                        </TableHead>
                        <TableHead
                          colSpan={PACKING_UNPLANNED_DT.length}
                          className="bg-pink-900/20 text-center text-xs font-bold text-pink-400 uppercase"
                        >
                          DOWNTIME
                        </TableHead>
                      </>
                    )}
                  {isMoulding && showDowntimeDetails && (
                    <>
                      <TableHead
                        colSpan={INJECTION_PLANNED_DT.length}
                        className="bg-emerald-900/20 text-center text-xs font-bold text-emerald-400 uppercase"
                      >
                        LOSS HOUR
                      </TableHead>
                      <TableHead
                        colSpan={INJECTION_UNPLANNED_DT.length}
                        className="bg-amber-900/20 text-center text-xs font-bold text-amber-400 uppercase"
                      >
                        DOWNTIME
                      </TableHead>
                    </>
                  )}

                  {activeCategory === "PAPER" && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Availability
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Performance
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Quality
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        OEE %
                      </TableHead>
                    </>
                  )}
                  {/* INJECTION ALSO DOESN'T HAVE OEE YET, or maybe later. For now just standard view columns for non-paper */}

                  {activeCategory !== "PAPER" && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Total Time
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Total Loss Hour
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Working Time
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Total Downtime
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Commercial Hour
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Running Hour
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        Effective Hour
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        DT RATE C/B
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        SPEED RATE D/C
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        QUALITY RATE E/D
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        REE E/B %
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        OEE E/A %
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        DOWN TIME %
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-muted-foreground text-right font-medium"
                      >
                        REJECT RATE
                      </TableHead>
                    </>
                  )}
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground font-medium"
                  >
                    Catatan
                  </TableHead>
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-muted-foreground w-[100px] text-center font-medium"
                  >
                    Aksi
                  </TableHead>
                </TableRow>
                {/* SUB-HEADERS FOR DOWNTIME (ROW 2 - PAPER ONLY) */}
                {/* SUB-HEADERS ROW (Merged) */}
                {((activeCategory === "PAPER" && showDowntimeDetails) ||
                  (activeCategory === "PRINTING" && showDowntimeDetails) ||
                  (activeCategory === "PACKING_ASSEMBLY" &&
                    (showRejectDetails || showDowntimeDetails)) ||
                  (isMoulding &&
                    (showRejectDetails || showDowntimeDetails))) && (
                  <TableRow className="hover:bg-slate-900/50">
                    {/* PAPER: Downtime Sub-headers */}
                    {activeCategory === "PAPER" &&
                      showDowntimeDetails &&
                      PAPER_PLANNED_DT.map((col) => (
                        <TableHead
                          key={col}
                          className="bg-emerald-900/10 text-right text-[10px] whitespace-nowrap text-emerald-300"
                        >
                          {col}
                        </TableHead>
                      ))}
                    {activeCategory === "PAPER" &&
                      showDowntimeDetails &&
                      PAPER_UNPLANNED_DT.map((col) => (
                        <TableHead
                          key={col}
                          className="bg-amber-900/10 text-right text-[10px] whitespace-nowrap text-amber-300"
                        >
                          {col}
                        </TableHead>
                      ))}

                    {/* PRINTING: Downtime Sub-headers */}
                    {activeCategory === "PRINTING" && showDowntimeDetails && (
                      <>
                        {PRINTING_PLANNED_DT.map((col) => (
                          <TableHead
                            key={`P_DT_PLAN_${col}`}
                            className="bg-pink-900/10 text-right text-[10px] whitespace-nowrap text-pink-300"
                          >
                            {col}
                          </TableHead>
                        ))}
                        {PRINTING_UNPLANNED_DT.map((col) => (
                          <TableHead
                            key={`P_DT_UNPLAN_${col}`}
                            className="bg-rose-900/10 text-right text-[10px] whitespace-nowrap text-rose-300"
                          >
                            {col}
                          </TableHead>
                        ))}
                      </>
                    )}

                    {/* PACKING ASSEMBLY: Reject Sub-headers */}
                    {activeCategory === "PACKING_ASSEMBLY" &&
                      showRejectDetails &&
                      PACKING_REJECT_SPLIT.map((group, groupIdx) =>
                        group.map((col) => (
                          <TableHead
                            key={`PK_REJ_${groupIdx}_${col}`}
                            className="bg-slate-900/10 text-right text-[10px] whitespace-nowrap text-slate-400"
                          >
                            {col}
                          </TableHead>
                        )),
                      )}
                    {/* PACKING ASSEMBLY: Downtime Sub-headers */}
                    {activeCategory === "PACKING_ASSEMBLY" &&
                      showDowntimeDetails && (
                        <>
                          {PACKING_PLANNED_DT.map((col) => (
                            <TableHead
                              key={`PK_DT_PLAN_${col}`}
                              className="bg-purple-900/10 text-right text-[10px] whitespace-nowrap text-purple-300"
                            >
                              {col}
                            </TableHead>
                          ))}
                          {PACKING_UNPLANNED_DT.map((col) => (
                            <TableHead
                              key={`PK_DT_UNPLAN_${col}`}
                              className="bg-pink-900/10 text-right text-[10px] whitespace-nowrap text-pink-300"
                            >
                              {col}
                            </TableHead>
                          ))}
                        </>
                      )}

                    {/* INJECTION / MOULDING: Reject Sub-headers */}
                    {isMoulding &&
                      showRejectDetails &&
                      INJECTION_REJECT_BB.map((col) => (
                        <TableHead
                          key={`BB-${col}`}
                          className="bg-purple-900/10 text-right text-[10px] whitespace-nowrap text-purple-300"
                        >
                          {col}
                        </TableHead>
                      ))}
                    {isMoulding &&
                      showRejectDetails &&
                      INJECTION_REJECT_PROD.map((col) => (
                        <TableHead
                          key={`PROD-${col}`}
                          className="bg-cyan-900/10 text-right text-[10px] whitespace-nowrap text-cyan-300"
                        >
                          {col}
                        </TableHead>
                      ))}

                    {/* INJECTION / MOULDING: Downtime Sub-headers */}
                    {isMoulding &&
                      showDowntimeDetails &&
                      INJECTION_PLANNED_DT.map((col) => (
                        <TableHead
                          key={col}
                          className="bg-emerald-900/10 text-right text-[10px] whitespace-nowrap text-emerald-300"
                        >
                          {col}
                        </TableHead>
                      ))}
                    {isMoulding &&
                      showDowntimeDetails &&
                      INJECTION_UNPLANNED_DT.map((col) => (
                        <TableHead
                          key={col}
                          className="bg-amber-900/10 text-right text-[10px] whitespace-nowrap text-amber-300"
                        >
                          {col}
                        </TableHead>
                      ))}
                  </TableRow>
                )}
              </TableHeader>
              <TableBody>
                {reports?.map((rpt, rptIdx) => (
                  <TableRow
                    key={rpt.id}
                    className="border-border hover:bg-muted/50 cursor-pointer border-b"
                    onClick={(e) => {
                      // Prevent opening if clicking on input or button
                      if (
                        e.target instanceof HTMLInputElement ||
                        e.target instanceof HTMLButtonElement ||
                        (e.target as HTMLElement).closest("button") ||
                        (e.target as HTMLElement).closest("input")
                      ) {
                        return;
                      }
                      setSelectedReport(rpt);
                      setSelectedReportIndex(rptIdx);
                    }}
                  >
                    <TableCell className="text-center text-xs font-medium">
                      <div>
                        {format(new Date(rpt.reportDate), "dd MMM yyyy")}
                      </div>
                      <div className="text-muted-foreground text-[10px]">
                        by {rpt.checkedBy?.username || "Admin"}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold">
                      {rpt.proses.pro.proNumber}
                    </TableCell>
                    <TableCell className="text-xs">
                      {rpt.proses.partNumber || "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="line-clamp-2 font-semibold">
                        {rpt.proses.pro.productName}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {rpt.proses.machine?.name}
                    </TableCell>
                    {activeCategory !== "PAPER" && (
                      <TableCell className="font-mono text-xs">
                        {rpt.batchNo || "-"}
                      </TableCell>
                    )}
                    {activeCategory === "PAPER" && (
                      <TableCell className="text-right font-mono text-xs text-slate-500">
                        {(() => {
                          if (!rpt.startTime || !rpt.endTime) return "-";

                          const start = new Date(rpt.startTime).getTime();
                          const end = new Date(rpt.endTime).getTime();
                          const diffMinutes = (end - start) / (1000 * 60);

                          if (diffMinutes <= 0) return "0";

                          // Total Output = Good + PassOn + Wip + Hold
                          const totalOutput =
                            Number(rpt.qtyPassOn || 0) +
                            Number(rpt.qtyWip || 0) +
                            Number(rpt.qtyHold || 0);

                          const speed = totalOutput / diffMinutes;
                          return isFinite(speed)
                            ? `${speed.toFixed(0)}/m`
                            : "-";
                        })()}
                      </TableCell>
                    )}
                    {activeCategory === "PAPER" && (
                      <TableCell className="text-right text-xs font-semibold">
                        {(() => {
                          const val = Number((rpt as any).stdSpeedPerHour ?? 0);
                          if (!isFinite(val) || val <= 0) return "-";
                          return `${val.toFixed(1)}/hour`;
                        })()}
                      </TableCell>
                    )}
                    <TableCell className="text-center text-xs font-bold">
                      {rpt.shift}
                    </TableCell>
                    <TableCell className="text-xs">
                      {rpt.operatorName}
                    </TableCell>
                    <TableCell className="text-center text-xs whitespace-nowrap text-slate-500">
                      {rpt.startTime
                        ? format(new Date(rpt.startTime), "dd MMM HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center text-xs whitespace-nowrap text-slate-500">
                      {rpt.endTime
                        ? format(new Date(rpt.endTime), "dd MMM HH:mm")
                        : "-"}
                    </TableCell>
                    {(activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY") && (
                      <>
                        <TableCell className="text-right text-xs">
                          {(rpt as any).manPowerStd
                            ? Number((rpt as any).manPowerStd)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400">
                          {(rpt as any).manPowerAct
                            ? Number((rpt as any).manPowerAct)
                            : "-"}
                        </TableCell>
                        {activeCategory === "PACKING_ASSEMBLY" && (
                          <TableCell className="text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            {(() => {
                              const mpLph = Number(
                                (rpt as any).manPowerAct || 0,
                              );
                              if (mpLph <= 0) return "-";

                              // Calculate Working Time ratio
                              const totalHours = 8;
                              let plannedDt = 0;
                              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                              const breakdown = rpt.downtimeBreakdown as any;
                              // Packing logic only here
                              const keys: readonly string[] =
                                PACKING_PLANNED_DT;

                              if (breakdown) {
                                keys.forEach((k) => {
                                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
                                  const val =
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                    breakdown?.[k] ||
                                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                    breakdown?.[`PLANNED:${k}`];
                                  if (val) plannedDt += Number(val);
                                });
                              }

                              const workingTime = totalHours - plannedDt;
                              const timeRatio =
                                workingTime > 0 ? workingTime / totalHours : 0;

                              const val = mpLph * timeRatio;
                              return val > 0 ? val.toFixed(2) : "-";
                            })()}
                          </TableCell>
                        )}
                        <TableCell className="text-right text-xs">
                          {rpt.cycleTimeStd
                            ? Number(rpt.cycleTimeStd).toFixed(2)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {(() => {
                            const ctStd = rpt.cycleTimeStd
                              ? Number(rpt.cycleTimeStd)
                              : null;

                            if (ctStd && ctStd > 0) {
                              // Standard Output = (3600 / CT) * 0.8
                              const stdOutputPerHour = (3600 / ctStd) * 0.8;
                              return Math.round(
                                stdOutputPerHour,
                              ).toLocaleString("id-ID");
                            }
                            return "-";
                          })()}
                        </TableCell>
                      </>
                    )}
                    {isMoulding && (
                      <>
                        <TableCell className="text-right text-xs">
                          {rpt.cavityStd ?? "-"}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {rpt.cycleTimeStd
                            ? Number(rpt.cycleTimeStd).toFixed(2)
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right text-xs font-semibold text-blue-600 dark:text-blue-400">
                          {(() => {
                            const cavStd = rpt.cavityStd;
                            const ctStd = rpt.cycleTimeStd
                              ? Number(rpt.cycleTimeStd)
                              : null;

                            if (cavStd && ctStd && ctStd > 0) {
                              const stdOutputPerHour = (3600 / ctStd) * cavStd;
                              return Math.round(
                                stdOutputPerHour,
                              ).toLocaleString("id-ID");
                            }
                            return "-";
                          })()}
                        </TableCell>
                      </>
                    )}
                    <TableCell className="text-right text-xs font-bold text-green-600">
                      {Number(rpt.qtyPassOn)}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400">
                      {Number(rpt.qtyHold) > 0 ? Number(rpt.qtyHold) : "-"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400">
                      {Number(rpt.qtyWip) > 0 ? Number(rpt.qtyWip) : "-"}
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold text-red-600">
                      {Number(rpt.qtyReject) > 0
                        ? Number(rpt.qtyReject).toLocaleString("id-ID")
                        : "-"}
                    </TableCell>
                    {activeCategory === "PAPER" &&
                      showRejectDetails &&
                      PAPER_REJECT_COLUMNS.map((col) => {
                        const breakdown = rpt.rejectBreakdown as any;
                        let val = breakdown?.[col];
                        if (col === "Reject Setup") {
                          val =
                            val ??
                            breakdown?.["Reject Set Up"] ??
                            breakdown?.["REJECT_SET_UP"] ??
                            breakdown?.["REJECT SET UP"];
                        } else if (col === "Reject Process") {
                          val =
                            val ??
                            breakdown?.["REJECT_PROCESS"] ??
                            breakdown?.["REJECT PROCESS"];
                        }
                        return (
                          <TableCell
                            key={col}
                            className="text-right text-xs text-slate-500"
                          >
                            {val ? Number(val).toLocaleString("id-ID") : "-"}
                          </TableCell>
                        );
                      })}
                    {activeCategory === "PRINTING" &&
                      showRejectDetails &&
                      PRINTING_REJECT_COLUMNS.map((col) => {
                        const breakdown = rpt.rejectBreakdown as any;
                        const val = breakdown?.[col];
                        return (
                          <TableCell
                            key={col}
                            className="text-right text-xs text-slate-500"
                          >
                            {val ? Number(val).toLocaleString("id-ID") : "-"}
                          </TableCell>
                        );
                      })}
                    {activeCategory === "PACKING_ASSEMBLY" &&
                      showRejectDetails &&
                      PACKING_REJECT_SPLIT.map((group, groupIdx) =>
                        group.map((col) => {
                          const breakdown = rpt.rejectBreakdown as any;
                          const val = breakdown?.[col];
                          return (
                            <TableCell
                              key={`PK_REJ_VAL_${groupIdx}_${col}`}
                              className="text-right text-xs text-slate-500"
                            >
                              {val ? Number(val).toLocaleString("id-ID") : "-"}
                            </TableCell>
                          );
                        }),
                      )}
                    {isMoulding && showRejectDetails && (
                      <>
                        {INJECTION_REJECT_BB.map((col) => {
                          let valBB: string | number | undefined | null;

                          if (col === "Gilingan / Purge") {
                            valBB = rpt.materialPurgeQty
                              ? Number(rpt.materialPurgeQty)
                              : "-";
                          } else if (col === "PT / Runner") {
                            valBB = rpt.materialRunnerQty
                              ? Number(rpt.materialRunnerQty)
                              : "-";
                          } else {
                            // Fallback
                            const breakdown = rpt.rejectBreakdown as any;
                            valBB =
                              breakdown?.[`REJECT:BAHAN_BAKU:${col}`] ||
                              breakdown?.[col];
                          }

                          return (
                            <TableCell
                              key={`BB-${col}`}
                              className="text-right text-xs text-purple-500/70"
                            >
                              {valBB && valBB !== "-"
                                ? Number(valBB).toLocaleString("id-ID")
                                : "-"}
                            </TableCell>
                          );
                        })}
                        {INJECTION_REJECT_PROD.map((col) => {
                          const breakdown = rpt.rejectBreakdown as any;
                          const valProd =
                            breakdown?.[`REJECT:PRODUK:${col}`] ||
                            breakdown?.[col];

                          return (
                            <TableCell
                              key={`PROD-${col}`}
                              className="text-right text-xs text-cyan-500/70"
                            >
                              {valProd
                                ? Number(valProd).toLocaleString("id-ID")
                                : "-"}
                            </TableCell>
                          );
                        })}
                      </>
                    )}

                    {activeCategory !== "PAPER" &&
                      activeCategory !== "PRINTING" &&
                      activeCategory !== "PACKING_ASSEMBLY" && (
                        <>
                          <TableCell className="text-right text-xs">
                            {/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any */}
                            {(rpt.metaData as any)?.productWeight ?? "-"}
                          </TableCell>
                          <TableCell className="text-right text-xs font-bold text-red-400">
                            {(() => {
                              const rejectPcs = getRejectPcsForCategory(rpt);
                              if (rejectPcs === null) return "-";
                              return rejectPcs > 0 ? rejectPcs : "-";
                            })()}
                          </TableCell>
                        </>
                      )}
                    {(isMoulding ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY") && (
                      <TableCell className="text-right text-xs font-bold text-emerald-600">
                        {(() => {
                          const finishGood =
                            Number(rpt.qtyPassOn || 0) +
                            Number(rpt.qtyHold || 0) +
                            Number(rpt.qtyWip || 0);
                          return finishGood;
                        })()}
                      </TableCell>
                    )}
                    <TableCell className="text-right text-xs font-black text-slate-800 dark:text-slate-100">
                      {(() => {
                        let total =
                          Number(rpt.qtyPassOn || 0) +
                          Number(rpt.qtyHold || 0) +
                          Number(rpt.qtyWip || 0);

                        const rejectVal = getRejectPcsForCategory(rpt) ?? 0;

                        total += rejectVal;
                        return total;
                      })()}
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold text-amber-600">
                      {(() => {
                        let calcTotal = 0;
                        let keys: readonly string[] = [];

                        if (isMoulding) {
                          keys = [
                            ...INJECTION_PLANNED_DT,
                            ...INJECTION_UNPLANNED_DT,
                          ];
                        } else if (activeCategory === "PRINTING") {
                          keys = [
                            ...PRINTING_PLANNED_DT,
                            ...PRINTING_UNPLANNED_DT,
                          ];
                        } else if (activeCategory === "PACKING_ASSEMBLY") {
                          keys = [
                            ...PACKING_PLANNED_DT,
                            ...PACKING_UNPLANNED_DT,
                          ];
                        }

                        if (keys.length > 0 && rpt.downtimeBreakdown) {
                          const bd = rpt.downtimeBreakdown as any;
                          keys.forEach((k) => {
                            const val =
                              bd[k] ||
                              bd[`PLANNED:${k}`] ||
                              bd[`UNPLANNED:${k}`];
                            calcTotal += Number(val || 0);
                          });
                        }

                        // Use stored total if calculated is 0 (fallback)
                        if (calcTotal === 0 && rpt.totalDowntime > 0) {
                          calcTotal = Number(rpt.totalDowntime);
                        }

                        if (calcTotal <= 0) return "-";

                        if (
                          isMoulding ||
                          activeCategory === "PRINTING" ||
                          activeCategory === "PACKING_ASSEMBLY"
                        ) {
                          return `${calcTotal.toLocaleString("id-ID", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} Jam`;
                        }
                        return `${calcTotal}m`;
                      })()}
                    </TableCell>
                    {activeCategory === "PAPER" && showDowntimeDetails && (
                      <>
                        {PAPER_PLANNED_DT.map((col) => {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                          const val = (rpt.downtimeBreakdown as any)?.[col];
                          return (
                            <TableCell
                              key={col}
                              className="text-right text-xs text-blue-500/70"
                            >
                              {val ? `${val}m` : "-"}
                            </TableCell>
                          );
                        })}
                        {PAPER_UNPLANNED_DT.map((col) => {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                          const val = (rpt.downtimeBreakdown as any)?.[col];
                          return (
                            <TableCell
                              key={col}
                              className="text-right text-xs text-orange-500/70"
                            >
                              {val ? `${val}m` : "-"}
                            </TableCell>
                          );
                        })}
                      </>
                    )}
                    {activeCategory === "PRINTING" && showDowntimeDetails && (
                      <>
                        {PRINTING_PLANNED_DT.map((col) => {
                          const val =
                            (rpt.downtimeBreakdown as any)?.[
                              `PLANNED:${col}`
                            ] || (rpt.downtimeBreakdown as any)?.[col];
                          return (
                            <TableCell
                              key={col}
                              className="text-right text-xs text-pink-500/70"
                            >
                              {val
                                ? `${Number(val).toLocaleString("id-ID", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })} Jam`
                                : "-"}
                            </TableCell>
                          );
                        })}
                        {PRINTING_UNPLANNED_DT.map((col) => {
                          const val = (rpt.downtimeBreakdown as any)?.[col];
                          return (
                            <TableCell
                              key={col}
                              className="text-right text-xs text-rose-500/70"
                            >
                              {val
                                ? `${Number(val).toLocaleString("id-ID", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })} Jam`
                                : "-"}
                            </TableCell>
                          );
                        })}
                      </>
                    )}

                    {activeCategory === "PACKING_ASSEMBLY" &&
                      showDowntimeDetails && (
                        <>
                          {PACKING_PLANNED_DT.map((col) => {
                            const val =
                              (rpt.downtimeBreakdown as any)?.[
                                `PLANNED:${col}`
                              ] || (rpt.downtimeBreakdown as any)?.[col];
                            return (
                              <TableCell
                                key={`PK_DT_PLAN_${col}`}
                                className="text-right text-xs text-purple-500/70"
                              >
                                {val
                                  ? `${Number(val).toLocaleString("id-ID", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })} Jam`
                                  : "-"}
                              </TableCell>
                            );
                          })}
                          {PACKING_UNPLANNED_DT.map((col) => {
                            const val = (rpt.downtimeBreakdown as any)?.[col];
                            return (
                              <TableCell
                                key={`PK_DT_UNPLAN_${col}`}
                                className="text-right text-xs text-pink-500/70"
                              >
                                {val
                                  ? `${Number(val).toLocaleString("id-ID", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })} Jam`
                                  : "-"}
                              </TableCell>
                            );
                          })}
                        </>
                      )}

                    {isMoulding && showDowntimeDetails && (
                      <>
                        {INJECTION_PLANNED_DT.map((col) => {
                          const val =
                            (rpt.downtimeBreakdown as any)?.[col] ||
                            (rpt.downtimeBreakdown as any)?.[`PLANNED:${col}`];
                          return (
                            <TableCell
                              key={col}
                              className="text-right text-xs text-blue-500/70"
                            >
                              {val
                                ? `${Number(val).toLocaleString("id-ID", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })} Jam`
                                : "-"}
                            </TableCell>
                          );
                        })}
                        {INJECTION_UNPLANNED_DT.map((col) => {
                          const val =
                            (rpt.downtimeBreakdown as any)?.[col] ||
                            (rpt.downtimeBreakdown as any)?.[
                              `UNPLANNED:${col}`
                            ];
                          return (
                            <TableCell
                              key={col}
                              className="text-right text-xs text-orange-500/70"
                            >
                              {val
                                ? `${Number(val).toLocaleString("id-ID", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })} Jam`
                                : "-"}
                            </TableCell>
                          );
                        })}
                      </>
                    )}
                    {activeCategory === "PAPER" && (
                      <>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            if (!rpt.startTime || !rpt.endTime) return "-";
                            const start = new Date(rpt.startTime).getTime();
                            const end = new Date(rpt.endTime).getTime();
                            const totalTimeDiff = (end - start) / (1000 * 60); // Total Minutes

                            if (totalTimeDiff <= 0) return "-";

                            // Calculate Planned Downtime
                            const plannedItems = [
                              "Trouble PLN",
                              "Trial",
                              "Preventive Maintenance",
                              "Istirahat",
                            ];
                            let totalPlannedDt = 0;
                            if (rpt.downtimeBreakdown) {
                              plannedItems.forEach((key) => {
                                const val = (rpt.downtimeBreakdown as any)[key];
                                if (val) totalPlannedDt += Number(val);
                              });
                            }

                            const plannedProductionTime =
                              totalTimeDiff - totalPlannedDt;
                            const operatingTime =
                              totalTimeDiff - rpt.totalDowntime;

                            if (plannedProductionTime <= 0) return "0%";

                            const avail =
                              (operatingTime / plannedProductionTime) * 100;
                            return (
                              <span
                                className={
                                  avail >= 90
                                    ? "font-bold text-emerald-600"
                                    : avail >= 80
                                      ? "font-bold text-amber-600"
                                      : "font-bold text-red-600"
                                }
                              >
                                {avail.toFixed(1)}%
                              </span>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            if (
                              !rpt.startTime ||
                              !rpt.endTime ||
                              !(rpt as any).stdSpeed
                            )
                              return "-";

                            const start = new Date(rpt.startTime).getTime();
                            const end = new Date(rpt.endTime).getTime();
                            const totalTimeDiff = (end - start) / (1000 * 60); // Minutes

                            if (totalTimeDiff <= 0) return "-";

                            const operatingTime =
                              totalTimeDiff - rpt.totalDowntime;
                            if (operatingTime <= 0) return "0%";

                            // Target = Std Speed (per min) * Operating Time
                            const targetOutput =
                              Number((rpt as any).stdSpeed) * operatingTime;

                            if (targetOutput <= 0) return "0%";

                            const totalOutput =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0) +
                              Number(rpt.qtyReject || 0);

                            const perf = (totalOutput / targetOutput) * 100;

                            return (
                              <span
                                className={
                                  perf >= 90
                                    ? "font-bold text-emerald-600"
                                    : perf >= 80
                                      ? "font-bold text-amber-600"
                                      : "font-bold text-red-600"
                                }
                              >
                                {perf.toFixed(1)}%
                              </span>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            const totalOutput =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0) +
                              Number(rpt.qtyReject || 0);

                            if (totalOutput <= 0) return "0%";

                            const quality =
                              (Number(rpt.qtyPassOn || 0) / totalOutput) * 100;

                            return (
                              <span
                                className={
                                  quality >= 90
                                    ? "font-bold text-emerald-600"
                                    : quality >= 80
                                      ? "font-bold text-amber-600"
                                      : "font-bold text-red-600"
                                }
                              >
                                {quality.toFixed(1)}%
                              </span>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            if (!rpt.startTime || !rpt.endTime) return "-";
                            const start = new Date(rpt.startTime).getTime();
                            const end = new Date(rpt.endTime).getTime();
                            const totalTimeDiff = (end - start) / (1000 * 60); // Minutes

                            if (totalTimeDiff <= 0) return "-";

                            // 1. Availability
                            // Planned Downtime
                            const plannedItems = [
                              "Trouble PLN",
                              "Trial",
                              "Preventive Maintenance",
                              "Istirahat",
                            ];
                            let totalPlannedDt = 0;
                            if (rpt.downtimeBreakdown) {
                              plannedItems.forEach((key) => {
                                const val = (rpt.downtimeBreakdown as any)[key];
                                if (val) totalPlannedDt += Number(val);
                              });
                            }
                            const plannedProductionTime =
                              totalTimeDiff - totalPlannedDt;
                            const operatingTime =
                              totalTimeDiff - rpt.totalDowntime;

                            let avail = 0;
                            if (plannedProductionTime > 0) {
                              avail = operatingTime / plannedProductionTime; // Ratio (0-1)
                            }

                            // 2. Performance
                            let perf = 0;
                            const rejectPcs = getRejectPcsForCategory(rpt) ?? 0;

                            if ((rpt as any).stdSpeed && operatingTime > 0) {
                              const targetOutput =
                                Number((rpt as any).stdSpeed) * operatingTime;
                              const totalOutput =
                                Number(rpt.qtyPassOn || 0) +
                                Number(rpt.qtyHold || 0) +
                                Number(rpt.qtyWip || 0) +
                                rejectPcs;

                              if (targetOutput > 0) {
                                perf = totalOutput / targetOutput; // Ratio (0-1)
                              }
                            }

                            // 3. Quality
                            let qual = 0;
                            const totalOutput =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0) +
                              rejectPcs;

                            if (totalOutput > 0) {
                              qual = Number(rpt.qtyPassOn || 0) / totalOutput; // Ratio (0-1)
                            }

                            // OEE
                            const oee = avail * perf * qual * 100;

                            if (isNaN(oee) || oee < 0) return "0%";

                            return (
                              <span
                                className={
                                  oee >= 85
                                    ? "font-black text-emerald-500"
                                    : oee >= 60
                                      ? "font-black text-amber-500"
                                      : "font-black text-red-500"
                                }
                              >
                                {oee.toFixed(2)}%
                              </span>
                            );
                          })()}
                        </TableCell>
                      </>
                    )}
                    {activeCategory !== "PAPER" && (
                      <>
                        <TableCell className="text-right text-xs">
                          8 Jam
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            let plannedDt = 0;
                            const breakdown = rpt.downtimeBreakdown as any;
                            let keys: readonly string[] = [];

                            if (isMoulding) keys = INJECTION_PLANNED_DT;
                            else if (activeCategory === "PRINTING")
                              keys = PRINTING_PLANNED_DT;
                            else if (activeCategory === "PACKING_ASSEMBLY")
                              keys = PACKING_PLANNED_DT;

                            if (breakdown) {
                              keys.forEach((k) => {
                                const val =
                                  breakdown?.[k] || breakdown?.[`PLANNED:${k}`];
                                if (val) plannedDt += Number(val);
                              });
                            }

                            return plannedDt > 0
                              ? `${plannedDt.toFixed(1)} Jam`
                              : "-";
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            const totalHours = 8;
                            let plannedDt = 0;
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                            const breakdown = rpt.downtimeBreakdown as any;
                            let keys: readonly string[] = [];

                            if (isMoulding) keys = INJECTION_PLANNED_DT;
                            else if (activeCategory === "PRINTING")
                              keys = PRINTING_PLANNED_DT;
                            else if (activeCategory === "PACKING_ASSEMBLY")
                              keys = PACKING_PLANNED_DT;

                            if (breakdown) {
                              keys.forEach((k) => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                const val =
                                  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                                  breakdown?.[k] || breakdown?.[`PLANNED:${k}`];
                                if (val) plannedDt += Number(val);
                              });
                            }

                            const workingTime = totalHours - plannedDt;
                            return `${workingTime.toFixed(1)} Jam`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            let unplannedDt = 0;
                            const breakdown = rpt.downtimeBreakdown as any;
                            let unplanKeys: readonly string[] = [];

                            if (isMoulding) {
                              unplanKeys = INJECTION_UNPLANNED_DT;
                            } else if (activeCategory === "PRINTING") {
                              unplanKeys = PRINTING_UNPLANNED_DT;
                            } else if (activeCategory === "PACKING_ASSEMBLY") {
                              unplanKeys = PACKING_UNPLANNED_DT;
                            }

                            if (breakdown) {
                              unplanKeys.forEach((k) => {
                                const val =
                                  breakdown?.[k] ||
                                  breakdown?.[`UNPLANNED:${k}`];
                                if (val) unplannedDt += Number(val);
                              });
                            }

                            return unplannedDt > 0
                              ? `${unplannedDt.toFixed(1)} Jam`
                              : "-";
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            const totalHours = 8;
                            let plannedDt = 0;
                            let unplannedDt = 0;
                            const breakdown = rpt.downtimeBreakdown as any;

                            let planKeys: readonly string[] = [];
                            let unplanKeys: readonly string[] = [];

                            if (isMoulding) {
                              planKeys = INJECTION_PLANNED_DT;
                              unplanKeys = INJECTION_UNPLANNED_DT;
                            } else if (activeCategory === "PRINTING") {
                              planKeys = PRINTING_PLANNED_DT;
                              unplanKeys = PRINTING_UNPLANNED_DT;
                            } else if (activeCategory === "PACKING_ASSEMBLY") {
                              planKeys = PACKING_PLANNED_DT;
                              unplanKeys = PACKING_UNPLANNED_DT;
                            }

                            if (breakdown) {
                              planKeys.forEach((k) => {
                                const val =
                                  breakdown?.[k] || breakdown?.[`PLANNED:${k}`];
                                if (val) plannedDt += Number(val);
                              });
                              unplanKeys.forEach((k) => {
                                const val =
                                  breakdown?.[k] ||
                                  breakdown?.[`UNPLANNED:${k}`];
                                if (val) unplannedDt += Number(val);
                              });
                            }

                            const workingTime = totalHours - plannedDt;
                            const commercialTime = workingTime - unplannedDt;
                            return `${commercialTime.toFixed(1)} Jam`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            const cavStd = rpt.cavityStd;
                            const ctStd = rpt.cycleTimeStd
                              ? Number(rpt.cycleTimeStd)
                              : null;

                            if (
                              (isMoulding && !rpt.cavityStd) ||
                              !ctStd ||
                              ctStd <= 0
                            )
                              return "-";

                            // Calculate Std Output Per Hour
                            // For Printing: (3600 / CT) * 0.8
                            const stdOutputPerHour = isMoulding
                              ? (3600 / ctStd) * (rpt.cavityStd || 1)
                              : (3600 / ctStd) * 0.8;

                            if (stdOutputPerHour <= 0) return "-";

                            // Calculate Total Output (in Pcs for Rigid)
                            let totalOutput =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0);

                            // Convert reject from grams to pcs for rigid
                            // For Printing, assuming qtyReject is already PCS if no weight provided or just use raw
                            const rejectPcs = getRejectPcsForCategory(rpt) ?? 0;
                            totalOutput += rejectPcs;

                            // Running Hour = Total Output / Std Output Per Hour
                            const runningHour =
                              activeCategory === "BLOW_MOULDING"
                                ? 7
                                : totalOutput / stdOutputPerHour;

                            return `${runningHour.toFixed(2)} Jam`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          {(() => {
                            const ctStd = rpt.cycleTimeStd
                              ? Number(rpt.cycleTimeStd)
                              : null;

                            if (
                              (isMoulding && !rpt.cavityStd) ||
                              !ctStd ||
                              ctStd <= 0
                            )
                              return "-";

                            // Calculate Std Output Per Hour
                            const stdOutputPerHour = isMoulding
                              ? (3600 / ctStd) * (rpt.cavityStd || 1)
                              : (3600 / ctStd) * 0.8;

                            if (stdOutputPerHour <= 0) return "-";

                            // Get Finish Good (Good + Pass On + Hold + WIP)
                            const finishGood =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0);

                            // Effective Hour = Finish Good / Std Output Per Hour
                            const effectiveHour = finishGood / stdOutputPerHour;

                            return `${effectiveHour.toFixed(2)} Jam`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            // Calculate Working Time
                            const totalHours = 8;
                            let plannedDt = 0;
                            const breakdown = rpt.downtimeBreakdown as any;
                            let keys: readonly string[] = [];

                            if (isMoulding) keys = INJECTION_PLANNED_DT;
                            else if (activeCategory === "PRINTING")
                              keys = PRINTING_PLANNED_DT;
                            else if (activeCategory === "PACKING_ASSEMBLY")
                              keys = PACKING_PLANNED_DT;

                            if (breakdown) {
                              keys.forEach((k) => {
                                const val =
                                  breakdown?.[k] || breakdown?.[`PLANNED:${k}`];
                                if (val) plannedDt += Number(val);
                              });
                            }

                            const workingTime = totalHours - plannedDt;

                            // Calculate Commercial Time
                            let unplannedDt = 0;
                            let planKeys: readonly string[] = [];
                            let unplanKeys: readonly string[] = [];

                            if (isMoulding) {
                              planKeys = INJECTION_PLANNED_DT;
                              unplanKeys = INJECTION_UNPLANNED_DT;
                            } else if (activeCategory === "PRINTING") {
                              planKeys = PRINTING_PLANNED_DT;
                              unplanKeys = PRINTING_UNPLANNED_DT;
                            } else if (activeCategory === "PACKING_ASSEMBLY") {
                              planKeys = PACKING_PLANNED_DT;
                              unplanKeys = PACKING_UNPLANNED_DT;
                            }

                            if (breakdown) {
                              unplanKeys.forEach((k) => {
                                const val =
                                  breakdown?.[k] ||
                                  breakdown?.[`UNPLANNED:${k}`];
                                if (val) unplannedDt += Number(val);
                              });
                            }

                            const commercialTime = workingTime - unplannedDt;

                            // DT RATE = Commercial Time / Working Time
                            if (workingTime <= 0) return "-";
                            const dtRate = commercialTime / workingTime;
                            return `${(dtRate * 100).toFixed(1)}%`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            const cavStd = rpt.cavityStd;
                            const ctStd = rpt.cycleTimeStd
                              ? Number(rpt.cycleTimeStd)
                              : null;

                            if (
                              (isMoulding && !rpt.cavityStd) ||
                              !ctStd ||
                              ctStd <= 0
                            )
                              return "-";

                            const stdOutputPerHour = isMoulding
                              ? (3600 / ctStd) * (rpt.cavityStd || 1)
                              : (3600 / ctStd) * 0.8;
                            if (stdOutputPerHour <= 0) return "-";

                            // Calculate Total Output (Running Hour numerator)
                            let totalOutput =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0);

                            const rejectPcs = getRejectPcsForCategory(rpt) ?? 0;
                            totalOutput += rejectPcs;

                            const runningHour =
                              activeCategory === "BLOW_MOULDING"
                                ? 7
                                : totalOutput / stdOutputPerHour;

                            // Calculate Commercial Time
                            const totalHours = 8;
                            let plannedDt = 0;
                            let unplannedDt = 0;
                            const breakdown = rpt.downtimeBreakdown as any;

                            let planKeys: readonly string[] = [];
                            let unplanKeys: readonly string[] = [];

                            if (isMoulding) {
                              planKeys = INJECTION_PLANNED_DT;
                              unplanKeys = INJECTION_UNPLANNED_DT;
                            } else if (activeCategory === "PRINTING") {
                              planKeys = PRINTING_PLANNED_DT;
                              unplanKeys = PRINTING_UNPLANNED_DT;
                            } else if (activeCategory === "PACKING_ASSEMBLY") {
                              planKeys = PACKING_PLANNED_DT;
                              unplanKeys = PACKING_UNPLANNED_DT;
                            }

                            if (breakdown) {
                              planKeys.forEach((k) => {
                                const val =
                                  breakdown?.[k] || breakdown?.[`PLANNED:${k}`];
                                if (val) plannedDt += Number(val);
                              });
                              unplanKeys.forEach((k) => {
                                const val =
                                  breakdown?.[k] ||
                                  breakdown?.[`UNPLANNED:${k}`];
                                if (val) unplannedDt += Number(val);
                              });
                            }

                            const workingTime = totalHours - plannedDt;
                            const commercialTime = workingTime - unplannedDt;

                            // SPEED RATE = Running Hour / Commercial Time
                            if (commercialTime <= 0) return "-";
                            const speedRate = runningHour / commercialTime;
                            return `${(speedRate * 100).toFixed(1)}%`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            const cavStd = rpt.cavityStd;
                            const ctStd = rpt.cycleTimeStd
                              ? Number(rpt.cycleTimeStd)
                              : null;

                            if (
                              (isMoulding && !rpt.cavityStd) ||
                              !ctStd ||
                              ctStd <= 0
                            )
                              return "-";

                            const stdOutputPerHour = isMoulding
                              ? (3600 / ctStd) * (rpt.cavityStd || 1)
                              : (3600 / ctStd) * 0.8;
                            if (stdOutputPerHour <= 0) return "-";

                            // Calculate Total Output (Running Hour)
                            let totalOutput =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0);

                            const rejectPcs = getRejectPcsForCategory(rpt) ?? 0;
                            totalOutput += rejectPcs;

                            const runningHour =
                              activeCategory === "BLOW_MOULDING"
                                ? 7
                                : totalOutput / stdOutputPerHour;

                            // Calculate Finish Good (Effective Hour numerator)
                            const finishGood =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0);

                            const effectiveHour = finishGood / stdOutputPerHour;

                            // QUALITY RATE = Effective Hour / Running Hour
                            if (runningHour <= 0) return "-";
                            const qualityRate = effectiveHour / runningHour;
                            return `${(qualityRate * 100).toFixed(1)}%`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            const cavStd = rpt.cavityStd;
                            const ctStd = rpt.cycleTimeStd
                              ? Number(rpt.cycleTimeStd)
                              : null;

                            if (
                              (isMoulding && !rpt.cavityStd) ||
                              !ctStd ||
                              ctStd <= 0
                            )
                              return "-";

                            const stdOutputPerHour = isMoulding
                              ? (3600 / ctStd) * (rpt.cavityStd || 1)
                              : (3600 / ctStd) * 0.8;
                            if (stdOutputPerHour <= 0) return "-";

                            // Calculate Working Time & Commercial Time for DT RATE
                            const totalHours = 8;
                            let plannedDt = 0;
                            let unplannedDt = 0;
                            const breakdown = rpt.downtimeBreakdown as any;
                            let planKeys: readonly string[] = [];
                            let unplanKeys: readonly string[] = [];

                            if (isMoulding) {
                              planKeys = INJECTION_PLANNED_DT;
                              unplanKeys = INJECTION_UNPLANNED_DT;
                            } else if (activeCategory === "PRINTING") {
                              planKeys = PRINTING_PLANNED_DT;
                              unplanKeys = PRINTING_UNPLANNED_DT;
                            } else if (activeCategory === "PACKING_ASSEMBLY") {
                              planKeys = PACKING_PLANNED_DT;
                              unplanKeys = PACKING_UNPLANNED_DT;
                            }

                            if (breakdown) {
                              planKeys.forEach((k) => {
                                const val =
                                  breakdown?.[k] || breakdown?.[`PLANNED:${k}`];
                                if (val) plannedDt += Number(val);
                              });
                              unplanKeys.forEach((k) => {
                                const val =
                                  breakdown?.[k] ||
                                  breakdown?.[`UNPLANNED:${k}`];
                                if (val) unplannedDt += Number(val);
                              });
                            }

                            const workingTime = totalHours - plannedDt;
                            const commercialTime = workingTime - unplannedDt;

                            // DT RATE = Commercial Time / Working Time
                            if (workingTime <= 0) return "-";
                            const dtRate = commercialTime / workingTime;

                            // Calculate Running Hour for SPEED RATE
                            let totalOutput =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0);

                            const rejectPcs = getRejectPcsForCategory(rpt) ?? 0;
                            totalOutput += rejectPcs;

                            // Running Hour logic (Fixed to 7 for Blow Moulding)
                            const runningHour =
                              activeCategory === "BLOW_MOULDING"
                                ? 7
                                : totalOutput / stdOutputPerHour;

                            // SPEED RATE = Running Hour / Commercial Time
                            if (commercialTime <= 0) return "-";
                            const speedRate = runningHour / commercialTime;

                            // Calculate Effective Hour for QUALITY RATE (using Finish Good)
                            const finishGood =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0);
                            const effectiveHour = finishGood / stdOutputPerHour;

                            // QUALITY RATE = Effective Hour / Running Hour
                            if (runningHour <= 0) return "-";
                            const qualityRate = effectiveHour / runningHour;

                            // REE = DT RATE × SPEED RATE × QUALITY RATE
                            const ree = dtRate * speedRate * qualityRate;
                            return `${(ree * 100).toFixed(1)}%`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            const cavStd = rpt.cavityStd;
                            const ctStd = rpt.cycleTimeStd
                              ? Number(rpt.cycleTimeStd)
                              : null;
                            const totalHours = 8;

                            if (
                              (isMoulding && !rpt.cavityStd) ||
                              !ctStd ||
                              ctStd <= 0
                            )
                              return "-";

                            const stdOutputPerHour = isMoulding
                              ? (3600 / ctStd) * (rpt.cavityStd || 1)
                              : (3600 / ctStd) * 0.8;
                            if (stdOutputPerHour <= 0) return "-";

                            // Calculate Effective Hour
                            const finishGood =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0);
                            const effectiveHour = finishGood / stdOutputPerHour;

                            // OEE = Effective Hour / Total Time
                            const oee = effectiveHour / totalHours;
                            return `${(oee * 100).toFixed(1)}%`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            const totalHours = 8;
                            let plannedDt = 0;
                            let unplannedDt = 0;
                            const breakdown = rpt.downtimeBreakdown as any;
                            let planKeys: readonly string[] = [];
                            let unplanKeys: readonly string[] = [];

                            if (isMoulding) {
                              planKeys = INJECTION_PLANNED_DT;
                              unplanKeys = INJECTION_UNPLANNED_DT;
                            } else if (activeCategory === "PRINTING") {
                              planKeys = PRINTING_PLANNED_DT;
                              unplanKeys = PRINTING_UNPLANNED_DT;
                            } else if (activeCategory === "PACKING_ASSEMBLY") {
                              planKeys = PACKING_PLANNED_DT;
                              unplanKeys = PACKING_UNPLANNED_DT;
                            }

                            if (breakdown) {
                              planKeys.forEach((k) => {
                                const val =
                                  breakdown?.[k] || breakdown?.[`PLANNED:${k}`];
                                if (val) plannedDt += Number(val);
                              });
                              unplanKeys.forEach((k) => {
                                const val =
                                  breakdown?.[k] ||
                                  breakdown?.[`UNPLANNED:${k}`];
                                if (val) unplannedDt += Number(val);
                              });
                            }

                            const workingTime = totalHours - plannedDt;

                            if (workingTime <= 0) return "-";
                            const downTimePct = unplannedDt / workingTime;
                            return `${(downTimePct * 100).toFixed(1)}%`;
                          })()}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          {(() => {
                            let totalOutput =
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0);

                            const rejectPcs = getRejectPcsForCategory(rpt) ?? 0;

                            // Total Output includes rejects
                            totalOutput += rejectPcs;

                            if (totalOutput <= 0) return "-";
                            const rejectRate = rejectPcs / totalOutput;
                            return `${(rejectRate * 100).toFixed(1)}%`;
                          })()}
                        </TableCell>
                      </>
                    )}
                    <TableCell className="p-2 align-top">
                      {rpt.notes ? (
                        <div className="min-w-[150px] text-xs whitespace-pre-wrap text-slate-700 dark:text-slate-200">
                          {rpt.notes}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 italic">-</div>
                      )}
                    </TableCell>
                    <TableCell className="p-2 align-top">
                      {readOnly ? (
                        <span className="text-xs text-slate-400">-</span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                          onClick={() => {
                            setVoidId(rpt.id);
                            setVoidReason("");
                          }}
                          disabled={voidMutation.isPending}
                        >
                          <Ban className="h-3 w-3" />
                          Void
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Void Report Dialog */}
      {!readOnly && (
        <Dialog open={!!voidId} onOpenChange={(o) => !o && setVoidId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Void Laporan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg p-3 text-sm">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>
                  Laporan yang di-void akan{" "}
                  <strong>membatalkan posting inventory</strong> (stok
                  dikembalikan). Status laporan berubah menjadi{" "}
                  <strong>VOID</strong> dan tidak bisa dikembalikan.
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="void-reason" className="text-sm font-medium">
                  Alasan Void (Wajib)
                </label>
                <Textarea
                  id="void-reason"
                  placeholder="Contoh: Data salah input, duplikat laporan, koreksi shift..."
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setVoidId(null)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                disabled={!voidReason.trim() || voidMutation.isPending}
                onClick={handleVoidSubmit}
              >
                {voidMutation.isPending ? "Memproses..." : "Void Laporan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <ReportDetailDialog
        isOpen={!!selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
        report={selectedReport}
        category={activeCategory}
        currentIndex={selectedReportIndex}
        totalCount={reports?.length ?? 0}
        onPrev={() => {
          const prevIdx = selectedReportIndex - 1;
          if (prevIdx >= 0 && reports) {
            setSelectedReport(reports[prevIdx]);
            setSelectedReportIndex(prevIdx);
          }
        }}
        onNext={() => {
          const nextIdx = selectedReportIndex + 1;
          if (reports && nextIdx < reports.length) {
            setSelectedReport(reports[nextIdx]);
            setSelectedReportIndex(nextIdx);
          }
        }}
      />
    </div>
  );
}
