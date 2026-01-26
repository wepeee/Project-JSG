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

const schema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["ADMIN", "SUPERADMIN", "PPIC", "OPERATOR", "MASTER"]),
});

export default function CreateUserForm() {
  const utils = api.useUtils();

  const users = api.adminUsers.getUsers.useQuery();

  const createUser = api.adminUsers.createUser.useMutation({
    onSuccess: async () => {
      await utils.adminUsers.getUsers.invalidate();
    },
  });

  const [serverError, setServerError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      role: "ADMIN" as "ADMIN" | "PPIC" | "OPERATOR" | "MASTER" | "SUPERADMIN",
    },
    validators: { onSubmit: schema },
    onSubmit: async ({ value }) => {
      setServerError(null);
      setSuccessMsg(null);

      try {
        const created = await createUser.mutateAsync(value);
        setSuccessMsg(`Akun dibuat: ${created.username} (${created.role})`);
        form.reset();
      } catch (e: any) {
        setServerError(e?.message ?? "Gagal membuat akun");
      }
    },
  });

  // search user
  const [q, setQ] = React.useState("");

  const filteredUsers = React.useMemo(() => {
    const data = users.data ?? [];
    const needle = q.trim().toLowerCase();
    if (!needle) return data;

    return data.filter((u) => {
      const uname = u.username.toLowerCase();
      const role = String(u.role).toLowerCase();
      return uname.includes(needle) || role.includes(needle);
    });
  }, [q, users.data]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buat Akun Baru</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            id="create-user-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <FieldGroup>
              <form.Field
                name="username"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="contoh: andi"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="password"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="minimal 8 karakter"
                        autoComplete="new-password"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="role"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(e.target.value as any)
                        }
                        className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
                        aria-invalid={isInvalid}
                      >
                        <option value="SUPERADMIN">SUPERADMIN</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="PPIC">PPIC</option>
                        <option value="OPERATOR">OPERATOR</option>
                        <option value="MASTER">MASTER</option>
                      </select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
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
                form="create-user-form"
                className="w-full"
                disabled={isSubmitting || createUser.isPending}
              >
                {isSubmitting || createUser.isPending
                  ? "Membuat..."
                  : "Buat Akun"}
              </Button>
            )}
          </form.Subscribe>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Tabel User</CardTitle>

            <div className="w-full sm:max-w-xs">
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search username / role..."
                autoComplete="off"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {users.isLoading ? (
            <p className="text-sm">Loading...</p>
          ) : users.error ? (
            <p className="text-destructive text-sm">{users.error.message}</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Dibuat</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-sm opacity-70"
                      >
                        Tidak ada hasil
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">
                          {u.username}
                        </TableCell>
                        <TableCell>{u.role}</TableCell>
                        <TableCell>
                          {new Date(u.createdAt).toLocaleString("id-ID")}
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
