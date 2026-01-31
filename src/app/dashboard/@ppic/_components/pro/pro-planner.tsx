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
            } else if (char === ',') {
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
  const [proType, setProType] = React.useState<"PAPER" | "RIGID" | "OTHER">("PAPER"); // Added
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
    processes.isLoading ||
    machines.isLoading ||
    materials.isLoading;

  // Steps
  const [steps, setSteps] = React.useState<StepDraft[]>([]);

  // Dialog state
  const [open, setOpen] = React.useState(false);
  const [editKey, setEditKey] = React.useState<string | null>(null);
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

      // Identify columns based on header (assumed row 0)
      // Format: R, MACHINE, Production Order, Name, Total Up, Qty Order, Start, End, Material, UoM, Qty
      // Indices: 0, 1,       2,                3,    4,        5,         6,     7,   8,        9,   10
      
      const machineList = machines.data ?? [];
      const materialList = materials.data ?? [];

      const newSteps: StepDraft[] = [];
      let foundHeaderInfo = false;

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

           if (proNumCsv) {
              setManualProNumber(proNumCsv);
           }
        }

        const partNum = cols[0]?.trim();

        // --- Create Step ---
        // 1. Machine Match
        const mach = machineList.find(m => m.name.trim().toLowerCase() === machineName.trim().toLowerCase());
        
        // 2. Start Date (M/D/YYYY or D/M/YYYY -> assuming M/D/YYYY)
        const dateStr = cols[6]?.trim();
        let formattedDate = "";
        if (dateStr) {
           const d = new Date(dateStr);
           if (!isNaN(d.getTime())) {
              formattedDate = d.toISOString().split('T')[0]!; // YYYY-MM-DD
           }
        }

        // 3. Materials
        // Split by '+'
        const matNames = (cols[8]?.trim() ?? "").split('+');
        const matQties = (cols[10]?.trim() ?? "").split('+');
        // uom ignored for ID match, but maybe useful for validation? (cols[9])

        const stepMats: StepDraftMaterial[] = [];
        
        for (let k = 0; k < matNames.length; k++) {
           const mName = matNames[k]?.trim();
           if (!mName) continue;
           
           const mQtyRaw = matQties[k]?.trim(); 
           // Clean format number?
           const mQty = mQtyRaw ? mQtyRaw.replace(",", ".") : ""; // JS number uses dot

           // Match name
           const cleanSearch = mName.toLowerCase();
           let foundMat = materialList.find(m => m.name.trim().toLowerCase() === cleanSearch);

           // Fallback: Partial Match (if unique)
           // e.g. CSV "Ivory 300" matches DB "Kertas Ivory 300"
           if (!foundMat) {
              const candidates = materialList.filter(m => m.name.trim().toLowerCase().includes(cleanSearch));
              if (candidates.length === 1) {
                  foundMat = candidates[0];
              }
           }
           
           stepMats.push({
              key: uid(),
              materialId: foundMat ? foundMat.id : null,
              qtyReq: foundMat ? mQty : "", // Only fill qty if material matched? Or fill anyway?
           });
        }
        
        // Add empty if none
        if (stepMats.length === 0) stepMats.push({ key: uid(), materialId: null, qtyReq: "" });

        newSteps.push({
          key: uid(),
          up: totalUpStr || "1", // Use row specific up or default 1
          machineId: mach ? mach.id : null,
          startDate: formattedDate,
          partNumber: partNum || "",
          materials: stepMats
        });
      }

      setSteps(prev => [...prev, ...newSteps]);
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
          .filter(m => m.materialId) 
          .map((m) => ({ materialId: m.materialId!, qtyReq: Number(m.qtyReq) })),
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
          <div className="grid gap-3 lg:grid-cols-4">
            <div className="space-y-2 lg:col-span-1">
              <div className="text-sm font-medium">Produk</div>
              <Input
                value={productName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
                placeholder="Nama produk"
                autoComplete="off"
              />
            </div>



            {/* Type Selector (Paper/Rigid) */}
            <div className="space-y-2 lg:col-span-1">
              <div className="text-sm font-medium">Tipe Box</div>
              <div className="flex items-center gap-1 rounded-md border p-1">
                 <Button
                   type="button"
                   variant={proType === "PAPER" ? "default" : "ghost"}
                   size="sm"
                   className="flex-1 h-8 text-xs"
                   onClick={() => setProType("PAPER")}
                 >
                   Paper Box
                 </Button>
                 <Button
                   type="button"
                   variant={proType === "RIGID" ? "default" : "ghost"}
                   size="sm"
                   className="flex-1 h-8 text-xs"
                   onClick={() => setProType("RIGID")}
                 >
                   Rigid Box
                 </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Proses (Prefix PRO)</div>
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

            <div className="space-y-2">
              <div className="text-sm font-medium">Jumlah PO (pcs)</div>
              <Input
                type="number"
                value={qtyPoPcs}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQtyPoPcs(e.target.value)}
                placeholder="contoh: 100000"
              />
            </div>

            <div className="space-y-2 lg:col-span-1">
              <div className="text-sm font-medium">No. PRO (Manual/Import)</div>
              <Input
                value={manualProNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualProNumber(e.target.value)}
                placeholder="(Auto)"
                className="bg-muted/30"
              />
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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

            <div className="text-xs opacity-70 sm:ml-auto">
              No. PRO prefix:{" "}
              {headerProcess ? `${headerProcess.code}(bulan)(tahun)` : "-"}
            </div>
          </div>

          {/* Steps table */}
          <div className="overflow-x-auto rounded-md border">
            <div className="min-w-[860px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">No.</TableHead>

                    <TableHead className="w-24">UP</TableHead>
                    <TableHead className="w-32">Part No.</TableHead>
                    <TableHead>Machine</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="w-24">Qty</TableHead>
                    <TableHead className="w-24">UoM</TableHead>
                    <TableHead className="w-[260px] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {steps.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-8 text-center text-sm opacity-70"
                      >
                        Belum ada step. Klik "Import CSV" atau "+ Tambah Step".
                      </TableCell>
                    </TableRow>
                  ) : (
                    steps.map((s: StepDraft, idx: number) => {
                      const m = getMachine(s.machineId);
                      return (
                        <TableRow key={s.key}>
                          <TableCell>{idx + 1}</TableCell>

                          <TableCell className="text-center">
                            {s.up || "-"}
                          </TableCell>
                          <TableCell>
                            {s.partNumber || "-"}
                          </TableCell>
                          <TableCell>
                             <div className="flex flex-col">
                                <span>{m?.name ?? <span className="text-destructive font-medium italic">Mesin tidak ditemukan</span>}</span>
                                {s.startDate && <span className="text-[10px] text-muted-foreground">{s.startDate}</span>}
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex flex-col gap-1">
                               {s.materials.map((m: StepDraftMaterial) => {
                                  const matInfo = getMaterial(m.materialId);
                                  return (
                                    <div key={m.key} className="text-xs border-b last:border-0 pb-0.5">
                                      {matInfo?.name ?? <span className="text-destructive font-medium italic">Unknown Material</span>}
                                    </div>
                                  )
                                })}
                               {s.materials.length === 0 && "-"}
                             </div>
                          </TableCell>
                          <TableCell className="text-right">
                             <div className="flex flex-col gap-1">
                               {s.materials.map((m: StepDraftMaterial) => (
                                    <div key={m.key} className="text-xs border-b last:border-0 pb-0.5">
                                      {m.qtyReq?.trim() ? Number(m.qtyReq).toLocaleString("id-ID") : "-"}
                                    </div>
                               ))}
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex flex-col gap-1">
                               {s.materials.map((m: StepDraftMaterial) => (
                                    <div key={m.key} className="text-xs border-b last:border-0 pb-0.5">
                                      {getMaterial(m.materialId)?.uom ?? "-"}
                                    </div>
                               ))}
                             </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex gap-2">
                              <Button
                                variant="outline"
                                className="h-9"
                                onClick={() => moveStep(s.key, "up")}
                                disabled={idx === 0}
                              >
                                Up
                              </Button>
                              <Button
                                variant="outline"
                                className="h-9"
                                onClick={() => moveStep(s.key, "down")}
                                disabled={idx === steps.length - 1}
                              >
                                Down
                              </Button>
                              <Button
                                variant="outline"
                                className="h-9"
                                onClick={() => openEdit(s)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                className="h-9"
                                onClick={() => removeStep(s.key)}
                              >
                                Hapus
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {err ? <p className="text-destructive text-sm">{err}</p> : null}
          {ok ? <p className="text-sm">{ok}</p> : null}
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
                       const newMaterials = d.materials.map((m: StepDraftMaterial) => {
                          const matInfo = materials.data?.find((x: any) => x.id === m.materialId);
                          const isSheet = matInfo?.uom?.toLowerCase() === "sheet";
                          
                          if (isSheet && upNum > 0 && poNum > 0) {
                             const autoQty = String(Math.ceil(poNum / upNum));
                             return { ...m, qtyReq: autoQty };
                          }
                          return m;
                       });
                       
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
                    setDraft((d: StepDraft) => ({ ...d, partNumber: e.target.value }))
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
                    setDraft((d: StepDraft) => ({ ...d, startDate: e.target.value }))
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
                    className="h-7 text-xs border"
                    onClick={() => setDraft((d: StepDraft) => ({ ...d, materials: [...d.materials, { key: uid(), materialId: null, qtyReq: "" }] }))}
                  >
                    + Tambah Material
                  </Button>
               </div>
               
               <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                 {draft.materials.map((mat: StepDraftMaterial, mIdx: number) => (
                    <div key={mat.key} className="grid grid-cols-12 gap-2 items-end border-b pb-2 last:border-0 last:pb-0">
                       {/* Material Select */}
                       <div className="col-span-6">
                          <label className="text-[10px] text-muted-foreground">Item</label>
                          <select
                            value={mat.materialId ?? ""}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              const v = e.target.value ? Number(e.target.value) : null;
                              
                              setDraft((d: StepDraft) => {
                                 const selectedMaterial = materials.data?.find((m: any) => m.id === v);
                                 const isSheet = selectedMaterial?.uom?.toLowerCase() === 'sheet';
                                 
                                 const poNum = Number(qtyPoPcs);
                                 const upNum = Number(d.up);
                                 
                                 let autoQty = mat.qtyReq;
                                 
                                 // Auto calc if sheet
                                 if (v && isSheet && upNum > 0 && poNum > 0) {
                                    autoQty = String(Math.ceil(poNum / upNum));
                                 }
                                 
                                 const newMats = [...d.materials];
                                 newMats[mIdx] = { ...mat, materialId: v, qtyReq: v ? autoQty : "" };
                                 return { ...d, materials: newMats };
                              });
                            }}
                            className={`${control} h-8 text-xs py-0`} 
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
                          <label className="text-[10px] text-muted-foreground">
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
                               })
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
                             className="h-8 w-8 text-destructive hover:text-destructive"
                             onClick={() => setDraft((d: StepDraft) => {
                                const newMats = d.materials.filter((m: StepDraftMaterial) => m.key !== mat.key);
                                return { ...d, materials: newMats };
                             })}
                          >
                             x
                          </Button>
                       </div>
                    </div>
                 ))}
                 
                 {draft.materials.length === 0 && (
                    <div className="text-center text-xs text-muted-foreground py-2 border border-dashed rounded">
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
