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

type Status = "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED";

function fmtDate(d?: Date | string | null) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleDateString("id-ID");
}
function fmtDateTime(d?: Date | string | null) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  return dt.toLocaleString("id-ID");
}

function fmtDuration(
  qty: number,
  up: number | null,
  stdPerShift?: number | null,
) {
  if (!stdPerShift || stdPerShift <= 0) return "-";

  // Rumus: Total Qty / UP = Total Lembar pengerjaan mesin
  const actualQty = up && up > 0 ? qty / up : qty;

  const totalShifts = Math.ceil(actualQty / stdPerShift);
  const days = Math.floor(totalShifts / 3); // Asumsi 1 hari = 3 shift
  const shifts = totalShifts % 3;

  const parts = [];
  if (days > 0) parts.push(`${days} Hari`);
  if (shifts > 0) parts.push(`${shifts} Shift`);

  const formatted = parts.length > 0 ? parts.join(", ") : "0 Shift";
  return days > 0 ? `${formatted} (Total ${totalShifts} S)` : formatted;
}

type Props = {
  initialSelectedId?: number | null;
  onClearJump?: () => void;
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

export default function ProList({ initialSelectedId, onClearJump }: Props) {
  const utils = api.useUtils();
  const processes = api.processes.list.useQuery();

  // ===== VIEW STATE =====
  const [selectedId, setSelectedId] = React.useState<number | null>(
    initialSelectedId ?? null,
  ); // null => list view

  React.useEffect(() => {
    if (initialSelectedId) {
      setSelectedId(initialSelectedId);
      onClearJump?.();
    }
  }, [initialSelectedId]);

  // ===== LIST STATE =====
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<Status | "ALL">("ALL");

  const list = api.pros.list.useQuery({
    q: q.trim() ? q.trim() : undefined,
    status: status === "ALL" ? undefined : status,
    take: 50,
  });

  // ===== DETAIL QUERY (only when selected) =====
  const detail = api.pros.getById.useQuery(
    { id: selectedId ?? 0 },
    { enabled: !!selectedId },
  );

  // ===== EDIT MODE (header) =====
  const [editing, setEditing] = React.useState(false);
  const [productName, setProductName] = React.useState("");
  const [qtyPoPcs, setQtyPoPcs] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [stepDrafts, setStepDrafts] = React.useState<StepDraft[]>([]);

  const update = api.pros.update.useMutation({
    onSuccess: async () => {
      if (selectedId) await utils.pros.getById.invalidate({ id: selectedId });
      await utils.pros.list.invalidate();
      setEditing(false);
    },
  });

  const del = api.pros.delete.useMutation({
    onSuccess: async (_data, vars) => {
      await utils.pros.list.invalidate();
      await utils.pros.getById.invalidate({ id: vars.id });
    },
  });

  React.useEffect(() => {
    if (!detail.data || editing) return;
    setProductName(detail.data.productName ?? "");
    setQtyPoPcs(String(detail.data.qtyPoPcs ?? ""));
    setStartDate(
      detail.data.startDate
        ? new Date(detail.data.startDate).toISOString().slice(0, 10)
        : "",
    );
  }, [detail.data]);

  const [err, setErr] = React.useState<string | null>(null);

  const onDeletePro = async (id: number, proNumber?: string) => {
    setErr(null);
    const ok = window.confirm(
      `Hapus PRO ${proNumber ?? String(id)}? Tindakan ini tidak bisa dibatalkan.`,
    );
    if (!ok) return;

    try {
      await del.mutateAsync({ id });
      if (selectedId === id) setSelectedId(null);
      setEditing(false);
    } catch (e: any) {
      setErr(e?.message ?? "Gagal menghapus PRO");
    }
  };
  const control =
    "border-input bg-background h-10 w-full rounded-md border px-3 text-sm";

  const toDraftSteps = React.useCallback((): StepDraft[] => {
    if (!detail.data) return [];
    return detail.data.steps.map((s) => {
      const mat0 = s.materials?.[0];
      return {
        key: String(s.id),
        orderNo: s.orderNo,
        processId: s.processId ?? null,
        up: String(s.up ?? 1),
        machineId: s.machineId ?? null,
        materialId: mat0?.materialId ?? null,
        qtyReq: mat0?.qtyReq ? String(mat0.qtyReq) : "",
      };
    });
  }, [detail.data]);

  const startEdit = () => {
    setErr(null);
    setEditing(true);
    setStepDrafts(toDraftSteps());
  };

  const cancelEdit = () => {
    setErr(null);
    setEditing(false);
    setStepDrafts([]);
    if (!detail.data) return;
    setProductName(detail.data.productName ?? "");
    setQtyPoPcs(String(detail.data.qtyPoPcs ?? ""));
    setStartDate(
      detail.data.startDate
        ? new Date(detail.data.startDate).toISOString().slice(0, 10)
        : "",
    );
  };

  const saveAll = async () => {
    setErr(null);
    if (!detail.data || !selectedId) return;

    const prod = productName.trim();
    if (!prod) return setErr("Produk wajib diisi");

    const qty = Number(qtyPoPcs);
    if (!qtyPoPcs.trim() || !Number.isFinite(qty) || qty <= 0) {
      return setErr("Qty PO wajib > 0");
    }

    const drafts = stepDrafts.length ? stepDrafts : toDraftSteps();
    if (!drafts.length) return setErr("Minimal 1 proses harus ada");

    for (const s of drafts) {
      if (!s.processId)
        return setErr(`Step ${s.orderNo}: proses wajib dipilih`);
      const upNum = Number(s.up);
      if (!s.up.trim() || !Number.isFinite(upNum) || upNum < 0) {
        return setErr(`Step ${s.orderNo}: UP wajib >= 0`);
      }
      if (s.materialId) {
        const qNum = Number(s.qtyReq);
        if (!s.qtyReq.trim() || !Number.isFinite(qNum) || qNum <= 0) {
          return setErr(`Step ${s.orderNo}: Qty material wajib > 0`);
        }
      }
    }

    await update.mutateAsync({
      id: selectedId,
      productName: prod,
      qtyPoPcs: qty,
      startDate: startDate ? new Date(`${startDate}T00:00:00`) : undefined,
      status: detail.data.status,
      steps: drafts
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
  };

  const saveHeaderOnly = async () => {
    setErr(null);
    if (!detail.data || !selectedId) return;

    const prod = productName.trim();
    if (!prod) return setErr("Produk wajib diisi");

    const qty = Number(qtyPoPcs);
    if (!qtyPoPcs.trim() || !Number.isFinite(qty) || qty <= 0) {
      return setErr("Qty PO wajib > 0");
    }

    // IMPORTANT: update router kamu butuh steps juga.
    // Jadi kita kirim steps existing apa adanya (read-only sementara).
    await update.mutateAsync({
      id: selectedId,
      productName: prod,
      qtyPoPcs: qty,
      startDate: startDate ? new Date(`${startDate}T00:00:00`) : undefined,
      status: detail.data.status,
      steps: detail.data.steps.map((s) => {
        const mat0 = s.materials?.[0];
        return {
          orderNo: s.orderNo,
          processId: s.processId,
          up: s.up ?? 1,
          machineId: s.machineId ?? null,
          materialId: mat0?.materialId ?? null,
          qtyReq: mat0?.qtyReq ? Number(mat0.qtyReq) : undefined,
        };
      }),
    });
  };

  // =========================
  // DETAIL VIEW (FULL PAGE)
  // =========================
  if (selectedId) {
    if (detail.isLoading) {
      return (
        <Card>
          <CardContent className="py-10 text-sm opacity-70">
            Loading...
          </CardContent>
        </Card>
      );
    }

    if (detail.error || !detail.data) {
      return (
        <Card>
          <CardContent className="text-destructive py-10 text-sm">
            {detail.error?.message ?? "PRO tidak ditemukan"}
          </CardContent>
        </Card>
      );
    }

    const p = detail.data;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedId(null);
              setEditing(false);
              setStepDrafts([]);
              setErr(null);
            }}
          >
            Kembali ke daftar
          </Button>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => void onDeletePro(p.id, p.proNumber)}
              disabled={del.isPending || update.isPending}
            >
              {del.isPending ? "Menghapus..." : "Hapus PRO"}
            </Button>

            {!editing ? (
              <Button onClick={startEdit}>Edit PRO</Button>
            ) : (
              <>
                <Button variant="outline" onClick={cancelEdit}>
                  Batal
                </Button>
                <Button
                  onClick={saveAll}
                  disabled={update.isPending || del.isPending}
                >
                  {update.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </>
            )}
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Detail PRO</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Info label="No. PRO" value={p.proNumber} />
              <Info label="Status" value={p.status} />
              {!editing ? (
                <Info
                  label="Proses (Prefix)"
                  value={
                    p.steps?.[0]
                      ? `${p.steps[0].process.code} - ${p.steps[0].process.name}`
                      : "-"
                  }
                />
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Proses (Prefix)</div>
                  <select
                    value={stepDrafts[0]?.processId ?? ""}
                    onChange={(e) => {
                      const v = e.target.value ? Number(e.target.value) : null;
                      setStepDrafts((prev) => {
                        if (!prev.length) return prev;
                        const copy = [...prev];
                        copy[0] = { ...copy[0]!, processId: v };
                        return copy;
                      });
                    }}
                    className={control}
                    disabled={
                      processes.isLoading || update.isPending || del.isPending
                    }
                  >
                    <option value="">Pilih proses</option>
                    {(processes.data ?? []).map((proc) => (
                      <option key={proc.id} value={proc.id}>
                        {proc.code} - {proc.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <Info label="Dibuat" value={fmtDateTime(p.createdAt)} />

              <div className="space-y-2 lg:col-span-2">
                <div className="text-sm font-medium">Produk</div>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Qty PO</div>
                <Input
                  type="number"
                  value={qtyPoPcs}
                  onChange={(e) => setQtyPoPcs(e.target.value)}
                  disabled={!editing}
                />
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Tanggal Mulai</div>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={!editing}
                />
              </div>
            </div>

            {err ? <p className="text-destructive text-sm">{err}</p> : null}

            <Separator />

            {editing ? (
              <div className="space-y-2">
                <div className="text-sm font-medium">Proses per Step</div>
                <div className="overflow-x-auto rounded-md border">
                  <div className="min-w-[520px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Step</TableHead>
                          <TableHead>Proses</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stepDrafts
                          .slice()
                          .sort((a, b) => a.orderNo - b.orderNo)
                          .map((st) => (
                            <TableRow key={st.key}>
                              <TableCell>{st.orderNo}</TableCell>
                              <TableCell>
                                <select
                                  value={st.processId ?? ""}
                                  onChange={(e) => {
                                    const v = e.target.value
                                      ? Number(e.target.value)
                                      : null;
                                    setStepDrafts((prev) =>
                                      prev.map((x) =>
                                        x.key === st.key
                                          ? { ...x, processId: v }
                                          : x,
                                      ),
                                    );
                                  }}
                                  className={control}
                                  disabled={
                                    processes.isLoading ||
                                    update.isPending ||
                                    del.isPending
                                  }
                                >
                                  <option value="">Pilih proses</option>
                                  {(processes.data ?? []).map((proc) => (
                                    <option key={proc.id} value={proc.id}>
                                      {proc.code} - {proc.name}
                                    </option>
                                  ))}
                                </select>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <div className="text-xs opacity-70">
                  Proses pertama menentukan prefix No. PRO (No. PRO tidak diubah
                  otomatis).
                </div>
              </div>
            ) : null}

            <div className="overflow-x-auto rounded-md border">
              <div className="min-w-[760px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Machine</TableHead>
                      <TableHead className="w-20 text-right">UP</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead className="w-24 text-right">Qty</TableHead>
                      <TableHead className="w-20">UoM</TableHead>
                      <TableHead className="w-32">Estimasi</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {p.steps.map((s) => {
                      const mat0 = s.materials?.[0];
                      return (
                        <TableRow key={s.id}>
                          <TableCell>{s.machine?.name ?? "-"}</TableCell>
                          <TableCell className="text-right">
                            {s.up ?? "-"}
                          </TableCell>
                          <TableCell>{mat0?.material?.name ?? "-"}</TableCell>
                          <TableCell className="text-right">
                            {mat0?.qtyReq ? String(mat0.qtyReq) : "-"}
                          </TableCell>
                          <TableCell>{mat0?.material?.uom ?? "-"}</TableCell>
                          <TableCell className="text-xs font-medium text-blue-600">
                            {fmtDuration(
                              p.qtyPoPcs,
                              s.up,
                              s.machine?.stdOutputPerShift,
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="text-xs opacity-70">
              Step masih read-only di halaman ini. Kalau kamu mau edit step juga
              (UP/Machine/Material/Qty), kita bikin tombol “Edit” per step
              (dialog kecil) tapi tetap stay di halaman detail.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // =========================
  // LIST VIEW
  // =========================
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Daftar PRO</CardTitle>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari No. PRO / Produk..."
              className="sm:w-72"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="border-input bg-background h-10 rounded-md border px-3 text-sm sm:w-48"
            >
              <option value="ALL">Semua Status</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <div className="min-w-[980px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-44">No. PRO</TableHead>
                  <TableHead>Produk</TableHead>
                  <TableHead className="w-32 text-right">Qty PO</TableHead>
                  <TableHead className="w-28">Mulai</TableHead>
                  <TableHead className="w-28">Status</TableHead>
                  <TableHead className="w-28 text-center">
                    Estimasi Durasi
                  </TableHead>
                  <TableHead className="w-24 text-right">Steps</TableHead>
                  <TableHead className="w-40 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {list.isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm opacity-70"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : list.error ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-destructive py-10 text-center text-sm"
                    >
                      {list.error.message}
                    </TableCell>
                  </TableRow>
                ) : list.data?.items?.length ? (
                  list.data.items.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        {p.proNumber}
                      </TableCell>
                      <TableCell>{p.productName}</TableCell>
                      <TableCell className="text-right">
                        {p.qtyPoPcs.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>{fmtDate(p.startDate)}</TableCell>
                      <TableCell>{p.status}</TableCell>
                      <TableCell className="text-center">
                        <div className="text-xs font-semibold text-blue-600">
                          {p.steps?.[0]?.machine?.stdOutputPerShift
                            ? fmtDuration(
                                p.qtyPoPcs,
                                p.steps[0].up,
                                p.steps[0].machine.stdOutputPerShift,
                              )
                            : "-"}
                        </div>
                        {p.steps.length > 1 && (
                          <div className="text-[10px] opacity-50">
                            (berdasarkan proses 1)
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {p.steps?.length ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedId(p.id)}
                          >
                            Detail
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => void onDeletePro(p.id, p.proNumber)}
                            disabled={del.isPending}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm opacity-70"
                    >
                      Tidak ada data PRO.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
