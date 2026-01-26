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

export default function ProList() {
  const utils = api.useUtils();

  // ===== VIEW STATE =====
  const [selectedId, setSelectedId] = React.useState<number | null>(null); // null => list view

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

  const update = api.pros.update.useMutation({
    onSuccess: async () => {
      if (selectedId) await utils.pros.getById.invalidate({ id: selectedId });
      await utils.pros.list.invalidate();
      setEditing(false);
    },
  });

  React.useEffect(() => {
    if (!detail.data) return;
    setProductName(detail.data.productName ?? "");
    setQtyPoPcs(String(detail.data.qtyPoPcs ?? ""));
    setStartDate(
      detail.data.startDate
        ? new Date(detail.data.startDate).toISOString().slice(0, 10)
        : "",
    );
  }, [detail.data]);

  const [err, setErr] = React.useState<string | null>(null);

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
              setErr(null);
            }}
          >
            ← Kembali ke daftar
          </Button>

          <div className="flex gap-2">
            {!editing ? (
              <Button onClick={() => setEditing(true)}>Edit PRO</Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(false);
                    setErr(null);
                    // reset values
                    setProductName(p.productName ?? "");
                    setQtyPoPcs(String(p.qtyPoPcs ?? ""));
                    setStartDate(
                      p.startDate
                        ? new Date(p.startDate).toISOString().slice(0, 10)
                        : "",
                    );
                  }}
                >
                  Batal
                </Button>
                <Button onClick={saveHeaderOnly} disabled={update.isPending}>
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

            <div className="overflow-x-auto rounded-md border">
              <div className="min-w-[980px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">No</TableHead>
                      <TableHead>Proses</TableHead>
                      <TableHead className="w-20 text-right">UP</TableHead>
                      <TableHead>Machine</TableHead>
                      <TableHead>Material</TableHead>
                      <TableHead className="w-24 text-right">Qty</TableHead>
                      <TableHead className="w-20">UoM</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {p.steps.map((s) => {
                      const mat0 = s.materials?.[0];
                      return (
                        <TableRow key={s.id}>
                          <TableCell>{s.orderNo}</TableCell>
                          <TableCell className="font-medium">
                            {s.process.code} - {s.process.name}
                          </TableCell>
                          <TableCell className="text-right">
                            {s.up ?? "-"}
                          </TableCell>
                          <TableCell>{s.machine?.name ?? "-"}</TableCell>
                          <TableCell>{mat0?.material?.name ?? "-"}</TableCell>
                          <TableCell className="text-right">
                            {mat0?.qtyReq ? String(mat0.qtyReq) : "-"}
                          </TableCell>
                          <TableCell>{mat0?.material?.uom ?? "-"}</TableCell>
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
                        <Button
                          variant="outline"
                          onClick={() => setSelectedId(p.id)}
                        >
                          Detail
                        </Button>
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
