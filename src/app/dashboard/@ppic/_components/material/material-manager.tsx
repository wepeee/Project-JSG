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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const UOM_OPTIONS = ["sheet", "pcs", "meter", "cm"] as const;
type Uom = (typeof UOM_OPTIONS)[number];

export default function MaterialManager() {
  const utils = api.useUtils();

  const materials = api.materials.list.useQuery();

  const createMat = api.materials.create.useMutation({
    onSuccess: async () => utils.materials.list.invalidate(),
  });
  const updateMat = api.materials.update.useMutation({
    onSuccess: async () => utils.materials.list.invalidate(),
  });
  const deleteMat = api.materials.delete.useMutation({
    onSuccess: async () => utils.materials.list.invalidate(),
  });

  // CREATE form state
  const [name, setName] = React.useState("");
  const [uom, setUom] = React.useState<Uom>("sheet");

  // SEARCH state
  const [q, setQ] = React.useState("");

  // EDIT state
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingName, setEditingName] = React.useState("");
  const [editingUom, setEditingUom] = React.useState<Uom>("sheet");

  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const data = materials.data ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data;

    return data.filter((m) => {
      const n = m.name.toLowerCase();
      const u = String(m.uom).toLowerCase();
      return n.includes(needle) || u.includes(needle);
    });
  }, [q, materials.data]);

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
      });

      setOk("Material berhasil ditambahkan");
      setName("");
      setUom("sheet");
    } catch (e: any) {
      setErr(e?.message ?? "Gagal menambah material");
    }
  };

  const startEdit = (m: { id: number; name: string; uom: Uom }) => {
    resetMessages();
    setEditingId(m.id);
    setEditingName(m.name);
    setEditingUom(m.uom);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingUom("sheet");
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

  return (
    <div className="space-y-6">
      {/* CREATE */}
      <Card>
        <CardHeader>
          <CardTitle>Tambah Material</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="mat-name">Nama</Label>
              <Input
                id="mat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="contoh: KERTAS A4"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="mat-uom">UoM</Label>
              <select
                id="mat-uom"
                value={uom}
                onChange={(e) => setUom(e.target.value as Uom)}
                className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
              >
                {UOM_OPTIONS.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {err ? <p className="text-destructive text-sm">{err}</p> : null}
          {ok ? <p className="text-sm">{ok}</p> : null}
        </CardContent>

        <CardFooter>
          <Button
            className="w-full"
            onClick={onCreate}
            disabled={createMat.isPending}
          >
            {createMat.isPending ? "Menyimpan..." : "Tambah Material"}
          </Button>
        </CardFooter>
      </Card>

      {/* LIST */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Daftar Material</CardTitle>
            <div className="w-full sm:max-w-xs">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search nama / uom"
                autoComplete="off"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {materials.isLoading ? (
            <p className="text-sm">Loading...</p>
          ) : materials.error ? (
            <p className="text-destructive text-sm">
              {materials.error.message}
            </p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>UoM</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-sm opacity-70"
                      >
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((m) => {
                      const isEdit = editingId === m.id;

                      return (
                        <TableRow key={m.id}>
                          <TableCell className="font-medium">
                            {isEdit ? (
                              <Input
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                autoComplete="off"
                              />
                            ) : (
                              m.name
                            )}
                          </TableCell>

                          <TableCell>
                            {isEdit ? (
                              <select
                                value={editingUom}
                                onChange={(e) =>
                                  setEditingUom(e.target.value as Uom)
                                }
                                className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                              >
                                {UOM_OPTIONS.map((x) => (
                                  <option key={x} value={x}>
                                    {x}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              String(m.uom)
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            {isEdit ? (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={cancelEdit}
                                  disabled={updateMat.isPending}
                                >
                                  Batal
                                </Button>
                                <Button
                                  onClick={onSave}
                                  disabled={updateMat.isPending}
                                >
                                  {updateMat.isPending ? "..." : "Simpan"}
                                </Button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    startEdit({
                                      id: m.id,
                                      name: m.name,
                                      uom: m.uom as Uom,
                                    })
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => onDelete(m.id)}
                                  disabled={deleteMat.isPending}
                                >
                                  Hapus
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
