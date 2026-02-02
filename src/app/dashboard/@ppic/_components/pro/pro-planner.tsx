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
import { GripVertical } from "lucide-react";

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
  const utils = api.useUtils();
  const processes = api.processes.list.useQuery();
  const machines = api.machines.list.useQuery();
  const materials = api.materials.list.useQuery();

  // Header PRO
  const [productName, setProductName] = React.useState("");
  const [processId, setProcessId] = React.useState<number | null>(null);
  const [qtyPoPcs, setQtyPoPcs] = React.useState<string>("");
  const [proType, setProType] = React.useState<"PAPER" | "RIGID" | "OTHER">(
    "PAPER",
  ); // Added
  const [manualProNumber, setManualProNumber] = React.useState("");

  const createPro = api.pros.create.useMutation({
    onSuccess: async (created) => {
      await utils.pros.list.invalidate();
      await utils.pros.getSchedule.invalidate();
      setOk(`PRO dibuat: ${created.proNumber}`);
      setProductName("");
      // setProcessId(null);
      // setProType("PAPER"); // Keep selected type for convenience
      setQtyPoPcs("");
      setManualProNumber("");
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
      let detectedUp = "";

      // Helper for loose matching
      const normalize = (s: string) =>
        s.replace(/\s+/g, " ").trim().toLowerCase();

      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i];
        if (!cols || cols.length < 2) continue;

        // machine
        const machineName = cols[1]?.trim() ?? "";
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

          // Product Name from Name column (col 3) if available
          const nameVal = cols[3]?.trim();
          if (nameVal) setProductName(nameVal);

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

        const partNum = cols[0]?.trim(); // Use col 0 (header R) as Part Number? Or is it R for row no? Usually R is row no. But earlier I saw comments.
        // Wait, user didn't clarify Part Number col. I will leave it blank? Or use col 0 if it looks like part num?
        // Let's stick to simple logic for now, Part Num manual or if previously was mapped.
        // Actually the previous code mapped `partNum = cols[0]` which is usually Row Number.
        // I should ignore it unless confirmed. Leaving it as is for now not to regress,
        // but user only asked about UoM and matching.

        // --- Create Step ---
        // 1. Machine Match (Normalized)
        const mach = machineList.find(
          (m) => normalize(m.name) === normalize(machineName),
        );

        // 2. Start Date (M/D/YYYY or D/M/YYYY -> assuming M/D/YYYY)
        const dateStr = cols[6]?.trim();
        let formattedDate = "";
        if (dateStr) {
          const d = new Date(dateStr);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toISOString().split("T")[0]!; // YYYY-MM-DD
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
            if (s.includes(",")) return s.replace(/\./g, "").replace(",", ".");
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
            // Try finding if DB name contains CSV name OR CSV name contains DB name (sometimes CSV is more descriptive or less)
            // User case: "IVORY VA RDD  300 GSM 79 X 109 CM" in CSV.
            // DB might correspond to "IVORY VA RDD 300 GSM"
            // normalize() handles spaces.
            // nSearch might be "ivory va rdd 300 gsm 79 x 109 cm"
            // db might be "ivory va rdd 300 gsm"

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

        // REMOVED: if (stepMats.length === 0) stepMats.push({ key: uid(), materialId: null, qtyReq: "" });
        // User request: empty cell = no material. So we allow empty array.

        newSteps.push({
          key: uid(),
          up: totalUpStr || "1", // Use row specific up or default 1
          machineId: mach ? mach.id : null,
          startDate: formattedDate,
          partNumber: partNum || "",
          materials: stepMats,
        });
      }

      setSteps((prev) => [...prev, ...newSteps]);
      setOk(`Berhasil import ${newSteps.length} steps.`);
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

    const qty = Number(qtyPoPcs);
    if (!qtyPoPcs.trim() || !Number.isFinite(qty) || qty <= 0) {
      return setErr("Jumlah PO (pcs) wajib > 0");
    }

    if (steps.length === 0) return setErr("Minimal 1 step harus ditambahkan");

    const payload = {
      productName: prod,
      partNumber: undefined,
      qtyPoPcs: qty,
      processId: processId,
      type: proType, // Added
      proNumber: manualProNumber ? manualProNumber.trim() : undefined,
      steps: steps.map((s) => ({
        up: Number(s.up),
        machineId: s.machineId ?? null,
        startDate: s.startDate ? new Date(s.startDate) : undefined,
        partNumber: s.partNumber?.trim() || undefined,
        materials: s.materials
          .filter((m) => m.materialId)
          .map((m) => ({
            materialId: m.materialId!,
            qtyReq: Number(m.qtyReq),
          })),
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
      <Card>
        <CardHeader>
          <CardTitle>Perencanaan PRO</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <input
            type="file"
            accept=".csv"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImport}
          />

          {/* Header PRO */}
          <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
              <div className="space-y-2 lg:col-span-5">
                <div className="text-sm font-medium">Produk</div>
                <Input
                  value={productName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setProductName(e.target.value)
                  }
                  placeholder="Nama produk"
                  autoComplete="off"
                />
              </div>

              {/* Type Selector (Paper/Rigid) */}
              <div className="space-y-2 lg:col-span-4">
                <div className="text-sm font-medium">Tipe Box</div>
                <div className="flex items-center gap-1 rounded-md border p-1">
                  <Button
                    type="button"
                    variant={proType === "PAPER" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 flex-1 text-xs"
                    onClick={() => setProType("PAPER")}
                  >
                    Paper Box
                  </Button>
                  <Button
                    type="button"
                    variant={proType === "RIGID" ? "default" : "ghost"}
                    size="sm"
                    className="h-8 flex-1 text-xs"
                    onClick={() => setProType("RIGID")}
                  >
                    Rigid Box
                  </Button>
                </div>
              </div>

              <div className="space-y-2 lg:col-span-3">
                <div className="text-sm font-medium">Jumlah PO (pcs)</div>
                <Input
                  type="number"
                  value={qtyPoPcs}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setQtyPoPcs(e.target.value)
                  }
                  placeholder="contoh: 100000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 border-b pb-6 lg:grid-cols-12 lg:items-end">
              <div className="space-y-2 lg:col-span-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Proses (Prefix PRO)</span>
                  {headerProcess && (
                    <span className="text-muted-foreground text-xs font-normal">
                      Prefix: {headerProcess.code}
                    </span>
                  )}
                </div>
                <select
                  value={processId ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setProcessId(e.target.value ? Number(e.target.value) : null)
                  }
                  className={control}
                  disabled={loadingMaster}
                >
                  <option value="">Pilih proses</option>
                  {(processes.data ?? []).map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 lg:col-span-3">
                <div className="text-sm font-medium">
                  No. PRO (Manual/Import)
                </div>
                <Input
                  value={manualProNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setManualProNumber(e.target.value)
                  }
                  placeholder="(Auto)"
                  className="bg-muted/30"
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loadingMaster}
                >
                  Import CSV
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={openAdd}
                  disabled={loadingMaster}
                >
                  + Tambah Step
                </Button>

                <Button
                  type="button"
                  onClick={submitPro}
                  disabled={createPro.isPending || loadingMaster}
                >
                  {createPro.isPending ? "Membuat..." : "Buat PRO"}
                </Button>
              </div>
            </div>
          </div>

          {err && (
            <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm font-medium">
              {err}
            </div>
          )}
          {ok && (
            <div className="rounded-md bg-green-500/15 p-3 text-sm font-medium text-green-600">
              {ok}
            </div>
          )}

          {/* Steps table */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="overflow-x-auto rounded-md border">
              <div className="min-w-[860px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead className="w-16">No.</TableHead>

                      <TableHead className="w-32">Part No.</TableHead>
                      <TableHead>Machine</TableHead>
                      <TableHead className="w-24">Tanggal</TableHead>
                      <TableHead className="w-24">UP</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead className="w-24 text-right">Qty</TableHead>
                      <TableHead className="w-24 text-right">UoM</TableHead>
                      <TableHead className="w-[180px] text-right">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {steps.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={10}
                          className="text-muted-foreground py-12 text-center"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <p className="font-semibold">Belum ada step</p>
                            <p className="text-sm">
                              Klik "Import CSV" atau "+ Tambah Step" untuk
                              memulai.
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
            </div>
          </DndContext>
        </CardContent>
      </Card>

      {/* Dialog form step (tanpa pilih proses) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editKey ? "Edit Step" : "Tambah Step"}</DialogTitle>
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
                <div className="text-sm font-medium">UP</div>
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
                <div className="text-sm font-medium">Part Number (Step)</div>
                <Input
                  value={draft.partNumber || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setDraft((d: StepDraft) => ({
                      ...d,
                      partNumber: e.target.value,
                    }))
                  }
                  placeholder="Part Number for this step"
                />
              </div>

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

            <Separator />

            {/* Materials Section */}
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
                        {(materials.data ?? []).map((m: any) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
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
          className="cursor-grab touch-none rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 active:cursor-grabbing"
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
        {step.startDate || "-"}
      </TableCell>
      <TableCell className="text-center">{step.up || "-"}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          {step.materials.map((mat) => (
            <div key={mat.key} className="border-b pb-1 text-xs last:border-0">
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
              className="border-b pb-1 font-mono text-xs last:border-0"
            >
              {mat.qtyReq ? Number(mat.qtyReq).toLocaleString("id-ID") : "-"}
            </div>
          ))}
        </div>
        {exceed && (
          <div className="mt-2 flex justify-end">
            <div className="rounded border border-red-200 bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
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
              className="text-muted-foreground border-b pb-1 text-xs last:border-0"
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
            className="text-destructive hover:text-destructive h-7 px-2 text-xs"
            onClick={() => onRemove(step.key)}
          >
            Hapus
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
