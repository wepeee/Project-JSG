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
  partNumber: z.string().optional(),
  productName: z.string().optional(),
  cycleTimeSec: z.number().optional(),
  cavity: z.number().int().optional(),
  manPower: z.number().int().optional(),
  workCenter: z.string().optional(),
  shortDesc: z.string().optional(),
  phase: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function MachineManager({
  machineType = "PAPER",
}: {
  machineType?: MachineType;
}) {
  const utils = api.useUtils();
  // @ts-ignore
  const machines = api.machines.list.useQuery({ type: machineType });

  const createMachine = api.machines.create.useMutation({
    onSuccess: async () => {
      // @ts-ignore
      await utils.machines.list.invalidate({ type: machineType });
    },
  });

  const [q, setQ] = React.useState("");
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

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
          m.partNumber?.toLowerCase().includes(needle) ||
          // @ts-ignore
          m.workCenter?.toLowerCase().includes(needle)
        );
      }
      return basic;
    });
  }, [q, machines.data, machineType]);

  const form = useForm({
    defaultValues: {
      name: "",
      stdOutputPerHour: 0,
      stdOutputPerShift: 0,
      uom: "pcs" as Uom,
      remark: "",
      
      partNumber: "",
      productName: "",
      cycleTimeSec: 0,
      cavity: 1,
      manPower: 1,
      workCenter: "",
      shortDesc: "",
      phase: "",
    } as FormValues,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMsg(null);

      try {
        const created = await createMachine.mutateAsync({
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
        });
        setSuccessMsg(`Data tersimpan: ${created.name}`);
        form.reset();
      } catch (e: any) {
        setServerError(e?.message ?? "Gagal menyimpan");
      }
    },
  });

  const calculateRigidOutput = (cycleTimeSec: number, cavity: number) => {
    if (!cycleTimeSec || cycleTimeSec <= 0) return 0;
    // 3600 / CT * Cavity
    return Math.round((3600 / cycleTimeSec) * cavity);
  };

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
                      {machineType === "PAPER" ? "Nama Mesin" : "Nama Product (Product)"}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={machineType === "PAPER" ? "ex: GOWEI" : "ex: PRINTING PUV - COVER..."}
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              />

              {/* Rigid Specific Fields */}
              {machineType === "RIGID" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <form.Field
                      name="partNumber"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Part No</FieldLabel>
                          <Input
                            value={field.state.value ?? ""}
                            onChange={(e) => field.handleChange(e.target.value)}
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

                  <div className="grid grid-cols-3 gap-4">
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
                              form.setFieldValue("stdOutputPerShift", outHr * SHIFT_HOURS);
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
                              
                              const ct = form.getFieldValue("cycleTimeSec") || 0;
                              const outHr = calculateRigidOutput(ct, val);
                              form.setFieldValue("stdOutputPerHour", outHr);
                              form.setFieldValue("stdOutputPerShift", outHr * SHIFT_HOURS);
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
                            onChange={(e) => field.handleChange(Number(e.target.value))}
                          />
                        </Field>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <form.Field
                      name="shortDesc"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Short Description</FieldLabel>
                          <Input
                            value={field.state.value ?? ""}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </Field>
                      )}
                    />
                     <form.Field
                      name="phase"
                      children={(field) => (
                        <Field>
                          <FieldLabel>Phase</FieldLabel>
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
                             form.setFieldValue("stdOutputPerShift", Math.round(perHour * PAPER_SHIFT_HOURS));
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
                    <select
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value as Uom)}
                      className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                    >
                      {UOM_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
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
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                     {machineType === "RIGID" && <TableHead>Part No</TableHead>}
                    <TableHead>{machineType === "RIGID" ? "Product" : "Nama Mesin"}</TableHead>
                    {machineType === "RIGID" && (
                      <>
                        <TableHead className="text-right">CT(s)</TableHead>
                        <TableHead className="text-right">Cav</TableHead>
                        <TableHead className="text-right">MP</TableHead>
                      </>
                    )}
                    <TableHead className="text-right">Out/Hr</TableHead>
                    <TableHead className="text-right">Out/Shift</TableHead>
                    {machineType === "RIGID" && (
                         <>
                         <TableHead className="text-right">Out/Day</TableHead>
                         <TableHead>Work Ctr</TableHead>
                         <TableHead>Phase</TableHead>
                         </>
                    )}
                    <TableHead>UoM</TableHead>
                     {machineType === "PAPER" && <TableHead>Remark</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={machineType === "RIGID" ? 12 : 5}
                        className="text-center text-sm opacity-70"
                      >
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((m) => (
                      <TableRow key={m.id}>
                        {machineType === "RIGID" && (
                           // @ts-ignore
                          <TableCell className="font-mono text-xs">{m.partNumber}</TableCell>
                        )}
                        <TableCell className={machineType === "RIGID" ? "max-w-[200px] truncate" : ""}>
                          {m.name}
                        </TableCell>
                        
                         {machineType === "RIGID" && (
                          <>
                           {/* @ts-ignore */}
                            <TableCell className="text-right">{m.cycleTimeSec ? Number(m.cycleTimeSec).toFixed(1) : "-"}</TableCell>
                             {/* @ts-ignore */}
                            <TableCell className="text-right">{m.cavity}</TableCell>
                             {/* @ts-ignore */}
                            <TableCell className="text-right">{m.manPower}</TableCell>
                          </>
                        )}

                        <TableCell className="text-right">
                          {m.stdOutputPerHour.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {m.stdOutputPerShift.toLocaleString()}
                        </TableCell>
                        
                         {machineType === "RIGID" && (
                          <>
                             {/* @ts-ignore */}
                            <TableCell className="text-right">{(m.stdOutputPerShift * 3).toLocaleString()}</TableCell>
                             {/* @ts-ignore */}
                            <TableCell className="text-xs">{m.workCenter}</TableCell>
                             {/* @ts-ignore */}
                            <TableCell className="text-xs">{m.phase}</TableCell>
                          </>
                        )}

                        <TableCell>{m.uom}</TableCell>
                        {machineType === "PAPER" && (
                          <TableCell className="max-w-[260px] truncate">
                            {m.remark ?? "-"}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {machineType === "RIGID" && (
        <p className="text-xs text-muted-foreground px-2">
            Catatan: Output/Day dihitung otomatis sebagai Output/Shift × 3. Shift = {SHIFT_HOURS} Jam.
        </p>
      )}
    </div>
  );
}
