"use client";

import * as React from "react";
import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
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
  machineId: number | null;
  materialId: number | null;
  qtyReq: string; // simpan string biar empty bisa
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

  const [productName, setProductName] = React.useState("");
  const [qtyPoPcs, setQtyPoPcs] = React.useState<string>("");
  const [up, setUp] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<string>(""); // yyyy-mm-dd

  const [steps, setSteps] = React.useState<StepDraft[]>([newStep()]);

  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  const loadingMaster =
    processes.isLoading || machines.isLoading || materials.isLoading;

  const getMaterial = (id: number | null) => {
    if (!id) return null;
    return (materials.data ?? []).find((m) => m.id === id) ?? null;
  };

  const addStep = () => setSteps((s) => [...s, newStep()]);
  const removeStep = (key: string) =>
    setSteps((s) => (s.length === 1 ? s : s.filter((x) => x.key !== key)));

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

  const submit = async () => {
    setErr(null);
    setOk(null);

    const prod = productName.trim();
    if (!prod) return setErr("Produk wajib diisi");

    const qty = Number(qtyPoPcs);
    if (!qtyPoPcs.trim() || !Number.isFinite(qty) || qty <= 0) {
      return setErr("Jumlah PO (pcs) wajib > 0");
    }

    for (let i = 0; i < steps.length; i++) {
      const s = steps[i]!;
      if (!s.processId) return setErr(`Baris ${i + 1}: proses belum dipilih`);

      // material optional, tapi kalau dipilih qtyReq harus valid
      if (s.materialId) {
        const q = Number(s.qtyReq);
        if (!s.qtyReq.trim() || !Number.isFinite(q) || q <= 0) {
          return setErr(`Baris ${i + 1}: Qty material wajib > 0`);
        }
      }
    }

    const payload = {
      productName: prod,
      qtyPoPcs: qty,
      up: up.trim() ? Number(up) : undefined,
      startDate: startDate ? new Date(`${startDate}T00:00:00`) : undefined,
      steps: steps.map((s) => ({
        processId: s.processId!,
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
      setUp("");
      setStartDate("");
      setSteps([newStep()]);
    } catch (e: any) {
      setErr(e?.message ?? "Gagal membuat PRO");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Perencanaan PRO</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Header input */}
          <div className="grid gap-3 lg:grid-cols-4">
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
              <div className="text-sm font-medium">UP (opsional)</div>
              <Input
                type="number"
                value={up}
                onChange={(e) => setUp(e.target.value)}
                placeholder="contoh: 4"
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

          {/* Table */}
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No.</TableHead>
                  <TableHead className="min-w-[220px]">Proses</TableHead>
                  <TableHead className="min-w-[220px]">Machine</TableHead>
                  <TableHead className="min-w-[260px]">Material</TableHead>
                  <TableHead className="w-[160px]">Qty Req</TableHead>
                  <TableHead className="w-[120px]">UoM</TableHead>
                  <TableHead className="w-[220px] text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {steps.map((s, idx) => {
                  const mat = getMaterial(s.materialId);
                  const uom = mat ? String(mat.uom) : "-";

                  return (
                    <TableRow key={s.key}>
                      <TableCell className="align-top">{idx + 1}</TableCell>

                      <TableCell className="align-top">
                        <select
                          value={s.processId ?? ""}
                          onChange={(e) => {
                            const v = e.target.value
                              ? Number(e.target.value)
                              : null;
                            setSteps((prev) =>
                              prev.map((x) =>
                                x.key === s.key ? { ...x, processId: v } : x,
                              ),
                            );
                          }}
                          className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                          disabled={loadingMaster}
                        >
                          <option value="">Pilih proses</option>
                          {(processes.data ?? []).map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.code} - {p.name}
                            </option>
                          ))}
                        </select>
                        {idx === 0 ? (
                          <div className="mt-1 text-xs opacity-70">
                            * Baris 1 menentukan prefix No. PRO.
                          </div>
                        ) : null}
                      </TableCell>

                      <TableCell className="align-top">
                        <select
                          value={s.machineId ?? ""}
                          onChange={(e) => {
                            const v = e.target.value
                              ? Number(e.target.value)
                              : null;
                            setSteps((prev) =>
                              prev.map((x) =>
                                x.key === s.key ? { ...x, machineId: v } : x,
                              ),
                            );
                          }}
                          className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                          disabled={loadingMaster}
                        >
                          <option value="">(optional)</option>
                          {(machines.data ?? []).map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>

                      <TableCell className="align-top">
                        <select
                          value={s.materialId ?? ""}
                          onChange={(e) => {
                            const v = e.target.value
                              ? Number(e.target.value)
                              : null;
                            setSteps((prev) =>
                              prev.map((x) =>
                                x.key === s.key
                                  ? {
                                      ...x,
                                      materialId: v,
                                      qtyReq: v ? x.qtyReq : "",
                                    }
                                  : x,
                              ),
                            );
                          }}
                          className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                          disabled={loadingMaster}
                        >
                          <option value="">(optional) pilih material</option>
                          {(materials.data ?? []).map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} ({String(m.uom)})
                            </option>
                          ))}
                        </select>
                      </TableCell>

                      <TableCell className="align-top">
                        <Input
                          type="number"
                          value={s.qtyReq}
                          onChange={(e) => {
                            const v = e.target.value;
                            setSteps((prev) =>
                              prev.map((x) =>
                                x.key === s.key ? { ...x, qtyReq: v } : x,
                              ),
                            );
                          }}
                          placeholder={s.materialId ? "Qty" : "-"}
                          disabled={!s.materialId || loadingMaster}
                        />
                      </TableCell>

                      <TableCell className="align-top">
                        <div className="flex h-10 items-center text-sm">
                          {uom}
                        </div>
                      </TableCell>

                      <TableCell className="align-top">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => moveStep(s.key, "up")}
                            disabled={idx === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => moveStep(s.key, "down")}
                            disabled={idx === steps.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeStep(s.key)}
                            disabled={steps.length === 1}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button type="button" variant="outline" onClick={addStep}>
              + Tambah Proses
            </Button>
            <Button
              type="button"
              onClick={submit}
              disabled={createPro.isPending || loadingMaster}
            >
              {createPro.isPending ? "Membuat..." : "Buat PRO"}
            </Button>
            <div className="text-xs opacity-70 sm:ml-auto">
              No. PRO: (kode proses pertama)(bulan)(tahun)(increment)
            </div>
          </div>

          {err ? <p className="text-destructive text-sm">{err}</p> : null}
          {ok ? <p className="text-sm">{ok}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
