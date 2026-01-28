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

  // Fallback logic
  const dateStr = dt.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
  });
  
  let label = `S${startShift}`;

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
      label = `S${startShift}→${endDateStr} S${endShift}`;
    } else {
      if (endShift !== startShift) {
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
  materials: Array<{ key: string; materialId: number; qtyReq: string }>;
  startDate?: string | null;
  shift: number; // 1, 2, or 3
};

export default function ProList({ initialSelectedId, onClearJump }: Props) {
  const utils = api.useUtils();
  const processes = api.processes.list.useQuery();
  const machines = api.machines.list.useQuery();
  const materials = api.materials.list.useQuery();

  // ===== VIEW STATE =====
  const [selectedId, setSelectedId] = React.useState<number | null>(
    initialSelectedId ?? null,
  );

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

  // ===== DETAIL QUERY =====
  const detail = api.pros.getById.useQuery(
    { id: selectedId ?? 0 },
    { enabled: !!selectedId },
  );

  // ===== EDIT MODE =====
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
    materials: [],
    startDate: null,
    shift: 1,
  });

  const openAddStep = () => {
    setEditingStepKey(null);
    setStepDraft({
      up: "",
      machineId: null,
      materials: [
        { key: Math.random().toString(36).slice(2), materialId: 0, qtyReq: "" },
      ],
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
      materials: step.materials,
      startDate: step.startDate,
      shift: step.shift,
    });
    setStepDialogOpen(true);
  };

  const addMaterial = () => {
    setStepDraft((d) => {
      const selectedMachine = machines.data?.find(m => m.id === d.machineId);
      const isSheet = selectedMachine?.uom === 'sheet';
      const upNum = Number(d.up);
      const poNum = Number(qtyPoPcs);
      
      let autoQty = "";
      if (isSheet && upNum > 0 && poNum > 0) {
        autoQty = String(Math.ceil(poNum / upNum));
      } else if (isSheet && poNum > 0) {
        autoQty = String(poNum);
      }
      
      return {
        ...d,
        materials: [
          ...d.materials,
          { key: Math.random().toString(36).slice(2), materialId: 0, qtyReq: autoQty },
        ],
      };
    });
  };

  const removeMaterial = (key: string) => {
    setStepDraft((d) => ({
      ...d,
      materials: d.materials.filter((m) => m.key !== key),
    }));
  };

  const updateMaterial = (key: string, field: "materialId" | "qtyReq", value: number | string) => {
    setStepDraft((d) => {
      const selectedMachine = machines.data?.find(m => m.id === d.machineId);
      const isSheet = selectedMachine?.uom === 'sheet';
      const upNum = Number(d.up);
      const poNum = Number(qtyPoPcs);

      const newMaterials = d.materials.map((m) => {
        if (m.key !== key) return m;
        
        let newQty = field === "qtyReq" ? String(value) : m.qtyReq;
        
        if (field === "materialId" && value && isSheet && upNum > 0 && poNum > 0) {
          newQty = String(Math.ceil(poNum / upNum));
        } else if (field === "materialId" && value && isSheet && poNum > 0) {
          newQty = String(poNum);
        }
        
        return { ...m, [field]: value, qtyReq: newQty };
      });
      
      return { ...d, materials: newMaterials };
    });
  };

  const saveStepDraft = () => {
    if (!stepDraft.up.trim()) return alert("UP wajib diisi");
    const upNum = Number(stepDraft.up);
    if (!Number.isFinite(upNum) || upNum < 0) return alert("UP harus >= 0");

    for (const mat of stepDraft.materials) {
      if (!mat.materialId) {
        return alert("Pilih material untuk semua entry");
      }
      const qNum = Number(mat.qtyReq);
      if (!mat.qtyReq.trim() || !Number.isFinite(qNum) || qNum <= 0) {
        return alert("Qty Material wajib > 0");
      }
    }

    if (editingStepKey) {
      setStepDrafts((prev) =>
        prev.map((s) =>
          s.key === editingStepKey
            ? { ...s, ...stepDraft }
            : s
        )
      );
    } else {
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
      return filtered.map((s, idx) => ({ ...s, orderNo: idx + 1 }));
    });
  };

  const splitStep = (key: string) => {
    setStepDrafts((prev) => {
      const step = prev.find((s) => s.key === key);
      if (!step) return prev;

      // Calculate number of shifts
      const matQ = Number(step.materials[0]?.qtyReq || "0");
      const poQ = Number(qtyPoPcs);
      const baseQty = matQ > 0 ? matQ : poQ;
      const baseUp = matQ > 0 ? 1 : (Number(step.up) || 1);
      const machine = machines.data?.find((m) => m.id === step.machineId);
      const std = machine?.stdOutputPerShift || 1000;
      const actualQty = baseUp > 0 ? baseQty / baseUp : baseQty;
      const totalShifts = Math.max(1, Math.ceil(actualQty / std));

      if (totalShifts <= 1) {
        alert("Proses ini sudah hanya 1 shift (tidak bisa di-split lagi).");
        return prev;
      }

      const newSteps: StepDraft[] = [];
      const currentDateString = step.startDate;
      const currentDate = currentDateString ? new Date(currentDateString) : new Date();
      let currentShiftNo = step.shift;

      const perShiftQty = Math.floor(baseQty / totalShifts);
      const remainder = baseQty % totalShifts;

      for (let i = 0; i < totalShifts; i++) {
        const qty = i === 0 ? perShiftQty + remainder : perShiftQty;
        const d = new Date(currentDate);

        newSteps.push({
          key: Math.random().toString(36).slice(2),
          orderNo: step.orderNo, // Will be reordered
          up: step.up,
          machineId: step.machineId,
          startDate: d.toISOString().slice(0, 10),
          shift: currentShiftNo,
          materials: step.materials.map((m) => ({
            ...m,
            key: Math.random().toString(36).slice(2),
            qtyReq: String(qty),
          })),
        });

        if (currentShiftNo < 3) currentShiftNo++;
        else {
          currentShiftNo = 1;
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }

      const filtered = prev.filter((s) => s.key !== key);
      const combined = [...filtered, ...newSteps].sort((a, b) => {
        if (a.orderNo !== b.orderNo) return a.orderNo - b.orderNo;
        const tA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const tB = b.startDate ? new Date(b.startDate).getTime() : 0;
        if (tA !== tB) return tA - tB;
        return a.shift - b.shift;
      });

      return combined.map((s, idx) => ({ ...s, orderNo: idx + 1 }));
    });
  };

  const updateDraftMaterialQty = (stepKey: string, matKey: string, val: string) => {
    setStepDrafts((prev) =>
      prev.map((s) => {
        if (s.key !== stepKey) return s;
        return {
          ...s,
          materials: s.materials.map((m) =>
            m.key === matKey ? { ...m, qtyReq: val } : m
          ),
        };
      })
    );
  };


  const update = api.pros.update.useMutation({
    onMutate: async (variables) => {
      await utils.pros.getById.cancel();
      await utils.pros.list.cancel();
      await utils.pros.getSchedule.cancel();
      
      const previousDetail = utils.pros.getById.getData({ id: variables.id });
      const previousList = utils.pros.list.getData({});
      
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
      await utils.pros.list.cancel();
      await utils.pros.getById.cancel();
      await utils.pros.getSchedule.cancel();
      
      const previousList = utils.pros.list.getData({});
      const previousDetail = utils.pros.getById.getData({ id: variables.id });
      
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
      const dt = s.startDate ? new Date(s.startDate) : null;
      return {
        key: String(s.id),
        orderNo: s.orderNo,
        up: String(s.up ?? 1),
        machineId: s.machineId ?? null,
        materials: (s.materials ?? []).map((m, idx) => ({
          key: `${s.id}-${m.materialId}-${idx}`,
          materialId: m.materialId,
          qtyReq: m.qtyReq ? String(m.qtyReq) : "",
        })),
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
      for (const mat of s.materials) {
        if (!mat.materialId) {
          return setErr(`Step ${s.orderNo}: Pilih material untuk semua entry`);
        }
        const qNum = Number(mat.qtyReq);
        if (!mat.qtyReq.trim() || !Number.isFinite(qNum) || qNum <= 0) {
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
          materials: s.materials.map((m) => ({
            materialId: m.materialId,
            qtyReq: Number(m.qtyReq),
          })),
          startDate: combineDateShift(s.startDate, s.shift),
        })),
      expand: expandDraft,
    });
  };

  // =========================
  // DETAIL VIEW
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
                       Pecah per Shift (Expand)
                    </label>
                 </div>
              )}
            </div>

            {err ? <p className="text-destructive text-sm">{err}</p> : null}

            <Separator />

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
                        
                        let machineName = "-";
                        let stdOutputPerShift: number | null | undefined = null;
                        let startDateVal: Date | string | undefined | null = null;

                        if (!isDraft) {
                           const s = item as typeof p.steps[number];
                           machineName = s.machine?.name ?? "-";
                           stdOutputPerShift = s.machine?.stdOutputPerShift;
                           startDateVal = (s as any).startDate;
                        } else {
                           const d = item as StepDraft;
                           const m = machines.data?.find(x => x.id === d.machineId);
                           machineName = m?.name ?? "-";
                           stdOutputPerShift = m?.stdOutputPerShift;
                           startDateVal = d.startDate;
                        }

                        const upVal = isDraft ? (item as StepDraft).up : (item as any).up;
                        
                        const materialsDisplay = isDraft 
                          ? (item as StepDraft).materials.map(m => {
                              const mat = materials.data?.find(x => x.id === m.materialId);
                              return {
                                name: mat?.name ?? "-",
                                qtyReq: m.qtyReq,
                                uom: mat?.uom ?? "-"
                              };
                            })
                          : (item as any).materials.map((m: any) => ({
                              name: m.material?.name ?? "-",
                              qtyReq: String(m.qtyReq),
                              uom: m.material?.uom ?? "-"
                            }));
                        
                        const firstQtyReq = materialsDisplay[0]?.qtyReq ?? "0";
                        const matQ = Number(firstQtyReq);
                        const poQ = Number(qtyPoPcs);
                        
                        const baseQty = matQ > 0 ? matQ : poQ;
                        const baseUp = matQ > 0 ? 1 : (Number(upVal) || 1);
                        const std = stdOutputPerShift || 1000;
                        
                        const actualQty = baseUp > 0 ? baseQty / baseUp : baseQty;
                        const totalShifts = Math.max(1, Math.ceil(actualQty / std));
                        
                        const scheduleList = [];
                        const shouldExpand = !editing || expandDraft;
                        
                        if (startDateVal && shouldExpand) {
                           let currentDate = new Date(startDateVal);
                           let currentShift = shiftFromDate(currentDate);
                           
                           for (let i = 0; i < totalShifts; i++) {
                               scheduleList.push({
                                  date: new Date(currentDate),
                                  shift: currentShift
                               });
                               
                               if (currentShift < 3) {
                                  currentShift++;
                               } else {
                                  currentShift = 1;
                                  currentDate.setDate(currentDate.getDate() + 1);
                               }
                           }
                        } else {
                           scheduleList.push({
                              date: startDateVal ? new Date(startDateVal) : null,
                              shift: isDraft ? (item as StepDraft).shift : (startDateVal ? shiftFromDate(new Date(startDateVal)) : 1)
                           });
                        }

                        return (
                          <React.Fragment key={isDraft ? (item as StepDraft).key : (item as any).id}>
                            {scheduleList.map((sch, sIdx) => {
                               const isMainRow = sIdx === 0;
                               
                               return (
                                 <TableRow key={`${isDraft ? (item as StepDraft).key : (item as any).id}-${sIdx}`} className={!isMainRow ? "bg-muted/30 border-none" : ""}>
                                   <TableCell>
                                    {isMainRow && editing ? (
                                       <select
                                         value={(item as StepDraft).machineId ?? ""}
                                         onChange={(e) => {
                                           const val = e.target.value ? Number(e.target.value) : null;
                                           const selectedMachine = machines.data?.find(m => m.id === val);
                                           
                                           setStepDrafts(prev => prev.map(x => {
                                              if (x.key !== (item as StepDraft).key) return x;
                                              
                                              const upNum = Number(x.up);
                                              const poNum = Number(qtyPoPcs);
                                              
                                              let autoQty = "";
                                              if (selectedMachine?.uom === 'sheet' && upNum > 0 && poNum > 0) {
                                                 autoQty = String(Math.ceil(poNum / upNum));
                                              } else if (selectedMachine?.uom === 'sheet' && poNum > 0) {
                                                 autoQty = String(poNum);
                                              }

                                              const updatedMaterials = x.materials.map(m => ({
                                                 ...m,
                                                 qtyReq: autoQty || m.qtyReq
                                              }));
                                              
                                              return { 
                                                 ...x, 
                                                 machineId: val,
                                                 up: selectedMachine?.stdOutputPerShift ? String(selectedMachine.stdOutputPerShift) : x.up,
                                                 materials: updatedMaterials
                                              };
                                           }));
                                         }}
                                         className="border-input bg-background h-8 w-full rounded border px-2 text-xs"
                                       >
                                         <option value="">(Optional)</option>
                                         {(machines.data ?? []).map((m: any) => (
                                           <option key={m.id} value={m.id}>{m.name}</option>
                                         ))}
                                       </select>
                                    ) : (
                                       <div className="font-medium text-xs text-gray-700">
                                         {machineName}
                                       </div>
                                    )}
                                 </TableCell>

                                 <TableCell className="text-right text-xs">
                                    {isMainRow && editing ? (
                                       <Input 
                                         className="h-8 w-16 bg-background border-input text-right text-xs"
                                         value={(item as StepDraft).up}
                                         onChange={(e) => {
                                           setStepDrafts(prev => prev.map(x => x.key === (item as StepDraft).key ? { ...x, up: e.target.value } : x));
                                         }}
                                       />
                                    ) : (
                                       upVal ? Number(upVal).toLocaleString('id-ID') : "-"
                                    )}
                                 </TableCell>
                                 
                                 <TableCell>
                                    <div className="flex flex-col gap-1 min-w-[120px]">
                                       {materialsDisplay.map((m: any, mIdx: number) => (
                                          <div key={mIdx} className="truncate text-[10px] text-gray-700 border-b last:border-0 pb-0.5" title={m.name}>
                                             {m.name}
                                          </div>
                                       ))}
                                       {materialsDisplay.length === 0 && <span className="text-gray-400">-</span>}
                                    </div>
                                 </TableCell>

                                 <TableCell className="text-right">
                                    <div className="flex flex-col gap-1">
                                       {materialsDisplay.map((m: any, mIdx: number) => {
                                          const val = m.qtyReq;
                                          if (isMainRow && editing) {
                                             return (
                                                <div key={mIdx} className="text-[10px] font-bold border-b last:border-0 pb-0.5">
                                                   {val ? Number(val).toLocaleString('id-ID') : "-"}
                                                </div>
                                             );
                                          } else {
                                             const perShift = totalShifts > 0 ? Math.round(Number(val || 0) / totalShifts) : 0;
                                             return (
                                                <div key={mIdx} className="text-[10px] border-b last:border-0 pb-0.5">
                                                   {perShift > 0 ? perShift.toLocaleString('id-ID') : (val || "-")}
                                                </div>
                                             );
                                          }
                                       })}
                                    </div>
                                 </TableCell>

                                 <TableCell>
                                    <div className="flex flex-col gap-1">
                                       {materialsDisplay.map((m: any, mIdx: number) => (
                                          <div key={mIdx} className="text-[10px] text-gray-500 border-b last:border-0 pb-0.5">
                                             {m.uom}
                                          </div>
                                       ))}
                                    </div>
                                 </TableCell>
                                 
                                   <TableCell className="text-xs font-medium py-4">
                                      {isMainRow && editing ? (
                                         <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                              <span className="text-[10px] text-muted-foreground w-8">Mulai:</span>
                                              <select
                                                 value={(item as StepDraft).shift ?? 1}
                                                 onChange={(e) => {
                                                   const val = Number(e.target.value);
                                                   setStepDrafts(prev => prev.map(x => x.key === (item as StepDraft).key ? { ...x, shift: val } : x));
                                                 }}
                                                 className="h-7 w-20 rounded-md border border-input bg-background px-2 text-xs"
                                              >
                                                 <option value={1}>Shift 1</option>
                                                 <option value={2}>Shift 2</option>
                                                 <option value={3}>Shift 3</option>
                                              </select>
                                            </div>
                                            
                                            {totalShifts > 1 && (
                                              <div className="text-[10px] text-blue-600 font-bold ml-[42px]">
                                                 (+{totalShifts - 1} next)
                                              </div>
                                            )}
                                         </div>
                                      ) : null}
                                      
                                      <div className={`text-xs text-gray-700 font-semibold ${isMainRow && editing ? 'mt-2 pl-[42px]' : 'mt-1'}`}>
                                         Shift {sch.shift}
                                      </div>
                                   </TableCell>

                                 <TableCell className="text-xs">
                                      {isMainRow && editing ? (
                                         <div className="flex flex-col gap-1">
                                            <Input
                                              type="date"
                                              className="h-8 w-32 bg-background border-input text-xs"
                                              value={(item as StepDraft).startDate ?? ""}
                                              onChange={(e) => {
                                                setStepDrafts(prev => prev.map(x => x.key === (item as StepDraft).key ? { ...x, startDate: e.target.value || null } : x));
                                              }}
                                            />
                                         </div>
                                      ) : (
                                         <div className="font-medium text-gray-700">
                                            {sch.date?.toLocaleDateString("id-ID", { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) ?? "-"}
                                         </div>
                                      )}
                                   </TableCell>

                                   <TableCell>
                                      {isMainRow && editing && (
                                         <div className="flex gap-1">
                                           <Button
                                             variant="ghost"
                                             size="sm"
                                             className="h-7 px-2 text-xs"
                                             onClick={() => openEditStep(item as StepDraft)}
                                           >
                                             Edit
                                           </Button>
                                           <Button
                                             variant="ghost"
                                             size="sm"
                                             className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                             onClick={() => removeStep((item as StepDraft).key)}
                                           >
                                             Hapus
                                           </Button>
                                         </div>
                                      )}
                                   </TableCell>
                                 </TableRow>
                               );
                            })}
                          </React.Fragment>
                        );
                      });
                    })()}
                  </TableBody>
                </Table>
              </div>
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
                      const val = e.target.value;
                      const upNum = Number(val);
                      
                      setStepDraft((prev) => {
                        let newMaterials = prev.materials;
                        
                        if (prev.machineId) {
                           const selectedMachine = machines.data?.find(m => m.id === prev.machineId);
                           if (selectedMachine?.uom === 'sheet' && upNum > 0) {
                              const po = Number(qtyPoPcs); 
                              const req = Math.ceil(po / upNum);
                              newMaterials = prev.materials.map(m => ({
                                ...m,
                                qtyReq: String(req)
                              }));
                           }
                        }
                        return { ...prev, up: val, materials: newMaterials };
                      });
                    }}
                    placeholder="ex: 4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Machine (optional)</div>
                  <select
                    value={stepDraft.machineId ?? ""}
                    onChange={(e) => {
                       const val = e.target.value ? Number(e.target.value) : null;
                       const selectedMachine = machines.data?.find(m => m.id === val);
                       
                       setStepDraft((d) => {
                          let newMaterials = d.materials;
                          const isSheet = selectedMachine?.uom === 'sheet';
                          const currentUp = Number(d.up);
                          const newUp = (isSheet && !currentUp && selectedMachine?.stdOutputPerShift)
                            ? String(selectedMachine.stdOutputPerShift)
                            : d.up;

                          if (isSheet) {
                             const upToUse = Number(newUp);
                             if (upToUse > 0) {
                               const po = Number(qtyPoPcs);
                               const req = Math.ceil(po / upToUse);
                               newMaterials = d.materials.map(mat => ({
                                  ...mat,
                                  qtyReq: String(req)
                               }));
                             }
                          }
                          
                          return {
                             ...d,
                             machineId: val,
                             up: newUp,
                             materials: newMaterials
                          };
                       });
                    }}
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
                  <div className="text-sm font-medium">Tanggal Mulai</div>
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={stepDraft.startDate ?? ""}
                      onChange={(e) =>
                        setStepDraft((d) => ({ ...d, startDate: e.target.value || null }))
                      }
                      className="flex-1"
                    />
                    <select
                       className="border-input bg-background h-10 rounded-md border px-3 text-sm w-24"
                       value={stepDraft.shift}
                       onChange={(e) =>
                         setStepDraft((d) => ({ ...d, shift: Number(e.target.value) }))
                       }
                    >
                       <option value={1}>Shift 1</option>
                       <option value={2}>Shift 2</option>
                       <option value={3}>Shift 3</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Materials</div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMaterial}
                  >
                    + Tambah Material
                  </Button>
                </div>

                {stepDraft.materials.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Belum ada material. Klik "Tambah Material" untuk menambahkan.
                  </p>
                )}

                {stepDraft.materials.map((mat) => (
                  <div key={mat.key} className="grid gap-2 sm:grid-cols-[2fr_1fr_auto] items-end border rounded-md p-3">
                    <div className="space-y-2">
                      <div className="text-xs font-medium">Material</div>
                      <select
                        value={mat.materialId || ""}
                        onChange={(e) =>
                          updateMaterial(mat.key, "materialId", e.target.value ? Number(e.target.value) : 0)
                        }
                        className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                        disabled={materials.isLoading}
                      >
                        <option value="">Pilih Material</option>
                        {(materials.data ?? []).map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-medium">Qty</div>
                      <Input
                        type="number"
                        value={mat.qtyReq}
                        onChange={(e) => updateMaterial(mat.key, "qtyReq", e.target.value)}
                        placeholder="Manual"
                        className="h-9"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeMaterial(mat.key)}
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
              placeholder="Cari No. PRO / Produk..."
              className="sm:w-72"
            />
            <select
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as any)}
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
                  list.data.items.map((p: any) => (
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
