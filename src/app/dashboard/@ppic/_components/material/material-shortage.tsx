"use client";

import { useMemo, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type Row = {
  code: string;
  name: string;
  wh: string;
  onHand: number;
  required: number;
  shortage: number;
  due: string;
  status: "Critical" | "Warning" | "OK";
};

const DATA: Row[] = [
  {
    code: "MAT-001",
    name: "Resin A",
    wh: "WH-01",
    onHand: 120,
    required: 200,
    shortage: 80,
    due: "2026-01-28",
    status: "Critical",
  },
  {
    code: "MAT-014",
    name: "Carton Box 20x30",
    wh: "WH-02",
    onHand: 500,
    required: 650,
    shortage: 150,
    due: "2026-01-30",
    status: "Warning",
  },
  {
    code: "MAT-103",
    name: "Label Sticker",
    wh: "WH-01",
    onHand: 1200,
    required: 900,
    shortage: 0,
    due: "2026-02-03",
    status: "OK",
  },
];

export default function MaterialShortage() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return DATA;
    return DATA.filter(
      (r) =>
        r.code.toLowerCase().includes(s) ||
        r.name.toLowerCase().includes(s) ||
        r.wh.toLowerCase().includes(s),
    );
  }, [q]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Shortage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Cari material / lokasi..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <Button>Generate PR</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>WH</TableHead>
              <TableHead className="text-right">On Hand</TableHead>
              <TableHead className="text-right">Required</TableHead>
              <TableHead className="text-right">Shortage</TableHead>
              <TableHead>Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.code}>
                <TableCell>{badge(r.status)}</TableCell>
                <TableCell>
                  <div className="font-medium">{r.code}</div>
                  <div className="text-muted-foreground text-xs">{r.name}</div>
                </TableCell>
                <TableCell>{r.wh}</TableCell>
                <TableCell className="text-right">{r.onHand}</TableCell>
                <TableCell className="text-right">{r.required}</TableCell>
                <TableCell className="text-right font-semibold">
                  {r.shortage}
                </TableCell>
                <TableCell>{r.due}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function badge(s: Row["status"]) {
  const variant =
    s === "Critical"
      ? "destructive"
      : s === "Warning"
        ? "secondary"
        : "outline";
  return <Badge variant={variant as any}>{s}</Badge>;
}
