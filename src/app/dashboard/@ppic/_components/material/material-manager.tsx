"use client";

import * as React from "react";
import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Search,
  Plus,
  AlertCircle,
  X,
  Save,
  Edit2,
  Trash2,
  Package,
  CheckCircle2,
} from "lucide-react";

const UOM_OPTIONS = [
  "drum",
  "gr",
  "gram",
  "kg",
  "liter",
  "pack",
  "pcs",
  "rim",
  "roll",
  "sheet",
  "meter",
  "cm",
] as const;
type Uom = (typeof UOM_OPTIONS)[number];
type MaterialKind = "RAW" | "WIP" | "FG" | "CONSUMABLE";

function normalizeMaterialKind(value?: string | null): MaterialKind {
  if (value === "WIP") return "WIP";
  if (value === "FG") return "FG";
  if (value === "CONSUMABLE") return "CONSUMABLE";
  return "RAW";
}

export default function MaterialManager() {
  const utils = api.useUtils();

  const materials = api.materials.list.useQuery(
    { includeFg: true, withStock: false },
    { staleTime: 60_000, refetchOnWindowFocus: false },
  );

  const createMat = api.materials.create.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.materials.list.invalidate(),
        utils.items.search.invalidate(),
      ]);
    },
  });
  const updateMat = api.materials.update.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.materials.list.invalidate(),
        utils.items.search.invalidate(),
      ]);
    },
  });
  const deleteMat = api.materials.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.materials.list.invalidate(),
        utils.items.search.invalidate(),
      ]);
    },
  });
  const activateMat = api.materials.activate.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.materials.list.invalidate(),
        utils.items.search.invalidate(),
      ]);
      setOk("Item berhasil diaktifkan");
    },
  });

  // CREATE form state
  const [name, setName] = React.useState("");
  const [uom, setUom] = React.useState<Uom>("sheet");
  const [type, setType] = React.useState<MaterialKind>("RAW");
  const [code, setCode] = React.useState("");

  // SEARCH & FILTER state
  const [q, setQ] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "ALL" | "DRAFT" | "ACTIVE"
  >("ALL");

  // EDIT state
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingName, setEditingName] = React.useState("");
  const [editingUom, setEditingUom] = React.useState<Uom>("sheet");
  const [editingType, setEditingType] = React.useState<MaterialKind>("RAW");
  const [editingCode, setEditingCode] = React.useState("");

  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const data = materials.data ?? [];
    const needle = q.trim().toLowerCase();

    return data.filter((m) => {
      // Status filter
      if (statusFilter !== "ALL" && (m as any).status !== statusFilter)
        return false;

      // Text search
      if (!needle) return true;
      const n = m.name.toLowerCase();
      const u = String(m.uom).toLowerCase();
      const c = (m.code ?? "").toLowerCase();
      return n.includes(needle) || u.includes(needle) || c.includes(needle);
    });
  }, [q, statusFilter, materials.data]);

  const draftCount = React.useMemo(() => {
    return (materials.data ?? []).filter((m) => (m as any).status === "DRAFT")
      .length;
  }, [materials.data]);

  const groupedMaterials = React.useMemo(() => {
    const groups: Record<MaterialKind, typeof filtered> = {
      RAW: [],
      WIP: [],
      FG: [],
      CONSUMABLE: [],
    };

    for (const m of filtered) {
      const kind = normalizeMaterialKind((m as any).type ?? (m as any).kind);
      groups[kind].push(m);
    }

    return groups;
  }, [filtered]);

  const rawTableMaterials = React.useMemo(
    () =>
      [...groupedMaterials.RAW, ...groupedMaterials.CONSUMABLE]
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [groupedMaterials],
  );

  const wipFgTableMaterials = React.useMemo(
    () =>
      [...groupedMaterials.WIP, ...groupedMaterials.FG]
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name)),
    [groupedMaterials],
  );

  const resetMessages = () => {
    setErr(null);
    setOk(null);
  };

  const onCreate = async () => {
    resetMessages();

    const n = name.trim();
    if (!n) return setErr("Nama material wajib diisi");

    try {
      await createMat.mutateAsync({
        name: n,
        uom,
        type: type as any,
        code: code.trim(),
      });

      setOk("Material berhasil ditambahkan");
      setName("");
      setUom("sheet");
      setType("RAW");
      setCode("");
    } catch (e: any) {
      setErr(e?.message ?? "Gagal menambah material");
    }
  };

  const startEdit = (m: any) => {
    resetMessages();
    setEditingId(m.id);
    setEditingName(m.name);
    setEditingUom(m.uom as Uom);
    setEditingType(normalizeMaterialKind(m.type));
    setEditingCode(m.code ?? "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingUom("sheet");
    setEditingCode("");
  };

  const onSave = async () => {
    resetMessages();
    if (!editingId) return;

    const n = editingName.trim();
    if (!n) return setErr("Nama material wajib diisi");

    try {
      await updateMat.mutateAsync({
        id: editingId,
        name: n,
        uom: editingUom,
        type: editingType as any,
        code: editingCode.trim(),
      });

      setOk("Material berhasil diupdate");
      cancelEdit();
    } catch (e: any) {
      setErr(e?.message ?? "Gagal update material");
    }
  };

  const onDelete = async (id: number) => {
    resetMessages();
    if (!confirm("Hapus material ini?")) return;

    try {
      await deleteMat.mutateAsync({ id });
      setOk("Material berhasil dihapus");
      if (editingId === id) cancelEdit();
    } catch (e: any) {
      setErr(e?.message ?? "Gagal hapus material");
    }
  };

  const renderMaterialRow = (m: any) => {
    const isEdit = editingId === m.id;

    return (
      <TableRow key={m.id} className="group">
        <TableCell className="font-mono text-sm">
          {isEdit ? (
            <Input
              value={editingCode}
              onChange={(e) => setEditingCode(e.target.value)}
              placeholder="Kode PN"
              className="h-8 font-mono text-xs"
              autoComplete="off"
            />
          ) : m.code ? (
            <span className="font-bold">{m.code}</span>
          ) : (
            <span className="text-muted-foreground text-[10px] italic">
              Gen. Otomatis
            </span>
          )}
        </TableCell>

        <TableCell className="font-medium">
          {isEdit ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              autoComplete="off"
              className="h-8"
            />
          ) : (
            <div className="flex flex-col">
              <span>{m.name}</span>
              <span className="text-muted-foreground max-w-[200px] truncate font-mono text-[10px]">
                ID: {m.id}
              </span>
            </div>
          )}
        </TableCell>

        <TableCell>
          {isEdit ? (
            <select
              value={editingUom}
              onChange={(e) => setEditingUom(e.target.value as Uom)}
              className="border-input bg-background h-8 w-full rounded-md border px-2 text-xs"
            >
              {UOM_OPTIONS.map((x) => (
                <option key={x} value={x}>
                  {x.toUpperCase()}
                </option>
              ))}
            </select>
          ) : (
            <span className="font-mono text-xs">{String(m.uom)}</span>
          )}
        </TableCell>

        <TableCell>
          {isEdit ? (
            <select
              value={editingType}
              onChange={(e) => setEditingType(e.target.value as MaterialKind)}
              className="border-input bg-background h-8 w-full rounded-md border px-2 text-xs"
            >
              <option value="RAW">RAW</option>
              <option value="WIP">WIP</option>
              <option value="FG">FG</option>
              <option value="CONSUMABLE">CONSUMABLE</option>
            </select>
          ) : (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${
                (m as any).type === "RAW"
                  ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                  : (m as any).type === "WIP"
                    ? "border-amber-200 bg-amber-100 text-amber-700"
                    : (m as any).type === "FG"
                      ? "border-cyan-200 bg-cyan-100 text-cyan-700"
                      : "border-slate-200 bg-slate-100 text-slate-700"
              }`}
            >
              {(m as any).type || "RAW"}
            </span>
          )}
        </TableCell>

        <TableCell>
          {(m as any).status === "DRAFT" ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/50 bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold text-amber-500">
              • DRAFT
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-green-300/50 bg-green-500/15 px-2 py-0.5 text-[10px] font-bold text-green-500">
              ✓ ACTIVE
            </span>
          )}
        </TableCell>

        <TableCell className="text-right">
          {isEdit ? (
            <div className="flex justify-end gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={cancelEdit}
                disabled={updateMat.isPending}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="icon"
                className="h-7 w-7 bg-green-600 text-white hover:bg-green-700"
                onClick={onSave}
                disabled={updateMat.isPending}
              >
                <Save className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {(m as any).status === "DRAFT" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 border-green-500/30 px-2 text-[11px] font-bold text-green-500 hover:bg-green-500/10 hover:text-green-400"
                  onClick={() => activateMat.mutate({ id: m.id })}
                  disabled={activateMat.isPending}
                >
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Aktifkan
                </Button>
              )}
              <Button
                variant="secondary"
                size="icon"
                className="h-7 w-7"
                onClick={() =>
                  startEdit({
                    id: m.id,
                    name: m.name,
                    uom: m.uom as Uom,
                    type: (m as any).type,
                    code: m.code ?? "",
                  })
                }
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 h-7 w-7"
                onClick={() => onDelete(m.id)}
                disabled={deleteMat.isPending}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </TableCell>
      </TableRow>
    );
  };

  const renderMaterialTable = (rows: any[], emptyMessage: string) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-32">Kode (PN)</TableHead>
            <TableHead className="w-[35%]">Nama Material</TableHead>
            <TableHead className="w-24">UoM</TableHead>
            <TableHead className="w-28">Tipe</TableHead>
            <TableHead className="w-28">Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-muted-foreground h-20 text-center text-xs"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((m) => renderMaterialRow(m))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Material & Bahan
          </h1>
          <p className="text-muted-foreground text-sm">
            Kelola data bahan baku (RAW), WIP, FG, dan Consumable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="bg-muted flex h-9 items-center rounded-lg p-0.5">
            {(["ALL", "DRAFT", "ACTIVE"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`relative rounded-md px-3 py-1.5 text-xs font-bold transition-all ${
                  statusFilter === s
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "ALL" ? "Semua" : s}
                {s === "DRAFT" && draftCount > 0 && (
                  <span className="ml-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 px-1 text-[9px] font-bold text-white">
                    {draftCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Cari nama/kode/uom..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="bg-background w-[250px] pl-9"
            />
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-primary/20 gap-2 font-bold shadow-lg">
                <Plus className="h-4 w-4" />
                Tambah Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Material Baru</DialogTitle>
                <DialogDescription>
                  Masukkan detail material baru ke dalam sistem.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-[1fr_2fr] gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mat-code">Kode (PN)</Label>
                    <Input
                      id="mat-code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Opsional, ct: 2061007"
                      autoComplete="off"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mat-name">Nama Material</Label>
                    <Input
                      id="mat-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: KERTAS A4 70GSM"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mat-uom">Satuan (UoM)</Label>
                    <select
                      id="mat-uom"
                      value={uom}
                      onChange={(e) => setUom(e.target.value as Uom)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {UOM_OPTIONS.map((x) => (
                        <option key={x} value={x}>
                          {x.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mat-type">Jenis Material</Label>
                    <select
                      id="mat-type"
                      value={type}
                      onChange={(e) =>
                        setType(e.target.value as MaterialKind)
                      }
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="RAW">BAHAN BAKU (RAW)</option>
                      <option value="WIP">WIP</option>
                      <option value="FG">FINISHED GOODS (FG)</option>
                      <option value="CONSUMABLE">BAHAN PENOLONG</option>
                    </select>
                  </div>
                </div>

                {err && (
                  <div className="bg-destructive/15 text-destructive flex items-center gap-2 rounded-md p-3 text-sm font-medium">
                    <AlertCircle className="h-4 w-4" />
                    {err}
                  </div>
                )}
                {ok && (
                  <div className="flex items-center gap-2 rounded-md bg-green-500/15 p-3 text-sm font-medium text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    {ok}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Selesai
                </Button>
                <Button onClick={onCreate} disabled={createMat.isPending}>
                  {createMat.isPending ? "Menyimpan..." : "Simpan & Buat Lagi"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* LIST */}
      <Card className="border-none shadow-md">
        <CardContent className="p-0">
          {materials.isLoading ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                <span className="text-xs font-medium">Memuat data...</span>
              </div>
            </div>
          ) : materials.error ? (
            <div className="text-destructive p-8 text-center">
              <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
              {materials.error.message}
            </div>
          ) : (
            <div className="space-y-6 rounded-md p-4">
              {filtered.length === 0 ? (
                <div className="text-muted-foreground h-32 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="bg-muted rounded-full p-4">
                      <Package className="h-6 w-6 opacity-20" />
                    </div>
                    <p className="font-medium">Tidak ada material ditemukan</p>
                  </div>
                </div>
              ) : (
                <Tabs defaultValue="raw" className="w-full">
                  <TabsList className="h-auto">
                    <TabsTrigger value="raw">
                      RAW ({rawTableMaterials.length})
                    </TabsTrigger>
                    <TabsTrigger value="wipfg">
                      WIP + FG ({wipFgTableMaterials.length})
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="raw" className="mt-3">
                    {renderMaterialTable(
                      rawTableMaterials,
                      "Belum ada data RAW/CONSUMABLE",
                    )}
                  </TabsContent>
                  <TabsContent value="wipfg" className="mt-3">
                    {renderMaterialTable(
                      wipFgTableMaterials,
                      "Belum ada data WIP/FG",
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

