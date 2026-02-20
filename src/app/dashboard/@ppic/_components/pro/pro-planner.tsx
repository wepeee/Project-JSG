"use client";

import * as React from "react";
import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Upload, Plus } from "lucide-react";

type StepDraftMaterial = {
  key: string;
  materialId: number | null;
  qtyReq: string;
};

type StepDraft = {
  key: string;
  up: string;
  machineId: number | null;
  materials: StepDraftMaterial[];
  startDate: string;
  partNumber?: string;
  batchNo?: string;
};

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function newStep(): StepDraft {
  return {
    key: uid(),
    up: "",
    machineId: null,
    materials: [{ key: uid(), materialId: null, qtyReq: "" }],
    startDate: "",
    partNumber: "",
    batchNo: "",
  };
}

// Simple CSV Parser
function parseCSV(text: string) {
  const result: string[][] = [];
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    if (!line.trim()) continue;

    const row: string[] = [];
    let curVal = "";
    let insideQuote = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (insideQuote) {
        if (char === '"') {
          // Check if next is quote (escape)
          if (i + 1 < line.length && line[i + 1] === '"') {
            curVal += '"';
            i++;
          } else {
            insideQuote = false;
          }
        } else {
          curVal += char;
        }
      } else {
        if (char === '"') {
          insideQuote = true;
        } else if (char === ",") {
          row.push(curVal.trim());
          curVal = "";
        } else {
          curVal += char;
        }
      }
    }
    row.push(curVal.trim()); // Last col
    result.push(row);
  }
  return result;
}

export default function ProPlanner() {
  // Header PRO
  const [productName, setProductName] = React.useState("");
  const [partNumber, setPartNumber] = React.useState(""); // Added
  const [processId, setProcessId] = React.useState<number | null>(null);
  const [qtyPoPcs, setQtyPoPcs] = React.useState<string>("");
  const [proType, setProType] = React.useState<"PAPER" | "RIGID" | "OTHER">(
    "PAPER",
  ); // Added
  const [manualProNumber, setManualProNumber] = React.useState("");
  const [headerBatchNo, setHeaderBatchNo] = React.useState(""); // Added for RIGID batch

  const utils = api.useUtils();
  const processes = api.processes.list.useQuery({ type: proType });
  const machines = api.machines.list.useQuery({
    // @ts-ignore
    type: proType === "OTHER" ? undefined : proType,
  });
  const materials = api.materials.list.useQuery({
    type: proType === "OTHER" ? undefined : proType,
  });

  const createPro = api.pros.create.useMutation({
    onSuccess: async (created) => {
      await utils.pros.list.invalidate();
      await utils.pros.getSchedule.invalidate();
      setOk(`PRO dibuat: ${created.proNumber}`);
      setProductName("");
      setPartNumber(""); // Reset
      // setProcessId(null);
      // setProType("PAPER"); // Keep selected type for convenience
      setQtyPoPcs("");
      setManualProNumber("");
      setHeaderBatchNo("");
      setSteps([]);
    },
  });

  const loadingMaster =
    processes.isLoading || machines.isLoading || materials.isLoading;

  // Steps
  const [steps, setSteps] = React.useState<StepDraft[]>([]);

  const [open, setOpen] = React.useState(false);
  const [editKey, setEditKey] = React.useState<string | null>(null);

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((i) => i.key === active.id);
        const newIndex = items.findIndex((i) => i.key === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  const [draft, setDraft] = React.useState<StepDraft>(newStep());

  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getProcess = (id: number | null) =>
    id ? ((processes.data ?? []).find((p) => p.id === id) ?? null) : null;

  const getMachine = (id: number | null) =>
    id ? ((machines.data ?? []).find((m) => m.id === id) ?? null) : null;

  const getMaterial = (id: number | null) =>
    id ? ((materials.data ?? []).find((m) => m.id === id) ?? null) : null;

  // CSV Import Logic
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr(null);
    setOk(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      if (rows.length < 2) {
        throw new Error("Format CSV tidak valid (terlalu pendek)");
      }

      const machineList = machines.data ?? [];
      const materialList = materials.data ?? [];
      const processList = processes.data ?? [];

      const newSteps: StepDraft[] = [];
      let foundHeaderInfo = false;
      let lastProductName = "";

      // Helper for loose matching
      const normalize = (s: string) =>
        s.replace(/\s+/g, " ").trim().toLowerCase();

      // RIGID CSV FORMAT
      if (proType === "RIGID") {
        // Rigid CSV columns:
        // 0: BATCH, 1: PART NUMBER, 2: MACHINE, 3: Production Order, 4: Name,
        // 5: Total Lpr Lembar, 6: Qty Order, 7: Schedule in PCS, 8: Start End, 9: Material, 10: Qty

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (!cols || cols.length < 3) continue;

          const batchNo = cols[0]?.trim() ?? "";
          const partNum = cols[1]?.trim() ?? "";
          const machineName = cols[2]?.trim() ?? "";
          const proNumCsv = cols[3]?.trim() ?? "";
          const productNameCsv = cols[4]?.trim() ?? "";
          const totalLpr = cols[5]?.trim() ?? "";
          const qtyOrderStr = cols[6]?.trim() ?? "";
          // Col 7 is Start Date in screenshot (H)
          const dateStr = cols[7]?.trim() ?? "";
          // Col 8 is End Date (I)
          // Col 9 is Material (J)
          const materialName = cols[9]?.trim() ?? "";
          // Col 10 is Qty (K)
          const qtyStr = cols[10]?.trim() ?? "";

          if (productNameCsv) lastProductName = productNameCsv;

          // Capture Batch No from first valid row (if not yet found)
          if (!foundHeaderInfo && batchNo) {
            setHeaderBatchNo(batchNo);
          }

          if (!machineName) continue; // Skip empty rows

          // Set header info from first valid row
          if (!foundHeaderInfo && qtyOrderStr) {
            const cleanedQty = qtyOrderStr.replace(/\./g, "").replace(/,/g, "");
            if (!isNaN(Number(cleanedQty))) {
              setQtyPoPcs(cleanedQty);
              foundHeaderInfo = true;
            }

            if (proNumCsv) {
              setManualProNumber(proNumCsv);

              // Auto-detect process from first 2 chars
              // User reported issue with PRO read, ensure we trim
              const safePro = proNumCsv.trim();
              const prefix = safePro.substring(0, 2).toUpperCase();
              const foundProc = processList.find((p) => p.code === prefix);
              if (foundProc) {
                setProcessId(foundProc.id);
              }
            }
          }

          // Machine Match
          const mach = machineList.find(
            (m) => normalize(m.name) === normalize(machineName),
          );

          // Date Parsing: Check Col 7 (Start?) and Col 8 (End?)
          // We want the earlier date as Start Date.
          const dateStrA = cols[7]?.trim() ?? "";
          const dateStrB = cols[8]?.trim() ?? "";

          const parseDate = (s: string) => {
            if (!s) return null;
            // Check for DD/MM/YYYY or DD-MM-YYYY
            const dmy = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
            if (dmy) {
              const day = dmy[1]!.padStart(2, "0");
              const month = dmy[2]!.padStart(2, "0");
              const year = dmy[3];
              return new Date(`${year}-${month}-${day}`);
            }
            const d = new Date(s);
            return !isNaN(d.getTime()) ? d : null;
          };

          const dA = parseDate(dateStrA);
          const dB = parseDate(dateStrB);

          let formattedDate = "";
          if (dA && dB) {
            // Pick earlier
            formattedDate = (dA < dB ? dA : dB).toISOString().split("T")[0]!;
          } else if (dA) {
            formattedDate = dA.toISOString().split("T")[0]!;
          } else if (dB) {
            formattedDate = dB.toISOString().split("T")[0]!;
          }

          // Materials (Support "MatA+MatB" and "QtyA+QtyB")
          const stepMats: StepDraftMaterial[] = [];

          const matNames = materialName.split("+");
          const matQties = qtyStr.split("+");

          // Helper to parse numeric string (1.000,5 -> 1000.5)
          const parseVal = (s: string) => {
            if (!s) return "";
            if (s.includes(",")) return s.replace(/\./g, "").replace(",", ".");
            // If dots exist
            const parts = s.split(".");
            if (parts.length > 2) return s.replace(/\./g, ""); // 1.000.000 -> 1000000
            if (parts.length === 2 && parts[1]?.length === 3)
              return s.replace(/\./g, ""); // 1.000 -> 1000
            return s;
          };

          for (let k = 0; k < matNames.length; k++) {
            const mNameRaw = matNames[k]?.trim();
            if (!mNameRaw) continue;

            const mQtyRaw = matQties[k]?.trim();
            let mQty = "";
            if (mQtyRaw) {
              mQty = parseVal(mQtyRaw);
            }

            // Match material (Normalized)
            const nSearch = normalize(mNameRaw);
            let foundMat = materialList.find(
              (m) => normalize(m.name) === nSearch,
            );

            // Fallback: Partial Match
            if (!foundMat) {
              const candidates = materialList.filter((m) => {
                const nDb = normalize(m.name);
                return nDb.includes(nSearch) || nSearch.includes(nDb);
              });

              if (candidates.length === 1) {
                foundMat = candidates[0];
              }
            }

            stepMats.push({
              key: uid(),
              materialId: foundMat ? foundMat.id : null,
              qtyReq: mQty,
            });
          }

          newSteps.push({
            key: uid(),
            up: totalLpr || "1",
            machineId: mach ? mach.id : null,
            startDate: formattedDate,
            partNumber: partNum || "",
            // batchNo: batchNo || "", // Removed per request, use header
            materials: stepMats,
          });
        }
      }
      // PAPER CSV FORMAT (existing logic)
      else {
        let detectedUp = "";

        for (let i = 1; i < rows.length; i++) {
          const cols = rows[i];
          if (!cols || cols.length < 2) continue;

          // machine
          const machineName = cols[1]?.trim() ?? "";
          const nameVal = cols[3]?.trim();
          if (nameVal) lastProductName = nameVal;

          if (!machineName) continue; // Skip empty rows

          // Check for header info row (has Qty Order)
          const qtyOrderStr = cols[5]?.trim();
          const totalUpStr = cols[4]?.trim();
          const proNumCsv = cols[2]?.trim(); // Production Order

          // If this row has Qty Order, treat it as Header info source
          if (qtyOrderStr && !foundHeaderInfo) {
            const cleanedQty = qtyOrderStr.replace(/\./g, "").replace(/,/g, ""); // Remove dots/commas
            if (!isNaN(Number(cleanedQty))) {
              setQtyPoPcs(cleanedQty);
              foundHeaderInfo = true;
            }

            // Global UP
            if (totalUpStr) {
              detectedUp = totalUpStr;
            }

            if (proNumCsv) {
              setManualProNumber(proNumCsv);

              // Auto-detect process from first 2 chars
              const prefix = proNumCsv.substring(0, 2).toUpperCase();
              const foundProc = processList.find((p) => p.code === prefix);
              if (foundProc) {
                setProcessId(foundProc.id);
              }
            }
          }

          const partNum = cols[0]?.trim();

          // --- Create Step ---
          // 1. Machine Match (Normalized)
          const mach = machineList.find(
            (m) => normalize(m.name) === normalize(machineName),
          );

          // 2. Start Date (Try parsing DD/MM/YYYY, DD-MM-YYYY, or standard)
          const dateStr = cols[6]?.trim();
          let formattedDate = "";

          if (dateStr) {
            // Check for DD/MM/YYYY or DD-MM-YYYY
            const dmy = dateStr.match(
              /^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/,
            );
            if (dmy) {
              const day = dmy[1]!.padStart(2, "0");
              const month = dmy[2]!.padStart(2, "0");
              const year = dmy[3];
              formattedDate = `${year}-${month}-${day}`;
            } else {
              const d = new Date(dateStr);
              if (!isNaN(d.getTime())) {
                formattedDate = d.toISOString().split("T")[0]!;
              }
            }
          }

          // 3. Materials
          // Split by '+'
          // Format: ..., 8:Material, 9:Qty (Shifted due to removed UoM)
          const matNames = (cols[8]?.trim() ?? "").split("+");
          // Qty Logic: Try Col 9, Fallback Col 10
          let qtyColVal = cols[9]?.trim();
          if (!qtyColVal) {
            const c10 = cols[10]?.trim();
            if (c10 && /[0-9]/.test(c10)) qtyColVal = c10;
          }
          const matQties = (qtyColVal ?? "").split("+");

          const stepMats: StepDraftMaterial[] = [];

          for (let k = 0; k < matNames.length; k++) {
            const mNameRaw = matNames[k]?.trim();
            if (!mNameRaw) continue;

            const mQtyRaw = matQties[k]?.trim();

            // Robust Qty Parse
            let mQty = "";
            const parseVal = (s: string) => {
              if (s.includes(","))
                return s.replace(/\./g, "").replace(",", ".");
              const parts = s.split(".");
              if (parts.length > 2) return s.replace(/\./g, "");
              if (parts.length === 2 && parts[1]?.length === 3)
                return s.replace(/\./g, "");
              return s;
            };

            if (mQtyRaw) {
              mQty = parseVal(mQtyRaw.trim());
            }

            // Match name (Normalized)
            const nSearch = normalize(mNameRaw);
            let foundMat = materialList.find(
              (m) => normalize(m.name) === nSearch,
            );

            // Fallback: Partial Match (if unique)
            if (!foundMat) {
              const candidates = materialList.filter((m) => {
                const nDb = normalize(m.name);
                return nDb.includes(nSearch) || nSearch.includes(nDb);
              });

              if (candidates.length === 1) {
                foundMat = candidates[0];
              }
            }

            stepMats.push({
              key: uid(),
              materialId: foundMat ? foundMat.id : null,
              qtyReq: mQty, // Allow qty even if material not found
            });
          }

          newSteps.push({
            key: uid(),
            up: totalUpStr || "1", // Use row specific up or default 1
            machineId: mach ? mach.id : null,
            startDate: formattedDate,
            partNumber: partNum || "",
            materials: stepMats,
          });
        }
      }

      if (lastProductName) {
        setProductName(lastProductName);
      }

      setSteps((prev) => [...prev, ...newSteps]);
      setOk(`Berhasil import ${newSteps.length} proses.`);
    } catch (err: any) {
      setErr("Gagal import: " + err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const openAdd = () => {
    setErr(null);
    if (!processId) return setErr("Proses wajib dipilih di header");
    setEditKey(null);
    setDraft(newStep());
    setOpen(true);
  };

  const openEdit = (s: StepDraft) => {
    setErr(null);
    setEditKey(s.key);
    setDraft({ ...s });
    setOpen(true);
  };

  const saveDraft = () => {
    setErr(null);
    // if (!processId) return setErr("Proses wajib dipilih di header");
    // ^ Allow adding steps before selecting process? current logic strictly requires processId.
    // Let's keep strictness
    if (!processId) return setErr("Proses wajib dipilih di header");

    // ... rest of validation
    const upNum = Number(draft.up);
    if (!draft.up.trim() || !Number.isFinite(upNum) || upNum < 0) {
      return setErr("UP wajib >= 0 (oleh 0)");
    }

    if (draft.materials.length > 0) {
      for (const m of draft.materials) {
        if (m.materialId) {
          const q = Number(m.qtyReq);
          if (!m.qtyReq.trim() || !Number.isFinite(q) || q <= 0) {
            return setErr("Qty Req material wajib > 0");
          }
        }
      }
    }

    setSteps((prev) => {
      if (!editKey) return [...prev, draft];
      return prev.map((x) => (x.key === editKey ? draft : x));
    });

    setOpen(false);
  };

  const removeStep = (key: string) => {
    setSteps((prev) => prev.filter((x) => x.key !== key));
  };

  const moveStep = (key: string, dir: "up" | "down") => {
    setSteps((prev) => {
      const idx = prev.findIndex((x) => x.key === key);
      if (idx < 0) return prev;
      const nextIdx = dir === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;
      const copy = [...prev];
      const tmp = copy[idx]!;
      copy[idx] = copy[nextIdx]!;
      copy[nextIdx] = tmp;
      return copy;
    });
  };

  const submitPro = async () => {
    setErr(null);
    setOk(null);

    const prod = productName.trim();
    if (!prod) return setErr("Produk wajib diisi");

    if (!processId) return setErr("Proses wajib dipilih");

    const qty = parseInt(qtyPoPcs);
    if (!qtyPoPcs.trim() || !Number.isFinite(qty) || qty <= 0) {
      return setErr("Jumlah PO (pcs) wajib > 0");
    }

    if (steps.length === 0) return setErr("Minimal 1 proses harus ditambahkan");

    const payload = {
      productName: prod,
      partNumber: partNumber.trim() || undefined, // Added
      qtyPoPcs: qty,
      proPrefixId: processId, // Updated
      type: proType, // Added
      proNumber: manualProNumber ? manualProNumber.trim() : undefined,
      proses: steps.map((s) => ({
        up: Number(s.up),
        machineId: s.machineId ?? null,
        startDate: s.startDate ? new Date(s.startDate) : undefined,
        partNumber: s.partNumber?.trim() || undefined,
        batchNo: headerBatchNo?.trim() || s.batchNo?.trim() || undefined, // Prioritize header
        materials: s.materials
          .filter((m) => m.materialId)
          .map((m) => ({
            materialId: m.materialId!,
            qtyReq: Number(m.qtyReq),
          })),
        // Standard Params removed
      })),
    };

    try {
      const created = await createPro.mutateAsync(payload);
      // onSuccess handles reset
    } catch (e: any) {
      setErr(e?.message ?? "Gagal membuat PRO");
    }
  };

  const control =
    "border-input bg-background h-10 w-full rounded-md border px-3 text-sm";

  const headerProcess = getProcess(processId);

  return (
    <div className="space-y-6">
      <div className="space-y-8 pb-32">
        {/* 1. Header Information */}
        <Card className="border-none shadow-md">
          <CardHeader className="bg-muted/20 border-border border-b pb-4">
            <CardTitle className="text-foreground flex items-center gap-2 text-lg font-bold tracking-tight uppercase">
              <div className="bg-primary h-8 w-1 rounded-full" />
              Informasi Produk & PRO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImport}
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Product Name */}
              <div className="space-y-2 lg:col-span-2">
                <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Nama Produk
                </div>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Nama produk..."
                  autoComplete="off"
                  className="focus:border-primary border-input bg-background h-11 text-base font-semibold"
                />
              </div>

              {/* FG Part Number */}
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  FG Part Number
                </div>
                <Input
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  placeholder="Part No. FG"
                  className="bg-background h-11 font-mono text-sm"
                />
              </div>

              {/* Tipe Box Toggle */}
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Tipe Box
                </div>
                <div className="bg-muted flex h-11 items-center rounded-lg p-1">
                  <Button
                    type="button"
                    variant={proType === "PAPER" ? "default" : "ghost"}
                    onClick={() => setProType("PAPER")}
                    className={`flex-1 rounded-md text-xs font-bold uppercase transition-all ${
                      proType === "PAPER"
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Paper Box
                  </Button>
                  <Button
                    type="button"
                    variant={proType === "RIGID" ? "default" : "ghost"}
                    onClick={() => setProType("RIGID")}
                    className={`flex-1 rounded-md text-xs font-bold uppercase transition-all ${
                      proType === "RIGID"
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Rigid Box
                  </Button>
                </div>
              </div>

              {/* Row 2 */}

              {/* Qty PO */}
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Jumlah PO (pcs)
                </div>
                <Input
                  type="number"
                  value={qtyPoPcs}
                  onChange={(e) => setQtyPoPcs(e.target.value)}
                  placeholder="0"
                  className="bg-muted/30 h-11 font-mono font-bold"
                />
              </div>

              {/* Prefix PRO */}
              <div className="space-y-2">
                <div className="text-muted-foreground flex justify-between text-xs font-bold tracking-wider uppercase">
                  <span>Prefix PRO</span>
                  {headerProcess && (
                    <span className="text-primary">{headerProcess.code}</span>
                  )}
                </div>
                <select
                  value={processId ?? ""}
                  onChange={(e) =>
                    setProcessId(e.target.value ? Number(e.target.value) : null)
                  }
                  className="border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring bg-background flex h-11 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loadingMaster}
                >
                  <option value="">Pilih proses...</option>
                  {(processes.data ?? []).map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* No PRO */}
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  No. PRO (Manual/Import)
                </div>
                <Input
                  value={manualProNumber}
                  onChange={(e) => setManualProNumber(e.target.value)}
                  placeholder="(Auto Generate)"
                  className="placeholder:text-muted-foreground/50 bg-muted/40 h-11 font-mono text-sm"
                />
              </div>

              {proType === "RIGID" && (
                <div className="space-y-2">
                  <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Batch No
                  </div>
                  <Input
                    value={headerBatchNo}
                    onChange={(e) => setHeaderBatchNo(e.target.value)}
                    placeholder="Batch No"
                    className="bg-background h-11"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 2. Process List */}
        <Card className="border-none shadow-md">
          <CardHeader className="bg-muted/20 border-border flex flex-row items-center justify-between border-b pb-4">
            <CardTitle className="text-foreground flex items-center gap-2 text-lg font-bold tracking-tight uppercase">
              <div className="bg-primary h-8 w-1 rounded-full" />
              Daftar Proses Produksi
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={loadingMaster}
                className="h-9 gap-2 border-dashed"
              >
                <Upload className="text-muted-foreground h-4 w-4" />
                Import CSV
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={openAdd}
                disabled={loadingMaster || !processId}
                className="h-9 gap-2 font-bold"
              >
                <Plus className="h-4 w-4" />
                Tambah Proses
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {err && (
              <div className="bg-destructive/10 text-destructive border-destructive/20 m-4 flex items-center rounded-lg border p-3 text-sm font-medium">
                <span className="mr-2 text-lg">⚠️</span> {err}
              </div>
            )}
            {ok && (
              <div className="m-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <span className="mr-2 text-lg">✅</span> {ok}
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-border border-b hover:bg-transparent">
                      <TableHead className="w-12 text-center">#</TableHead>
                      <TableHead className="w-16 text-center">No.</TableHead>
                      <TableHead className="w-48">Output PN (Step)</TableHead>
                      <TableHead className="min-w-[150px]">Machine</TableHead>
                      <TableHead className="w-32 text-center">Starts</TableHead>
                      <TableHead className="w-24 text-center">UP/Cav</TableHead>
                      <TableHead className="min-w-[200px]">Material</TableHead>
                      <TableHead className="w-24 text-right">Qty</TableHead>
                      <TableHead className="w-20 text-right">UoM</TableHead>
                      <TableHead className="w-[140px] text-right">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {steps.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="h-48 text-center">
                          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
                            <div className="bg-muted rounded-full p-4">
                              <GripVertical className="h-6 w-6 opacity-20" />
                            </div>
                            <p className="font-medium">
                              Belum ada proses ditambahkan
                            </p>
                            <p className="mx-auto max-w-xs text-xs opacity-70">
                              Gunakan tombol "Import CSV" atau "Tambah Proses"
                              di atas untuk mengisi alur produksi.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      <SortableContext
                        items={steps.map((s) => s.key)}
                        strategy={verticalListSortingStrategy}
                      >
                        {steps.map((s, idx) => (
                          <SortableRow
                            key={s.key}
                            step={s}
                            idx={idx}
                            machines={machines.data ?? []}
                            materialsList={materials.data ?? []}
                            qtyPo={Number(qtyPoPcs) || 0}
                            onEdit={openEdit}
                            onRemove={removeStep}
                          />
                        ))}
                      </SortableContext>
                    )}
                  </TableBody>
                </Table>
              </div>
            </DndContext>
          </CardContent>
        </Card>

        {/* 3. Action Bar */}
        <div className="bg-card/80 sticky bottom-4 z-10 flex items-center justify-between rounded-xl border p-4 shadow-xl backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs font-bold uppercase">
              Summary
            </span>
            <span className="text-foreground font-mono text-sm font-medium">
              {steps.length} Proses •{" "}
              {qtyPoPcs ? Number(qtyPoPcs).toLocaleString() : 0} Pcs Output
            </span>
          </div>
          <Button
            type="button"
            size="lg"
            onClick={submitPro}
            disabled={createPro.isPending || loadingMaster}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 min-w-[200px] font-bold shadow-lg"
          >
            {createPro.isPending ? "Memproses..." : "Buat Production Order"}
          </Button>
        </div>
      </div>

      {/* Dialog form step (tanpa pilih proses) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editKey ? "Edit Proses" : "Tambah Proses"}
            </DialogTitle>
            <DialogDescription>
              Proses diambil dari header:{" "}
              {headerProcess
                ? `${headerProcess.code} - ${headerProcess.name}`
                : "-"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">UP / CAV</div>
                <Input
                  type="number"
                  value={draft.up}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const newUp = e.target.value;
                    const upNum = Number(newUp);
                    const poNum = Number(qtyPoPcs);

                    setDraft((d: StepDraft) => {
                      // Recalc materials if material is sheet
                      const newMaterials = d.materials.map(
                        (m: StepDraftMaterial) => {
                          const matInfo = materials.data?.find(
                            (x: any) => x.id === m.materialId,
                          );
                          const isSheet =
                            matInfo?.uom?.toLowerCase() === "sheet";

                          if (isSheet && upNum > 0 && poNum > 0) {
                            const autoQty = String(Math.ceil(poNum / upNum));
                            return { ...m, qtyReq: autoQty };
                          }
                          return m;
                        },
                      );

                      return { ...d, up: newUp, materials: newMaterials };
                    });
                  }}
                  placeholder="contoh: 4"
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">
                  Output Part Number (Step)
                </div>
                <Input
                  value={draft.partNumber || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDraft((d: StepDraft) => ({
                      ...d,
                      partNumber: e.target.value,
                    }))
                  }
                  placeholder="Part Number untuk proses ini"
                />
              </div>

              {proType === "RIGID" && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Batch No. (Rigid)</div>
                  <Input
                    value={draft.batchNo || ""}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setDraft((d: StepDraft) => ({
                        ...d,
                        batchNo: e.target.value,
                      }))
                    }
                    placeholder="Batch number (optional)"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="text-sm font-medium">Machine (optional)</div>
                <select
                  value={draft.machineId ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const val = e.target.value ? Number(e.target.value) : null;

                    setDraft((d: StepDraft) => {
                      return {
                        ...d,
                        machineId: val,
                      };
                    });
                  }}
                  className={control}
                  disabled={loadingMaster}
                >
                  <option value="">(optional)</option>
                  {(machines.data ?? []).map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Tanggal Mulai</div>
                <Input
                  type="date"
                  value={draft.startDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDraft((d: StepDraft) => ({
                      ...d,
                      startDate: e.target.value,
                    }))
                  }
                  placeholder="dd/mm/yyyy"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Material (optional)</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 border text-xs"
                  onClick={() =>
                    setDraft((d: StepDraft) => ({
                      ...d,
                      materials: [
                        ...d.materials,
                        { key: uid(), materialId: null, qtyReq: "" },
                      ],
                    }))
                  }
                >
                  + Tambah Material
                </Button>
              </div>

              <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                {draft.materials.map((mat: StepDraftMaterial, mIdx: number) => (
                  <div
                    key={mat.key}
                    className="grid grid-cols-12 items-end gap-2 border-b pb-2 last:border-0 last:pb-0"
                  >
                    {/* Material Select */}
                    <div className="col-span-6">
                      <label className="text-muted-foreground text-[10px]">
                        Item
                      </label>
                      <select
                        value={mat.materialId ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const v = e.target.value
                            ? Number(e.target.value)
                            : null;

                          setDraft((d: StepDraft) => {
                            const selectedMaterial = materials.data?.find(
                              (m: any) => m.id === v,
                            );
                            const isSheet =
                              selectedMaterial?.uom?.toLowerCase() === "sheet";

                            const poNum = Number(qtyPoPcs);
                            const upNum = Number(d.up);

                            let autoQty = mat.qtyReq;

                            // Auto calc if sheet
                            if (v && isSheet && upNum > 0 && poNum > 0) {
                              autoQty = String(Math.ceil(poNum / upNum));
                            }

                            const newMats = [...d.materials];
                            newMats[mIdx] = {
                              ...mat,
                              materialId: v,
                              qtyReq: v ? autoQty : "",
                            };
                            return { ...d, materials: newMats };
                          });
                        }}
                        className={`${control} h-8 py-0 text-xs`}
                        disabled={loadingMaster}
                      >
                        <option value="">(pilih)</option>

                        <optgroup label="Bahan Baku & Consumable">
                          {(materials.data ?? [])
                            // @ts-ignore
                            .filter((m) => m.type !== "WIP")
                            .map((m: any) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                        </optgroup>

                        <optgroup label="Barang Setengah Jadi (WIP)">
                          {(materials.data ?? [])
                            // @ts-ignore
                            .filter(
                              (m) => m.type === "WIP" && (m.wipStock || 0) > 0,
                            )
                            .map((m: any) => {
                              const stock = m.wipStock || 0;
                              return (
                                <option key={m.id} value={m.id}>
                                  {m.name}{" "}
                                  {stock > 0
                                    ? `- Stock: ${stock.toLocaleString("id-ID")}`
                                    : ""}
                                </option>
                              );
                            })}
                        </optgroup>
                      </select>
                    </div>

                    {/* Qty Input */}
                    <div className="col-span-4">
                      <label className="text-muted-foreground text-[10px]">
                        Qty ({getMaterial(mat.materialId)?.uom ?? "-"})
                      </label>
                      <Input
                        type="number"
                        className="h-8 text-xs"
                        value={mat.qtyReq}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const val = e.target.value;
                          setDraft((d: StepDraft) => {
                            const newMats = [...d.materials];
                            newMats[mIdx] = { ...mat, qtyReq: val };
                            return { ...d, materials: newMats };
                          });
                        }}
                        disabled={!mat.materialId}
                        placeholder="Qty"
                      />
                    </div>

                    {/* Delete Btn */}
                    <div className="col-span-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive h-8 w-8"
                        onClick={() =>
                          setDraft((d: StepDraft) => {
                            const newMats = d.materials.filter(
                              (m: StepDraftMaterial) => m.key !== mat.key,
                            );
                            return { ...d, materials: newMats };
                          })
                        }
                      >
                        x
                      </Button>
                    </div>
                  </div>
                ))}

                {draft.materials.length === 0 && (
                  <div className="text-muted-foreground rounded border border-dashed py-2 text-center text-xs">
                    Tidak ada material.
                  </div>
                )}
              </div>
            </div>

            {err ? <p className="text-destructive text-sm">{err}</p> : null}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="button" onClick={saveDraft}>
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SortableRow({
  step,
  idx,
  machines,
  materialsList,
  qtyPo,
  onEdit,
  onRemove,
}: {
  step: StepDraft;
  idx: number;
  machines: any[];
  materialsList: any[];
  qtyPo: number;
  onEdit: (s: StepDraft) => void;
  onRemove: (k: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 999 : "auto",
  };

  const m = machines.find((x) => x.id === step.machineId);
  const up = Number(step.up) || 1;
  const capacity = m?.stdOutputPerShift || 0;

  let shiftCount = 0;
  let exceed = false;

  if (capacity > 0 && qtyPo > 0) {
    const outputNeeded = Math.ceil(qtyPo / up);
    shiftCount = Math.ceil(outputNeeded / capacity);
    if (shiftCount > 1) exceed = true;
  }

  const getMatName = (id: number) =>
    materialsList.find((x) => x.id === id)?.name ?? "-";
  const getMatUom = (id: number) =>
    materialsList.find((x) => x.id === id)?.uom ?? "-";

  return (
    <TableRow ref={setNodeRef} style={style} className="group">
      <TableCell className="w-10 p-0 pl-2 text-center">
        <button
          {...attributes}
          {...listeners}
          className="text-muted-foreground hover:bg-muted hover:text-foreground cursor-grab touch-none rounded p-1.5 active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell>{idx + 1}</TableCell>
      <TableCell>{step.partNumber || "-"}</TableCell>
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {m?.name ?? (
              <span className="text-destructive italic">Unknown</span>
            )}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center text-xs">
        {(() => {
          if (!step.startDate) return "-";
          const d = new Date(step.startDate);
          if (isNaN(d.getTime())) return step.startDate;
          return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        })()}
      </TableCell>
      <TableCell className="text-center">{step.up || "-"}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {step.materials.map((mat) => (
            <div
              key={mat.key}
              className="border-border text-muted-foreground border-b pb-1 text-xs last:border-0"
            >
              {getMatName(mat.materialId!)}
            </div>
          ))}
          {step.materials.length === 0 && "-"}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-col gap-1">
          {step.materials.map((mat) => (
            <div
              key={mat.key}
              className="border-border text-foreground border-b pb-1 font-mono text-xs last:border-0"
            >
              {mat.qtyReq ? Number(mat.qtyReq).toLocaleString("id-ID") : "-"}
            </div>
          ))}
        </div>
        {exceed && (
          <div className="mt-2 flex justify-end">
            <div className="border-destructive/20 bg-destructive/10 text-destructive rounded border px-1.5 py-0.5 text-[10px] font-bold">
              ⚠️ {shiftCount} Shift
            </div>
          </div>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex flex-col gap-1">
          {step.materials.map((mat) => (
            <div
              key={mat.key}
              className="text-muted-foreground border-border border-b pb-1 text-xs last:border-0"
            >
              {getMatUom(mat.materialId!)}
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="inline-flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => onEdit(step)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2 text-xs"
            onClick={() => onRemove(step.key)}
          >
            Hapus
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
