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
}

export function ProductionReportModal({
  open,
  onOpenChange,
  task,
}: ProductionReportModalProps) {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = React.useState("info");
  const [loading, setLoading] = React.useState(false);
  // const [showRumus, setShowRumus] = React.useState(false); // Removed formula toggle

  // Initial State derived from task
  const [lphType, setLphType] = React.useState<LphType>("PAPER");

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

  const totalDowntime = React.useMemo(() => {
    return Object.values(formData.downtimes).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0,
    );
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

    const operatingTime = tMin - totalDowntime;
    const av = tMin > 0 ? (operatingTime / tMin) * 100 : 0;

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
    totalDowntime,
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
              parsed.operatorName = ""; // Explicitly empty
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
            operatorName: "", // Start empty per user request
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
    }
  }, [open, task, draftKey, session]);

  // Auto Save
  React.useEffect(() => {
    if (open && draftKey) {
      localStorage.setItem(draftKey, JSON.stringify(formData));
    }
  }, [formData, open, draftKey]);

  if (!task) return null;

  const utils = api.useUtils();
  const createReportMutation = api.production.createReport.useMutation({
    onSuccess: () => {
      utils.production.getHistory.invalidate(); // Refresh history
      alert("Laporan berhasil disimpan!");
      if (draftKey) localStorage.removeItem(draftKey);
      setLoading(false);
      onOpenChange(false);
    },
    onError: (err) => {
      console.error(err);
      alert("Gagal menyimpan laporan: " + err.message);
      setLoading(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
                 Number(formData.rejectSetup) > 0 ? [["Reject Setup", Number(formData.rejectSetup)]] : [],
                 Number(formData.rejectProcess) > 0 ? [["Reject Process", Number(formData.rejectProcess)]] : []
            )
        ),
        downtimeBreakdown: Object.fromEntries(
             Object.entries(formData.downtimes)
             .filter(([_, v]) => Number(v) > 0)
             .map(([k, v]) => [k, Number(v)])
        ),
        totalDowntime: totalDowntime,
        notes: formData.notes
    });
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
                  Info & Params
                </TabsTrigger>
                <TabsTrigger
                  value="material"
                  className="min-w-fit flex-1 px-3 py-2 text-xs font-bold text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 data-[state=active]:shadow-sm sm:text-sm"
                >
                  Material
                </TabsTrigger>
                <TabsTrigger
                  value="reject"
                  className="min-w-fit flex-1 px-3 py-2 text-xs font-bold text-slate-400 data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 data-[state=active]:shadow-sm sm:text-sm"
                >
                  Reject & Down
                </TabsTrigger>
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
                        onChange={(e) =>
                          setFormData({ ...formData, operatorName: e.target.value })
                        }
                        className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
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

                      {/* MP */}
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">MP Std</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          className="border-slate-800 bg-slate-950 text-slate-100"
                          value={formData.mpStd}
                          onChange={(e) =>
                            setFormData({ ...formData, mpStd: e.target.value })
                          }
                        />
                      </div>
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

                      {/* CT / SPEED */}
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
                            setFormData({ ...formData, ctStd: e.target.value })
                          }
                        />
                      </div>
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

                      {/* Cavities (Moulding) */}
                      {isMoulding && (
                        <>
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
                    onClick={() => setActiveTab("material")}
                    variant="outline"
                    className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    Lanjut: Material &rarr;
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

                    {isRigid && (
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

                  <h4 className="mb-3 text-xs font-bold text-slate-500 uppercase">
                    Reject Assembly
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
                    {REJECT_LISTS[lphType].map((label) => (
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
                  </div>
                </div>

                {/* DOWNTIME GRID */}
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-amber-500 uppercase">
                      <Zap className="h-4 w-4" /> Downtime (Menit)
                    </h3>
                    <div className="text-sm font-black text-amber-500">
                      Total: {totalDowntime} mnt
                    </div>
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
                              value={formData.downtimes[label] || ""}
                              onChange={(e) =>
                                handleDowntimeChange(label, e.target.value)
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

              {/* --- TAB 4: REJECT & DOWNTIME --- */}
              {/* --- TAB 3: REJECT & DOWNTIME --- */}
              {/* --- TAB 4: RESULT (OUTPUT) --- */}
              <TabsContent value="result" className="space-y-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-300">
                    <Package className="h-4 w-4 text-emerald-500" /> Hasil
                    Produksi (Output)
                  </h3>
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                    {/* IF PAPER: Pass On is the New Finish Good (Prominent) */}
                    {!isRigid ? (
                      <div className="col-span-2 space-y-1.5">
                        <Label className="text-xs font-bold text-emerald-500">
                          FINISH GOOD (PASS ON)
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
                    ) : (
                      // IF RIGID: Keep Original (Good + Pass On separated)
                      <>
                        <div className="col-span-2 space-y-1.5">
                          <Label className="text-xs font-bold text-emerald-500">
                            GOOD / FINISH GOOD
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0"
                            className="h-14 border-emerald-900/50 bg-emerald-950/30 text-2xl font-black text-emerald-500 placeholder:text-emerald-900/50"
                            value={formData.qtyGood}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                qtyGood: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs text-slate-400">
                            PASS ON
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0"
                            className="border-slate-800 bg-slate-950 text-slate-100 placeholder:text-slate-600"
                            value={formData.qtyPassOn}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                qtyPassOn: e.target.value,
                              })
                            }
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-1.5">
                      <Label className="text-xs text-slate-400">
                        WIP (Work In Progress)
                      </Label>
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
                      <Label className="text-xs text-slate-400">
                        HOLD / QC
                      </Label>
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

                <div className="rounded-xl border border-blue-800 bg-blue-950/20 p-4 shadow-sm">
                  <h3 className="mb-4 flex items-center justify-between gap-2 text-sm font-bold text-blue-400">
                    <div className="flex items-center gap-2">
                       <History className="h-4 w-4" /> Quick Report (Estimasi)
                    </div>
                    {/* Formula button removed */}
                  </h3>

                  {/* Formula text removed */}


                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
                        Availability
                      </Label>
                      <div
                        className={`text-xl font-bold ${availability >= 90 ? "text-emerald-400" : "text-amber-400"}`}
                      >
                        {availability.toFixed(1)}%
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
                            Isi {lphType === "PAPER" ? "Speed" : "CT"} Std
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
                    <div className="col-span-2 flex items-center justify-between rounded-lg border border-blue-800/50 bg-blue-900/20 p-3 md:col-span-4">
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
              </TabsContent>
            </Tabs>
          </form>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between border-t border-slate-800 bg-slate-950 p-4 sm:p-6">
          <span className="mr-auto flex items-center gap-1.5 text-[10px] text-slate-500 italic">
            <Save className="h-3 w-3" /> Auto-saved
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:bg-slate-900 hover:text-slate-200"
            >
              Batal
            </Button>
            <Button
              form="lph-form"
              type="submit"
              disabled={loading}
              className="bg-blue-600 px-8 font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-700"
            >
              {loading ? "Menyimpan..." : "Simpan Laporan"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
