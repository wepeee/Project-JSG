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

type StepDraft = {
  key: string;
  processId: number | null;
  up: string;
  machineId: number | null;
  materialId: number | null;
  qtyReq: string;
};

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function newStep(): StepDraft {
  return {
    key: uid(),
    processId: null,
    up: "",
    machineId: null,
    materialId: null,
    qtyReq: "",
  };
}

export default function ProPlanner() {
  const processes = api.processes.list.useQuery();
  const machines = api.machines.list.useQuery();
  const materials = api.materials.list.useQuery();

  const createPro = api.pros.create.useMutation();

  const loadingMaster =
    processes.isLoading || machines.isLoading || materials.isLoading;

  // Header PRO
  const [productName, setProductName] = React.useState("");
  const [qtyPoPcs, setQtyPoPcs] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<string>("");

  // Steps
  const [steps, setSteps] = React.useState<StepDraft[]>([]);

  // Dialog state
  const [open, setOpen] = React.useState(false);
  const [editKey, setEditKey] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<StepDraft>(newStep());

  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  const getProcess = (id: number | null) =>
    id ? ((processes.data ?? []).find((p) => p.id === id) ?? null) : null;

  const getMachine = (id: number | null) =>
    id ? ((machines.data ?? []).find((m) => m.id === id) ?? null) : null;

  const getMaterial = (id: number | null) =>
    id ? ((materials.data ?? []).find((m) => m.id === id) ?? null) : null;

  const openAdd = () => {
    setErr(null);
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

    if (!draft.processId) return setErr("Proses wajib dipilih");

    const upNum = Number(draft.up);
    if (!draft.up.trim() || !Number.isFinite(upNum) || upNum <= 0) {
      return setErr("UP wajib > 0");
    }

    if (draft.materialId) {
      const q = Number(draft.qtyReq);
      if (!draft.qtyReq.trim() || !Number.isFinite(q) || q <= 0) {
        return setErr("Qty Req wajib > 0 kalau material dipilih");
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

    const qty = Number(qtyPoPcs);
    if (!qtyPoPcs.trim() || !Number.isFinite(qty) || qty <= 0) {
      return setErr("Jumlah PO (pcs) wajib > 0");
    }

    if (steps.length === 0) return setErr("Minimal 1 proses harus ditambahkan");

    const payload = {
      productName: prod,
      qtyPoPcs: qty,
      startDate: startDate ? new Date(`${startDate}T00:00:00`) : undefined,
      steps: steps.map((s) => ({
        processId: s.processId!,
        up: Number(s.up),
        machineId: s.machineId ?? null,
        materials: s.materialId
          ? [{ materialId: s.materialId, qtyReq: Number(s.qtyReq) }]
          : [],
      })),
    };

    try {
      const created = await createPro.mutateAsync(payload);
      setOk(`PRO dibuat: ${created.proNumber}`);
      setProductName("");
      setQtyPoPcs("");
      setStartDate("");
      setSteps([]);
    } catch (e: any) {
      setErr(e?.message ?? "Gagal membuat PRO");
    }
  };

  const control =
    "border-input bg-background h-10 w-full rounded-md border px-3 text-sm";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Perencanaan PRO</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Header PRO */}
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Produk</div>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Nama produk"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Jumlah PO (pcs)</div>
              <Input
                type="number"
                value={qtyPoPcs}
                onChange={(e) => setQtyPoPcs(e.target.value)}
                placeholder="contoh: 100000"
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Tanggal Mulai</div>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={openAdd}
              disabled={loadingMaster}
            >
              + Tambah Proses
            </Button>

            <Button
              type="button"
              onClick={submitPro}
              disabled={createPro.isPending || loadingMaster}
            >
              {createPro.isPending ? "Membuat..." : "Buat PRO"}
            </Button>

            <div className="text-xs opacity-70 sm:ml-auto">
              No. PRO: (kode proses pertama)(bulan)(tahun)(increment)
            </div>
          </div>

          {/* List table (readable) */}
          <div className="overflow-x-auto rounded-md border">
            <div className="min-w-[860px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">No.</TableHead>
                    <TableHead>Proses</TableHead>
                    <TableHead className="w-24">UP</TableHead>
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
                        colSpan={8}
                        className="py-8 text-center text-sm opacity-70"
                      >
                        Belum ada proses. Klik “+ Tambah Proses”.
                      </TableCell>
                    </TableRow>
                  ) : (
                    steps.map((s, idx) => {
                      const p = getProcess(s.processId);
                      const m = getMachine(s.machineId);
                      const mat = getMaterial(s.materialId);
                      return (
                        <TableRow key={s.key}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell className="font-medium">
                            {p ? `${p.code} - ${p.name}` : "-"}
                            {idx === 0 ? (
                              <div className="mt-1 text-xs opacity-70">
                                * proses pertama menentukan prefix
                              </div>
                            ) : null}
                          </TableCell>
                          <TableCell className="text-center">
                            {s.up || "-"}
                          </TableCell>
                          <TableCell>{m?.name ?? "-"}</TableCell>
                          <TableCell>{mat?.name ?? "-"}</TableCell>
                          <TableCell className="text-right">
                            {s.qtyReq?.trim() ? s.qtyReq : "-"}
                          </TableCell>
                          <TableCell>{mat ? String(mat.uom) : "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="inline-flex gap-2">
                              <Button
                                variant="outline"
                                className="h-9"
                                onClick={() => moveStep(s.key, "up")}
                                disabled={idx === 0}
                              >
                                ↑
                              </Button>
                              <Button
                                variant="outline"
                                className="h-9"
                                onClick={() => moveStep(s.key, "down")}
                                disabled={idx === steps.length - 1}
                              >
                                ↓
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

      {/* Dialog form step */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editKey ? "Edit Proses" : "Tambah Proses"}
            </DialogTitle>
            <DialogDescription>
              Isi proses, UP, machine, dan material (optional).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium">Proses</div>
                <select
                  value={draft.processId ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      processId: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className={control}
                  disabled={loadingMaster}
                >
                  <option value="">Pilih proses</option>
                  {(processes.data ?? []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">UP</div>
                <Input
                  type="number"
                  value={draft.up}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, up: e.target.value }))
                  }
                  placeholder="contoh: 4"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Machine (optional)</div>
              <select
                value={draft.machineId ?? ""}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    machineId: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                className={control}
                disabled={loadingMaster}
              >
                <option value="">(optional)</option>
                {(machines.data ?? []).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <Separator />

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
                <div className="text-sm font-medium">Material (optional)</div>
                <select
                  value={draft.materialId ?? ""}
                  onChange={(e) => {
                    const v = e.target.value ? Number(e.target.value) : null;
                    setDraft((d) => ({
                      ...d,
                      materialId: v,
                      qtyReq: v ? d.qtyReq : "",
                    }));
                  }}
                  className={control}
                  disabled={loadingMaster}
                >
                  <option value="">(optional) pilih material</option>
                  {(materials.data ?? []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({String(m.uom)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Qty Req</div>
                <Input
                  type="number"
                  value={draft.qtyReq}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, qtyReq: e.target.value }))
                  }
                  disabled={!draft.materialId}
                  placeholder={draft.materialId ? "Qty" : ""}
                />
                <div className="text-xs opacity-70">
                  UoM: {getMaterial(draft.materialId)?.uom ?? "-"}
                </div>
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
