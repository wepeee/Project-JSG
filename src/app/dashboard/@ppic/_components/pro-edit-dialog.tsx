"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
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

type Props = {
  proId: number | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

type StepDraft = {
  key: string;
  orderNo: number;
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

export default function ProEditDialog({ proId, open, onOpenChange }: Props) {
  const utils = api.useUtils();

  const processes = api.processes.list.useQuery();
  const machines = api.machines.list.useQuery();
  const materials = api.materials.list.useQuery();

  const pro = api.pros.getById.useQuery(
    { id: proId ?? 0 },
    { enabled: !!proId },
  );

  const update = api.pros.update.useMutation({
    onSuccess: async () => {
      await utils.pros.list.invalidate();
      if (proId) await utils.pros.getById.invalidate({ id: proId });
    },
  });

  const [productName, setProductName] = React.useState("");
  const [qtyPoPcs, setQtyPoPcs] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<string>("");

  const [steps, setSteps] = React.useState<StepDraft[]>([]);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!pro.data) return;

    setProductName(pro.data.productName ?? "");
    setQtyPoPcs(String(pro.data.qtyPoPcs ?? ""));
    setStartDate(
      pro.data.startDate
        ? new Date(pro.data.startDate).toISOString().slice(0, 10)
        : "",
    );

    setSteps(
      (pro.data.steps ?? []).map((s: any) => {
        const mat0 = s.materials?.[0];
        return {
          key: uid(),
          orderNo: s.orderNo,
          processId: s.processId,
          up: String(s.up ?? ""),
          machineId: s.machineId ?? null,
          materialId: mat0?.materialId ?? null,
          qtyReq: mat0?.qtyReq ? String(mat0.qtyReq) : "",
        };
      }),
    );
  }, [pro.data]);

  const control =
    "border-input bg-background h-10 w-full rounded-md border px-3 text-sm";

  const moveStep = (orderNo: number, dir: "up" | "down") => {
    setSteps((prev) => {
      const idx = prev.findIndex((x) => x.orderNo === orderNo);
      if (idx < 0) return prev;
      const nextIdx = dir === "up" ? idx - 1 : idx + 1;
      if (nextIdx < 0 || nextIdx >= prev.length) return prev;

      const copy = [...prev];
      // swap orderNo
      const a = copy[idx]!;
      const b = copy[nextIdx]!;
      const aNo = a.orderNo;
      a.orderNo = b.orderNo;
      b.orderNo = aNo;
      // swap positions
      copy[idx] = b;
      copy[nextIdx] = a;

      // normalize sort
      return copy.sort((x, y) => x.orderNo - y.orderNo);
    });
  };

  const submit = async () => {
    setErr(null);
    if (!proId) return;

    const prod = productName.trim();
    if (!prod) return setErr("Produk wajib diisi");

    const qty = Number(qtyPoPcs);
    if (!qtyPoPcs.trim() || !Number.isFinite(qty) || qty <= 0) {
      return setErr("Qty PO wajib > 0");
    }

    for (const s of steps) {
      if (!s.processId)
        return setErr(`Order ${s.orderNo}: proses belum dipilih`);
      const upNum = Number(s.up);
      if (!s.up.trim() || !Number.isFinite(upNum) || upNum <= 0) {
        return setErr(`Order ${s.orderNo}: UP wajib > 0`);
      }
      if (s.materialId) {
        const qNum = Number(s.qtyReq);
        if (!s.qtyReq.trim() || !Number.isFinite(qNum) || qNum <= 0) {
          return setErr(`Order ${s.orderNo}: Qty material wajib > 0`);
        }
      }
    }

    await update.mutateAsync({
      id: proId,
      productName: prod,
      qtyPoPcs: qty,
      startDate: startDate ? new Date(`${startDate}T00:00:00`) : undefined,
      steps: steps
        .slice()
        .sort((a, b) => a.orderNo - b.orderNo)
        .map((s) => ({
          orderNo: s.orderNo,
          processId: s.processId!,
          up: Number(s.up),
          machineId: s.machineId ?? null,
          materialId: s.materialId ?? null,
          qtyReq: s.materialId ? Number(s.qtyReq) : undefined,
        })),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit PRO</DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(85vh-140px)] space-y-4 overflow-y-auto pr-1">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="text-sm font-medium">Produk</div>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Qty PO</div>
              <Input
                type="number"
                value={qtyPoPcs}
                onChange={(e) => setQtyPoPcs(e.target.value)}
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

          <div className="overflow-x-auto rounded-md border">
            <div className="min-w-[980px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">No</TableHead>
                    <TableHead className="min-w-[260px]">Proses</TableHead>
                    <TableHead className="w-24">UP</TableHead>
                    <TableHead className="min-w-[220px]">Machine</TableHead>
                    <TableHead className="min-w-[260px]">Material</TableHead>
                    <TableHead className="w-28">Qty</TableHead>
                    <TableHead className="w-24">UoM</TableHead>
                    <TableHead className="w-48 text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {steps
                    .slice()
                    .sort((a, b) => a.orderNo - b.orderNo)
                    .map((s) => {
                      const mat = s.materialId
                        ? (materials.data ?? []).find(
                            (m) => m.id === s.materialId,
                          )
                        : null;

                      return (
                        <TableRow key={s.key}>
                          <TableCell>{s.orderNo}</TableCell>

                          <TableCell>
                            <select
                              value={s.processId ?? ""}
                              onChange={(e) => {
                                const v = e.target.value
                                  ? Number(e.target.value)
                                  : null;
                                setSteps((prev) =>
                                  prev.map((x) =>
                                    x.key === s.key
                                      ? { ...x, processId: v }
                                      : x,
                                  ),
                                );
                              }}
                              className={control}
                            >
                              <option value="">Pilih proses</option>
                              {(processes.data ?? []).map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.code} - {p.name}
                                </option>
                              ))}
                            </select>
                          </TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              value={s.up}
                              onChange={(e) =>
                                setSteps((prev) =>
                                  prev.map((x) =>
                                    x.key === s.key
                                      ? { ...x, up: e.target.value }
                                      : x,
                                  ),
                                )
                              }
                              className="h-10 text-center"
                            />
                          </TableCell>

                          <TableCell>
                            <select
                              value={s.machineId ?? ""}
                              onChange={(e) => {
                                const v = e.target.value
                                  ? Number(e.target.value)
                                  : null;
                                setSteps((prev) =>
                                  prev.map((x) =>
                                    x.key === s.key
                                      ? { ...x, machineId: v }
                                      : x,
                                  ),
                                );
                              }}
                              className={control}
                            >
                              <option value="">(optional)</option>
                              {(machines.data ?? []).map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name}
                                </option>
                              ))}
                            </select>
                          </TableCell>

                          <TableCell>
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
                              className={control}
                            >
                              <option value="">
                                (optional) pilih material
                              </option>
                              {(materials.data ?? []).map((m) => (
                                <option key={m.id} value={m.id}>
                                  {m.name} ({String(m.uom)})
                                </option>
                              ))}
                            </select>
                          </TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              value={s.qtyReq}
                              onChange={(e) =>
                                setSteps((prev) =>
                                  prev.map((x) =>
                                    x.key === s.key
                                      ? { ...x, qtyReq: e.target.value }
                                      : x,
                                  ),
                                )
                              }
                              disabled={!s.materialId}
                              className="h-10"
                            />
                          </TableCell>

                          <TableCell>{mat?.uom ?? "-"}</TableCell>

                          <TableCell className="text-right">
                            <div className="inline-flex gap-2">
                              <Button
                                variant="outline"
                                className="h-9"
                                onClick={() => moveStep(s.orderNo, "up")}
                                disabled={s.orderNo === 1}
                              >
                                ↑
                              </Button>
                              <Button
                                variant="outline"
                                className="h-9"
                                onClick={() => moveStep(s.orderNo, "down")}
                                disabled={s.orderNo === steps.length}
                              >
                                ↓
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </div>
          </div>

          {err ? <p className="text-destructive text-sm">{err}</p> : null}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={submit} disabled={update.isPending}>
            {update.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
