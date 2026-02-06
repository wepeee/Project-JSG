"use client";

import * as React from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Clock,
  User,
  AlertTriangle,
  Package,
  History,
  Save,
  Settings,
  Flame,
  Layers,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

// --- CONSTANTS ---

type LphType =
  | "PAPER"
  | "PRINTING"
  | "PACKING_ASSEMBLY"
  | "BLOW_MOULDING"
  | "INJECTION";

const REJECT_LISTS: Record<LphType, string[]> = {
  PAPER: [
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
  ],
  PRINTING: [
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
  ],
  PACKING_ASSEMBLY: [
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
    "Lain-lain",
  ],
  BLOW_MOULDING: [
    "Bintik Hitam",
    "P/S Deformasi",
    "Warna # Std",
    "Appearance # Std",
    "Dimensi # Std",
    "Kotor Fet",
    "Proses",
    "Baret",
    "Lain-lain",
  ],
  INJECTION: [
    "Bintik Hitam",
    "P/S Deformasi",
    "Warna # Std",
    "Appearance # Std",
    "Dimensi # Std",
    "Kotor Fet",
    "Proses",
    "Baret",
    "Lain-lain",
  ],
};

// Injection Split Lists
const REJECT_INJECTION_BB = ["Bintik Hitam", "Kotor Fet", "Lain-lain BB"];

const REJECT_INJECTION_PRODUCT = [
  "Bintik Hitam",
  "P/S Deformasi",
  "Warna # Std",
  "Appearance # Std",
  "Dimensi # Std",
  "Kotor Fet",
  "Proses",
  "Baret",
];

const REJECT_PACKING_ASSEMBLY_SPLIT = [
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

const DOWNTIME_LISTS: Record<
  "PAPER" | "RIGID",
  { PLANNED: string[]; UNPLANNED: string[] }
> = {
  PAPER: {
    PLANNED: [
      "Trouble PLN",
      "Trial",
      "Preventive Maintenance",
      "Istirahat",
      "Lain-lain",
    ],
    UNPLANNED: [
      "Tunggu Approval",
      "Tunggu Material",
      "Set Up & Change Over",
      "Machine Problem",
      "Mencari Tools",
      "Running In",
      "Operator Issue",
      "Adjustment Process",
      "Lain-lain",
    ],
  },
  RIGID: {
    PLANNED: [
      "No Order",
      "Istirahat",
      "Clean / CIL",
      "Trial",
      "Preventive",
      "Start Mesin",
      "Set Up",
      "Approve",
    ],
    UNPLANNED: [
      "Loss HS",
      "Material",
      "Electrik",
      "Mesin",
      "Hydraulic",
      "Robot",
      "Utility",
      "Mold/Tools",
      "Proses",
      "Lain-lain",
    ],
  },
};

const LOSS_HOUR_INJECTION = [
  "No Order",
  "Istirahat",
  "Cil / Clean",
  "Trial",
  "Preventive",
];

const LOSS_HOUR_PRINTING = [
  "CLEAN",
  "NO ORDER",
  "ISTIRAHAT",
  "TRIAL",
  "PREVEN MESIN",
];

const LOSS_HOUR_PACKING_ASSEMBLY = ["CLEAN", "NO ORDER", "ISTIRAHAT", "TRIAL"];

const DOWNTIME_INJECTION_LIST = [
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

const DOWNTIME_PRINTING_LIST = [
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

const DOWNTIME_PACKING_ASSEMBLY_LIST = [
  "Material",
  "WARNA TIDAK STD",
  "Approve",
  "Set Up",
  "Airblow",
  "Proses",
  "Man",
  "Other",
];

// --- HELPER ---

const getLphType = (pro: any, machineName: string): LphType => {
  // 1. PAPER Strategy: One size fits all (mostly)
  if (pro.type === "PAPER") return "PAPER";

  // 2. RIGID Strategy: Depend on PRO Process Code
  const pCode = pro.process?.code;
  if (pCode === "11") return "INJECTION";
  if (pCode === "12") return "BLOW_MOULDING";
  if (pCode === "14") return "PRINTING"; // Screen Printing
  if (pCode === "29") return "PACKING_ASSEMBLY"; // FG
  // Add other Rigid codes if needed (e.g. 13 Assembly if used for Rigid)

  // 3. Fallback: Machine Name Parsing (Legacy/Safety)
  const m = machineName.toUpperCase();
  if (m.includes("IMM") || m.includes("INJECTION")) return "INJECTION";
  if (m.includes("EBM") || m.includes("BLOW")) return "BLOW_MOULDING";
  if (m.includes("PRINT")) return "PRINTING";
  if (m.includes("PACK") || m.includes("ASSEMBLY")) return "PACKING_ASSEMBLY";

  return "INJECTION"; // Default Rigid fallback
};

interface ProductionReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    pro: any;
    step: any;
    shift: number;
  } | null;
  onDraftChange?: () => void;
  editReport?: any; // Pass the report object to edit (from history)
}

export function ProductionReportModal({
  open,
  onOpenChange,
  task,
  onDraftChange,
  editReport,
}: ProductionReportModalProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = React.useState("info");
  const [loading, setLoading] = React.useState(false);
  // const [showRumus, setShowRumus] = React.useState(false); // Removed formula toggle

  // Initial State derived from task
  const [lphType, setLphType] = React.useState<LphType>("PAPER");
  const [isLoaded, setIsLoaded] = React.useState(false);
  const skipNextSave = React.useRef(false);

  // Form Data State
  const [formData, setFormData] = React.useState({
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",

    // Rigid Resources
    batchNo: "",
    mpStd: "",
    mpAct: "",
    ctStd: "",
    ctAct: "",
    cavStd: "",
    cavAct: "",

    // Editable Header Info
    shift: "",
    operatorName: "",

    // Material
    inputMaterial: "", // Paper: input, Rigid: material tuang
    materialRunner: "", // Rigid only
    materialPurge: "", // Rigid only
    productWeight: "", // Injection only

    // Output
    qtyGood: "",
    qtyPassOn: "",
    qtyWip: "",
    qtyHold: "",

    // Rejects (Dynamic Key-Value)
    rejectSetup: "",
    rejectProcess: "",
    rejects: {} as Record<string, string>,

    // Downtime (Dynamic Key-Value)
    downtimes: {} as Record<string, string>,

    notes: "",
  });

  // Calculate Totals
  const totalReject = React.useMemo(() => {
    const listTotal = Object.values(formData.rejects).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0,
    );
    return (
      listTotal +
      (Number(formData.rejectSetup) || 0) +
      (Number(formData.rejectProcess) || 0)
    );
  }, [formData.rejects, formData.rejectSetup, formData.rejectProcess]);

  const totalDowntimeObj = React.useMemo(() => {
    const allEntries = Object.entries(formData.downtimes);
    const total = allEntries.reduce(
      (acc, [_, val]) => acc + (Number(val) || 0),
      0,
    );

    const planned = allEntries
      .filter(([key]) => key.startsWith("PLANNED:"))
      .reduce((acc, [_, val]) => acc + (Number(val) || 0), 0);

    return { total, planned };
  }, [formData.downtimes]);

  // Calculate Totals & OEE
  const {
    totalTimeMinutes,
    availability,
    performance,
    quality,
    oee,
    valStd,
    targetOutput,
    speedPerMin,
    speedPerHour,
  } = React.useMemo(() => {
    // 1. Availability
    let tMin = 0;
    if (
      formData.startDate &&
      formData.startTime &&
      formData.endDate &&
      formData.endTime
    ) {
      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.endDate}T${formData.endTime}`);
      const diffMs = end.getTime() - start.getTime();
      tMin = diffMs > 0 ? diffMs / 1000 / 60 : 0;
    }

    const { total: totalDowntime, planned: totalPlannedDowntime } =
      totalDowntimeObj;

    const availableTime = tMin - totalPlannedDowntime;
    const operatingTime = tMin - totalDowntime; // or availableTime - unplanned

    // User Request: Availability = Operating Time / (Total Time - Planned Downtime)
    const av = availableTime > 0 ? (operatingTime / availableTime) * 100 : 0;

    // 2. Output & Quality
    const good = Number(formData.qtyGood) || 0;
    const passOn = Number(formData.qtyPassOn) || 0;
    const hold = Number(formData.qtyHold) || 0;
    const wip = Number(formData.qtyWip) || 0;

    // Finish Good (calculated from components that are NOT reject)
    // User says: Total Output = PASS ON + HOLD + WIP + TOTAL REJECT
    // And: Finish Good = Total Output - Total Reject
    // Implies: Finish Good = PASS ON + HOLD + WIP
    // We also include 'good' input in case it's used instead of breakdown.
    const finishGood = good + passOn + hold + wip;
    const totalOut = finishGood + totalReject;

    // Quality = PASS ON / Total Output (User Request)
    // Note: We include 'good' just in case, but primary is Pass On.
    // If user inputs 'good' instead of 'passOn', it should count.
    // But commonly it's Pass On.
    const qualityNumerator = passOn + good;
    const q = totalOut > 0 ? (qualityNumerator / totalOut) * 100 : 0;

    // 3. Performance
    // Formula: (Total Output / Target Output) * 100
    // Target Output = Speed/Menit * Operating Time (Waktu yang ada)
    // IF RIGID: Input CT (sec) -> Speed/Menit = 60 / CT
    // IF PAPER: Input Speed (hour) -> Speed/Menit = Speed / 60
    // Total Output = PASS ON + HOLD + WIP + REJECT (+ Good if applicable)
    let perf = 0;
    const valStd = Number(formData.ctStd) || 0;

    let targetOutputDisplay = 0;
    let speedPerMin = 0;
    let speedPerHour = 0;

    if (valStd > 0) {
      // Calculate speeds
      if (lphType === "PAPER") {
        speedPerMin = valStd / 60;
        speedPerHour = valStd;
      } else {
        // Rigid: valStd is CT (sec).
        // Speed/Min = 60 / CT
        // Speed/Hour = (60/CT) * 60
        if (valStd > 0) {
          speedPerMin = 60 / valStd;
          speedPerHour = speedPerMin * 60;
        }
      }

      // User Request: Performance = (Output) / (Speed * Total Waktu)
      // "Total Waktu" construed as totalTimeMinutes (tMin), not OperatingTime.
      if (tMin > 0) {
        targetOutputDisplay = speedPerMin * tMin;

        const performanceNumerator = passOn + hold + wip + good;
        perf =
          targetOutputDisplay > 0
            ? (performanceNumerator / targetOutputDisplay) * 100
            : 0;
      }
    }

    // 4. OEE (Calculate here to be in scope)
    const oeeVal = (av / 100) * (perf / 100) * (q / 100) * 100;

    // Note: If perf is 0 (because valStd is 0), OEE will be 0. Correct.

    return {
      totalTimeMinutes: tMin,
      availability: av,
      performance: perf,
      quality: q,
      oee: oeeVal,
      valStd,
      targetOutput: targetOutputDisplay,
      speedPerMin,
      speedPerHour,
    };
  }, [
    formData.startDate,
    formData.startTime,
    formData.endDate,
    formData.endTime,
    formData.ctStd,
    formData.qtyGood,
    formData.qtyPassOn,
    formData.qtyHold,
    formData.qtyWip,
    formData.qtyWip,
    totalDowntimeObj, // Updated dependency
    totalReject,
    lphType,
  ]);
  const draftKey = React.useMemo(
    () => (task ? `pro_report_v2_${task.step.id}` : ""),
    [task],
  );

  React.useEffect(() => {
    if (open && task) {
      // 1. Detect Type
      const type = getLphType(task.pro, task.step.machine?.name || "");
      setLphType(type);

      // Auto-fill Logic
      const machine = task.step.machine;
      const isPaper = type === "PAPER";
      let prefilledCtStd = "";
      if (machine) {
        if (isPaper && machine.stdOutputPerHour) {
          prefilledCtStd = String(machine.stdOutputPerHour);
        } else if (!isPaper && machine.cycleTimeSec) {
          prefilledCtStd = String(machine.cycleTimeSec);
        }
      }

      // 2. Load Draft
      if (draftKey) {
        const saved = localStorage.getItem(draftKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);

            // If draft has empty ctStd, try to fill from machine data
            if (!parsed.ctStd || parsed.ctStd == 0) {
              parsed.ctStd = prefilledCtStd;
            }

            // Fallback for Shift & Operator if missing in draft
            if (!parsed.shift) {
              parsed.shift = String(task.shift);
            }
            if (!parsed.operatorName) {
              parsed.operatorName = session?.user?.name || "";
            }

            setFormData((prev) => ({ ...prev, ...parsed }));
          } catch (e) {
            console.error("Bad draft", e);
          }
        } else {
          // Reset form
          setFormData({
            startTime: new Date().toTimeString().slice(0, 5),
            endTime: "",
            startDate: new Date().toISOString().slice(0, 10),
            endDate: new Date().toISOString().slice(0, 10),
            shift: String(task.shift), // Initial from task
            operatorName: session?.user?.name || "",
            batchNo: "",
            mpStd: "",
            mpAct: "",
            ctStd: prefilledCtStd,
            ctAct: "",
            cavStd: "",
            cavAct: "",
            inputMaterial: "",
            materialRunner: "",
            materialPurge: "",
            productWeight: "",
            qtyGood: "",
            qtyPassOn: "",
            qtyWip: "",
            qtyHold: "",
            rejectSetup: "",
            rejectProcess: "",
            rejects: {},
            downtimes: {},
            notes: "",
          });
        }
      }
      setIsLoaded(true); // Mark as loaded so auto-save can start working
    } else {
      setIsLoaded(false); // Reset when closed
    }
  }, [open, task, draftKey, session]);

  // Auto Save
  React.useEffect(() => {
    // Skip save if explicitly requested (e.g. during reset)
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    // Only save if open, key exists, AND we have finished the initial load/reset
    if (open && draftKey && isLoaded) {
      localStorage.setItem(draftKey, JSON.stringify(formData));
      window.dispatchEvent(new Event("draft-update"));
      onDraftChange?.();
    }
  }, [formData, open, draftKey, isLoaded, onDraftChange]);

  if (!task) return null;

  const utils = api.useUtils();
  const createReportMutation = api.production.createReport.useMutation({
    onSuccess: () => {
      utils.production.getHistory.invalidate(); // Refresh history
      alert("Laporan berhasil disimpan!");
      if (draftKey) localStorage.removeItem(draftKey);
      window.dispatchEvent(new Event("draft-update"));
      onDraftChange?.();
      setLoading(false);
      onOpenChange(false);
    },
    onError: (err) => {
      console.error(err);
      alert("Gagal menyimpan laporan: " + err.message);
      setLoading(false);
    },
  });

  const updateReportMutation = api.production.updateReport.useMutation({
    onSuccess: () => {
      utils.production.getHistory.invalidate();
      alert("Laporan berhasil diperbarui!");
      window.dispatchEvent(new Event("draft-update"));
      onDraftChange?.();
      setLoading(false);
      onOpenChange(false);
    },
    onError: (err) => {
      console.error(err);
      alert("Gagal memperbarui laporan: " + err.message);
      setLoading(false);
    },
  });

  // Populate Form from Edit Report
  React.useEffect(() => {
    if (open && editReport) {
      // Helper to format Date to HH:mm
      const formatTime = (d?: string | Date) => {
        if (!d) return "";
        const date = new Date(d);
        return date.toLocaleTimeString("id", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      };

      const breakdown =
        (editReport.rejectBreakdown as Record<string, number>) || {};
      const downtimeDown =
        (editReport.downtimeBreakdown as Record<string, number>) || {};

      // Filter out setup/process from general breakdown map if stored there
      // But typically we stored them separately in logic? NO, we stored them in the same JSON object
      // So we need to extract them.

      const newFormData: any = {
        shift: String(editReport.shift),
        operatorName: editReport.operatorName,
        startDate: new Date(editReport.reportDate).toISOString().split("T")[0], // YYYY-MM-DD
        // endDate... not really used in submit?
        startTime: formatTime(editReport.startTime),
        endTime: formatTime(editReport.endTime),

        batchNo: editReport.batchNo || "",
        mpStd: String(editReport.manPowerStd || ""),
        mpAct: String(editReport.manPowerAct || ""),
        ctStd: String(editReport.cycleTimeStd || ""),
        ctAct: String(editReport.cycleTimeAct || ""),
        cavStd: String(editReport.cavityStd || ""),
        cavAct: String(editReport.cavityAct || ""),

        inputMaterial: String(editReport.inputMaterialQty || ""),
        materialRunner: String(editReport.materialRunnerQty || ""),
        materialPurge: String(editReport.materialPurgeQty || ""),

        qtyGood: String(editReport.qtyGood || ""),
        qtyPassOn: String(editReport.qtyPassOn || ""),
        qtyHold: String(editReport.qtyHold || ""),
        qtyWip: String(editReport.qtyWip || ""),

        notes: editReport.notes || "",

        rejectSetup: String(breakdown["Reject Setup"] || ""),
        rejectProcess: String(breakdown["Reject Process"] || ""),
        rejects: {},
        downtimes: {},
      };

      // Populate dynamic rejects
      Object.entries(breakdown).forEach(([k, v]) => {
        if (k !== "Reject Setup" && k !== "Reject Process") {
          newFormData.rejects[k] = String(v);
        }
      });

      // Populate downtimes
      Object.entries(downtimeDown).forEach(([k, v]) => {
        newFormData.downtimes[k] = String(v);
      });

      setFormData((prev) => ({ ...prev, ...newFormData }));
      setLphType(editReport.reportType);
      setIsLoaded(true);
    }
  }, [open, editReport]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.operatorName.trim()) {
      alert("Nama Operator wajib diisi!");
      setLoading(false);
      return;
    }

    if (editReport) {
      updateReportMutation.mutate({
        id: editReport.id,
        data: {
          proStepId: task.step.id,
          shift: Number(formData.shift) || task.shift,
          reportDate: new Date(formData.startDate),
          operatorName: formData.operatorName,
          reportType: lphType as any,
          startTime: formData.startTime,
          endTime: formData.endTime,
          batchNo: formData.batchNo,
          mpStd: Number(formData.mpStd) || undefined,
          mpAct: Number(formData.mpAct) || undefined,
          cycleTimeStd: Number(formData.ctStd) || undefined,
          cycleTimeAct: Number(formData.ctAct) || undefined,
          cavityStd: Number(formData.cavStd) || undefined,
          cavityAct: Number(formData.cavAct) || undefined,
          inputMaterialQty: Number(formData.inputMaterial) || undefined,
          materialRunnerQty: Number(formData.materialRunner) || undefined,
          materialPurgeQty: Number(formData.materialPurge) || undefined,
          qtyGood: Number(formData.qtyGood) || 0,
          qtyPassOn: Number(formData.qtyPassOn) || 0,
          qtyHold: Number(formData.qtyHold) || 0,
          qtyWip: Number(formData.qtyWip) || 0,
          qtyReject: totalReject,
          rejectBreakdown: Object.fromEntries(
            Object.entries(formData.rejects)
              .filter(([_, v]) => Number(v) > 0)
              .map(([k, v]) => [k, Number(v)])
              .concat(
                Number(formData.rejectSetup) > 0
                  ? [["Reject Setup", Number(formData.rejectSetup)]]
                  : [],
                Number(formData.rejectProcess) > 0
                  ? [["Reject Process", Number(formData.rejectProcess)]]
                  : [],
              ),
          ),
          downtimeBreakdown: Object.fromEntries(
            Object.entries(formData.downtimes)
              .filter(([_, v]) => Number(v) > 0)
              .map(([k, v]) => [k, Number(v)]),
          ),
          totalDowntime: totalDowntimeObj.total,
          notes: formData.notes,
        },
      });
    } else {
      createReportMutation.mutate({
        proStepId: task.step.id,
        shift: Number(formData.shift) || task.shift,
        reportDate: new Date(formData.startDate), // Basic date
        operatorName: formData.operatorName,
        reportType: lphType as any,

        startTime: formData.startTime,
        endTime: formData.endTime, // These are HH:mm strings, handled by backend

        batchNo: formData.batchNo,
        mpStd: Number(formData.mpStd) || undefined,
        mpAct: Number(formData.mpAct) || undefined,
        cycleTimeStd: Number(formData.ctStd) || undefined,
        cycleTimeAct: Number(formData.ctAct) || undefined,
        cavityStd: Number(formData.cavStd) || undefined,
        cavityAct: Number(formData.cavAct) || undefined,

        inputMaterialQty: Number(formData.inputMaterial) || undefined,
        materialRunnerQty: Number(formData.materialRunner) || undefined,
        materialPurgeQty: Number(formData.materialPurge) || undefined,

        qtyGood: Number(formData.qtyGood) || 0,
        qtyPassOn: Number(formData.qtyPassOn) || 0,
        qtyHold: Number(formData.qtyHold) || 0,
        qtyWip: Number(formData.qtyWip) || 0,
        qtyReject: totalReject,

        // Convert "10" (string) to 10 (number) for backend records
        rejectBreakdown: Object.fromEntries(
          Object.entries(formData.rejects)
            .filter(([_, v]) => Number(v) > 0)
            .map(([k, v]) => [k, Number(v)])
            .concat(
              Number(formData.rejectSetup) > 0
                ? [["Reject Setup", Number(formData.rejectSetup)]]
                : [],
              Number(formData.rejectProcess) > 0
                ? [["Reject Process", Number(formData.rejectProcess)]]
                : [],
            ),
        ),
        downtimeBreakdown: Object.fromEntries(
          Object.entries(formData.downtimes)
            .filter(([_, v]) => Number(v) > 0)
            .map(([k, v]) => [k, Number(v)]),
        ),
        totalDowntime: totalDowntimeObj.total,
        notes: formData.notes,
      });
    }
  };

  const handleRejectChange = (key: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      rejects: { ...prev.rejects, [key]: val },
    }));
  };

  const handleDowntimeChange = (key: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      downtimes: { ...prev.downtimes, [key]: val },
    }));
  };

  const isRigid = lphType !== "PAPER";
  const isMoulding = lphType === "BLOW_MOULDING" || lphType === "INJECTION";
  const isSplitTabs =
    isMoulding || lphType === "PRINTING" || lphType === "PACKING_ASSEMBLY";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[200] flex h-[100dvh] max-h-[100dvh] w-full flex-col gap-0 overflow-hidden rounded-none border-slate-800 bg-slate-950 p-0 text-slate-100 sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl">
        <DialogHeader className="border-b border-slate-800 bg-slate-950 p-4 pr-10 pb-3 text-left sm:p-6 sm:pr-12 sm:pb-4">
          <div className="flex flex-col gap-2">
            <div>
              <DialogTitle className="text-lg font-bold text-slate-100 sm:text-xl">
                Laporan Produksi
              </DialogTitle>
              <DialogDescription className="mt-1 font-mono text-xs font-medium text-slate-400 sm:text-sm">
                <span className="font-bold text-blue-400">
                  {task.pro.proNumber}
                </span>
                <span className="mx-1 text-slate-600">|</span>
                {task.pro.productName}
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs sm:text-sm">
              <span className="rounded-md bg-slate-900 px-2.5 py-1 font-bold whitespace-nowrap text-slate-300">
                {lphType.replace("_", " ")}
              </span>
              <span className="whitespace-nowrap text-slate-500">
                {task.step.machine?.name} &bull; Shift {task.shift}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-slate-950">
          <form
            id="lph-form"
            onSubmit={handleSubmit}
            className="p-4 text-slate-100 sm:p-6"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4 flex h-auto w-full justify-start gap-2 overflow-x-auto bg-slate-900 p-1 sm:mb-6 sm:grid sm:grid-cols-4 sm:overflow-visible">
                <TabsTrigger
                  value="info"
                  className="min-w-fit flex-1 px-3 py-2 text-xs font-bold text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 data-[state=active]:shadow-sm sm:text-sm"
                >
                  Info
                </TabsTrigger>
                {isRigid &&
                  !isMoulding &&
                  lphType !== "PRINTING" &&
                  lphType !== "PACKING_ASSEMBLY" && (
                    <TabsTrigger
                      value="material"
                      className="min-w-fit flex-1 px-3 py-2 text-xs font-bold text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 data-[state=active]:shadow-sm sm:text-sm"
                    >
                      Material
                    </TabsTrigger>
                  )}
                <TabsTrigger
                  value="reject"
                  className="min-w-fit flex-1 px-3 py-2 text-xs font-bold text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 data-[state=active]:shadow-sm sm:text-sm"
                >
                  {isSplitTabs ? "Reject" : "Reject & Down"}
                </TabsTrigger>
                {isSplitTabs && (
                  <TabsTrigger
                    value="downtime"
                    className="min-w-fit flex-1 px-3 py-2 text-xs font-bold text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 data-[state=active]:shadow-sm sm:text-sm"
                  >
                    Downtime
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="result"
                  className="min-w-fit flex-1 px-3 py-2 text-xs font-bold text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 data-[state=active]:shadow-sm sm:text-sm"
                >
                  Output
                </TabsTrigger>
              </TabsList>

              {/* --- TAB 1: INFO & RESOURCES --- */}
              <TabsContent value="info" className="space-y-6">
                {/* Common Time */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-300">
                    <Clock className="h-4 w-4 text-blue-500" /> Waktu & Operator
                  </h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">
                        Nama Operator
                      </Label>
                      <Input
                        value={formData.operatorName}
                        disabled
                        className="border-slate-800 bg-slate-900 text-slate-400 opacity-100" // Styled to look read-only but legible
                        placeholder="Nama Operator..."
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">Shift</Label>
                      <Input
                        type="number"
                        min={1}
                        max={3}
                        value={formData.shift}
                        onChange={(e) =>
                          setFormData({ ...formData, shift: e.target.value })
                        }
                        className="w-16 border-slate-800 bg-slate-950 text-center font-bold text-slate-400"
                      />
                    </div>

                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">
                          Tgl Mulai
                        </Label>
                        <Input
                          type="date"
                          className="border-slate-800 bg-slate-950 text-slate-100 [color-scheme:dark]"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">
                          Jam Mulai
                        </Label>
                        <Input
                          type="time"
                          className="border-slate-800 bg-slate-950 text-slate-100 [color-scheme:dark] placeholder:text-slate-600"
                          value={formData.startTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="col-span-2 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">
                          Tgl Selesai
                        </Label>
                        <Input
                          type="date"
                          className="border-slate-800 bg-slate-950 text-slate-100 [color-scheme:dark]"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">
                          Jam Selesai
                        </Label>
                        <Input
                          type="time"
                          className="border-slate-800 bg-slate-950 text-slate-100 [color-scheme:dark] placeholder:text-slate-600"
                          value={formData.endTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rigid Resources */}
                {isRigid && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-300">
                      <Settings className="h-4 w-4 text-blue-500" /> Resources &
                      Params
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="col-span-2 space-y-1 md:col-span-1">
                        <Label className="text-xs font-bold text-blue-400">
                          Batch No
                        </Label>
                        <Input
                          placeholder="Lot/Batch..."
                          className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
                          value={formData.batchNo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              batchNo: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* MP - Hide Std for Injection/BM (Moulding) AND Printing AND Packing Assembly */}
                      {!isMoulding &&
                        lphType !== "PRINTING" &&
                        lphType !== "PACKING_ASSEMBLY" && (
                          <div className="space-y-1">
                            <Label className="text-xs text-slate-400">
                              MP Std
                            </Label>
                            <Input
                              type="number"
                              placeholder="0"
                              className="border-slate-800 bg-slate-950 text-slate-100"
                              value={formData.mpStd}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  mpStd: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">
                          MP Aktual
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="border-blue-900/50 bg-blue-950/20 text-blue-100"
                          value={formData.mpAct}
                          onChange={(e) =>
                            setFormData({ ...formData, mpAct: e.target.value })
                          }
                        />
                      </div>

                      {/* CT / SPEED - Hide Std for Injection/BM/Printing/Packing */}
                      {!isMoulding &&
                        lphType !== "PRINTING" &&
                        lphType !== "PACKING_ASSEMBLY" && (
                          <div className="space-y-1">
                            <Label className="text-xs text-slate-400">
                              {isRigid
                                ? "Cycle Time Std (detik)"
                                : "Speed Std (Sheet/Jam)"}
                            </Label>
                            <Input
                              type="number"
                              step={isRigid ? "0.1" : "1"}
                              placeholder="0"
                              className="border-slate-800 bg-slate-950 text-slate-100"
                              value={formData.ctStd}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  ctStd: e.target.value,
                                })
                              }
                            />
                          </div>
                        )}
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">
                          {isRigid ? "Cycle Time Act" : "Speed Act"}
                        </Label>
                        <Input
                          type="number"
                          step={isRigid ? "0.1" : "1"}
                          placeholder="0"
                          className="border-blue-900/50 bg-blue-950/20 text-blue-100"
                          value={formData.ctAct}
                          onChange={(e) =>
                            setFormData({ ...formData, ctAct: e.target.value })
                          }
                        />
                      </div>

                      {/* Cavities (Moulding) - Hide Std for Injection */}
                      {isMoulding && (
                        <>
                          {!isMoulding && (
                            <div className="space-y-1">
                              <Label className="text-xs text-slate-400">
                                Cavity Std
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                className="border-slate-800 bg-slate-950 text-slate-100"
                                value={formData.cavStd}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    cavStd: e.target.value,
                                  })
                                }
                              />
                            </div>
                          )}
                          <div className="space-y-1">
                            <Label className="text-xs text-slate-300">
                              Cavity Act
                            </Label>
                            <Input
                              type="number"
                              placeholder="0"
                              className="border-blue-900/50 bg-blue-950/20 text-blue-100"
                              value={formData.cavAct}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  cavAct: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-right">
                  <Button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        isRigid &&
                          !isMoulding &&
                          lphType !== "PRINTING" &&
                          lphType !== "PACKING_ASSEMBLY"
                          ? "material"
                          : "reject",
                      )
                    }
                    variant="outline"
                    className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Lanjut:{" "}
                    {isRigid &&
                    !isMoulding &&
                    lphType !== "PRINTING" &&
                    lphType !== "PACKING_ASSEMBLY"
                      ? "Material"
                      : "Reject & Down"}{" "}
                    &rarr;
                  </Button>
                </div>
              </TabsContent>

              {/* --- TAB 2: MATERIAL --- */}
              <TabsContent value="material" className="space-y-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-300">
                    <Layers className="h-4 w-4 text-blue-500" /> Penggunaan
                    Material
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-300">
                        {isRigid
                          ? "Total Material Tuang / Input"
                          : "Input Material (Sheet/Kg)"}
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="h-12 border-slate-700 bg-slate-950 text-lg font-bold text-slate-100 placeholder:text-slate-600"
                        value={formData.inputMaterial}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            inputMaterial: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Rigid Material - Hide Purge/Runner if Injection/BM (moved to Reject Tab) */}
                    {isRigid && !isMoulding && (
                      <>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-400">
                            Gilingan / Purge (Kg)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
                            value={formData.materialPurge}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                materialPurge: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-400">
                            Runner / PT (Kg)
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
                            value={formData.materialRunner}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                materialRunner: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("reject")}
                    variant="outline"
                    className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Lanjut: Reject & Down &rarr;
                  </Button>
                </div>
              </TabsContent>

              {/* --- TAB 3: RESULT --- */}
              {/* --- TAB 3: REJECT & DOWNTIME --- */}
              <TabsContent value="reject" className="space-y-6">
                {/* REJECT GRID */}
                {/* REJECT GRID */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold tracking-wider text-red-400 uppercase">
                    Rincian Reject
                  </h3>

                  {/* Standalone Rejects */}
                  {/* Standalone Rejects - Hide for Injection/BM AND Printing */}
                  {/* Standalone Rejects - Hide for Injection/BM AND Printing AND Packing Assembly */}
                  {!isMoulding &&
                    lphType !== "PRINTING" &&
                    lphType !== "PACKING_ASSEMBLY" && (
                      <>
                        <div className="mb-6 grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="truncate text-[10px] text-slate-500 uppercase">
                              Reject Set Up
                            </Label>
                            <Input
                              type="number"
                              placeholder="0"
                              className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-red-500"
                              value={formData.rejectSetup}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  rejectSetup: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="truncate text-[10px] text-slate-500 uppercase">
                              Reject Process
                            </Label>
                            <Input
                              type="number"
                              placeholder="0"
                              className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-red-500"
                              value={formData.rejectProcess}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  rejectProcess: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <Separator className="my-4 bg-slate-800" />
                      </>
                    )}

                  {!isMoulding &&
                    lphType !== "PRINTING" &&
                    lphType !== "PACKING_ASSEMBLY" && (
                      <h4 className="mb-3 text-xs font-bold text-slate-500 uppercase">
                        Reject Assembly
                      </h4>
                    )}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
                    {isMoulding ? (
                      // Injection/BM Split View
                      <>
                        <div className="col-span-2 md:col-span-4">
                          <div className="mb-4 flex items-center gap-4">
                            <Separator className="flex-1 bg-slate-800" />
                            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                              Reject Bahan Baku
                            </span>
                            <Separator className="flex-1 bg-slate-800" />
                          </div>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="space-y-1">
                              <Label className="truncate text-[10px] font-bold text-slate-500 uppercase">
                                Gilingan Cucian (Gram)
                              </Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-red-500"
                                value={formData.materialPurge}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    materialPurge: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="truncate text-[10px] font-bold text-slate-500 uppercase">
                                PT / Runner (Gram)
                              </Label>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-red-500"
                                value={formData.materialRunner}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    materialRunner: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-span-2 flex items-center justify-end md:col-span-2">
                              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                  Total Material Reject:
                                </span>
                                <span className="font-mono font-bold text-red-400">
                                  {(
                                    (Number(formData.materialPurge) || 0) +
                                    (Number(formData.materialRunner) || 0)
                                  ).toLocaleString("id-ID", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  Gram
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 mt-2 md:col-span-4">
                          <div className="mb-4 flex items-center gap-4">
                            <Separator className="flex-1 bg-slate-800" />
                            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                              Reject Product
                            </span>
                            <Separator className="flex-1 bg-slate-800" />
                          </div>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {REJECT_INJECTION_PRODUCT.map((label) => (
                              <div key={label} className="space-y-1">
                                <Label
                                  className="truncate text-[10px] text-slate-500 uppercase"
                                  title={label}
                                >
                                  {label}
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-red-500"
                                  value={formData.rejects[label] || ""}
                                  onChange={(e) =>
                                    handleRejectChange(label, e.target.value)
                                  }
                                />
                              </div>
                            ))}
                            <div className="col-span-2 flex items-center justify-end md:col-span-4">
                              <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                  Total Product Reject:
                                </span>
                                <span className="font-mono font-bold text-red-400">
                                  {REJECT_INJECTION_PRODUCT.reduce(
                                    (acc, key) =>
                                      acc +
                                      (Number(formData.rejects[key]) || 0),
                                    0,
                                  ).toLocaleString("id-ID")}{" "}
                                  Gram
                                </span>
                              </div>
                            </div>

                            <div className="col-span-2 mt-4 md:col-span-4">
                              <div className="mb-4 flex items-center gap-4">
                                <Separator className="flex-1 bg-slate-800" />
                                <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                  Berat Produk (Pcs/Gram)
                                </span>
                                <Separator className="flex-1 bg-slate-800" />
                              </div>
                              <div className="w-full">
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  className="h-12 w-full border-slate-800 bg-slate-950 text-center font-mono text-lg text-slate-100 placeholder:text-slate-700 focus-visible:ring-red-500"
                                  value={formData.productWeight}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      productWeight: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : lphType === "PACKING_ASSEMBLY" ? (
                      // PACKING ASSEMBLY - 6 Split Sections
                      <div className="col-span-2 md:col-span-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {REJECT_PACKING_ASSEMBLY_SPLIT.map((group, idx) => (
                            <div key={idx} className="space-y-3">
                              <h4 className="border-b border-slate-800 pb-2 text-xs font-bold text-slate-500 uppercase">
                                Bagian {idx + 1}
                              </h4>
                              <div className="grid grid-cols-2 gap-4">
                                {group.map((label) => (
                                  <div key={label} className="space-y-1">
                                    <Label
                                      className="truncate text-[10px] text-slate-500 uppercase"
                                      title={label}
                                    >
                                      {label}
                                    </Label>
                                    <Input
                                      type="number"
                                      placeholder="0"
                                      className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-red-500"
                                      value={formData.rejects[label] || ""}
                                      onChange={(e) =>
                                        handleRejectChange(
                                          label,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Standard View for Others
                      REJECT_LISTS[lphType].map((label) => (
                        <div key={label} className="space-y-1">
                          <Label
                            className="truncate text-[10px] text-slate-500 uppercase"
                            title={label}
                          >
                            {label}
                          </Label>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-red-500"
                            value={formData.rejects[label] || ""}
                            onChange={(e) =>
                              handleRejectChange(label, e.target.value)
                            }
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* DOWNTIME GRID - Only show here if NOT Split Tabs */}
                {!isSplitTabs && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-amber-500 uppercase">
                        <Zap className="h-4 w-4" /> Downtime (Menit)
                      </h3>
                      <div>Total: {totalDowntimeObj.total} mnt</div>
                    </div>

                    <div className="space-y-6">
                      {/* Unplanned */}
                      <div>
                        <h4 className="mb-3 text-xs font-bold text-slate-500 uppercase">
                          Unplanned / Breakdown
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
                          {(isRigid
                            ? DOWNTIME_LISTS.RIGID.UNPLANNED
                            : DOWNTIME_LISTS.PAPER.UNPLANNED
                          ).map((label) => (
                            <div key={label} className="space-y-1">
                              <Label
                                className="truncate text-[10px] text-slate-500 uppercase"
                                title={label}
                              >
                                {label}
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-amber-500"
                                value={
                                  formData.downtimes[`UNPLANNED:${label}`] || ""
                                }
                                onChange={(e) =>
                                  handleDowntimeChange(
                                    `UNPLANNED:${label}`,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="bg-slate-800" />

                      {/* Planned */}
                      <div>
                        <h4 className="mb-3 text-xs font-bold text-slate-500 uppercase">
                          Planned Downtime
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
                          {(isRigid
                            ? DOWNTIME_LISTS.RIGID.PLANNED
                            : DOWNTIME_LISTS.PAPER.PLANNED
                          ).map((label) => (
                            <div key={label} className="space-y-1">
                              <Label
                                className="truncate text-[10px] text-slate-500 uppercase"
                                title={label}
                              >
                                {label}
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-blue-500"
                                value={
                                  formData.downtimes[`PLANNED:${label}`] || ""
                                }
                                onChange={(e) =>
                                  handleDowntimeChange(
                                    `PLANNED:${label}`,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-1.5">
                      <Label className="text-xs font-bold text-slate-300">
                        Catatan / Keterangan Masalah
                      </Label>
                      <Textarea
                        placeholder="Tulis detail masalah atau catatan lainnya..."
                        className="resize-none border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-600"
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="text-right">
                  <Button
                    type="button"
                    onClick={() =>
                      setActiveTab(isSplitTabs ? "downtime" : "result")
                    }
                    variant="outline"
                    className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Lanjut: {isSplitTabs ? "Downtime" : "Output"} &rarr;
                  </Button>
                </div>
              </TabsContent>

              {/* --- TAB 4: REJECT & DOWNTIME --- */}
              {/* --- TAB 3.5: DOWNTIME (Standalone for Injection) --- */}
              <TabsContent value="downtime" className="space-y-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-amber-500 uppercase">
                      <Zap className="h-4 w-4" /> Downtime (Menit)
                    </h3>
                    <div>Total: {totalDowntimeObj.total} mnt</div>
                  </div>

                  <div className="space-y-6">
                    {/* Unplanned */}
                    {isMoulding ||
                    lphType === "PRINTING" ||
                    lphType === "PACKING_ASSEMBLY" ? (
                      // Injection split
                      <div className="space-y-6">
                        {/* 1. Loss Hour (Planned) */}
                        <div>
                          <div className="mb-4 flex items-center gap-4">
                            <Separator className="flex-1 bg-slate-800" />
                            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                              Loss Hour
                            </span>
                            <Separator className="flex-1 bg-slate-800" />
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
                            {(lphType === "PRINTING"
                              ? LOSS_HOUR_PRINTING
                              : lphType === "PACKING_ASSEMBLY"
                                ? LOSS_HOUR_PACKING_ASSEMBLY
                                : LOSS_HOUR_INJECTION
                            ).map((label) => (
                              <div key={label} className="space-y-1">
                                <Label
                                  className="truncate text-[10px] text-slate-500 uppercase"
                                  title={label}
                                >
                                  {label}
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-blue-500"
                                  value={
                                    formData.downtimes[`PLANNED:${label}`] || ""
                                  }
                                  onChange={(e) =>
                                    handleDowntimeChange(
                                      `PLANNED:${label}`,
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 2. Downtime (Unplanned) */}
                        <div>
                          <div className="mb-4 flex items-center gap-4">
                            <Separator className="flex-1 bg-slate-800" />
                            <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                              Downtime
                            </span>
                            <Separator className="flex-1 bg-slate-800" />
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
                            {(lphType === "PRINTING"
                              ? DOWNTIME_PRINTING_LIST
                              : lphType === "PACKING_ASSEMBLY"
                                ? DOWNTIME_PACKING_ASSEMBLY_LIST
                                : DOWNTIME_INJECTION_LIST
                            ).map((label) => (
                              <div key={label} className="space-y-1">
                                <Label
                                  className="truncate text-[10px] text-slate-500 uppercase"
                                  title={label}
                                >
                                  {label}
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-amber-500"
                                  value={formData.downtimes[label] || ""}
                                  onChange={(e) =>
                                    handleDowntimeChange(label, e.target.value)
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // STANDARD VIEW (Printing / Split Others)
                      <div>
                        <h4 className="mb-3 text-xs font-bold text-slate-500 uppercase">
                          Unplanned / Breakdown
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
                          {(isRigid
                            ? DOWNTIME_LISTS.RIGID.UNPLANNED
                            : DOWNTIME_LISTS.PAPER.UNPLANNED
                          ).map((label) => (
                            <div key={label} className="space-y-1">
                              <Label
                                className="truncate text-[10px] text-slate-500 uppercase"
                                title={label}
                              >
                                {label}
                              </Label>
                              <Input
                                type="number"
                                placeholder="0"
                                className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-amber-500"
                                value={
                                  formData.downtimes[`UNPLANNED:${label}`] || ""
                                }
                                onChange={(e) =>
                                  handleDowntimeChange(
                                    `UNPLANNED:${label}`,
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Separator className="bg-slate-800" />

                    {/* Planned - Hide for PRINTING & PACKING_ASSEMBLY */}
                    {lphType !== "PRINTING" &&
                      lphType !== "PACKING_ASSEMBLY" && (
                        <div>
                          <h4 className="mb-3 text-xs font-bold text-slate-500 uppercase">
                            Planned Downtime
                          </h4>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
                            {(isRigid
                              ? DOWNTIME_LISTS.RIGID.PLANNED
                              : DOWNTIME_LISTS.PAPER.PLANNED
                            ).map((label) => (
                              <div key={label} className="space-y-1">
                                <Label
                                  className="truncate text-[10px] text-slate-500 uppercase"
                                  title={label}
                                >
                                  {label}
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  className="h-9 border-slate-800 bg-slate-950 text-right font-mono text-sm text-slate-100 placeholder:text-slate-700 focus-visible:ring-blue-500"
                                  value={
                                    formData.downtimes[`PLANNED:${label}`] || ""
                                  }
                                  onChange={(e) =>
                                    handleDowntimeChange(
                                      `PLANNED:${label}`,
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="mt-6 space-y-1.5">
                    <Label className="text-xs font-bold text-slate-300">
                      Catatan / Keterangan Masalah
                    </Label>
                    <Textarea
                      placeholder="Tulis detail masalah atau catatan lainnya..."
                      className="resize-none border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-600"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="text-right">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("result")}
                    variant="outline"
                    className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Lanjut: Output &rarr;
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="result" className="space-y-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-300">
                    <Package className="h-4 w-4 text-emerald-500" /> Hasil
                    Produksi (Output)
                  </h3>
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {/* IF PAPER: Pass On is the New Finish Good (Prominent) */}
                    <div className="col-span-2 space-y-1.5">
                      <Label className="text-xs font-bold text-emerald-500">
                        PASS ON
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        className="h-14 border-emerald-900/50 bg-emerald-950/30 text-2xl font-black text-emerald-500 placeholder:text-emerald-900/50"
                        value={formData.qtyPassOn}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            qtyPassOn: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">WIP</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
                        value={formData.qtyWip}
                        onChange={(e) =>
                          setFormData({ ...formData, qtyWip: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">HOLD</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
                        value={formData.qtyHold}
                        onChange={(e) =>
                          setFormData({ ...formData, qtyHold: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-red-400">
                        <AlertTriangle className="h-4 w-4" /> Total Reject
                      </h3>
                      <p className="mt-1 text-xs text-red-400/70">
                        Dihitung otomatis dari tab Reject
                      </p>
                    </div>
                    <div className="text-3xl font-black text-red-500">
                      {totalReject.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>

                {isRigid &&
                  !isMoulding &&
                  lphType !== "PRINTING" &&
                  lphType !== "PACKING_ASSEMBLY" && (
                    <div className="rounded-xl border border-blue-800 bg-blue-950/20 p-4 shadow-sm">
                      <h3 className="mb-4 flex items-center justify-between gap-2 text-sm font-bold text-blue-400">
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4" /> Quick Report
                          (Estimasi)
                        </div>
                        {/* Formula button removed */}
                      </h3>

                      {/* Formula text removed */}

                      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                        <div className="space-y-1 rounded-lg bg-slate-950 p-3">
                          <Label className="text-[10px] text-slate-500 uppercase">
                            Total Waktu
                          </Label>
                          <div className="text-xl font-bold text-slate-200">
                            {totalTimeMinutes.toFixed(0)}{" "}
                            <span className="text-sm font-normal text-slate-500">
                              mnt
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1 rounded-lg bg-slate-950 p-3">
                          <Label className="text-[10px] text-slate-500 uppercase">
                            Operating Time
                          </Label>
                          <div className="text-xl font-bold text-slate-200">
                            {(
                              totalTimeMinutes - totalDowntimeObj.total
                            ).toFixed(0)}{" "}
                            <span className="text-sm font-normal text-slate-500">
                              mnt
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1 rounded-lg bg-slate-950 p-3">
                          <Label className="text-[10px] text-slate-500 uppercase">
                            Availability
                          </Label>
                          <div
                            className={`text-xl font-bold ${availability >= 90 ? "text-emerald-400" : "text-amber-400"}`}
                          >
                            {availability.toFixed(1)}%
                            <p className="mt-1 text-[10px] font-normal text-slate-500">
                              • Availability = (Operating Time / (Total Time -
                              Planned Downtime)) × 100
                            </p>
                          </div>
                        </div>
                        <div className="space-y-1 rounded-lg bg-slate-950 p-3">
                          <Label className="text-[10px] text-slate-500 uppercase">
                            Performance
                          </Label>
                          <div
                            className={`text-xl font-bold ${performance >= 90 ? "text-emerald-400" : "text-amber-400"}`}
                          >
                            {valStd > 0 ? (
                              <>
                                {performance.toFixed(1)}%
                                <div className="mt-1 space-y-0.5 text-[10px] font-normal text-slate-500">
                                  <div>
                                    Kapasitas: {targetOutput.toLocaleString()}
                                  </div>
                                  <div
                                    className="text-slate-600"
                                    title="Speed Mesin"
                                  >
                                    Spd: {speedPerMin.toFixed(0)}/m |{" "}
                                    {speedPerHour.toLocaleString()}/h
                                  </div>
                                </div>
                              </>
                            ) : (
                              <span className="text-xs font-medium text-red-400">
                                Isi CT Std
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1 rounded-lg bg-slate-950 p-3">
                          <Label className="text-[10px] text-slate-500 uppercase">
                            Quality
                          </Label>
                          <div
                            className={`text-xl font-bold ${quality >= 90 ? "text-emerald-400" : "text-amber-400"}`}
                          >
                            {quality.toFixed(1)}%
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-between rounded-lg border border-blue-800/50 bg-blue-900/20 p-3 md:col-span-5">
                          <Label className="text-xs font-bold text-blue-300 uppercase">
                            OEE Score
                          </Label>
                          <div
                            className={`text-2xl font-black ${oee >= 85 ? "text-emerald-400" : oee >= 60 ? "text-amber-400" : "text-red-400"}`}
                          >
                            {oee.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </TabsContent>
            </Tabs>
          </form>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-4 border-t border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:justify-start">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500 italic">
              <Save className="h-3 w-3" /> Auto-saved
            </span>
            <button
              type="button"
              onClick={() => {
                const isPaper = lphType === "PAPER";
                let prefilledCtStd = "";
                if (task?.step.machine) {
                  const m = task.step.machine;
                  if (isPaper && m.stdOutputPerHour) {
                    prefilledCtStd = String(m.stdOutputPerHour);
                  } else if (!isPaper && m.cycleTimeSec) {
                    prefilledCtStd = String(m.cycleTimeSec);
                  }
                }

                if (confirm("Reset formulir & hapus draft?")) {
                  skipNextSave.current = true;
                  setFormData({
                    startTime: new Date().toTimeString().slice(0, 5),
                    endTime: "",
                    startDate: new Date().toISOString().slice(0, 10),
                    endDate: new Date().toISOString().slice(0, 10),
                    shift: String(task?.shift || 1),
                    operatorName: session?.user?.name || "",
                    batchNo: "",
                    mpStd: "",
                    mpAct: "",
                    ctStd: prefilledCtStd,
                    ctAct: "",
                    cavStd: "",
                    cavAct: "",
                    inputMaterial: "",
                    materialRunner: "",
                    materialPurge: "",
                    productWeight: "",
                    qtyGood: "",
                    qtyPassOn: "",
                    qtyWip: "",
                    qtyHold: "",
                    rejectSetup: "",
                    rejectProcess: "",
                    rejects: {},
                    downtimes: {},
                    notes: "",
                  });
                  if (draftKey) localStorage.removeItem(draftKey);
                  window.dispatchEvent(new Event("draft-update")); // Trigger update for other components
                  onDraftChange?.();
                  onOpenChange(false);
                }
              }}
              className="mr-auto text-xs font-semibold text-red-500 underline hover:text-red-400"
            >
              Reset / Hapus Draft
            </button>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 text-slate-400 hover:bg-slate-900 hover:text-slate-200 sm:flex-none"
            >
              Batal
            </Button>
            <Button
              form="lph-form"
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 px-8 font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700 sm:flex-none"
            >
              {loading ? "Menyimpan..." : "Simpan Laporan"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
