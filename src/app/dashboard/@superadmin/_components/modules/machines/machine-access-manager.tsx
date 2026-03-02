"use client";

import * as React from "react";
import { api } from "~/trpc/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Loader2,
  HardDrive,
  User,
  ShieldCheck,
  ShieldX,
  Check,
  RefreshCw,
} from "lucide-react";

export default function MachineAccessManager() {
  const utils = api.useUtils();

  // Semua user (operator)
  const users = api.adminUsers.getUsers.useQuery();
  // Semua mesin
  // @ts-ignore
  const machines = api.machines.list.useQuery({});
  // Semua akses saat ini
  const accesses = api.machineAccess.listByUser.useQuery();

  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
    null,
  );
  const [saving, setSaving] = React.useState(false);
  const [localSelected, setLocalSelected] = React.useState<Set<number>>(
    new Set(),
  );

  // Saat user dipilih, load mesin yang sudah dimiliki
  React.useEffect(() => {
    if (!selectedUserId || !accesses.data) return;
    const owned = accesses.data
      .filter((a) => a.userId === selectedUserId)
      .map((a) => a.machineId);
    setLocalSelected(new Set(owned));
  }, [selectedUserId, accesses.data]);

  const setMachines = api.machineAccess.setUserMachines.useMutation({
    onSuccess: async () => {
      await utils.machineAccess.listByUser.invalidate();
      await utils.machineAccess.myMachines.invalidate();
      setSaving(false);
    },
    onError: () => setSaving(false),
  });

  const handleToggleMachine = (machineId: number) => {
    setLocalSelected((prev) => {
      const next = new Set(prev);
      if (next.has(machineId)) next.delete(machineId);
      else next.add(machineId);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedUserId) return;
    setSaving(true);
    setMachines.mutate({
      userId: selectedUserId,
      machineIds: Array.from(localSelected),
    });
  };

  const selectedUser = users.data?.find((u) => u.id === selectedUserId);

  // Hitung badge count per user
  const accessCountByUser = React.useMemo(() => {
    const map: Record<string, number> = {};
    accesses.data?.forEach((a) => {
      map[a.userId] = (map[a.userId] ?? 0) + 1;
    });
    return map;
  }, [accesses.data]);

  const isLoading = users.isLoading || machines.isLoading || accesses.isLoading;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Akses Mesin per Operator</h2>
        <p className="text-muted-foreground text-sm">
          Tentukan mesin mana yang dapat dilihat oleh setiap operator di jadwal produksi.
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 py-8 text-sm text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          Memuat data...
        </div>
      )}

      {!isLoading && (
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          {/* --- Daftar User --- */}
          <Card className="h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Pilih Operator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-border divide-y">
                {(users.data ?? [])
                  .filter((u: any) => u.role === "OPERATOR" || u.role === "ADMIN")
                  .map((u: any) => {
                    const count = accessCountByUser[u.id] ?? 0;
                    const isActive = selectedUserId === u.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => setSelectedUserId(u.id)}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{u.username}</div>
                          <div className="text-muted-foreground text-[10px] uppercase tracking-wide">
                            {u.role} {u.department ? `· ${u.department}` : ""}
                          </div>
                        </div>
                        <Badge
                          variant={count > 0 ? "default" : "outline"}
                          className="text-[10px]"
                        >
                          {count > 0 ? (
                            <span className="flex items-center gap-1">
                              <HardDrive className="h-2.5 w-2.5" />
                              {count}
                            </span>
                          ) : (
                            "–"
                          )}
                        </Badge>
                      </button>
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* --- Daftar Mesin & Toggle --- */}
          {selectedUserId ? (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <HardDrive className="h-4 w-4" />
                      Mesin untuk:{" "}
                      <span className="text-primary font-black">
                        {selectedUser?.username}
                      </span>
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Centang mesin yang boleh diakses operator ini.{" "}
                      {localSelected.size > 0
                        ? `${localSelected.size} mesin dipilih.`
                        : "Belum ada mesin dipilih (tampilkan semua)."}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving || setMachines.isPending}
                    className="gap-1.5"
                  >
                    {saving || setMachines.isPending ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    Simpan
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-border overflow-hidden rounded-b-md border-t">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-muted-foreground w-10 px-4 text-xs font-bold uppercase tracking-wider">
                          ✓
                        </TableHead>
                        <TableHead className="text-muted-foreground px-4 text-xs font-bold uppercase tracking-wider">
                          Mesin
                        </TableHead>
                        <TableHead className="text-muted-foreground px-4 text-xs font-bold uppercase tracking-wider">
                          Tipe
                        </TableHead>
                        <TableHead className="text-muted-foreground px-4 text-right text-xs font-bold uppercase tracking-wider">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {machines.data?.map((m) => {
                        const isChecked = localSelected.has(m.id);
                        return (
                          <TableRow
                            key={m.id}
                            className={`border-border hover:bg-muted/40 cursor-pointer border-b ${
                              isChecked ? "bg-primary/5" : ""
                            }`}
                            onClick={() => handleToggleMachine(m.id)}
                          >
                            <TableCell className="px-4 py-3">
                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                                  isChecked
                                    ? "border-primary bg-primary text-white"
                                    : "border-muted-foreground/30"
                                }`}
                              >
                                {isChecked && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="px-4 py-3 font-medium">
                              <div className="text-sm">{m.name}</div>
                              {(m as any).defaultProPrefix && (
                                <div className="text-primary mt-0.5 text-[10px] font-semibold">
                                  [{(m as any).defaultProPrefix.code}]{" "}
                                  {(m as any).defaultProPrefix.name}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-muted-foreground px-4 py-3 text-xs">
                              {m.type}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-right">
                              {isChecked ? (
                                <span className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                  <ShieldCheck className="h-2.5 w-2.5" />
                                  Akses
                                </span>
                              ) : (
                                <span className="text-muted-foreground/50 inline-flex items-center gap-1 text-[10px]">
                                  <ShieldX className="h-2.5 w-2.5" />
                                  Tidak
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-muted/30 flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
              <User className="text-muted-foreground/30 mb-3 h-10 w-10" />
              <p className="text-muted-foreground text-sm">
                Pilih operator di sebelah kiri untuk mengatur akses mesin
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
