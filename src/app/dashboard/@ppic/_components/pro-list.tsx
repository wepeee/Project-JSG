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


function shiftFromDate(d: Date) {
  const h = d.getHours();
  if (h >= 16) return 3;
  if (h >= 11) return 2;
  return 1;
}

function fmtSchedule(
  d?: Date | string | null,
  durationShifts = 0,
  customShifts?: Array<{ shiftIndex: number; scheduledDate: Date | string }>,
) {
  // 1. Custom per-shift scheduling (display all specific shifts)
  if (customShifts && customShifts.length > 0) {
    const sorted = customShifts
      .slice()
      .sort((a, b) => a.shiftIndex - b.shiftIndex);

    return (
      <div className="flex flex-col gap-0.5">
        {sorted.map((shift, idx) => {
          const dt =
            typeof shift.scheduledDate === "string"
              ? new Date(shift.scheduledDate)
              : shift.scheduledDate;
          const dateStr = dt.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          });
          const shiftNo = shiftFromDate(dt);

          return (
            <div key={idx} className="text-[10px]">
              <span className="font-medium">{dateStr}</span>{" "}
              <span className="text-blue-600 font-semibold">S{shiftNo}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // 2. Fallback logic (auto-calculated duration)
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  
  // Compact date: 28 Jan
  const dateStr = dt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
  
  const startShift = shiftFromDate(dt);
  let label = `S${startShift}`; // Compact: S1

  // Calculate end range if duration > 1
  if (durationShifts > 1) {
    const startAbs = startShift - 1;
    const endAbs = startAbs + (durationShifts - 1);

    const endShiftIndex = endAbs % 3;
    const endShift = endShiftIndex + 1;

    const daysForward = Math.floor(endAbs / 3);

    if (daysForward > 0) {
      const endDate = new Date(dt);
      endDate.setDate(endDate.getDate() + daysForward);
      const endDateStr = endDate.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      // Compact range crossing days: S1 → 30 Jan S3
      label = `S${startShift}→${endDateStr} S${endShift}`;
    } else {
      if (endShift !== startShift) {
        // Compact range mostly same day: S1-S3
        label = `S${startShift}-S${endShift}`;
      }
    }
  }

  return (
    <div className="text-[10px]">
      <span className="font-medium">{dateStr}</span>{" "}
      <span className="text-blue-600 font-semibold">{label}</span>
    </div>
  );
}

type StepDraft = {
  key: string;
  orderNo: number;
  processId: number | null;
  up: string;
  machineId: number | null;
  materialId: number | null;
  qtyReq: string;
  startDate?: string | null;
};

export default function ProList({ initialSelectedId, onClearJump }: Props) {
  const utils = api.useUtils();
  const processes = api.processes.list.useQuery();
  const machines = api.machines.list.useQuery();
  const materials = api.materials.list.useQuery();

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
  const [statusDraft, setStatusDraft] = React.useState<Status>("OPEN");
  const [processDraftId, setProcessDraftId] = React.useState<number | null>(null);
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
        // @ts-ignore
        startDate: s.startDate ? new Date(s.startDate).toISOString() : null,
      };
    });
  }, [detail.data]);

  const startEdit = () => {
    setErr(null);
    setEditing(true);
    setStepDrafts(toDraftSteps());
    setStatusDraft((detail.data?.status as Status) ?? "OPEN");
    // Init process draft from first step or just null
    const firstStepProc = detail.data?.steps?.[0]?.processId ?? null;
    setProcessDraftId(firstStepProc);
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

    if (!processDraftId) return setErr("Proses (Prefix) wajib dipilih di header");

    const drafts = stepDrafts.length ? stepDrafts : toDraftSteps();
    if (!drafts.length) return setErr("Minimal 1 proses harus ada");

    for (const s of drafts) {
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
      status: statusDraft,
      steps: drafts
        .slice()
        .sort((a, b) => a.orderNo - b.orderNo)
        .map((s) => ({
          orderNo: s.orderNo,
          processId: processDraftId, // Force use header process
          up: Number(s.up),
          machineId: s.machineId ?? null,
          materialId: s.materialId ?? null,
          qtyReq: s.materialId ? Number(s.qtyReq) : undefined,
          startDate: s.startDate ? new Date(s.startDate) : undefined,
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
              
              {!editing ? (
                <Info label="Status" value={p.status} />
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Status</div>
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value as Status)}
                    className={control}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="DONE">DONE</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              )}

              {!editing ? (
                <Info
                  label="Proses (Prefix)"
                  value={
                    // For editing, we show the current draft[0] process name
                    stepDrafts[0]?.processId
                      ? (processes.data?.find((x) => x.id === stepDrafts[0]!.processId)
                          ?.name ?? "-")
                      : (
                        p.steps?.[0]?.process ? `${p.steps[0].process.code} - ${p.steps[0].process.name}` : "-"
                      )
                  }
                />
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Proses (Prefix)</div>
                  <select
                    value={processDraftId ?? ""}
                    onChange={(e) => {
                      const v = e.target.value ? Number(e.target.value) : null;
                      setProcessDraftId(v);
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

            {/* Proses per step edit table removed. Now integrated into main table below. */}

            <div className="overflow-x-auto rounded-md border">
              <div className="min-w-[900px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Machine</TableHead>
                      <TableHead className="w-24 text-right">UP</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead className="w-24 text-right">Qty Mat</TableHead>
                      <TableHead className="w-20">UoM</TableHead>
                      <TableHead className="w-32">Estimasi</TableHead>
                      <TableHead className="w-40">Jadwal</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {(editing ? stepDrafts : p.steps)
                      .slice()
                      .sort((a, b) => a.orderNo - b.orderNo)
                      .map((item, idx) => {
                        const isDraft = editing;
                        // For draft, we find process/machine/material from React Query cache or props
                        // For real step (item), we access relations directly
                        
                        // Normalized getters
                        let machineName = "-";
                        let matName = "-";
                        let matUom = "-";
                        let stdOutputPerShift: number | null | undefined = null;
                        let startDateVal: Date | string | undefined | null = null;
                        let customShifts: Array<{ shiftIndex: number; scheduledDate: Date | string }> | undefined = undefined;

                        if (!isDraft) {
                           const s = item as typeof p.steps[number];
                           const mat0 = s.materials?.[0];
                           machineName = s.machine?.name ?? "-";
                           matName = mat0?.material?.name ?? "-";
                           matUom = mat0?.material?.uom ?? "-";
                           stdOutputPerShift = s.machine?.stdOutputPerShift;
                           startDateVal = (s as any).startDate;
                           // Extract custom shifts if available
                           customShifts = (s as any).shifts;
                        } else {
                           const d = item as StepDraft;
                           
                           // We need machines and materials lists. 
                           // I will assume machines and materials queries are available in scope (I will add them in next edit).
                           const m = machines.data?.find(x => x.id === d.machineId);
                           machineName = m?.name ?? "-";
                           const mat = materials.data?.find(x => x.id === d.materialId);
                           matName = mat?.name ?? "-";
                           matUom = mat?.uom ?? "-";
                           stdOutputPerShift = m?.stdOutputPerShift;
                           startDateVal = d.startDate;
                        }

                        // Shared values
                        const upVal = isDraft ? (item as StepDraft).up : (item as any).up;
                        const qtyReqVal = isDraft ? (item as StepDraft).qtyReq : (item as any).materials?.[0]?.qtyReq;
                        
                        // Calculate duration shifts for display
                        let durationShifts = 0;
                        const qty = Number(qtyPoPcs) || 0;
                        const upp = Number(upVal);
                        if (upp > 0 && stdOutputPerShift && stdOutputPerShift > 0) {
                           const actualQty = qty / upp;
                           durationShifts = Math.ceil(actualQty / stdOutputPerShift);
                        }

                        return (
                          <TableRow key={isDraft ? (item as StepDraft).key : (item as any).id}>
                           
                            <TableCell>
                              {editing ? (
                                <select
                                  value={(item as StepDraft).machineId ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value ? Number(e.target.value) : null;
                                    setStepDrafts(prev => prev.map(x => x.key === (item as StepDraft).key ? { ...x, machineId: val } : x));
                                  }}
                                  className="border-input bg-background h-8 w-full rounded border px-2 text-xs"
                                >
                                  <option value="">(Optional)</option>
                                  {(machines.data ?? []).map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                  ))}
                                </select>
                              ) : machineName}
                            </TableCell>

                            <TableCell className="text-right">
                              {editing ? (
                                <Input 
                                  type="number" 
                                  className="h-8 w-20 bg-background border-input text-right text-xs"
                                  value={(item as StepDraft).up}
                                  onChange={(e) => {
                                    setStepDrafts(prev => prev.map(x => x.key === (item as StepDraft).key ? { ...x, up: e.target.value } : x));
                                  }}
                                />
                              ) : (
                                upVal ?? "-"
                              )}
                            </TableCell>
                            
                            <TableCell>
                              {editing ? (
                                <select
                                  value={(item as StepDraft).materialId ?? ""}
                                  onChange={(e) => {
                                    const val = e.target.value ? Number(e.target.value) : null;
                                    setStepDrafts(prev => prev.map(x => x.key === (item as StepDraft).key ? { ...x, materialId: val } : x));
                                  }}
                                  className="border-input bg-background h-8 w-full rounded border px-2 text-xs"
                                >
                                  <option value="">(None)</option>
                                  {(materials.data ?? []).map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                  ))}
                                </select>
                              ) : matName}
                            </TableCell>

                            <TableCell className="text-right">
                              {editing ? (
                                <Input 
                                  type="number"
                                  className="h-8 w-20 bg-background border-input text-right text-xs"
                                  value={(item as StepDraft).qtyReq}
                                  placeholder={!!(item as StepDraft).materialId ? "Req" : "-"}
                                  disabled={!(item as StepDraft).materialId}
                                  onChange={(e) => {
                                    setStepDrafts(prev => prev.map(x => x.key === (item as StepDraft).key ? { ...x, qtyReq: e.target.value } : x));
                                  }}
                                />
                              ) : (
                                qtyReqVal ? String(qtyReqVal) : "-"
                              )}
                            </TableCell>

                            <TableCell className="text-xs">{matUom}</TableCell>
                            
                            <TableCell className="text-xs font-medium text-blue-600">
                              {fmtDuration(
                                Number(qtyPoPcs) || 0,
                                Number(upVal),
                                stdOutputPerShift,
                              )}
                            </TableCell>

                            <TableCell className="text-xs">
                              {fmtSchedule(startDateVal, durationShifts, customShifts)}
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
