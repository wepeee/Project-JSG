"use client";

import * as React from "react";
import { signOut } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";
import { Separator } from "~/components/ui/separator";

import PPICSchedule from "./schedule/ppic-schedule";
import MaterialManager from "./material/material-manager";
import ProcessManager from "./process/process-manager";
import ProPlanner from "./pro/pro-planner";
import ProList from "./pro/pro-list";

type Props = {
  user: {
    name: string;
    role: string;
  };
};

type NavKey =
  | "schedule"
  | "prolist"
  | "materials"
  | "processes"
  | "planning";

export default function PPICShell({ user }: Props) {
  const [active, setActive] = React.useState<NavKey>("prolist");
  const [open, setOpen] = React.useState(false);
  
  const [jumpToProId, setJumpToProId] = React.useState<number | null>(null);

  const title =
    active === "prolist"
      ? "Daftar PRO"
      : active === "planning"
        ? "Perencanaan PRO"
        : active === "schedule"
          ? "Schedule"
          : active === "processes"
            ? "Proses"
            : "Materials";

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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-md border px-3 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="mx-auto flex w-full gap-0 lg:gap-6">
        {/* Sidebar (desktop) */}
        <aside className="bg-background sticky top-0 hidden h-screen w-64 shrink-0 border-r lg:flex lg:flex-col">
          <div className="px-4 py-4">
            <div className="text-lg font-semibold">Dashboard</div>
            <div className="text-xs opacity-70">PPIC</div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-2">
            <SidebarItem
              label="Daftar PRO"
              active={active === "prolist"}
              onClick={() => setActive("prolist")}
            />
            <SidebarItem
              label="Perencanaan PRO"
              active={active === "planning"}
              onClick={() => setActive("planning")}
            />
            <SidebarItem
              label="Schedule"
              active={active === "schedule"}
              onClick={() => setActive("schedule")}
            />
            <SidebarItem
              label="Proses"
              active={active === "processes"}
              onClick={() => setActive("processes")}
            />
            <SidebarItem
              label="Materials"
              active={active === "materials"}
              onClick={() => setActive("materials")}
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
                  <div className="text-xs opacity-70">PPIC</div>
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
                  label="Daftar PRO"
                  active={active === "prolist"}
                  onClick={() => {
                    setActive("prolist");
                    setOpen(false);
                  }}
                />
                <SidebarItem
                  label="Perencanaan PRO"
                  active={active === "planning"}
                  onClick={() => {
                    setActive("planning");
                    setOpen(false);
                  }}
                />
                <SidebarItem
                  label="Schedule"
                  active={active === "schedule"}
                  onClick={() => {
                    setActive("schedule");
                    setOpen(false);
                  }}
                />
                <SidebarItem
                  label="Proses"
                  active={active === "processes"}
                  onClick={() => {
                    setActive("processes");
                    setOpen(false);
                  }}
                />
                <SidebarItem
                  label="Materials"
                  active={active === "materials"}
                  onClick={() => {
                    setActive("materials");
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
                Fokus PPIC: cegah line stop, shortage jelas, jadwal rapi.
              </p>
            </div>
          </div>

          <Separator className="mb-6 hidden lg:block" />

          {active === "prolist" ? (
            <ProList 
              initialSelectedId={jumpToProId} 
              onClearJump={() => setJumpToProId(null)} 
            />
          ) : active === "planning" ? (
            <ProPlanner />
          ) : active === "schedule" ? (
             <PPICSchedule 
              onSelectPro={(id) => {
                setJumpToProId(id);
                setActive("prolist");
              }} 
            />
          ) : active === "processes" ? (
            <ProcessManager />
          ) : (
             <MaterialManager />
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
