"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type Status =
  | "ALL"
  | "OPEN"
  | "IN_PROGRESS"
  | "COMPLETE"
  | "CLOSED"
  | "CANCELLED";
type ProType = "ALL" | "PAPER" | "RIGID" | "OTHER";

function fmtNum(n: number) {
  return n.toLocaleString("id-ID");
}

function fmtDate(d?: Date | string | null) {
  if (!d) return "-";
  const x = typeof d === "string" ? new Date(d) : d;
  return x.toLocaleDateString("id-ID");
}

function statusClass(status: string) {
  if (status === "OPEN")
    return "bg-blue-500/15 text-blue-600 border-blue-400/30";
  if (status === "IN_PROGRESS")
    return "bg-amber-500/15 text-amber-600 border-amber-400/30";
  if (status === "COMPLETE")
    return "bg-emerald-500/15 text-emerald-600 border-emerald-400/30";
  if (status === "CANCELLED")
    return "bg-rose-500/15 text-rose-600 border-rose-400/30";
  return "bg-slate-500/15 text-slate-600 border-slate-400/30";
}

export default function ProTargetGap() {
  const [q, setQ] = React.useState("");
  const [status, setStatus] = React.useState<Status>("ALL");
  const [type, setType] = React.useState<ProType>("ALL");

  const queryInput = React.useMemo(
    () => ({
      q: q.trim() ? q.trim() : undefined,
      status: status === "ALL" ? undefined : status,
      type: type === "ALL" ? undefined : type,
      onlyOpen: status === "ALL",
      take: 300,
    }),
    [q, status, type],
  );

  const { data, isLoading, error } = api.pros.targetGapList.useQuery(
    queryInput,
    {
      staleTime: 20_000,
      refetchOnWindowFocus: false,
    },
  );

  const totals = React.useMemo(() => {
    const rows = data ?? [];
    const totalTarget = rows.reduce(
      (acc, r) => acc + Number(r.qtyPoPcs ?? 0),
      0,
    );
    const totalOutput = rows.reduce(
      (acc, r) => acc + Number((r as any).currentOutput ?? 0),
      0,
    );
    const totalGap = rows.reduce(
      (acc, r) => acc + Number((r as any).qtyGap ?? 0),
      0,
    );
    return { totalTarget, totalOutput, totalGap };
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase opacity-70">
              Total Target
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xl font-bold">
            {fmtNum(totals.totalTarget)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase opacity-70">
              Total Output
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xl font-bold">
            {fmtNum(totals.totalOutput)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase opacity-70">
              Total Kurang
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-xl font-bold text-rose-600">
            {fmtNum(totals.totalGap)}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <CardTitle className="text-base">Monitor Target Per PRO</CardTitle>
          <div className="grid gap-2 sm:grid-cols-[1fr_160px_160px]">
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari PRO / produk / PN..."
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Status)}
              className="border-input bg-background h-10 rounded-md border px-3 text-sm"
            >
              <option value="ALL">Semua Status</option>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETE">COMPLETE</option>
              <option value="CLOSED">CLOSED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ProType)}
              className="border-input bg-background h-10 rounded-md border px-3 text-sm"
            >
              <option value="ALL">Semua Type</option>
              <option value="PAPER">PAPER</option>
              <option value="RIGID">RIGID</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground py-8 text-center text-sm">
              Memuat data PRO...
            </div>
          ) : error ? (
            <div className="py-8 text-center text-sm text-rose-600">
              {error.message}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PRO</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead className="text-right">Target</TableHead>
                    <TableHead className="text-right">Output</TableHead>
                    <TableHead className="text-right">Kurang</TableHead>
                    <TableHead className="w-32">Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Start</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data ?? []).length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-muted-foreground h-24 text-center"
                      >
                        Tidak ada data PRO
                      </TableCell>
                    </TableRow>
                  ) : (
                    (data ?? []).map((r) => {
                      const target = Number(r.qtyPoPcs ?? 0);
                      const output = Number((r as any).currentOutput ?? 0);
                      const gap = Number((r as any).qtyGap ?? 0);
                      const pct = Math.max(
                        0,
                        Math.min(Number((r as any).progressPct ?? 0), 100),
                      );
                      return (
                        <TableRow key={r.id}>
                          <TableCell className="font-mono text-xs">
                            {r.proNumber}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[280px]">
                              <div className="truncate text-sm font-medium">
                                {r.productName}
                              </div>
                              <div className="text-muted-foreground truncate text-[11px]">
                                PN: {r.partNumber || "-"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {fmtNum(target)}
                          </TableCell>
                          <TableCell className="text-right">
                            {fmtNum(output)}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-rose-600">
                            {fmtNum(gap)}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-[11px] font-medium">
                                {pct.toFixed(1)}%
                              </div>
                              <div className="bg-muted h-1.5 w-full rounded-full">
                                <div
                                  className="h-1.5 rounded-full bg-emerald-500"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={statusClass(r.status)}
                            >
                              {r.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{r.type}</TableCell>
                          <TableCell>{fmtDate(r.startDate)}</TableCell>
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
