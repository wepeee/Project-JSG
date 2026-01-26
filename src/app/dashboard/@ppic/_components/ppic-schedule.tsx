"use client";

import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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
  wo: string;
  item: string;
  line: string;
  start: string;
  end: string;
  qty: number;
  status: "On Track" | "At Risk" | "Delayed";
};

const DATA: Row[] = [
  {
    wo: "WO-24019",
    item: "SKU-AX12",
    line: "LINE-1",
    start: "08:00",
    end: "12:00",
    qty: 1200,
    status: "On Track",
  },
  {
    wo: "WO-24020",
    item: "SKU-BK77",
    line: "LINE-2",
    start: "09:00",
    end: "15:00",
    qty: 900,
    status: "At Risk",
  },
  {
    wo: "WO-24021",
    item: "SKU-CM10",
    line: "LINE-1",
    start: "13:00",
    end: "18:00",
    qty: 700,
    status: "Delayed",
  },
];

export default function PPICSchedule() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Hari Ini</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>WO</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Line</TableHead>
              <TableHead>Start</TableHead>
              <TableHead>End</TableHead>
              <TableHead className="text-right">Qty</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {DATA.map((r) => (
              <TableRow key={r.wo}>
                <TableCell>{badge(r.status)}</TableCell>
                <TableCell className="font-medium">{r.wo}</TableCell>
                <TableCell>{r.item}</TableCell>
                <TableCell>{r.line}</TableCell>
                <TableCell>{r.start}</TableCell>
                <TableCell>{r.end}</TableCell>
                <TableCell className="text-right">{r.qty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex justify-end gap-2">
          <Button variant="outline">Export</Button>
          <Button>Adjust</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function badge(s: Row["status"]) {
  const variant =
    s === "Delayed" ? "destructive" : s === "At Risk" ? "secondary" : "outline";
  return <Badge variant={variant as any}>{s}</Badge>;
}
