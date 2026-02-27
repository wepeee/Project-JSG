"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import ItemCodeInput from "./item-code-input";

import { Badge } from "~/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ChevronDown, Search } from "lucide-react";

type Status = "OPEN" | "IN_PROGRESS" | "COMPLETE" | "CLOSED" | "CANCELLED";

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
  initialTypeFilter?: "PAPER" | "RIGID" | "ALL"; // Added
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
    results.forEach((r) => {
      const dStr = r.date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      });
      const arr = grouped.get(dStr) ?? [];
      arr.push(r.shift);
      grouped.set(dStr, arr);
    });

    return (
      <div className="flex flex-col gap-0.5">
        {Array.from(grouped.entries()).map(([dateStr, shifts], idx) => (
          <div key={idx} className="text-[10px]">
            <span className="font-medium">{dateStr}</span>{" "}
            <span className="font-semibold text-blue-600">
              S{shifts.join(", S")}
            </span>
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
      <span className="font-semibold text-blue-600">{label}</span>
    </div>
  );
}

type StepDraft = {
  key: string;
  id?: number; // Added ID
  orderNo: number;
  up: string;
  machineId: number | null;
  materials: Array<{ key: string; materialId: number; qtyReq: string }>;
  startDate?: string | null;
  shift: number; // 1, 2, or 3
  partNumber?: string;
  batchNo?: string;
};

export default function ProList({
  initialSelectedId,
  onClearJump,
  initialTypeFilter,
}: Props) {
  const utils = api.useUtils();
  const processes = api.processes.list.useQuery({});
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
  const [typeFilter, setTypeFilter] = React.useState<
    "ALL" | "PAPER" | "RIGID" | "OTHER"
  >(initialTypeFilter || "PAPER"); // Use prop or default to PAPER

  // Sync with external filter changes
  React.useEffect(() => {
    if (initialTypeFilter) {
      setTypeFilter(initialTypeFilter);
    }
  }, [initialTypeFilter]);

  const list = api.pros.list.useQuery({
    q: q.trim() ? q.trim() : undefined,
    status: status === "ALL" ? undefined : status,
    type: typeFilter === "ALL" ? undefined : typeFilter, // Added
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
  const [batchNo, setBatchNo] = React.useState(""); // Added for editing batch no
  const [statusDraft, setStatusDraft] = React.useState<Status>("OPEN");
  const [processDraftId, setProcessDraftId] = React.useState<number | null>(
    null,
  );
  const [expandDraft, setExpandDraft] = React.useState(false);
  const [stepDrafts, setStepDrafts] = React.useState<StepDraft[]>([]);

  // ===== DIALOG ADD/EDIT STEP =====
  const [stepDialogOpen, setStepDialogOpen] = React.useState(false);
  const [editingStepKey, setEditingStepKey] = React.useState<string | null>(
    null,
  );
  const [stepDraft, setStepDraft] = React.useState<
    Omit<StepDraft, "key" | "orderNo">
  >({
    up: "",
    machineId: null,
    materials: [],
    startDate: null,
    shift: 1,
    partNumber: "",
  });

  const [proTypeDraft, setProTypeDraft] = React.useState<
    "PAPER" | "RIGID" | "OTHER"
  >("PAPER"); // Added
  const [partNumberDraft, setPartNumberDraft] = React.useState(""); // Added

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
      partNumber: "",
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
      partNumber: step.partNumber,
    });
    setStepDialogOpen(true);
  };

  const addMaterial = () => {
    setStepDraft((d) => {
      const autoQty = ""; // Material belum dipilih, jadi tidak hitung otomatis dulu

      return {
        ...d,
        materials: [
          ...d.materials,
          {
            key: Math.random().toString(36).slice(2),
            materialId: 0,
            qtyReq: autoQty,
          },
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

  const updateMaterial = (
    key: string,
    field: "materialId" | "qtyReq",
    value: number | string,
  ) => {
    setStepDraft((d) => {
      const upNum = Number(d.up);
      const poNum = Number(qtyPoPcs);

      const newMaterials = d.materials.map((m) => {
        if (m.key !== key) return m;

        let newQty = field === "qtyReq" ? String(value) : m.qtyReq;

        if (field === "materialId") {
          // 1. Reset Qty setiap kali ganti pilihan material
          newQty = "";

          if (value) {
            const matId = Number(value);
            const matData = materials.data?.find((x) => x.id === matId);

            // JIKA DATA MATERIAL TIDAK DITEMUKAN, BERHENTI DI SINI
            if (!matData)
              return { ...m, materialId: Number(value), qtyReq: "" };

            const selectedMachine = machines.data?.find(
              (x) => x.id === d.machineId,
            );
            const isMachineSheet =
              selectedMachine?.uom?.toLowerCase() === "sheet";
            const isMatSheet = matData?.uom?.toLowerCase() === "sheet";

            // Auto-calculation removed as per user request
            // if (isMachineSheet && isMatSheet && upNum > 0 && poNum > 0) {
            //   newQty = String(Math.ceil(poNum / upNum));
            // }
          }
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
          s.key === editingStepKey ? { ...s, ...stepDraft } : s,
        ),
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
      const baseUp = matQ > 0 ? 1 : Number(step.up) || 1;
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
      const currentDate = currentDateString
        ? new Date(currentDateString)
        : new Date();
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

  const updateDraftMaterialQty = (
    stepKey: string,
    matKey: string,
    val: string,
  ) => {
    setStepDrafts((prev) =>
      prev.map((s) => {
        if (s.key !== stepKey) return s;
        return {
          ...s,
          materials: s.materials.map((m) =>
            m.key === matKey ? { ...m, qtyReq: val } : m,
          ),
        };
      }),
    );
  };

  const update = api.pros.update.useMutation({
    onMutate: async (variables: any) => {
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
            partNumber: variables.partNumber, // Added
            qtyPoPcs: variables.qtyPoPcs,
            startDate: variables.startDate ?? previousDetail.startDate,
            status: variables.status ?? previousDetail.status,
            proPrefixId: variables.proPrefixId, // Updated
            proses: variables.proses
              .map((stepInput: any, idx: number) => {
                const existingStep = previousDetail.proses[idx];
                if (!existingStep) return null;
                return {
                  ...existingStep,
                  orderNo: stepInput.orderNo,
                  up: stepInput.up,
                  machineId: stepInput.machineId ?? null,
                  startDate: stepInput.startDate ?? existingStep.startDate,
                };
              })
              .filter((s: any): s is NonNullable<typeof s> => s !== null),
          },
        );
      }

      if (previousList) {
        utils.pros.list.setData(
          {},
          {
            ...previousList,
            items: previousList.items.map((pro: any) =>
              pro.id === variables.id
                ? {
                    ...pro,
                    productName: variables.productName,
                    qtyPoPcs: variables.qtyPoPcs,
                    startDate: variables.startDate ?? pro.startDate,
                    status: variables.status ?? pro.status,
                    type: variables.type ?? (pro as any).type,
                    proPrefixId: variables.proPrefixId, // Updated
                  }
                : pro,
            ),
          },
        );
      }

      return { previousDetail, previousList };
    },
    onError: (_err: any, variables: any, context: any) => {
      if (context?.previousDetail) {
        utils.pros.getById.setData(
          { id: variables.id },
          context.previousDetail,
        );
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
    onMutate: async (variables: any) => {
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
            items: previousList.items.filter(
              (pro: any) => pro.id !== variables.id,
            ),
          },
        );
      }

      return { previousList, previousDetail };
    },
    onError: (_err: any, variables: any, context: any) => {
      if (context?.previousList) {
        utils.pros.list.setData({}, context.previousList);
      }
      if (context?.previousDetail) {
        utils.pros.getById.setData(
          { id: variables.id },
          context.previousDetail,
        );
      }
    },
    onSuccess: async (_data: any, vars: any) => {
      setSelectedId(null);
      setEditing(false);
      await utils.pros.list.invalidate();
      await utils.pros.getById.invalidate({ id: vars.id });
      await utils.pros.getSchedule.invalidate();
    },
  });

  React.useEffect(() => {
    if (!detail.data || editing) return;
    setProductName(detail.data.productName ?? "");
    setQtyPoPcs(String(detail.data.qtyPoPcs ?? ""));
    // Get batch no from first step if available (assuming all same for RIGID)
    // Get batch no from first step if available (assuming all same for RIGID)
    // Get batch no from first step if available (assuming all same for RIGID)
    const firstStep = detail.data.proses.find((s) => (s as any).batchNo);
    const firstBatch = firstStep ? (firstStep as any).batchNo : "";
    setBatchNo(firstBatch ?? "");
    setPartNumberDraft((detail.data as any).partNumber ?? ""); // Added
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
    } catch (e: any) {
      setErr(e?.message ?? "Gagal menghapus PRO");
    }
  };
  const control =
    "border-input bg-background h-10 w-full rounded-md border px-3 text-sm";

  const toDraftSteps = React.useCallback((): StepDraft[] => {
    if (!detail.data) return [];
    return detail.data.proses.map((s) => {
      const dt = s.startDate ? new Date(s.startDate) : null;
      return {
        key: String(s.id),
        id: s.id,
        orderNo: s.orderNo,
        up: String(s.up ?? 1),
        machineId: s.machineId ?? null,
        materials: (s.materials ?? []).map((m, idx) => ({
          key: `${s.id}-${m.materialId}-${idx}`,
          materialId: m.materialId,
          qtyReq: m.qtyReq ? String(m.qtyReq) : "",
        })),
        startDate: dt
          ? `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`
          : null,
        shift: dt ? shiftFromDate(dt) : 1,
        partNumber: (s as any).partNumber ?? "",
        batchNo: (s as any).batchNo ?? "",
      };
    });
  }, [detail.data]);

  const startEdit = () => {
    setErr(null);
    setEditing(true);
    setStepDrafts(toDraftSteps());
    setStatusDraft((detail.data?.status as Status) ?? "OPEN");
    setExpandDraft(false);
    setProcessDraftId(detail.data?.proPrefixId ?? null); // Updated
    setProTypeDraft((detail.data as any).type ?? "PAPER");
    setPartNumberDraft((detail.data as any).partNumber ?? ""); // Added
  };

  const cancelEdit = () => {
    setErr(null);
    setEditing(false);
    setStepDrafts([]);
    if (!detail.data) return;
    setProductName(detail.data.productName ?? "");
    setQtyPoPcs(String(detail.data.qtyPoPcs ?? ""));
    setQtyPoPcs(String(detail.data.qtyPoPcs ?? ""));
    const firstStep = detail.data.proses.find((s) => (s as any).batchNo);
    const firstBatch = firstStep ? (firstStep as any).batchNo : "";
    setBatchNo(firstBatch ?? "");
  };

  const saveAll = async () => {
    setErr(null);
    if (!detail.data || !selectedId) return;

    const prod = productName.trim();
    if (!prod) return setErr("Produk wajib diisi");

    const qty = parseInt(qtyPoPcs);
    if (!qtyPoPcs.trim() || !Number.isFinite(qty) || qty <= 0) {
      return setErr("Qty PO wajib > 0");
    }

    if (!processDraftId)
      return setErr("Proses (Prefix) wajib dipilih di header");

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

    // Determine PRO Start Date from the first step
    const sortedSteps = drafts.slice().sort((a, b) => a.orderNo - b.orderNo);
    const firstStep = sortedSteps[0];
    const newStartDate = firstStep
      ? combineDateShift(firstStep.startDate, firstStep.shift)
      : undefined;

    await update.mutateAsync({
      id: selectedId,
      productName: prod,
      partNumber: partNumberDraft, // Added
      qtyPoPcs: qty,
      startDate: newStartDate,
      status: statusDraft,
      proPrefixId: processDraftId, // Updated
      proses: drafts
        .slice()
        .sort((a, b) => a.orderNo - b.orderNo)
        .map((s) => ({
          id: s.id,
          orderNo: s.orderNo,
          up: Number(s.up),
          machineId: s.machineId ?? null,
          materials: s.materials.map((m) => ({
            materialId: m.materialId,
            qtyReq: Number(m.qtyReq),
          })),
          startDate: combineDateShift(s.startDate, s.shift),
          partNumber: s.partNumber,
          batchNo: batchNo, // Use header batch no for all steps
        })),

      // expand: expandDraft, // Removed as per backend change
      type: proTypeDraft, // Added
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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedId(null);
                setEditing(false);
                setStepDrafts([]);
                setErr(null);
              }}
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground h-9 gap-2"
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
              Kembali
            </Button>
            <div>
              <h2 className="text-foreground text-xl font-bold tracking-tight">
                {p.proNumber}
              </h2>
              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span>Details & Material</span>
                <span>•</span>
                <span>{fmtDateTime(p.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editing ? (
              <>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => void onDeletePro(p.id, p.proNumber)}
                  disabled={del.isPending || update.isPending}
                  className="h-9"
                >
                  {del.isPending ? "Menghapus..." : "Hapus PRO"}
                </Button>
                <Button onClick={startEdit} className="h-9 shadow-sm">
                  Edit PRO
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" onClick={cancelEdit}>
                  Batal
                </Button>
                <Button
                  onClick={saveAll}
                  disabled={update.isPending || del.isPending}
                >
                  {update.isPending ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {err && (
          <div className="border-destructive/20 bg-destructive/10 text-destructive mb-4 rounded-md border px-4 py-3 text-sm">
            {err}
          </div>
        )}

        <Card className="border-border shadow-sm">
          <CardHeader className="border-border bg-muted/20 border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-foreground flex items-center gap-2 font-semibold">
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg">
                  📄
                </div>
                Informasi Produksi
              </div>
              {!editing && (
                <Badge
                  variant="outline"
                  className="px-3 py-1 font-mono text-xs"
                >
                  {p.type}
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  No. PRO
                </div>
                <div className="text-foreground font-mono text-lg font-bold">
                  {p.proNumber}
                </div>
              </div>

              {!editing ? (
                <div className="space-y-1">
                  <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Status
                  </div>
                  <Badge
                    variant="outline"
                    className={`border px-2 py-0.5 text-xs font-bold ${p.status === "OPEN" ? "border-primary/20 bg-primary/10 text-primary" : ""} ${p.status === "IN_PROGRESS" ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400" : ""} ${p.status === "COMPLETE" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : ""} ${p.status === "CLOSED" ? "border-muted bg-muted text-muted-foreground" : ""} ${p.status === "CANCELLED" ? "border-destructive/20 bg-destructive/10 text-destructive" : ""} `}
                  >
                    {p.status}
                  </Badge>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Status
                  </div>
                  <select
                    value={statusDraft}
                    onChange={(e) => setStatusDraft(e.target.value as Status)}
                    className={control}
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="CLOSED">CLOSED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              )}

              {!editing ? (
                <div className="space-y-1">
                  <div
                    className="text-muted-foreground max-w-[200px] truncate text-xs font-bold tracking-wider uppercase"
                    title="Prefix / Kategori"
                  >
                    Prefix / Cat
                  </div>
                  <div className="text-foreground line-clamp-1 text-sm font-medium">
                    {processDraftId
                      ? (processes.data?.find(
                          (x: any) => x.id === processDraftId,
                        )?.name ?? "-")
                      : p.proPrefix
                        ? `${p.proPrefix.code} - ${p.proPrefix.name}`
                        : "-"}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    Prefix / Kategori
                  </div>
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
                    {(processes.data ?? [])
                      .filter(
                        (proc: any) =>
                          !proTypeDraft || proc.type === proTypeDraft,
                      )
                      .map((proc: any) => (
                        <option key={proc.id} value={proc.id}>
                          {proc.code} - {proc.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Dibuat
                </div>
                <div className="text-foreground text-sm font-medium">
                  {fmtDateTime(p.createdAt)}
                </div>
              </div>

              {p.type === "RIGID" &&
                (!editing ? (
                  <div className="space-y-1">
                    <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                      Batch No
                    </div>
                    <div className="text-foreground text-sm font-medium">
                      {batchNo || "-"}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                      Batch No
                    </div>
                    <Input
                      value={batchNo}
                      onChange={(e) => setBatchNo(e.target.value)}
                      className="h-9"
                    />
                  </div>
                ))}

              <div className="space-y-2 lg:col-span-2">
                <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Produk
                </div>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  disabled={!editing}
                  className="bg-background font-medium"
                />
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Part Number (FG)
                </div>
                <ItemCodeInput
                  value={partNumberDraft}
                  onChange={(code) => setPartNumberDraft(code)}
                  defaultKind="FG"
                  placeholder="Part Number (FG)"
                  disabled={!editing}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  Qty PO
                </div>
                <Input
                  type="number"
                  value={qtyPoPcs}
                  onChange={(e) => setQtyPoPcs(e.target.value)}
                  disabled={!editing}
                  className="bg-background font-medium"
                />
              </div>

              {editing && (
                <div className="flex items-center gap-2 lg:pt-8">
                  <input
                    type="checkbox"
                    id="regen"
                    checked={expandDraft}
                    onChange={(e) => setExpandDraft(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="regen"
                    className="text-primary cursor-pointer text-sm font-medium"
                  >
                    Hitung sesuai kapasitas mesin
                  </label>
                </div>
              )}

              {/* Display Auto Shift Expansion Flag */}
              {!editing && (p as any).autoShiftExpansion && (
                <div className="flex items-center gap-2 pt-2 lg:col-span-4">
                  <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium">
                    <span className="text-sm">🔄</span>
                    PRO dibuat dengan otomatisasi shift
                  </span>
                </div>
              )}
            </div>

            {err ? <p className="text-destructive text-sm">{err}</p> : null}
          </CardContent>

          <Separator />

          <div className="w-full max-w-full overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="w-full">
                {/* HANYA MENGUBAH BACKGROUND ABU DI SINI */}
                <TableHeader className="bg-muted">
                  <TableRow className="border-border border-y hover:bg-transparent">
                    <TableHead className="text-foreground min-w-[150px] px-4 py-3 text-xs font-bold tracking-wider uppercase">
                      Machine
                    </TableHead>
                    <TableHead className="text-foreground w-16 px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                      UP/CAV
                    </TableHead>
                    <TableHead className="text-foreground w-24 px-4 py-3 text-xs font-bold tracking-wider uppercase">
                      Part No.
                    </TableHead>
                    <TableHead className="text-foreground min-w-[120px] px-4 py-3 text-xs font-bold tracking-wider uppercase">
                      Material
                    </TableHead>
                    <TableHead className="text-foreground w-16 px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                      Qty Mat
                    </TableHead>
                    <TableHead className="text-foreground w-14 px-4 py-3 text-xs font-bold tracking-wider uppercase">
                      UoM
                    </TableHead>
                    <TableHead className="text-foreground w-20 px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                      Target
                    </TableHead>
                    <TableHead className="text-foreground w-16 px-4 py-3 text-xs font-bold tracking-wider uppercase">
                      Shift
                    </TableHead>
                    <TableHead className="text-foreground w-24 px-4 py-3 text-xs font-bold tracking-wider uppercase">
                      Jadwal
                    </TableHead>
                    {editing && (
                      <TableHead className="text-foreground w-20 px-4 py-3 text-xs font-bold tracking-wider uppercase">
                        Action
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {(() => {
                    const list = (editing ? stepDrafts : p.proses)
                      .slice()
                      .sort((a, b) => a.orderNo - b.orderNo);

                    return list.map((item: any, idx: number) => {
                      const isDraft = editing;
                      const itemReports = !isDraft
                        ? (item as any).productionReports
                        : [];
                      const totalAchieved =
                        itemReports?.reduce(
                          (acc: number, r: any) =>
                            acc +
                            (r.status === "APPROVED"
                              ? Number(r.qtyPassOn) || 0
                              : 0),
                          0,
                        ) ?? 0;

                      let machineName = "-";
                      let stdOutputPerShift: number | null | undefined = null;
                      let machineUom: string | null | undefined = null;
                      let startDateVal: Date | string | undefined | null = null;

                      if (!isDraft) {
                        const s = item as (typeof p.proses)[number];
                        machineName = s.machine?.name ?? "-";
                        stdOutputPerShift = s.machine?.stdOutputPerShift;
                        machineUom = s.machine?.uom;
                        startDateVal = (s as any).startDate;
                      } else {
                        const d = item as StepDraft;
                        const m = machines.data?.find(
                          (x) => x.id === d.machineId,
                        );
                        machineName = m?.name ?? "-";
                        stdOutputPerShift = m?.stdOutputPerShift;
                        machineUom = m?.uom;
                        startDateVal = d.startDate;
                      }

                      const upVal = isDraft
                        ? (item as StepDraft).up
                        : (item as any).up;

                      const materialsDisplay = isDraft
                        ? (item as StepDraft).materials.map((m) => {
                            const mat = materials.data?.find(
                              (x) => x.id === m.materialId,
                            );
                            return {
                              name: mat?.name ?? "-",
                              qtyReq: m.qtyReq,
                              uom: mat?.uom ?? "-",
                            };
                          })
                        : (item as any).materials.map((m: any) => ({
                            name: m.material?.name ?? "-",
                            qtyReq: String(m.qtyReq),
                            uom: m.material?.uom ?? "-",
                          }));

                      const firstQtyReq = materialsDisplay[0]?.qtyReq ?? "0";
                      const matQ = Number(firstQtyReq);
                      const poQ = Number(qtyPoPcs);

                      const baseQty = matQ > 0 ? matQ : poQ;
                      const baseUp = matQ > 0 ? 1 : Number(upVal) || 1;
                      const std = stdOutputPerShift || 1000;

                      const actualQty = baseUp > 0 ? baseQty / baseUp : baseQty;
                      const totalShifts = isDraft
                        ? machineUom === "sheet"
                          ? Math.max(1, Math.ceil(actualQty / std))
                          : 1
                        : (item as any).estimatedShifts || 1;

                      const scheduleList = [];
                      const shouldExpand = editing && expandDraft;

                      if (startDateVal && shouldExpand) {
                        let currentDate = new Date(startDateVal);
                        let currentShift = isDraft
                          ? (item as StepDraft).shift
                          : shiftFromDate(currentDate);

                        for (let i = 0; i < totalShifts; i++) {
                          scheduleList.push({
                            date: new Date(currentDate),
                            shift: currentShift,
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
                          shift: isDraft
                            ? (item as StepDraft).shift
                            : startDateVal
                              ? shiftFromDate(new Date(startDateVal))
                              : 1,
                        });
                      }

                      return (
                        <React.Fragment
                          key={
                            isDraft ? (item as StepDraft).key : (item as any).id
                          }
                        >
                          {scheduleList.map((sch, sIdx) => {
                            const isMainRow = sIdx === 0;

                            return (
                              <TableRow
                                key={`${isDraft ? (item as StepDraft).key : (item as any).id}-${sIdx}`}
                                className={`hover:bg-muted/50 transition-colors ${!isMainRow ? "bg-muted/20 border-border border-b" : "border-border border-b"} `}
                              >
                                <TableCell className="px-4 py-3 align-top">
                                  {isMainRow && editing ? (
                                    <select
                                      value={
                                        (item as StepDraft).machineId ?? ""
                                      }
                                      onChange={(e) => {
                                        const val = e.target.value
                                          ? Number(e.target.value)
                                          : null;
                                        const selectedMachine =
                                          machines.data?.find(
                                            (m: any) => m.id === val,
                                          );

                                        setStepDrafts((prev) =>
                                          prev.map((x: any) => {
                                            if (
                                              x.key !== (item as StepDraft).key
                                            )
                                              return x;

                                            return {
                                              ...x,
                                              machineId: val,
                                              up: selectedMachine?.stdOutputPerShift
                                                ? String(
                                                    selectedMachine.stdOutputPerShift,
                                                  )
                                                : x.up,
                                              // Don't recalc materials here
                                            };
                                          }),
                                        );
                                      }}
                                      className="bg-background h-8 w-full rounded border border-slate-200 px-2 text-xs font-medium dark:border-slate-800"
                                    >
                                      <option value="">(Optional)</option>
                                      {(machines.data ?? []).map((m: any) => (
                                        <option key={m.id} value={m.id}>
                                          {m.name}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <div className="max-w-[180px]">
                                      <div className="text-foreground truncate text-xs leading-relaxed font-bold">
                                        {machineName}
                                      </div>
                                      <div className="text-muted-foreground truncate text-[10px] font-medium">
                                        {p.productName}
                                      </div>
                                    </div>
                                  )}
                                </TableCell>

                                <TableCell className="px-4 py-3 text-right align-top text-xs">
                                  {isMainRow && editing ? (
                                    <Input
                                      className="bg-background h-8 w-16 border-slate-200 text-right text-xs font-medium dark:border-slate-800"
                                      value={(item as StepDraft).up}
                                      onChange={(e) => {
                                        setStepDrafts((prev) =>
                                          prev.map((x) =>
                                            x.key === (item as StepDraft).key
                                              ? { ...x, up: e.target.value }
                                              : x,
                                          ),
                                        );
                                      }}
                                    />
                                  ) : upVal ? (
                                    <span className="text-foreground font-mono font-medium">
                                      {Number(upVal).toLocaleString("id-ID")}
                                    </span>
                                  ) : (
                                    "-"
                                  )}
                                </TableCell>

                                <TableCell className="px-4 py-3 align-top text-xs">
                                  {isMainRow && editing ? (
                                    <ItemCodeInput
                                      value={
                                        (item as StepDraft).partNumber || ""
                                      }
                                      onChange={(code) => {
                                        setStepDrafts((prev) =>
                                          prev.map((x) =>
                                            x.key === (item as StepDraft).key
                                              ? {
                                                  ...x,
                                                  partNumber: code,
                                                }
                                              : x,
                                          ),
                                        );
                                      }}
                                      defaultKind="WIP"
                                      placeholder="Part No."
                                      className="min-w-[100px]"
                                    />
                                  ) : (
                                    <span className="text-foreground font-medium">
                                      {(isDraft
                                        ? (item as StepDraft).partNumber
                                        : (item as any).partNumber) || "-"}
                                    </span>
                                  )}
                                </TableCell>

                                <TableCell className="px-4 py-3 align-top">
                                  <div className="flex min-w-[120px] flex-col gap-1.5">
                                    {materialsDisplay.map(
                                      (m: any, mIdx: number) => (
                                        <div
                                          key={mIdx}
                                          className="text-foreground truncate text-[11px] font-medium"
                                          title={m.name}
                                        >
                                          {m.name}
                                        </div>
                                      ),
                                    )}
                                    {materialsDisplay.length === 0 && (
                                      <span className="text-xs text-slate-300">
                                        -
                                      </span>
                                    )}
                                  </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 text-right align-top">
                                  <div className="flex flex-col gap-1.5">
                                    {materialsDisplay.map(
                                      (m: any, mIdx: number) => {
                                        const val = m.qtyReq;
                                        if (isMainRow && editing) {
                                          return (
                                            <div
                                              key={mIdx}
                                              className="text-foreground text-[11px] font-bold"
                                            >
                                              {val
                                                ? Number(val).toLocaleString(
                                                    "id-ID",
                                                  )
                                                : "-"}
                                            </div>
                                          );
                                        } else {
                                          const remainingWorkInSheets =
                                            Math.max(
                                              0,
                                              Math.min(
                                                actualQty - sIdx * std,
                                                std,
                                              ),
                                            );
                                          const portion =
                                            actualQty > 0
                                              ? remainingWorkInSheets /
                                                actualQty
                                              : 1;
                                          const perShift = Math.round(
                                            Number(val || 0) * portion,
                                          );

                                          return (
                                            <div
                                              key={mIdx}
                                              className="text-muted-foreground text-[11px] font-medium"
                                            >
                                              {perShift > 0
                                                ? perShift.toLocaleString(
                                                    "id-ID",
                                                  )
                                                : val || "-"}
                                            </div>
                                          );
                                        }
                                      },
                                    )}
                                  </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 align-top">
                                  <div className="flex flex-col gap-1.5">
                                    {materialsDisplay.map(
                                      (m: any, mIdx: number) => (
                                        <div
                                          key={mIdx}
                                          className="text-muted-foreground text-[11px] font-medium"
                                        >
                                          {m.uom}
                                        </div>
                                      ),
                                    )}
                                  </div>
                                </TableCell>

                                <TableCell className="text-foreground px-4 py-3 text-right align-top text-xs font-bold">
                                  <div className="mt-0.5">
                                    {totalAchieved.toLocaleString("id-ID")} /{" "}
                                    {p.qtyPoPcs.toLocaleString("id-ID")}
                                  </div>
                                </TableCell>

                                <TableCell className="px-4 py-3 align-top text-xs font-medium">
                                  {isMainRow && editing ? (
                                    <div className="flex flex-col gap-1.5">
                                      <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground hidden w-6 text-[10px] font-medium lg:inline">
                                          Shift:
                                        </span>
                                        <select
                                          value={(item as StepDraft).shift ?? 1}
                                          onChange={(e) => {
                                            const val = Number(e.target.value);
                                            setStepDrafts((prev) =>
                                              prev.map((x) =>
                                                x.key ===
                                                (item as StepDraft).key
                                                  ? { ...x, shift: val }
                                                  : x,
                                              ),
                                            );
                                          }}
                                          className="border-input bg-background h-7 w-16 rounded-md border px-1 text-xs font-medium"
                                        >
                                          <option value={1}>I</option>
                                          <option value={2}>II</option>
                                          <option value={3}>III</option>
                                        </select>
                                      </div>

                                      {totalShifts > 1 && (
                                        <div className="text-primary text-[10px] font-bold">
                                          (+{totalShifts - 1})
                                        </div>
                                      )}
                                    </div>
                                  ) : null}

                                  {!(isMainRow && editing) && (
                                    <div
                                      className={`text-foreground text-xs font-semibold ${isMainRow && editing ? "mt-2 pl-[42px]" : "mt-1"}`}
                                    >
                                      Shift {sch.shift}
                                    </div>
                                  )}
                                </TableCell>

                                <TableCell className="px-4 py-3 align-top text-xs">
                                  {isMainRow && editing ? (
                                    <div className="flex flex-col gap-1">
                                      <Input
                                        type="date"
                                        className="bg-background h-8 w-full min-w-[100px] border-slate-200 text-xs font-medium dark:border-slate-800"
                                        value={
                                          (item as StepDraft).startDate ?? ""
                                        }
                                        onChange={(e) => {
                                          setStepDrafts((prev) =>
                                            prev.map((x) =>
                                              x.key === (item as StepDraft).key
                                                ? {
                                                    ...x,
                                                    startDate:
                                                      e.target.value || null,
                                                  }
                                                : x,
                                            ),
                                          );
                                        }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="text-foreground font-medium">
                                      {sch.date
                                        ? new Date(sch.date).toLocaleDateString(
                                            "id-ID",
                                            {
                                              weekday: "short",
                                              day: "2-digit",
                                              month: "short",
                                            },
                                          )
                                        : "-"}
                                    </div>
                                  )}
                                </TableCell>

                                {/* HANYA MENGUBAH INI AGAR TIDAK ADA KOLOM PUTIH KOSONG DI KANAN */}
                                {editing && (
                                  <TableCell className="px-4 py-3 align-top">
                                    {isMainRow && (
                                      <div className="flex justify-end gap-1">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-muted-foreground hover:bg-muted hover:text-foreground h-7 px-2 text-xs"
                                          onClick={() =>
                                            openEditStep(item as StepDraft)
                                          }
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 px-2 text-xs"
                                          onClick={() =>
                                            removeStep((item as StepDraft).key)
                                          }
                                        >
                                          Hapus
                                        </Button>
                                      </div>
                                    )}
                                  </TableCell>
                                )}
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

          <CardContent>
            {editing && (
              <div className="mt-3 flex gap-2">
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
              <DialogTitle>
                {editingStepKey ? "Edit Step" : "Tambah Step"}
              </DialogTitle>
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
                      setStepDraft((prev) => {
                        return { ...prev, up: val };
                      });
                    }}
                    placeholder="ex: 4"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Part Number (Step)</div>
                  <ItemCodeInput
                    value={stepDraft.partNumber || ""}
                    onChange={(code) =>
                      setStepDraft((prev) => ({
                        ...prev,
                        partNumber: code,
                      }))
                    }
                    defaultKind="WIP"
                    placeholder="Part Number"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Machine (optional)</div>
                  <select
                    value={stepDraft.machineId ?? ""}
                    onChange={(e) => {
                      const val = e.target.value
                        ? Number(e.target.value)
                        : null;
                      const selectedMachine = machines.data?.find(
                        (m: any) => m.id === val,
                      );

                      setStepDraft((d) => {
                        const isSheetMachine =
                          selectedMachine?.uom?.toLowerCase() === "sheet";
                        const currentUp = Number(d.up);

                        const newUp =
                          isSheetMachine &&
                          !currentUp &&
                          selectedMachine?.stdOutputPerShift
                            ? String(selectedMachine.stdOutputPerShift)
                            : d.up;

                        return {
                          ...d,
                          machineId: val,
                          up: newUp,
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
                        setStepDraft((d) => ({
                          ...d,
                          startDate: e.target.value || null,
                        }))
                      }
                      className="flex-1"
                    />
                    <select
                      className="border-input bg-background h-10 w-24 rounded-md border px-3 text-sm"
                      value={stepDraft.shift}
                      onChange={(e) =>
                        setStepDraft((d: any) => ({
                          ...d,
                          shift: Number(e.target.value),
                        }))
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
                  <p className="text-muted-foreground text-sm">
                    Belum ada material. Klik "Tambah Material" untuk
                    menambahkan.
                  </p>
                )}

                {stepDraft.materials.map((mat) => (
                  <div
                    key={mat.key}
                    className="grid items-end gap-2 rounded-md border p-3 sm:grid-cols-[2fr_1fr_auto]"
                  >
                    <div className="space-y-2">
                      <div className="text-xs font-medium">Material</div>
                      <select
                        value={mat.materialId || ""}
                        onChange={(e) =>
                          updateMaterial(
                            mat.key,
                            "materialId",
                            e.target.value ? Number(e.target.value) : 0,
                          )
                        }
                        className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
                        disabled={materials.isLoading}
                      >
                        <option value="">Pilih Material</option>
                        {(materials.data ?? []).map((m: any) => (
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
                        onChange={(e) =>
                          updateMaterial(mat.key, "qtyReq", e.target.value)
                        }
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
              <Button
                variant="outline"
                onClick={() => setStepDialogOpen(false)}
              >
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
      <CardHeader className="border-border bg-muted/20 border-b pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hover:bg-muted text-foreground -ml-2 h-auto px-3 py-1.5 text-lg font-bold"
              >
                Daftar PRO{" "}
                <span className="text-muted-foreground ml-2 font-normal">
                  {typeFilter === "PAPER"
                    ? "(Paper Box)"
                    : typeFilter === "RIGID"
                      ? "(Rigid Box)"
                      : typeFilter === "OTHER"
                        ? "(Other)"
                        : "(Semua)"}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => setTypeFilter("PAPER")}>
                Paper Box
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("RIGID")}>
                Rigid Box
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("OTHER")}>
                Other
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTypeFilter("ALL")}>
                Semua
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                value={q}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQ(e.target.value)
                }
                placeholder="Cari No. PRO / Produk..."
                className="bg-background pl-9 sm:w-64"
              />
            </div>

            <select
              value={status}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setStatus(e.target.value as any)
              }
              className="border-input bg-background focus:ring-primary h-10 rounded-md border px-3 text-sm focus:ring-2 sm:w-40"
            >
              <option value="ALL">Semua Status</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <div className="min-w-[980px]">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-muted-foreground w-44 px-4 py-3 text-xs font-bold tracking-wider uppercase">
                    No. PRO
                  </TableHead>
                  <TableHead className="text-muted-foreground w-24 px-4 py-3 text-xs font-bold tracking-wider uppercase">
                    Tipe
                  </TableHead>
                  <TableHead className="text-muted-foreground px-4 py-3 text-xs font-bold tracking-wider uppercase">
                    Produk
                  </TableHead>
                  <TableHead className="text-muted-foreground w-32 px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                    Target
                  </TableHead>
                  <TableHead className="text-muted-foreground w-28 px-4 py-3 text-xs font-bold tracking-wider uppercase">
                    Mulai
                  </TableHead>
                  <TableHead className="text-muted-foreground w-28 px-4 py-3 text-xs font-bold tracking-wider uppercase">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground w-24 px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                    Proses
                  </TableHead>
                  <TableHead className="text-muted-foreground w-40 px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {list.isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-10 text-center text-sm opacity-70"
                    >
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : list.error ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-destructive py-10 text-center text-sm"
                    >
                      {list.error.message}
                    </TableCell>
                  </TableRow>
                ) : list.data?.items?.length ? (
                  list.data.items.map((p: any) => (
                    <TableRow
                      key={p.id}
                      className="border-border hover:bg-muted/50 border-b transition-colors"
                    >
                      <TableCell className="text-foreground px-4 py-3 font-mono text-xs font-bold">
                        {p.proNumber}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs">
                        {(p as any).type === "PAPER" ? (
                          <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold">
                            PPR
                          </span>
                        ) : (p as any).type === "RIGID" ? (
                          <span className="inline-flex items-center rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            RGD
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-foreground px-4 py-3 text-sm font-semibold">
                        {p.productName}
                      </TableCell>
                      <TableCell className="text-muted-foreground px-4 py-3 text-right text-xs">
                        {(() => {
                          const lastStep = p.proses?.[p.proses.length - 1];
                          let currentOutput = 0;
                          if (lastStep?.productionReports) {
                            currentOutput = lastStep.productionReports
                              .filter((r: any) => r.status === "APPROVED")
                              .reduce(
                                (acc: number, curr: any) =>
                                  acc + (Number(curr.qtyPassOn) || 0),
                                0,
                              );
                          }
                          return (
                            <span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {currentOutput.toLocaleString("id-ID")}
                              </span>
                              <span className="text-muted-foreground mx-1">
                                /
                              </span>
                              {p.qtyPoPcs.toLocaleString("id-ID")}
                            </span>
                          );
                        })()}
                      </TableCell>
                      <TableCell className="text-muted-foreground px-4 py-3 text-xs font-medium">
                        {(() => {
                          const firstStep = p.proses?.[0];
                          const d = firstStep?.startDate ?? p.startDate;
                          return fmtDate(d);
                        })()}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`border text-[10px] font-bold ${p.status === "OPEN" ? "border-primary/20 bg-primary/10 text-primary" : ""} ${p.status === "IN_PROGRESS" ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400" : ""} ${p.status === "COMPLETE" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : ""} ${p.status === "CLOSED" ? "border-muted bg-muted text-muted-foreground" : ""} ${p.status === "CANCELLED" ? "border-destructive/20 bg-destructive/10 text-destructive" : ""} `}
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground px-4 py-3 text-right text-xs font-medium">
                        {p.proses?.length ?? 0}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        <div className="inline-flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-border text-muted-foreground hover:bg-muted hover:text-foreground h-7 text-xs font-medium"
                            onClick={() => setSelectedId(p.id)}
                          >
                            Detail
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 px-2 text-xs"
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
                      colSpan={8}
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

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
