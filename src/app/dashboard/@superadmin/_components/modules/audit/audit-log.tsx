"use client";

import * as React from "react";
import { RefreshCw, Search } from "lucide-react";
import { api } from "~/trpc/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

type FilterType = "ALL" | "USER" | "REPORT" | "ITEM" | "MACHINE" | "PRO";

function actionBadgeVariant(
  action: string,
): "outline" | "secondary" | "destructive" {
  if (action.includes("REJECT") || action.includes("VOID"))
    return "destructive";
  if (action.includes("CREATED")) return "secondary";
  return "outline";
}

export default function AuditLog() {
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState<FilterType>("ALL");
  const deferredSearch = React.useDeferredValue(search);

  const { data, isLoading, isFetching, refetch } = api.audit.list.useQuery({
    limit: 200,
    type,
    search: deferredSearch.trim() ? deferredSearch.trim() : undefined,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle>Audit Log</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              void refetch();
            }}
            disabled={isLoading || isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari action / actor / target..."
              className="pl-8"
            />
          </div>
          <Select value={type} onValueChange={(v) => setType(v as FilterType)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Tipe</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="REPORT">Report</SelectItem>
              <SelectItem value="ITEM">Item</SelectItem>
              <SelectItem value="MACHINE">Machine</SelectItem>
              <SelectItem value="PRO">PRO</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-muted-foreground py-10 text-center text-sm">
            Memuat audit log...
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-muted-foreground py-10 text-center text-sm">
            Belum ada data audit log.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[170px]">Waktu</TableHead>
                <TableHead className="w-[100px]">Tipe</TableHead>
                <TableHead className="w-[170px]">Action</TableHead>
                <TableHead className="w-[140px]">Actor</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(row.at).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={actionBadgeVariant(row.action)}>
                      {row.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{row.actor}</TableCell>
                  <TableCell className="max-w-[320px] text-sm break-words whitespace-normal">
                    {row.target}
                  </TableCell>
                  <TableCell className="max-w-[360px] text-sm break-words whitespace-normal">
                    {row.detail ?? "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
