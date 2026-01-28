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

function getShiftNo(d?: Date | string | null): string {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  const h = dt.getHours();
  if (h >= 16) return "Shift 3";
  if (h >= 11) return "Shift 2";
  return "Shift 1";
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

function combineDateShift(dateStr: string | null | undefined, shift: number) {
  if (!dateStr) return undefined;
  const d = new Date(`${dateStr}T00:00:00`);
  if (shift === 1) d.setHours(6, 0, 0, 0);
  else if (shift === 2) d.setHours(11, 0, 0, 0);
  else d.setHours(16, 0, 0, 0);
  return d;
}

function fmtSchedule(
  d?: Date | string | null,
  durationShifts = 0,
  customShifts?: Array<{ shiftIndex: number; scheduledDate: Date | string }>,
) {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  const startShift = shiftFromDate(dt);

  // If there are custom shifts, we need to reconstruct the FULL schedule map
  if (customShifts && customShifts.length > 0) {
    const shiftMap = new Map<number, Date>();
    customShifts.forEach((s) => {
      shiftMap.set(
        s.shiftIndex,
        typeof s.scheduledDate === "string"
          ? new Date(s.scheduledDate)
          : s.scheduledDate,
      );
    });

    const results: Array<{ date: Date; shift: number }> = [];

    // Helper to calculate default date for shift index i
    let currentDay = new Date(dt);
    let currentShift = startShift;

    for (let i = 0; i < durationShifts; i++) {
        // Default relative to start
        const defaultDate = new Date(currentDay); // clone
        const defaultShiftVal = currentShift;

        // Check overwrite
        const customDate = shiftMap.get(i);
        
        let finalDate: Date;
        let finalShift: number;

        if (customDate) {
            finalDate = customDate;
            finalShift = shiftFromDate(customDate);
        } else {
            finalDate = defaultDate;
            finalShift = defaultShiftVal;
        }

        results.push({ date: finalDate, shift: finalShift });

        // Advance default cursor for next loop
        if (currentShift < 3) {
            currentShift++;
        } else {
            currentShift = 1;
            currentDay.setDate(currentDay.getDate() + 1);
        }
    }

    // Sort by date then shift
    results.sort((a, b) => {
        const tA = a.date.getTime();
        const tB = b.date.getTime();
        if (tA !== tB) return tA - tB;
        return a.shift - b.shift;
    });

    // Group by Date for cleaner display
    // e.g. 28 Jan: S1, S2
    //      30 Jan: S3
    const grouped = new Map<string, number[]>();
    results.forEach(r => {
        const dStr = r.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
        const arr = grouped.get(dStr) ?? [];
        arr.push(r.shift);
        grouped.set(dStr, arr);
    });

    return (
      <div className="flex flex-col gap-0.5">
        {Array.from(grouped.entries()).map(([dateStr, shifts], idx) => (
            <div key={idx} className="text-[10px]">
                <span className="font-medium">{dateStr}</span>{" "}
                <span className="text-blue-600 font-semibold">S{shifts.join(", S")}</span>
            </div>
        ))}
      </div>
    );
  }

  // 2. Fallback logic (original range logic if no custom shifts at all)
  
  // Compact date: 28 Jan
  const dateStr = dt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
  
  let label = `S${startShift}`;

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
  up: string;
  machineId: number | null;
  materialId: number | null;
  qtyReq: string;
  startDate?: string | null;
  shift: number; // 1, 2, 3
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
  const [statusDraft, setStatusDraft] = React.useState<Status>("OPEN");
  const [processDraftId, setProcessDraftId] = React.useState<number | null>(null);
  const [expandDraft, setExpandDraft] = React.useState(false);
  const [stepDrafts, setStepDrafts] = React.useState<StepDraft[]>([]);

  // ===== DIALOG ADD/EDIT STEP =====
  const [stepDialogOpen, setStepDialogOpen] = React.useState(false);
  const [editingStepKey, setEditingStepKey] = React.useState<string | null>(null);
  const [stepDraft, setStepDraft] = React.useState<Omit<StepDraft, "key" | "orderNo">>({
    up: "",
    machineId: null,
    materialId: null,
    qtyReq: "",
    startDate: null,
    shift: 1,
  });

  const openAddStep = () => {
    setEditingStepKey(null);
    setStepDraft({
      up: "",
      machineId: null,
      materialId: null,
      qtyReq: "",
      startDate: null,
      shift: 1,
    });
    setStepDialogOpen(true);
  };

  const openEditStep = (step: StepDraft) => {
    setEditingStepKey(step.key);
    setStepDraft({
      up: step.up,
      machineId: step.machineId,
      materialId: step.materialId,
      qtyReq: step.qtyReq,
      startDate: step.startDate,
      shift: step.shift,
    });
    setStepDialogOpen(true);
  };

  const saveStepDraft = () => {
    if (!stepDraft.up.trim()) return alert("UP wajib diisi");
    const upNum = Number(stepDraft.up);
    if (!Number.isFinite(upNum) || upNum < 0) return alert("UP harus >= 0");

    if (stepDraft.materialId) {
      const qNum = Number(stepDraft.qtyReq);
      if (!stepDraft.qtyReq.trim() || !Number.isFinite(qNum) || qNum <= 0) {
        return alert("Qty Material wajib > 0");
      }
    }

    if (editingStepKey) {
      // Edit existing step
      setStepDrafts((prev) =>
        prev.map((s) =>
          s.key === editingStepKey
            ? { ...s, ...stepDraft }
            : s
        )
      );
    } else {
      // Add new step
      const newStep: StepDraft = {
        key: Math.random().toString(36).slice(2),
        orderNo: stepDrafts.length + 1,
        ...stepDraft,
      };
      setStepDrafts((prev) => [...prev, newStep]);
    }

    setStepDialogOpen(false);
  };

  const removeStep = (key: string) => {
    setStepDrafts((prev) => {
      const filtered = prev.filter((s) => s.key !== key);
      // Re-number orderNo
      return filtered.map((s, idx) => ({ ...s, orderNo: idx + 1 }));
    });
  };


  const update = api.pros.update.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.pros.getById.cancel();
      await utils.pros.list.cancel();
      await utils.pros.getSchedule.cancel();
      
      // Snapshot previous values
      const previousDetail = utils.pros.getById.getData({ id: variables.id });
      const previousList = utils.pros.list.getData({});
      const previousSchedule = utils.pros.getSchedule.getData();
      
      // Optimistically update detail cache
      if (previousDetail) {
        utils.pros.getById.setData(
          { id: variables.id },
          {
            ...previousDetail,
            productName: variables.productName,
            qtyPoPcs: variables.qtyPoPcs,
            startDate: variables.startDate ?? previousDetail.startDate,
            status: variables.status ?? previousDetail.status,
            processId: variables.processId,
            steps: variables.steps
              .map((stepInput, idx) => {
                const existingStep = previousDetail.steps[idx];
                if (!existingStep) return null;
                return {
                  ...existingStep,
                  orderNo: stepInput.orderNo,
                  up: stepInput.up,
                  machineId: stepInput.machineId ?? null,
                  startDate: stepInput.startDate ?? existingStep.startDate,
                };
              })
              .filter((s): s is NonNullable<typeof s> => s !== null),
          }
        );
      }
      
      // Optimistically update list cache
      if (previousList) {
        utils.pros.list.setData(
          {},
          {
            ...previousList,
            items: previousList.items.map((pro) =>
              pro.id === variables.id
                ? {
                    ...pro,
                    productName: variables.productName,
                    qtyPoPcs: variables.qtyPoPcs,
                    startDate: variables.startDate ?? pro.startDate,
                    status: variables.status ?? pro.status,
                  }
                : pro
            ),
          }
        );
      }
      
      return { previousDetail, previousList };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousDetail) {
        utils.pros.getById.setData({ id: variables.id }, context.previousDetail);
      }
      if (context?.previousList) {
        utils.pros.list.setData({}, context.previousList);
      }
    },
    onSuccess: async () => {
      if (selectedId) await utils.pros.getById.invalidate({ id: selectedId });
      await utils.pros.list.invalidate();
      await utils.pros.getSchedule.invalidate();
      setEditing(false);
    },
  });

  const del = api.pros.delete.useMutation({
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await utils.pros.list.cancel();
      await utils.pros.getById.cancel();
      await utils.pros.getSchedule.cancel();
      
      // Snapshot previous values
      const previousList = utils.pros.list.getData({});
      const previousDetail = utils.pros.getById.getData({ id: variables.id });
      const previousSchedule = utils.pros.getSchedule.getData();
      
      // Optimistically remove from list cache
      if (previousList) {
        utils.pros.list.setData(
          {},
          {
            ...previousList,
            items: previousList.items.filter((pro) => pro.id !== variables.id),
          }
        );
      }
      
      return { previousList, previousDetail };
    },
    onError: (_err, variables, context) => {
      // Rollback on error
      if (context?.previousList) {
        utils.pros.list.setData({}, context.previousList);
      }
      if (context?.previousDetail) {
        utils.pros.getById.setData({ id: variables.id }, context.previousDetail);
      }
    },
    onSuccess: async (_data, vars) => {
      await utils.pros.list.invalidate();
      await utils.pros.getById.invalidate({ id: vars.id });
      await utils.pros.getSchedule.invalidate();
    },
  });

  React.useEffect(() => {
    if (!detail.data || editing) return;
    setProductName(detail.data.productName ?? "");
    setQtyPoPcs(String(detail.data.qtyPoPcs ?? ""));
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
      const dt = s.startDate ? new Date(s.startDate) : null;
      return {
        key: String(s.id),
        orderNo: s.orderNo,
        up: String(s.up ?? 1),
        machineId: s.machineId ?? null,
        materialId: mat0?.materialId ?? null,
        qtyReq: mat0?.qtyReq ? String(mat0.qtyReq) : "",
        startDate: dt ? dt.toISOString().slice(0, 10) : null,
        shift: dt ? shiftFromDate(dt) : 1,
      };
    });
  }, [detail.data]);

  const startEdit = () => {
    setErr(null);
    setEditing(true);
    setStepDrafts(toDraftSteps());
    setStatusDraft((detail.data?.status as Status) ?? "OPEN");
    setExpandDraft(false);
    // Init process draft from header
    setProcessDraftId(detail.data?.processId ?? null);
  };

  const cancelEdit = () => {
    setErr(null);
    setEditing(false);
    setStepDrafts([]);
    if (!detail.data) return;
    setProductName(detail.data.productName ?? "");
    setQtyPoPcs(String(detail.data.qtyPoPcs ?? ""));
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
      status: statusDraft,
      processId: processDraftId,
      steps: drafts
        .slice()
        .sort((a, b) => a.orderNo - b.orderNo)
        .map((s) => ({
          orderNo: s.orderNo,
          up: Number(s.up),
          machineId: s.machineId ?? null,
          materialId: s.materialId ?? null,
          qtyReq: s.materialId ? Number(s.qtyReq) : undefined,
          startDate: combineDateShift(s.startDate, s.shift),
        })),
      expand: expandDraft,
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
      status: detail.data.status,
      processId: detail.data.processId ?? 0, // Should always be set
      steps: detail.data.steps.map((s) => {
        const mat0 = s.materials?.[0];
        return {
          orderNo: s.orderNo,
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
                    // For editing, we show the current draft process
                    processDraftId
                      ? (processes.data?.find((x) => x.id === processDraftId)
                          ?.name ?? "-")
                      : (
                         p.process ? `${p.process.code} - ${p.process.name}` : "-"
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

              {editing && (
                 <div className="flex items-center gap-2 lg:pt-8">
                    <input 
                      type="checkbox" 
                      id="regen"
                      checked={expandDraft}
                      onChange={e => setExpandDraft(e.target.checked)}
                      className="h-4 w-4"
                    />
                    <label htmlFor="regen" className="text-sm font-medium text-blue-600 cursor-pointer">
                       Regenerate (Ulangi hitungan shift)
                    </label>
                 </div>
              )}
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
                      <TableHead className="w-32">Urutan Shift</TableHead>
                      <TableHead className="w-40">Jadwal</TableHead>
                      {editing && <TableHead className="w-32">Action</TableHead>}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {(() => {
                      const list = (editing ? stepDrafts : p.steps)
                        .slice()
                        .sort((a, b) => a.orderNo - b.orderNo);

                      return list.map((item, idx) => {
                        const isDraft = editing;
                        
                        // Normalized getters
                        let machineName = "-";
                        let matName = "-";
                        let matUom = "-";
                        let stdOutputPerShift: number | null | undefined = null;
                        let startDateVal: Date | string | undefined | null = null;

                        if (!isDraft) {
                           const s = item as typeof p.steps[number];
                           const mat0 = s.materials?.[0];
                           machineName = s.machine?.name ?? "-";
                           matName = mat0?.material?.name ?? "-";
                           matUom = mat0?.material?.uom ?? "-";
                           stdOutputPerShift = s.machine?.stdOutputPerShift;
                           startDateVal = (s as any).startDate;
                        } else {
                           const d = item as StepDraft;
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
                              ) : (
                                <div className="font-medium text-xs">
                                  {machineName} {p.productName}
                                </div>
                              )}
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
                              ) : (
                                <div className="truncate max-w-[120px] text-xs" title={matName}>{matName}</div>
                              )}
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
                                <span className="text-xs">{qtyReqVal ? String(qtyReqVal) : "-"}</span>
                              )}
                            </TableCell>

                            <TableCell className="text-xs">{matUom}</TableCell>
                            
                            <TableCell className="text-xs font-medium">
                               {editing ? (
                                  <div className="flex flex-col gap-0.5">
                                    <div className="text-blue-600">
                                      {fmtDuration(Number(qtyPoPcs) || 0, Number(upVal) || 0, stdOutputPerShift)}
                                    </div>
                                    <div className="text-[10px] opacity-60">S-{(idx + 1)}</div>
                                  </div>
                               ) : (
                                  <div className="flex flex-col gap-0.5">
                                    <div>{getShiftNo(startDateVal)}</div>
                                    <div className="text-[10px] opacity-40">Seq {(idx + 1)}</div>
                                  </div>
                               )}
                            </TableCell>

                            <TableCell className="text-xs">
                              {editing ? (
                                <div className="flex flex-col gap-1">
                                  <Input
                                    type="date"
                                    className="h-8 w-32 bg-background border-input text-xs"
                                    value={(item as StepDraft).startDate ?? ""}
                                    onChange={(e) => {
                                      setStepDrafts(prev => prev.map(x => x.key === (item as StepDraft).key ? { ...x, startDate: e.target.value || null } : x));
                                    }}
                                  />
                                  <select
                                    value={(item as StepDraft).shift}
                                    onChange={(e) => {
                                      const v = Number(e.target.value);
                                      setStepDrafts(prev => prev.map(x => x.key === (item as StepDraft).key ? { ...x, shift: v } : x));
                                    }}
                                    className="border-input bg-background h-7 w-32 rounded border px-1 text-[10px]"
                                  >
                                    <option value={1}>S1: 06:00-11:00</option>
                                    <option value={2}>S2: 11:00-16:00</option>
                                    <option value={3}>S3: 16:00-21:00</option>
                                  </select>
                                </div>
                              ) : (
                                startDateVal ? (
                                  <div className="font-medium text-blue-700">
                                    {new Date(startDateVal).toLocaleDateString("id-ID", {
                                      weekday: "short",
                                      day: "2-digit",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    })}
                                  </div>
                                ) : "-"
                              )}
                            </TableCell>

                            {editing && (
                              <TableCell>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                    onClick={() => removeStep((item as StepDraft).key)}
                                  >
                                    Hapus
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      });
                    })()}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="text-xs opacity-70">
              Step masih read-only di halaman ini. Kalau kamu mau edit step juga
              (UP/Machine/Material/Qty), kita bikin tombol “Edit” per step
              (dialog kecil) tapi tetap stay di halaman detail.
            </div>
            {editing && (
              <div className="flex gap-2 mt-3">
                <Button
                  variant="outline"
                  onClick={openAddStep}
                  disabled={update.isPending || del.isPending}
                >
                  + Tambah Step
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog Add/Edit Step */}
        <Dialog open={stepDialogOpen} onOpenChange={setStepDialogOpen}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingStepKey ? "Edit Step" : "Tambah Step"}</DialogTitle>
              <DialogDescription>
                Isi detail step proses produksi
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium">UP</div>
                  <Input
                    type="number"
                    value={stepDraft.up}
                    onChange={(e) => {
                      const newUp = e.target.value;
                      const upNum = Number(newUp);
                      const poNum = Number(qtyPoPcs);

                      let autoQty = stepDraft.qtyReq;
                      if (upNum > 0 && poNum > 0) {
                        autoQty = String(Math.ceil(poNum / upNum));
                      }

                      setStepDraft((d) => ({ ...d, up: newUp, qtyReq: autoQty }));
                    }}
                    placeholder="contoh: 4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Machine (optional)</div>
                  <select
                    value={stepDraft.machineId ?? ""}
                    onChange={(e) =>
                      setStepDraft((d) => ({
                        ...d,
                        machineId: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                    disabled={machines.isLoading}
                  >
                    <option value="">(optional)</option>
                    {(machines.data ?? []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Tanggal & Shift Mulai</div>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      className="flex-1"
                      value={stepDraft.startDate ?? ""}
                      onChange={(e) =>
                        setStepDraft((d) => ({ ...d, startDate: e.target.value || null }))
                      }
                    />
                    <select
                      value={stepDraft.shift}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setStepDraft((d) => ({ ...d, shift: v }));
                      }}
                      className="border-input bg-background h-10 w-32 rounded-md border px-3 text-sm"
                    >
                      <option value={1}>Shift 1</option>
                      <option value={2}>Shift 2</option>
                      <option value={3}>Shift 3</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-2 sm:col-span-2">
                  <div className="text-sm font-medium">Material (optional)</div>
                  <select
                    value={stepDraft.materialId ?? ""}
                    onChange={(e) => {
                      const v = e.target.value ? Number(e.target.value) : null;
                      
                      let autoQty = "";
                      if (v) {
                        const upNum = Number(stepDraft.up);
                        const poNum = Number(qtyPoPcs);
                        if (upNum > 0 && poNum > 0) {
                          autoQty = String(Math.ceil(poNum / upNum));
                        }
                      }

                      setStepDraft((d) => ({ ...d, materialId: v, qtyReq: autoQty }));
                    }}
                    className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                    disabled={materials.isLoading}
                  >
                    <option value="">(None)</option>
                    {(materials.data ?? []).map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Qty Material</div>
                  <Input
                    type="number"
                    value={stepDraft.qtyReq}
                    onChange={(e) => setStepDraft((d) => ({ ...d, qtyReq: e.target.value }))}
                    placeholder="Req"
                    disabled={!stepDraft.materialId}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setStepDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={saveStepDraft}>
                {editingStepKey ? "Simpan" : "Tambah"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
