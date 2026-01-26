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

const SHIFT_HOURS = 6.8; // samain dengan backend biar user lihat angka yang sama

const UOM_OPTIONS = ["sheet", "pcs", "meter", "cm"] as const;
type Uom = (typeof UOM_OPTIONS)[number];

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  stdOutputPerHour: z.number().int().positive("Harus > 0"),
  stdOutputPerShift: z.number().int().nonnegative(),
  uom: z.enum(UOM_OPTIONS),
  remark: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function MachineManager() {
  const utils = api.useUtils();
  const machines = api.machines.list.useQuery();

  const createMachine = api.machines.create.useMutation({
    onSuccess: async () => {
      await utils.machines.list.invalidate();
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
      return (
        m.name.toLowerCase().includes(needle) ||
        m.uom.toLowerCase().includes(needle)
      );
    });
  }, [q, machines.data]);

  const form = useForm({
    defaultValues: {
      name: "",
      stdOutputPerHour: 1000,
      stdOutputPerShift: 0,
      uom: "sheet" as Uom,
      remark: "",
    } as FormValues,
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMsg(null);

      try {
        const created = await createMachine.mutateAsync({
          ...value,
          stdOutputPerHour: Number(value.stdOutputPerHour),
          stdOutputPerShift: Number(value.stdOutputPerShift),
        });
        setSuccessMsg(`Mesin dibuat: ${created.name}`);
        form.reset();
      } catch (e: any) {
        setServerError(e?.message ?? "Gagal membuat mesin");
      }
    },
  });

  const recomputeShift = (perHour: number) => {
    const x = Number.isFinite(perHour) ? perHour : 0;
    return Math.round(x * SHIFT_HOURS);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tambah Mesin</CardTitle>
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
            <FieldGroup>
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Nama Mesin</FieldLabel>
                      <Input
                        id={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='contoh: "GOWEI PAPER CUTTER MACHINE"'
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="stdOutputPerHour"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Std Output / Hour
                      </FieldLabel>
                      <Input
                        id={field.name}
                        type="number"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const perHour = Number(e.target.value);
                          field.handleChange(perHour);

                          // ✅ auto-hitungan per shift
                          form.setFieldValue(
                            "stdOutputPerShift",
                            recomputeShift(perHour),
                          );
                        }}
                        placeholder="contoh: 2500"
                        aria-invalid={isInvalid}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                      <p className="text-xs opacity-70">
                        Shift hours dipakai: {SHIFT_HOURS} jam
                      </p>
                    </Field>
                  );
                }}
              />

              <form.Field
                name="stdOutputPerShift"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Std Output / Shift
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      value={field.state.value}
                      readOnly
                      tabIndex={-1}
                      className="opacity-80"
                    />
                    <p className="text-xs opacity-70">
                      Auto dari per hour × {SHIFT_HOURS}
                    </p>
                  </Field>
                )}
              />

              <form.Field
                name="uom"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>UoM</FieldLabel>

                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value as Uom)
                        }
                        className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                        aria-invalid={isInvalid}
                      >
                        {UOM_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="remark"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Remark</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="opsional"
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
                  : "Simpan Mesin"}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Daftar Mesin</CardTitle>
            <div className="w-full sm:max-w-xs">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search nama / uom..."
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead className="text-right">Std/Hr</TableHead>
                    <TableHead className="text-right">Std/Shift</TableHead>
                    <TableHead>UoM</TableHead>
                    <TableHead>Remark</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-sm opacity-70"
                      >
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell>{m.name}</TableCell>
                        <TableCell className="text-right">
                          {m.stdOutputPerHour}
                        </TableCell>
                        <TableCell className="text-right">
                          {m.stdOutputPerShift}
                        </TableCell>
                        <TableCell>{m.uom}</TableCell>
                        <TableCell className="max-w-[260px] truncate">
                          {m.remark ?? "-"}
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
    </div>
  );
}
