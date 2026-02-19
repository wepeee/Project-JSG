"use client";

import * as React from "react";
import { api } from "~/trpc/react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
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
} from "lucide-react";

export default function ProcessManager() {
  const utils = api.useUtils();

  const processes = api.processes.list.useQuery({});

  const createProc = api.processes.create.useMutation({
    onSuccess: async () => utils.processes.list.invalidate(),
  });
  const updateProc = api.processes.update.useMutation({
    onSuccess: async () => utils.processes.list.invalidate(),
  });
  const deleteProc = api.processes.delete.useMutation({
    onSuccess: async () => utils.processes.list.invalidate(),
  });

  const [q, setQ] = React.useState("");

  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<"PAPER" | "RIGID">("PAPER");

  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingCode, setEditingCode] = React.useState("");
  const [editingName, setEditingName] = React.useState("");
  const [editingType, setEditingType] = React.useState<"PAPER" | "RIGID">(
    "PAPER",
  );
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const [err, setErr] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const data = processes.data ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data;
    return data.filter(
      (p) => p.code.includes(needle) || p.name.toLowerCase().includes(needle),
    );
  }, [q, processes.data]);

  const onCreate = async () => {
    setErr(null);
    const c = code.trim();
    const n = name.trim();
    if (!/^\d{2}$/.test(c)) return setErr("Kode harus 2 digit (00-99)");
    if (!n) return setErr("Nama proses wajib diisi");

    try {
      // @ts-ignore - backend will be updated
      await createProc.mutateAsync({ code: c, name: n, type });
      setCode("");
      setName("");
      setName("");
      setType("PAPER");
      setIsCreateOpen(false); // Close dialog on success
    } catch (e: any) {
      setErr(e?.message ?? "Gagal tambah proses");
    }
  };

  const startEdit = (p: {
    id: number;
    code: string;
    name: string;
    type: any;
  }) => {
    setErr(null);
    setEditingId(p.id);
    setEditingCode(p.code);
    setEditingName(p.name);
    setEditingType((p.type as "PAPER" | "RIGID") || "PAPER");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingCode("");
    setEditingName("");
  };

  const onSave = async () => {
    setErr(null);
    if (!editingId) return;

    const c = editingCode.trim();
    const n = editingName.trim();
    if (!/^\d{2}$/.test(c)) return setErr("Kode harus 2 digit (00-99)");
    if (!n) return setErr("Nama proses wajib diisi");

    try {
      // @ts-ignore
      await updateProc.mutateAsync({
        id: editingId,
        code: c,
        name: n,
        type: editingType,
      });
      cancelEdit();
    } catch (e: any) {
      setErr(e?.message ?? "Gagal update proses");
    }
  };

  const onDelete = async (id: number) => {
    setErr(null);
    if (!confirm("Hapus proses ini?")) return;
    try {
      await deleteProc.mutateAsync({ id });
    } catch (e: any) {
      setErr(e?.message ?? "Gagal hapus proses (mungkin sudah dipakai di PRO)");
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header & Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proses Produksi</h1>
          <p className="text-muted-foreground text-sm">
            Kelola daftar proses (Paper & Rigid Box)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Cari kode/nama..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="bg-background w-[250px] pl-9"
            />
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-primary/20 gap-2 font-bold shadow-lg">
                <Plus className="h-4 w-4" />
                Tambah Proses
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Proses Baru</DialogTitle>
                <DialogDescription>
                  Isi kode dan nama proses produksi baru.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Kode (2 Digit)</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Contoh: 01"
                    className="font-mono"
                    maxLength={2}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Nama Proses</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Potong Kertas"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tipe Box</label>
                  <div className="bg-muted/50 flex items-center gap-2 rounded-lg border p-1">
                    <Button
                      type="button"
                      variant={type === "PAPER" ? "default" : "ghost"}
                      onClick={() => setType("PAPER")}
                      className={`flex-1 ${type === "PAPER" ? "shadow-sm" : ""}`}
                      size="sm"
                    >
                      Paper Box
                    </Button>
                    <Button
                      type="button"
                      variant={type === "RIGID" ? "default" : "ghost"}
                      onClick={() => setType("RIGID")}
                      className={`flex-1 ${type === "RIGID" ? "shadow-sm" : ""}`}
                      size="sm"
                    >
                      Rigid Box
                    </Button>
                  </div>
                </div>
                {err && (
                  <div className="bg-destructive/15 text-destructive flex items-center gap-2 rounded-md p-3 text-sm font-medium">
                    <AlertCircle className="h-4 w-4" />
                    {err}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Batal
                </Button>
                <Button onClick={onCreate} disabled={createProc.isPending}>
                  {createProc.isPending ? "Menyimpan..." : "Simpan Proses"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main List Card */}
      <Card className="border-none shadow-md">
        <CardContent className="p-0">
          {processes.isLoading ? (
            <div className="text-muted-foreground flex h-32 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
                <span className="text-xs font-medium">Memuat data...</span>
              </div>
            </div>
          ) : processes.error ? (
            <div className="text-destructive p-8 text-center">
              <AlertCircle className="mx-auto mb-2 h-8 w-8 opacity-50" />
              {processes.error.message}
            </div>
          ) : (
            <div className="rounded-md">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-24">Kode</TableHead>
                    <TableHead>Nama Proses</TableHead>
                    <TableHead className="w-32 text-center">Tipe</TableHead>
                    <TableHead className="w-[150px] text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-muted-foreground h-32 text-center"
                      >
                        Tidak ada data proses ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((p) => {
                      const isEdit = editingId === p.id;
                      return (
                        <TableRow key={p.id} className="group">
                          <TableCell className="font-mono font-medium">
                            {isEdit ? (
                              <Input
                                value={editingCode}
                                onChange={(e) => setEditingCode(e.target.value)}
                                className="h-8 font-mono text-xs"
                                maxLength={2}
                              />
                            ) : (
                              <span className="bg-muted rounded px-2 py-1 text-xs">
                                {p.code}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {isEdit ? (
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                className="h-8"
                              />
                            ) : (
                              p.name
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            {isEdit ? (
                              <div className="bg-muted flex items-center gap-1 rounded p-0.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingType("PAPER")}
                                  className={`flex-1 rounded px-1 text-[10px] font-bold uppercase transition-all ${editingType === "PAPER" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}
                                >
                                  Paper
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingType("RIGID")}
                                  className={`flex-1 rounded px-1 text-[10px] font-bold uppercase transition-all ${editingType === "RIGID" ? "bg-background text-primary shadow-sm" : "text-muted-foreground"}`}
                                >
                                  Rigid
                                </button>
                              </div>
                            ) : (
                              <span
                                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${p.type === "RIGID" ? "border-orange-200 bg-orange-100 text-orange-700" : "border-blue-200 bg-blue-100 text-blue-700"}`}
                              >
                                {p.type ?? "PAPER"}
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
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="icon"
                                  className="h-7 w-7 bg-green-600 text-white hover:bg-green-700"
                                  onClick={onSave}
                                  disabled={updateProc.isPending}
                                >
                                  <Save className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => startEdit(p as any)}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:bg-destructive/10 h-7 w-7"
                                  onClick={() => onDelete(p.id)}
                                  disabled={deleteProc.isPending}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
