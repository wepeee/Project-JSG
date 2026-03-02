"use client";

import * as React from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Loader2, Pencil, Trash2 } from "lucide-react";

const SHIFT_HOURS = 7; // Rigid usually 7 hrs shift based on data (14700/2100=7)
const PAPER_SHIFT_HOURS = 6.8;

const UOM_OPTIONS = ["sheet", "pcs", "meter", "cm"] as const;
type Uom = (typeof UOM_OPTIONS)[number];

type MachineType = "PAPER" | "RIGID";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  stdOutputPerHour: z.number().int().positive("Harus > 0"),
  stdOutputPerShift: z.number().int().nonnegative(),
  uom: z.enum(UOM_OPTIONS),
  remark: z.string().optional(),

  // Rigid specific
  cycleTimeSec: z.number().optional(),
  cavity: z.number().int().optional(),
  manPower: z.number().int().optional(),
  workCenter: z.string().optional(),
  defaultProPrefixId: z.number().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function MachineManager({
  machineType = "PAPER",
}: {
  machineType?: MachineType;
}) {
  const utils = api.useUtils();
  const machines = api.machines.list.useQuery({ type: machineType });
  const prefixes = api.processes.list.useQuery({
    type: machineType === "RIGID" ? "RIGID" : "PAPER",
  });

  const [q, setQ] = React.useState("");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Edit State
  const [editOpen, setEditOpen] = React.useState(false);
  const [editingMachine, setEditingMachine] = React.useState<any>(null);
  const [editError, setEditError] = React.useState<string | null>(null);

  // Delete State
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const createMachine = api.machines.create.useMutation({
    onSuccess: async () => {
      // @ts-ignore
      await utils.machines.list.invalidate({ type: machineType });
      setSuccessMsg("Machine created successfully");
      form.reset();
    },
    onError: (err) => {
      setServerError(err.message);
    },
  });

  const updateMachine = api.machines.update.useMutation({
    onSuccess: async () => {
      // @ts-ignore
      await utils.machines.list.invalidate({ type: machineType });
      setEditOpen(false);
      setEditingMachine(null);
    },
    onError: (err) => {
      setEditError(err.message);
    },
  });

  const deleteMachine = api.machines.delete.useMutation({
    onSuccess: async () => {
      // @ts-ignore
      await utils.machines.list.invalidate({ type: machineType });
      setDeleteId(null);
    },
  });

  const calculateRigidOutput = (cycleTimeSec: number, cavity: number) => {
    if (!cycleTimeSec || cycleTimeSec <= 0) return 0;
    // 3600 / CT * Cavity
    return Math.round((3600 / cycleTimeSec) * cavity);
  };

  const form = useForm({
    defaultValues: {
      name: "",
      stdOutputPerHour: 0,
      stdOutputPerShift: 0,
      uom: "pcs" as Uom,
      remark: "",
      cycleTimeSec: 0,
      cavity: 1,
      manPower: 1,
      workCenter: "",
      defaultProPrefixId: undefined,
    } as FormValues,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMsg(null);

      try {
        await createMachine.mutateAsync({
          ...value,
          // @ts-ignore
          type: machineType,
          stdOutputPerHour: Number(value.stdOutputPerHour),
          stdOutputPerShift: Number(value.stdOutputPerShift),
          cycleTimeSec: Number(value.cycleTimeSec),
          cycleTimeMin: Number(value.cycleTimeSec) / 60, // auto calc
          cavity: Number(value.cavity),
          manPower: Number(value.manPower),
          stdOutputPerDay: Number(value.stdOutputPerShift) * 3, // auto calc approx
          defaultProPrefixId: value.defaultProPrefixId,
        });
      } catch (e: any) {
        setServerError(e?.message ?? "Gagal menyimpan");
      }
    },
  });

  // Edit Form
  const editForm = useForm({
    defaultValues: {
      name: "",
      stdOutputPerHour: 0,
      stdOutputPerShift: 0,
      uom: "pcs" as Uom,
      remark: "",
      cycleTimeSec: 0,
      cavity: 1,
      manPower: 1,
      workCenter: "",
      defaultProPrefixId: undefined,
    } as FormValues,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      if (!editingMachine) return;
      setEditError(null);
      try {
        await updateMachine.mutateAsync({
          id: editingMachine.id,
          ...value,
          // @ts-ignore
          stdOutputPerHour: Number(value.stdOutputPerHour),
          cycleTimeSec: Number(value.cycleTimeSec),
          cycleTimeMin: Number(value.cycleTimeSec) / 60,
          cavity: Number(value.cavity),
          manPower: Number(value.manPower),
          stdOutputPerDay: Number(value.stdOutputPerShift) * 3,
          workCenter: value.workCenter || undefined,
          remark: value.remark || undefined,
          defaultProPrefixId: value.defaultProPrefixId,
        });
      } catch (e: any) {
        // handled by onError
      }
    },
  });

  // Sync Edit Form when opening
  React.useEffect(() => {
    if (editingMachine) {
      editForm.reset({
        name: editingMachine.name,
        stdOutputPerHour: editingMachine.stdOutputPerHour,
        stdOutputPerShift: editingMachine.stdOutputPerShift,
        uom: editingMachine.uom as Uom,
        remark: editingMachine.remark ?? "",
        cycleTimeSec: Number(editingMachine.cycleTimeSec) || 0,
        cavity: editingMachine.cavity ?? 1,
        manPower: editingMachine.manPower ?? 1,
        workCenter: editingMachine.workCenter ?? "",
        defaultProPrefixId: editingMachine.defaultProPrefixId ?? undefined,
      });
    }
  }, [editingMachine]);

  const filtered = React.useMemo(() => {
    const data = machines.data ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data;
    return data.filter((m) => {
      const basic =
        m.name.toLowerCase().includes(needle) ||
        m.uom.toLowerCase().includes(needle);
      if (machineType === "RIGID") {
        return (
          basic ||
          // @ts-ignore
          m.workCenter?.toLowerCase().includes(needle)
        );
      }
      return basic;
    });
  }, [q, machines.data, machineType]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {machineType === "PAPER"
              ? "Tambah Mesin Paper"
              : "Tambah Data Standar Rigid"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form
            id="create-machine-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            {/* Common Name Field - Label varies */}
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      {machineType === "PAPER" ? "Nama Mesin" : "Nama Item"}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={
                        machineType === "PAPER"
                          ? "ex: GOWEI"
                          : "ex: Item/Product Name"
                      }
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              />

              {/* Rigid Specific Fields */}
              {machineType === "RIGID" && (
                <>
                  <div className="grid grid-cols-4 gap-4">
                    <form.Field
                      name="cycleTimeSec"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Cycle Time (Sec)</FieldLabel>
                          <Input
                            type="number"
                            step="0.01"
                            value={field.state.value ?? 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              field.handleChange(val);

                              // Auto calc outputs
                              // need cavity
                              const cav = form.getFieldValue("cavity") || 1;
                              const outHr = calculateRigidOutput(val, cav);
                              form.setFieldValue("stdOutputPerHour", outHr);
                              form.setFieldValue(
                                "stdOutputPerShift",
                                outHr * SHIFT_HOURS,
                              );
                            }}
                          />
                        </Field>
                      )}
                    />
                    <form.Field
                      name="cavity"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Cavity</FieldLabel>
                          <Input
                            type="number"
                            value={field.state.value ?? 1}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              field.handleChange(val);

                              const ct =
                                form.getFieldValue("cycleTimeSec") || 0;
                              const outHr = calculateRigidOutput(ct, val);
                              form.setFieldValue("stdOutputPerHour", outHr);
                              form.setFieldValue(
                                "stdOutputPerShift",
                                outHr * SHIFT_HOURS,
                              );
                            }}
                          />
                        </Field>
                      )}
                    />
                    <form.Field
                      name="manPower"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Man Power</FieldLabel>
                          <Input
                            type="number"
                            value={field.state.value ?? 1}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                          />
                        </Field>
                      )}
                    />
                    <form.Field
                      name="workCenter"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Work Center</FieldLabel>
                          <Input
                            value={field.state.value ?? ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="ex: PUV / SK MANUAL"
                          />
                        </Field>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Std Output (Auto Calculated for Rigid, Manual for Paper) */}
              <div className="grid grid-cols-2 gap-4">
                <form.Field
                  name="stdOutputPerHour"
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Std Output / Hour {machineType === "RIGID" && "(Auto)"}
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="number"
                        value={field.state.value}
                        readOnly={machineType === "RIGID"} // Rigid auto calc
                        onChange={(e) => {
                          const perHour = Number(e.target.value);
                          field.handleChange(perHour);
                          if (machineType === "PAPER") {
                            form.setFieldValue(
                              "stdOutputPerShift",
                              Math.round(perHour * PAPER_SHIFT_HOURS),
                            );
                          }
                        }}
                      />
                    </Field>
                  )}
                />

                <form.Field
                  name="stdOutputPerShift"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Std Output / Shift</FieldLabel>
                      <Input
                        type="number"
                        value={field.state.value}
                        readOnly
                        className="opacity-80"
                      />
                    </Field>
                  )}
                />
              </div>

              <form.Field
                name="uom"
                children={(field) => (
                  <Field>
                    <FieldLabel>UoM</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val as Uom)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih UoM" />
                      </SelectTrigger>
                      <SelectContent>
                        {UOM_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <form.Field
                name="remark"
                children={(field) => (
                  <Field>
                    <FieldLabel>Remark</FieldLabel>
                    <Input
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              />

              <form.Field
                name="defaultProPrefixId"
                children={(field) => (
                  <Field>
                    <FieldLabel>Default Process Prefix</FieldLabel>
                    <Select
                      value={field.state.value?.toString()}
                      onValueChange={(val) => field.handleChange(Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Prefix" />
                      </SelectTrigger>
                      <SelectContent>
                        {prefixes.data?.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            [{p.code}] {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>

            {serverError ? (
              <p className="text-destructive text-sm">{serverError}</p>
            ) : null}
            {successMsg ? <p className="text-sm">{successMsg}</p> : null}
          </form>
        </CardContent>

        <CardFooter>
          <form.Subscribe selector={(s) => [s.isSubmitting]}>
            {([isSubmitting]) => (
              <Button
                type="submit"
                form="create-machine-form"
                className="w-full"
                disabled={isSubmitting || createMachine.isPending}
              >
                {isSubmitting || createMachine.isPending
                  ? "Menyimpan..."
                  : "Simpan Data"}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>
              Daftar {machineType === "PAPER" ? "Mesin Paper" : "Standar Rigid"}
            </CardTitle>
            <div className="w-full sm:max-w-xs">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                autoComplete="off"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {machines.isLoading ? (
            <p className="text-sm">Loading...</p>
          ) : machines.error ? (
            <p className="text-destructive text-sm">{machines.error.message}</p>
          ) : (
            <div className="border-border overflow-hidden rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border border-b hover:bg-transparent">
                    <TableHead className="text-muted-foreground px-4 py-3 text-xs font-bold tracking-wider uppercase">
                      {machineType === "RIGID" ? "Nama Item" : "Nama Mesin"}
                    </TableHead>
                    {machineType === "RIGID" && (
                      <>
                        <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                          CT(s)
                        </TableHead>
                        <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                          Cav
                        </TableHead>
                        <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                          MP
                        </TableHead>
                      </>
                    )}
                    <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                      Out/Hr
                    </TableHead>
                    <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                      Out/Shift
                    </TableHead>
                    {machineType === "RIGID" && (
                      <>
                        <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                          Out/Day
                        </TableHead>
                        <TableHead className="text-muted-foreground px-4 py-3 text-xs font-bold tracking-wider uppercase">
                          Work Ctr
                        </TableHead>
                      </>
                    )}
                    <TableHead className="text-muted-foreground px-4 py-3 text-xs font-bold tracking-wider uppercase">
                      UoM
                    </TableHead>
                    {machineType === "PAPER" && (
                      <TableHead className="text-muted-foreground px-4 py-3 text-xs font-bold tracking-wider uppercase">
                        Remark
                      </TableHead>
                    )}
                    <TableHead className="text-muted-foreground px-4 py-3 text-right text-xs font-bold tracking-wider uppercase">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={machineType === "RIGID" ? 9 : 6}
                        className="text-muted-foreground text-center text-sm opacity-70"
                      >
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((m) => (
                      <TableRow
                        key={m.id}
                        className="border-border hover:bg-muted/50 border-b"
                      >
                        <TableCell
                          className={`text-foreground px-4 py-3 font-medium ${
                            machineType === "RIGID"
                              ? "max-w-[200px] truncate"
                              : ""
                          }`}
                        >
                          <div>
                            <div>{m.name}</div>
                            {m.defaultProPrefix && (
                              <div className="text-primary mt-0.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-tight">
                                <span className="bg-primary/10 border-primary/20 rounded border px-1 py-0.5 leading-none">
                                  {m.defaultProPrefix.code}
                                </span>
                                <span className="opacity-70">
                                  {m.defaultProPrefix.name}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {machineType === "RIGID" && (
                          <>
                            {/* @ts-ignore */}
                            <TableCell className="text-muted-foreground px-4 py-3 text-right text-xs">
                              {m.cycleTimeSec
                                ? Number(m.cycleTimeSec).toFixed(1)
                                : "-"}
                            </TableCell>
                            {/* @ts-ignore */}
                            <TableCell className="text-muted-foreground px-4 py-3 text-right text-xs">
                              {m.cavity}
                            </TableCell>
                            {/* @ts-ignore */}
                            <TableCell className="text-muted-foreground px-4 py-3 text-right text-xs">
                              {m.manPower}
                            </TableCell>
                          </>
                        )}

                        <TableCell className="text-muted-foreground px-4 py-3 text-right font-mono text-xs">
                          {m.stdOutputPerHour.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-foreground px-4 py-3 text-right font-mono text-xs font-medium">
                          {m.stdOutputPerShift.toLocaleString()}
                        </TableCell>

                        {machineType === "RIGID" && (
                          <>
                            {/* @ts-ignore */}
                            <TableCell className="text-muted-foreground px-4 py-3 text-right font-mono text-xs">
                              {(m.stdOutputPerShift * 3).toLocaleString()}
                            </TableCell>
                            {/* @ts-ignore */}
                            <TableCell className="text-muted-foreground px-4 py-3 text-xs">
                              {m.workCenter ?? "-"}
                            </TableCell>
                          </>
                        )}

                        <TableCell className="text-muted-foreground px-4 py-3 text-xs">
                          {m.uom}
                        </TableCell>
                        {machineType === "PAPER" && (
                          <TableCell className="text-muted-foreground max-w-[260px] truncate px-4 py-3 text-xs">
                            {m.remark ?? "-"}
                          </TableCell>
                        )}
                        <TableCell className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:bg-muted h-7 w-7"
                              onClick={() => {
                                setEditingMachine(m);
                                setEditOpen(true);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-7"
                              onClick={() => setDeleteId(m.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Mesin / Item</DialogTitle>
            <DialogDescription>
              Ubah data mesin atau item standar.
            </DialogDescription>
          </DialogHeader>

          <form
            id="edit-machine-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              editForm.handleSubmit();
            }}
            className="space-y-4"
          >
            <FieldGroup>
              <editForm.Field
                name="name"
                children={(field) => (
                  <Field>
                    <FieldLabel>
                      {machineType === "PAPER" ? "Nama Mesin" : "Nama Item"}
                    </FieldLabel>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              />

              {/* Rigid Specific Fields */}
              {machineType === "RIGID" && (
                <>
                  <div className="grid grid-cols-4 gap-4">
                    <editForm.Field
                      name="cycleTimeSec"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Cycle Time (Sec)</FieldLabel>
                          <Input
                            type="number"
                            step="0.01"
                            value={field.state.value ?? 0}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              field.handleChange(val);

                              // Auto calc outputs
                              const cav = editForm.getFieldValue("cavity") || 1;
                              const outHr = calculateRigidOutput(val, cav);
                              editForm.setFieldValue("stdOutputPerHour", outHr);
                              editForm.setFieldValue(
                                "stdOutputPerShift",
                                outHr * SHIFT_HOURS,
                              );
                            }}
                          />
                        </Field>
                      )}
                    />
                    <editForm.Field
                      name="cavity"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Cavity</FieldLabel>
                          <Input
                            type="number"
                            value={field.state.value ?? 1}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              field.handleChange(val);

                              const ct =
                                editForm.getFieldValue("cycleTimeSec") || 0;
                              const outHr = calculateRigidOutput(ct, val);
                              editForm.setFieldValue("stdOutputPerHour", outHr);
                              editForm.setFieldValue(
                                "stdOutputPerShift",
                                outHr * SHIFT_HOURS,
                              );
                            }}
                          />
                        </Field>
                      )}
                    />
                    <editForm.Field
                      name="manPower"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Man Power</FieldLabel>
                          <Input
                            type="number"
                            value={field.state.value ?? 1}
                            onChange={(e) =>
                              field.handleChange(Number(e.target.value))
                            }
                          />
                        </Field>
                      )}
                    />
                    <editForm.Field
                      name="workCenter"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Work Center</FieldLabel>
                          <Input
                            value={field.state.value ?? ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </Field>
                      )}
                    />
                  </div>
                </>
              )}

              {/* Std Output */}
              <div className="grid grid-cols-2 gap-4">
                <editForm.Field
                  name="stdOutputPerHour"
                  children={(field) => (
                    <Field>
                      <FieldLabel>
                        Std Output / Hour {machineType === "RIGID" && "(Auto)"}
                      </FieldLabel>
                      <Input
                        type="number"
                        value={field.state.value}
                        readOnly={machineType === "RIGID"}
                        onChange={(e) => {
                          const perHour = Number(e.target.value);
                          field.handleChange(perHour);
                          if (machineType === "PAPER") {
                            editForm.setFieldValue(
                              "stdOutputPerShift",
                              Math.round(perHour * PAPER_SHIFT_HOURS),
                            );
                          }
                        }}
                      />
                    </Field>
                  )}
                />

                <editForm.Field
                  name="stdOutputPerShift"
                  children={(field) => (
                    <Field>
                      <FieldLabel>Std Output / Shift</FieldLabel>
                      <Input
                        type="number"
                        value={field.state.value}
                        readOnly
                        className="opacity-80"
                      />
                    </Field>
                  )}
                />
              </div>

              <editForm.Field
                name="uom"
                children={(field) => (
                  <Field>
                    <FieldLabel>UoM</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => field.handleChange(val as Uom)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih UoM" />
                      </SelectTrigger>
                      <SelectContent>
                        {UOM_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              <editForm.Field
                name="remark"
                children={(field) => (
                  <Field>
                    <FieldLabel>Remark</FieldLabel>
                    <Input
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </Field>
                )}
              />

              <editForm.Field
                name="defaultProPrefixId"
                children={(field) => (
                  <Field>
                    <FieldLabel>Default Process Prefix</FieldLabel>
                    <Select
                      value={field.state.value?.toString()}
                      onValueChange={(val) => field.handleChange(Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Prefix" />
                      </SelectTrigger>
                      <SelectContent>
                        {prefixes.data?.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            [{p.code}] {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>
            {editError && (
              <p className="text-destructive text-sm">{editError}</p>
            )}
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Batal
            </Button>
            <editForm.Subscribe selector={(s) => [s.isSubmitting]}>
              {([isSubmitting]) => (
                <Button
                  type="submit"
                  form="edit-machine-form"
                  disabled={isSubmitting || updateMachine.isPending}
                >
                  {isSubmitting || updateMachine.isPending
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </Button>
              )}
            </editForm.Subscribe>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data mesin akan dihapus
              permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMachine.mutate({ id: deleteId })}
              disabled={deleteMachine.isPending}
            >
              {deleteMachine.isPending ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {machineType === "RIGID" && (
        <p className="text-muted-foreground px-2 text-xs">
          Catatan: Output/Day dihitung otomatis sebagai Output/Shift × 3. Shift
          = {SHIFT_HOURS} Jam.
        </p>
      )}
    </div>
  );
}
