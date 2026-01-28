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

export default function ProcessManager() {
  const utils = api.useUtils();

  const processes = api.processes.list.useQuery();

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

  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingCode, setEditingCode] = React.useState("");
  const [editingName, setEditingName] = React.useState("");

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
      await createProc.mutateAsync({ code: c, name: n });
      setCode("");
      setName("");
    } catch (e: any) {
      setErr(e?.message ?? "Gagal tambah proses");
    }
  };

  const startEdit = (p: { id: number; code: string; name: string }) => {
    setErr(null);
    setEditingId(p.id);
    setEditingCode(p.code);
    setEditingName(p.name);
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
      await updateProc.mutateAsync({ id: editingId, code: c, name: n });
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Proses</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-3">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Kode (2 digit) contoh: 11"
            />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama proses contoh: CETAK"
            />
            <Button onClick={onCreate} disabled={createProc.isPending}>
              {createProc.isPending ? "..." : "Tambah"}
            </Button>
          </div>
          {err ? <p className="text-destructive text-sm">{err}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Daftar Proses</CardTitle>
            <div className="w-full sm:max-w-xs">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search kode/nama..."
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {processes.isLoading ? (
            <p className="text-sm">Loading...</p>
          ) : processes.error ? (
            <p className="text-destructive text-sm">
              {processes.error.message}
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => {
                    const isEdit = editingId === p.id;
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="w-28">
                          {isEdit ? (
                            <Input
                              value={editingCode}
                              onChange={(e) => setEditingCode(e.target.value)}
                            />
                          ) : (
                            p.code
                          )}
                        </TableCell>
                        <TableCell>
                          {isEdit ? (
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                            />
                          ) : (
                            p.name
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {isEdit ? (
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={cancelEdit}>
                                Batal
                              </Button>
                              <Button
                                onClick={onSave}
                                disabled={updateProc.isPending}
                              >
                                {updateProc.isPending ? "..." : "Simpan"}
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => startEdit(p)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => onDelete(p.id)}
                                disabled={deleteProc.isPending}
                              >
                                Hapus
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
