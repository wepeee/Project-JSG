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

const DOWNTIME_LISTS: Record<string, string[]> = {
  PAPER: [
    "Tunggu Approval",
    "Tunggu Material",
    "Set Up & Change Over",
    "Machine Problem",
    "Mencari Tools",
    "Running In",
    "Operator Issue",
    "Adjustment Process",
    "Istirahat",
    "Trial",
    "Preventive",
    "Lain-lain",
  ],
  RIGID: [
    "No Order",
    "Istirahat",
    "Clean / CIL",
    "Trial",
    "Preventive",
    "Loss HS",
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
    "Lain-lain",
  ],
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

  // Initial State derived from task
  const [lphType, setLphType] = React.useState<LphType>("PAPER");

  // Form Data State
  const [formData, setFormData] = React.useState({
    startTime: "",
    endTime: "",

    // Rigid Resources
    batchNo: "",
    mpStd: "",
    mpAct: "",
    ctStd: "",
    ctAct: "",
    cavStd: "",
    cavAct: "",

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
    rejects: {} as Record<string, string>,

    // Downtime (Dynamic Key-Value)
    downtimes: {} as Record<string, string>,

    notes: "",
  });

  // Calculate Totals
  const totalReject = React.useMemo(() => {
    return Object.values(formData.rejects).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0,
    );
  }, [formData.rejects]);

  const totalDowntime = React.useMemo(() => {
    return Object.values(formData.downtimes).reduce(
      (acc, val) => acc + (Number(val) || 0),
      0,
    );
  }, [formData.downtimes]);

  // Draft Logic
  const draftKey = React.useMemo(
    () => (task ? `pro_report_v2_${task.step.id}` : ""),
    [task],
  );

  React.useEffect(() => {
    if (open && task) {
      // 1. Detect Type
      const type = getLphType(task.pro, task.step.machine?.name || "");
      setLphType(type);

      // 2. Load Draft
      if (draftKey) {
        const saved = localStorage.getItem(draftKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setFormData((prev) => ({ ...prev, ...parsed }));
          } catch (e) {
            console.error("Bad draft", e);
          }
        } else {
          // Reset form
          setFormData({
            startTime: new Date().toTimeString().slice(0, 5),
            endTime: "",
            batchNo: "",
            mpStd: task.step.manPowerStd ? String(task.step.manPowerStd) : "",
            mpAct: "",
            ctStd: task.step.cycleTimeStd ? String(task.step.cycleTimeStd) : "",
            ctAct: "",
            cavStd: task.step.cavityStd ? String(task.step.cavityStd) : "",
            cavAct: "",
            inputMaterial: "",
            materialRunner: "",
            materialPurge: "",
            qtyGood: "",
            qtyPassOn: "",
            qtyWip: "",
            qtyHold: "",
            rejects: {},
            downtimes: {},
            notes: "",
          });
        }
      }
    }
  }, [open, task, draftKey]);

  // Auto Save
  React.useEffect(() => {
    if (open && draftKey) {
      localStorage.setItem(draftKey, JSON.stringify(formData));
    }
  }, [formData, open, draftKey]);

  if (!task) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Connect to trpc mutation
    console.log("Submitting:", {
      ...formData,
      lphType,
      operator: session?.user?.name,
    });

    setTimeout(() => {
      alert("Laporan tersimpan (Mock)!");
      if (draftKey) localStorage.removeItem(draftKey);
      setLoading(false);
      onOpenChange(false);
    }, 800);
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
                        value={session?.user?.name || ""}
                        readOnly
                        className="border-slate-800 bg-slate-950 text-slate-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">Shift</Label>
                      <Input
                        value={task.shift}
                        readOnly
                        className="w-16 border-slate-800 bg-slate-950 text-center font-bold text-slate-400"
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
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-300">
                        Jam Selesai
                      </Label>
                      <Input
                        type="time"
                        className="border-slate-800 bg-slate-950 text-slate-100 [color-scheme:dark] placeholder:text-slate-600"
                        value={formData.endTime}
                        onChange={(e) =>
                          setFormData({ ...formData, endTime: e.target.value })
                        }
                      />
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

                      {/* CT */}
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-400">
                          Cycle Time Std
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
                          className="border-slate-800 bg-slate-950 text-slate-100"
                          value={formData.ctStd}
                          onChange={(e) =>
                            setFormData({ ...formData, ctStd: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-slate-300">
                          Cycle Time Act
                        </Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="0.0"
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
                <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
                  <h3 className="mb-4 text-sm font-bold tracking-wider text-red-400 uppercase">
                    Rincian Reject
                  </h3>
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

                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:grid-cols-4">
                    {(isRigid
                      ? DOWNTIME_LISTS.RIGID
                      : DOWNTIME_LISTS.PAPER
                    )?.map((label) => (
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
                          setFormData({ ...formData, qtyGood: e.target.value })
                        }
                      />
                    </div>
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
