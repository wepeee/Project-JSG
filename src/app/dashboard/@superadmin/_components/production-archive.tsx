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
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";

function AdminNoteInput({
  id,
  initialValue,
}: {
  id: string;
  initialValue: string | null;
}) {
  const [value, setValue] = React.useState(initialValue ?? "");
  const [isSaved, setIsSaved] = React.useState(true);
  
  const utils = api.useUtils();
  
  const mutation = api.verification.updateAdminNote.useMutation({
    onSuccess: () => {
      setIsSaved(true);
      void utils.verification.getReports.invalidate();
    },
  });

  const handleBlur = () => {
    if (value !== (initialValue ?? "")) {
      setIsSaved(false);
      mutation.mutate({ id, note: value });
    }
  };

  // Update local state if prop changes (e.g. re-fetch)
  React.useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

  return (
    <div className="relative">
      <Input
        className={`h-8 w-[200px] text-xs ${
          !isSaved
            ? "border-amber-400 bg-amber-50"
            : "border-transparent bg-transparent px-0 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setIsSaved(false);
        }}
        onBlur={handleBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
        placeholder="Isi catatan..."
      />
      {!isSaved && mutation.isPending && (
        <div className="absolute right-2 top-2">
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        </div>
      )}
    </div>
  );
}

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

export default function ProductionArchive() {
  const [activeCategory, setActiveCategory] = React.useState<
    "PAPER" | "INJECTION" | "BLOW_MOULDING" | "PRINTING" | "PACKING_ASSEMBLY"
  >("PAPER");
  const [showRejectDetails, setShowRejectDetails] = React.useState(false);
  const [showDowntimeDetails, setShowDowntimeDetails] = React.useState(false);

  // Fetch APPROVED reports
  // Auto-recover from "RIGID" state (HMR legacy)
  React.useEffect(() => {
    if (activeCategory === ("RIGID" as any)) {
      setActiveCategory("INJECTION");
    }
  }, [activeCategory]);

  const safeCategory =
    activeCategory === ("RIGID" as any) ? "INJECTION" : activeCategory;

  const { data: reports, isLoading } = api.verification.getReports.useQuery({
    status: "APPROVED",
    category: safeCategory,
    limit: 100,
  });

  const rigidSubCategories = [
    { id: "INJECTION", label: "INJECTION" },
    { id: "BLOW_MOULDING", label: "BLOW MOLD" },
    { id: "PRINTING", label: "PRINTING" },
    { id: "PACKING_ASSEMBLY", label: "PACKING" },
  ] as const;

  const isRigidActive = activeCategory !== "PAPER";
  const isMoulding =
    activeCategory === "INJECTION" || activeCategory === "BLOW_MOULDING";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Daftar Laporan Produksi
          </h2>
          <p className="text-sm text-slate-500">
            Arsip laporan yang telah disetujui.
          </p>
        </div>

        {/* Category Switcher */}
        <div className="flex flex-col items-end gap-2">
          {/* Main Level */}
          <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
            <button
              onClick={() => setActiveCategory("PAPER")}
              className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                !isRigidActive
                  ? "bg-white shadow dark:bg-slate-700"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
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
                  ? "bg-white shadow dark:bg-slate-700"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              RIGID
            </button>
          </div>

          {/* Sub Level for Rigid */}
          {isRigidActive && (
            <div className="no-scrollbar flex overflow-x-auto rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
              {rigidSubCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-md px-3 py-1 text-xs font-bold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-white shadow dark:bg-slate-700"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-slate-900">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
          </div>
        ) : reports?.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Belum ada laporan {activeCategory.replace("_", " ")} yang disetujui.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-slate-800 bg-slate-950">
                <TableRow className="hover:bg-slate-900/50">
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="w-[120px] text-slate-300"
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
                    className="text-slate-300"
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
                    className="min-w-[200px] text-slate-300"
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
                    className="text-slate-300"
                  >
                    Mesin
                  </TableHead>
                  {activeCategory === "PAPER" && (
                    <>
                      <TableHead
                        rowSpan={2}
                        className="text-right text-slate-300"
                      >
                        Speed
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-right text-slate-300"
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
                    className="text-slate-300"
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
                    className="text-slate-300"
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
                    className="text-slate-300"
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
                    className="text-slate-300"
                  >
                    Selesai
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
                    className="text-right text-slate-300"
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
                    className="text-right text-slate-300"
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
                    className="text-right text-slate-300"
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
                    className="text-right text-slate-300"
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
                          className="rounded p-0.5 hover:bg-slate-800"
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
                        className="text-right text-xs whitespace-nowrap text-slate-300"
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
                        className="text-right text-xs whitespace-nowrap text-slate-300"
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
                  <TableHead
                    rowSpan={
                      activeCategory === "PAPER" ||
                      activeCategory === "PRINTING" ||
                      activeCategory === "PACKING_ASSEMBLY" ||
                      isMoulding
                        ? 2
                        : 1
                    }
                    className="text-right text-slate-300"
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
                    className="text-right text-slate-300"
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
                          className="rounded p-0.5 hover:bg-slate-800"
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
                        className="text-right text-slate-300"
                      >
                        Availability
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-right text-slate-300"
                      >
                        Performance
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-right text-slate-300"
                      >
                        Quality
                      </TableHead>
                      <TableHead
                        rowSpan={2}
                        className="text-right text-slate-300"
                      >
                        OEE %
                      </TableHead>
                    </>
                  )}
                  {/* INJECTION ALSO DOESN'T HAVE OEE YET, or maybe later. For now just standard view columns for non-paper */}
                  {activeCategory !== "PAPER" &&
                    activeCategory !== "PRINTING" &&
                    activeCategory !== "PACKING_ASSEMBLY" &&
                    !isMoulding && (
                      <>
                        <TableHead className="text-right text-slate-300">
                          MP
                        </TableHead>
                        <TableHead className="text-right text-slate-300">
                          CT
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
                    className="text-slate-300"
                  >
                    Catatan
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
                {reports?.map((rpt) => (
                  <TableRow
                    key={rpt.id}
                    className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50"
                  >
                    <TableCell className="text-xs font-medium">
                      <div>
                        {format(new Date(rpt.reportDate), "dd MMM yyyy")}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        by {rpt.checkedBy?.username || "Admin"}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs font-bold">
                      {rpt.step.pro.proNumber}
                    </TableCell>
                    <TableCell className="text-xs">
                      {rpt.step.partNumber || "-"}
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className="line-clamp-2 font-semibold">
                        {rpt.step.pro.productName}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {rpt.step.machine?.name}
                    </TableCell>
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
                            Number(rpt.qtyGood || 0) +
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
                      <TableCell className="text-right text-xs text-slate-500">
                        {
                          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                          (rpt as any).stdSpeed
                            ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                              `${Math.round((rpt as any).stdSpeed as number)}/m`
                            : "-"
                        }
                      </TableCell>
                    )}
                    <TableCell className="text-center text-xs font-bold">
                      {rpt.shift}
                    </TableCell>
                    <TableCell className="text-xs">
                      {rpt.operatorName}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-slate-500">
                      {rpt.startTime
                        ? format(new Date(rpt.startTime), "dd MMM HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-slate-500">
                      {rpt.endTime
                        ? format(new Date(rpt.endTime), "dd MMM HH:mm")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold text-green-600">
                      {(
                        Number(rpt.qtyGood) + Number(rpt.qtyPassOn)
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400">
                      {Number(rpt.qtyHold) > 0
                        ? Number(rpt.qtyHold).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-600 dark:text-slate-400">
                      {Number(rpt.qtyWip) > 0
                        ? Number(rpt.qtyWip).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold text-red-600">
                      {Number(rpt.qtyReject) > 0
                        ? Number(rpt.qtyReject).toLocaleString()
                        : "-"}
                    </TableCell>
                    {activeCategory === "PAPER" &&
                      showRejectDetails &&
                      PAPER_REJECT_COLUMNS.map((col) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                        const val = (rpt.rejectBreakdown as any)?.[col];
                        return (
                          <TableCell
                            key={col}
                            className="text-right text-xs text-slate-500"
                          >
                            {val ? Number(val).toLocaleString() : "-"}
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
                            {val ? Number(val).toLocaleString() : "-"}
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
                              {val ? Number(val).toLocaleString() : "-"}
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
                                ? Number(valBB).toLocaleString()
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
                              {valProd ? Number(valProd).toLocaleString() : "-"}
                            </TableCell>
                          );
                        })}
                      </>
                    )}
                    <TableCell className="text-right text-xs font-black text-slate-800 dark:text-slate-100">
                      {(
                        Number(rpt.qtyGood) +
                        Number(rpt.qtyPassOn) +
                        Number(rpt.qtyHold) +
                        Number(rpt.qtyWip) +
                        Number(rpt.qtyReject)
                      ).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold text-amber-600">
                      {rpt.totalDowntime > 0 ? `${rpt.totalDowntime}m` : "-"}
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
                              {val ? `${val}m` : "-"}
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
                              {val ? `${val}m` : "-"}
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
                                {val ? `${val}m` : "-"}
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
                                {val ? `${val}m` : "-"}
                              </TableCell>
                            );
                          })}
                        </>
                      )}

                    {isMoulding && showDowntimeDetails && (
                      <>
                        {INJECTION_PLANNED_DT.map((col) => {
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
                        {INJECTION_UNPLANNED_DT.map((col) => {
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
                              Number(rpt.qtyGood || 0) +
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
                              Number(rpt.qtyGood || 0) +
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
                            if ((rpt as any).stdSpeed && operatingTime > 0) {
                              const targetOutput =
                                Number((rpt as any).stdSpeed) * operatingTime;
                              const totalOutput =
                                Number(rpt.qtyGood || 0) +
                                Number(rpt.qtyPassOn || 0) +
                                Number(rpt.qtyHold || 0) +
                                Number(rpt.qtyWip || 0) +
                                Number(rpt.qtyReject || 0);
                              if (targetOutput > 0) {
                                perf = totalOutput / targetOutput; // Ratio (0-1)
                              }
                            }

                            // 3. Quality
                            let qual = 0;
                            const totalOutput =
                              Number(rpt.qtyGood || 0) +
                              Number(rpt.qtyPassOn || 0) +
                              Number(rpt.qtyHold || 0) +
                              Number(rpt.qtyWip || 0) +
                              Number(rpt.qtyReject || 0);

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
                    {activeCategory !== "PAPER" &&
                      activeCategory !== "PRINTING" &&
                      activeCategory !== "PACKING_ASSEMBLY" &&
                      !isMoulding && (
                        <>
                          <TableCell className="text-right text-xs">
                            {rpt.manPowerAct ?? "-"}
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {rpt.cycleTimeAct?.toString() ?? "-"}
                          </TableCell>
                        </>
                      )}
                    <TableCell className="p-2">
                      <AdminNoteInput
                        id={rpt.id}
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        initialValue={(rpt as any).adminNote as string | null}
                      />
                      {rpt.notes && (
                        <div className="mt-1 max-w-[200px] truncate text-[10px] text-slate-400" title={rpt.notes}>
                          Op: {rpt.notes}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
