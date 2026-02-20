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

const schema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["ADMIN", "SUPERADMIN", "PPIC", "OPERATOR", "MASTER"]),
  department: z.string(),
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
      department: "",
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
      const dept = String(u.department || "").toLowerCase();
      return (
        uname.includes(needle) || role.includes(needle) || dept.includes(needle)
      );
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
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(val) => field.handleChange(val as any)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Pilih Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SUPERADMIN">SUPERADMIN</SelectItem>
                          <SelectItem value="ADMIN">ADMIN</SelectItem>
                          <SelectItem value="PPIC">PPIC</SelectItem>
                          <SelectItem value="OPERATOR">OPERATOR</SelectItem>
                          <SelectItem value="MASTER">MASTER</SelectItem>
                        </SelectContent>
                      </Select>
                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                    </Field>
                  );
                }}
              />

              <form.Subscribe
                selector={(state) => state.values.role}
                children={(role) => (
                  <form.Field
                    name="department"
                    children={(field) => {
                      return (
                        <Field>
                          <FieldLabel htmlFor={field.name}>
                            Bagian (Department)
                          </FieldLabel>
                          {role === "SUPERADMIN" ? (
                            <Select
                              value={field.state.value}
                              onValueChange={(val) => field.handleChange(val)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Department..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PAPER">PAPER</SelectItem>
                                <SelectItem value="RIGID">RIGID</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value || ""}
                              onBlur={field.handleBlur}
                              onChange={
                                (e) => field.handleChange(e.target.value)
                                // If PPIC, we could force empty, but let's leave it flexible
                              }
                              placeholder={
                                role === "PPIC"
                                  ? "Tidak perlu diisi"
                                  : "Contoh: A / B / C"
                              }
                              disabled={role === "PPIC"}
                              autoComplete="off"
                            />
                          )}
                        </Field>
                      );
                    }}
                  />
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {/* Search is handled in the header in previous design, but can be improved here if needed. 
                   Keeping it in header as requested by layout but ensuring input style is consistent */}
            </div>

            {users.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-muted-foreground animate-pulse text-sm">
                  Loading users...
                </p>
              </div>
            ) : users.error ? (
              <div className="bg-destructive/10 text-destructive rounded-md p-4 text-sm">
                {users.error.message}
              </div>
            ) : (
              <div className="border-border rounded-md border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="border-border border-b hover:bg-transparent">
                      <TableHead className="text-foreground font-semibold">
                        Username
                      </TableHead>
                      <TableHead className="text-foreground font-semibold">
                        Role
                      </TableHead>
                      <TableHead className="text-foreground font-semibold">
                        Bagian
                      </TableHead>
                      <TableHead className="text-foreground font-semibold">
                        Dibuat
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-muted-foreground h-24 text-center text-sm"
                        >
                          Tidak ada hasil
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((u) => (
                        <TableRow
                          key={u.id}
                          className="border-border hover:bg-muted/50 border-b"
                        >
                          <TableCell className="text-foreground font-medium">
                            {u.username}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium">
                              {u.role}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {u.department || "-"}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {new Date(u.createdAt).toLocaleString("id-ID")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
