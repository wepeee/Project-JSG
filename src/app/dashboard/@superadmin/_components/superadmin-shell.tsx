"use client";

import * as React from "react";
import { signOut } from "next-auth/react";

import { Button } from "~/components/ui/button";

import { ThemeToggle } from "~/components/theme-toggle";

// ganti path kalau CreateUserForm kamu ada di folder lain
import CreateUserForm from "./create-users-form";
import MachineManager from "./machine-manager";

type Props = {
  user: {
    name: string;
    role: string;
  };
};

type NavKey = "users" | "machines_paper" | "machines_rigid" | "settings" | "audit";

export default function SuperadminShell({ user }: Props) {
  const [active, setActive] = React.useState<NavKey>("users");
  const [open, setOpen] = React.useState(false);

  const title =
    active === "users"
      ? "Kelola Akun"
      : active === "machines_paper"
        ? "Kelola Mesin Paper"
        : active === "machines_rigid"
          ? "Kelola Mesin Rigid"
          : active === "settings"
            ? "Pengaturan"
            : "Audit Log";

  return (
    <div className="bg-background min-h-screen w-full">
      {/* Mobile topbar */}
      <div className="bg-background sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-md border px-3 py-2 text-sm"
          aria-label="Open sidebar"
        >
          Menu
        </button>

        <div className="text-sm font-semibold">{title}</div>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Logout
        </button>
      </div>

      {/* Layout */}
      <div className="mx-auto flex w-full gap-0 lg:gap-6">
        {/* Sidebar (desktop) */}
        <aside className="bg-background sticky top-0 hidden h-screen w-64 shrink-0 border-r lg:flex lg:flex-col">
          <div className="px-4 py-4">
            <div className="text-lg font-semibold">Dashboard</div>
            <div className="text-xs opacity-70">SUPERADMIN</div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-2">
            <SidebarItem
              label="Kelola Akun"
              active={active === "users"}
              onClick={() => setActive("users")}
            />
            <SidebarItem
              label="Audit Log"
              active={active === "audit"}
              onClick={() => setActive("audit")}
            />
            <SidebarItem
              label="Pengaturan"
              active={active === "settings"}
              onClick={() => setActive("settings")}
            />
            <div className="pt-2 pb-1 text-xs font-semibold opacity-50 px-3">
              MESIN
            </div>
            <SidebarItem
              label="Mesin Paper"
              active={active === "machines_paper"}
              onClick={() => {
                setActive("machines_paper");
                setOpen(false);
              }}
            />
            <SidebarItem
              label="Mesin Rigid"
              active={active === "machines_rigid"}
              onClick={() => {
                setActive("machines_rigid");
                setOpen(false);
              }}
            />
          </nav>

          <div className="border-t px-4 py-4">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs opacity-70">{user.role}</div>

            <div className="mt-3 flex items-center gap-2">
              <ThemeToggle />
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Sidebar (mobile drawer) */}
        {open ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setOpen(false)}
            />
            <div className="bg-background absolute top-0 left-0 h-full w-72 border-r">
              <div className="flex items-center justify-between border-b px-4 py-4">
                <div>
                  <div className="text-lg font-semibold">Dashboard</div>
                  <div className="text-xs opacity-70">SUPERADMIN</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  Tutup
                </button>
              </div>

              <nav className="flex flex-col gap-1 px-2 py-3">
                <SidebarItem
                  label="Kelola Akun"
                  active={active === "users"}
                  onClick={() => {
                    setActive("users");
                    setOpen(false);
                  }}
                />
                <SidebarItem
                  label="Audit Log"
                  active={active === "audit"}
                  onClick={() => {
                    setActive("audit");
                    setOpen(false);
                  }}
                />
                <SidebarItem
                  label="Pengaturan"
                  active={active === "settings"}
                  onClick={() => {
                    setActive("settings");
                    setOpen(false);
                  }}
                />
                 <div className="pt-2 pb-1 text-xs font-semibold opacity-50 px-3">
                  MESIN
                </div>
                <SidebarItem
                  label="Mesin Paper"
                  active={active === "machines_paper"}
                  onClick={() => {
                    setActive("machines_paper");
                    setOpen(false);
                  }}
                />
                <SidebarItem
                  label="Mesin Rigid"
                  active={active === "machines_rigid"}
                  onClick={() => {
                    setActive("machines_rigid");
                    setOpen(false);
                  }}
                />
              </nav>

              <div className="border-t px-4 py-4">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs opacity-70">{user.role}</div>
                <Button
                  className="mt-3 w-full"
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Main */}
        <main className="w-full px-4 py-6 lg:px-6">
          {/* Desktop header */}
          <div className="mb-6 hidden items-center justify-between lg:flex">
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-sm opacity-70">
                Kelola sistem sesuai hak akses.
              </p>
            </div>
          </div>

          {active === "users" ? (
            <CreateUserForm />
          ) : active === "audit" ? (
            <div className="rounded-md border p-4 text-sm opacity-80">
              Audit log belum dibuat. Nanti kita tambah (read-only) dari DB.
            </div>
          ) : active === "settings" ? (
            <div className="rounded-md border p-4 text-sm opacity-80">
              Pengaturan belum dibuat. Nanti kita rapihin.
            </div>
          ) : active === "machines_paper" ? (
            <MachineManager machineType="PAPER" />
          ) : (
            <MachineManager machineType="RIGID" />
          )}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-md px-3 py-2 text-left text-sm",
        active ? "bg-muted font-medium" : "hover:bg-muted/60",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
