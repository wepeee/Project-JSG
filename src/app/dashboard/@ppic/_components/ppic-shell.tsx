"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  | "planning-paper"
  | "planning-rigid";

type ProListType = "PAPER" | "RIGID" | "ALL";

function resolvePpicRoute(pathname: string): {
  active: NavKey;
  proType: ProListType;
} {
  if (pathname === "/dashboard") {
    return { active: "prolist", proType: "PAPER" };
  }
  if (pathname.startsWith("/dashboard/pro-list/rigid")) {
    return { active: "prolist", proType: "RIGID" };
  }
  if (pathname.startsWith("/dashboard/pro-list/all")) {
    return { active: "prolist", proType: "ALL" };
  }
  if (pathname.startsWith("/dashboard/pro-list")) {
    return { active: "prolist", proType: "PAPER" };
  }
  if (pathname.startsWith("/dashboard/planning/rigid")) {
    return { active: "planning-rigid", proType: "RIGID" };
  }
  if (pathname.startsWith("/dashboard/planning/paper")) {
    return { active: "planning-paper", proType: "PAPER" };
  }
  if (pathname.startsWith("/dashboard/schedule")) {
    return { active: "schedule", proType: "PAPER" };
  }
  if (pathname.startsWith("/dashboard/processes")) {
    return { active: "processes", proType: "PAPER" };
  }
  if (pathname.startsWith("/dashboard/materials")) {
    return { active: "materials", proType: "PAPER" };
  }
  return { active: "prolist", proType: "PAPER" };
}

function buildPpicPath(active: NavKey, proType: ProListType): string {
  if (active === "prolist") {
    if (proType === "RIGID") return "/dashboard/pro-list/rigid";
    if (proType === "ALL") return "/dashboard/pro-list/all";
    return "/dashboard/pro-list/paper";
  }
  if (active === "planning-paper") return "/dashboard/planning/paper";
  if (active === "planning-rigid") return "/dashboard/planning/rigid";
  if (active === "schedule") return "/dashboard/schedule";
  if (active === "processes") return "/dashboard/processes";
  return "/dashboard/materials";
}

export default function PPICShell({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);

  const routeState = React.useMemo(
    () => resolvePpicRoute(pathname || "/dashboard"),
    [pathname],
  );

  const active = routeState.active;
  const proTypeFilter = routeState.proType;

  const jumpToProId = React.useMemo(() => {
    const raw = searchParams.get("jumpProId");
    if (!raw) return null;
    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed <= 0) return null;
    return parsed;
  }, [searchParams]);

  const navigate = React.useCallback(
    (nextActive: NavKey, nextType: ProListType = proTypeFilter, close = false) => {
      const nextPath = buildPpicPath(nextActive, nextType);
      if (pathname !== nextPath) {
        router.push(nextPath);
      }
      if (close) {
        setOpen(false);
      }
    },
    [pathname, proTypeFilter, router],
  );

  const clearJumpProId = React.useCallback(() => {
    if (!searchParams.get("jumpProId")) return;
    const cleanPath = buildPpicPath("prolist", proTypeFilter);
    router.replace(cleanPath);
  }, [proTypeFilter, router, searchParams]);

  const title =
    active === "prolist"
      ? "Daftar PRO"
      : active === "planning-paper"
        ? "Perencanaan PRO - Paper Box"
        : active === "planning-rigid"
          ? "Perencanaan PRO - Rigid Box"
          : active === "schedule"
            ? "Schedule"
            : active === "processes"
              ? "Proses"
              : "Materials";

  return (
    <div className="bg-background min-h-screen w-full">
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

      <div className="mx-auto flex w-full gap-0 lg:gap-6">
        <aside className="bg-background sticky top-0 hidden h-screen w-64 shrink-0 border-r lg:flex lg:flex-col">
          <div className="px-4 py-4">
            <div className="text-lg font-semibold">Dashboard</div>
            <div className="text-xs opacity-70">PPIC</div>
          </div>

          <nav className="flex flex-1 flex-col gap-1 px-2">
            <SidebarItemWithSubmenu
              label="Daftar PRO"
              active={active === "prolist"}
              activeKey={proTypeFilter}
              onClick={() => navigate("prolist", proTypeFilter)}
              submenu={[
                {
                  key: "PAPER",
                  label: "Paper Box",
                  onClick: () => navigate("prolist", "PAPER"),
                },
                {
                  key: "RIGID",
                  label: "Rigid Box",
                  onClick: () => navigate("prolist", "RIGID"),
                },
                {
                  key: "ALL",
                  label: "Semua",
                  onClick: () => navigate("prolist", "ALL"),
                },
              ]}
            />

            <SidebarItemWithSubmenu
              label="Perencanaan PRO"
              active={active === "planning-paper" || active === "planning-rigid"}
              activeKey={
                active === "planning-paper"
                  ? "paper"
                  : active === "planning-rigid"
                    ? "rigid"
                    : undefined
              }
              onClick={() => navigate("planning-paper")}
              submenu={[
                {
                  key: "paper",
                  label: "Paper Box",
                  onClick: () => navigate("planning-paper"),
                },
                {
                  key: "rigid",
                  label: "Rigid Box",
                  onClick: () => navigate("planning-rigid"),
                },
              ]}
            />

            <SidebarItem
              label="Schedule"
              active={active === "schedule"}
              onClick={() => navigate("schedule")}
            />
            <SidebarItem
              label="Proses"
              active={active === "processes"}
              onClick={() => navigate("processes")}
            />
            <SidebarItem
              label="Materials"
              active={active === "materials"}
              onClick={() => navigate("materials")}
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
                <SidebarItemWithSubmenu
                  label="Daftar PRO"
                  active={active === "prolist"}
                  activeKey={proTypeFilter}
                  onClick={() => navigate("prolist", proTypeFilter, true)}
                  submenu={[
                    {
                      key: "PAPER",
                      label: "Paper Box",
                      onClick: () => navigate("prolist", "PAPER", true),
                    },
                    {
                      key: "RIGID",
                      label: "Rigid Box",
                      onClick: () => navigate("prolist", "RIGID", true),
                    },
                    {
                      key: "ALL",
                      label: "Semua",
                      onClick: () => navigate("prolist", "ALL", true),
                    },
                  ]}
                />

                <SidebarItemWithSubmenu
                  label="Perencanaan PRO"
                  active={active === "planning-paper" || active === "planning-rigid"}
                  activeKey={
                    active === "planning-paper"
                      ? "paper"
                      : active === "planning-rigid"
                        ? "rigid"
                        : undefined
                  }
                  onClick={() => navigate("planning-paper", "PAPER", true)}
                  submenu={[
                    {
                      key: "paper",
                      label: "Paper Box",
                      onClick: () => navigate("planning-paper", "PAPER", true),
                    },
                    {
                      key: "rigid",
                      label: "Rigid Box",
                      onClick: () => navigate("planning-rigid", "RIGID", true),
                    },
                  ]}
                />

                <SidebarItem
                  label="Schedule"
                  active={active === "schedule"}
                  onClick={() => navigate("schedule", "PAPER", true)}
                />
                <SidebarItem
                  label="Proses"
                  active={active === "processes"}
                  onClick={() => navigate("processes", "PAPER", true)}
                />
                <SidebarItem
                  label="Materials"
                  active={active === "materials"}
                  onClick={() => navigate("materials", "PAPER", true)}
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

        <main className="min-w-0 flex-1 overflow-hidden px-4 py-6 lg:px-6">
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
              onClearJump={clearJumpProId}
              initialTypeFilter={proTypeFilter}
            />
          ) : active === "planning-paper" ? (
            <ProPlanner proType="PAPER" />
          ) : active === "planning-rigid" ? (
            <ProPlanner proType="RIGID" />
          ) : active === "schedule" ? (
            <PPICSchedule
              onSelectPro={(id) => {
                router.push(`/dashboard/pro-list/all?jumpProId=${id}`);
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

function SidebarItemWithSubmenu({
  label,
  active,
  activeKey,
  onClick,
  submenu,
}: {
  label: string;
  active: boolean;
  activeKey?: string;
  onClick: () => void;
  submenu: Array<{ key?: string; label: string; onClick: () => void }>;
}) {
  const [showSubmenu, setShowSubmenu] = React.useState(false);

  React.useEffect(() => {
    if (active) setShowSubmenu(true);
  }, [active]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          onClick();
          setShowSubmenu(!showSubmenu);
        }}
        className={[
          "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm",
          active ? "bg-muted font-medium" : "hover:bg-muted/60",
        ].join(" ")}
      >
        <span>{label}</span>
        <svg
          className={`h-4 w-4 transition-transform ${showSubmenu ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {showSubmenu && (
        <div className="mt-1 ml-4 space-y-0.5">
          {submenu.map((item, idx) => {
            const isActive =
              active && activeKey != null && item.key === activeKey;
            return (
              <button
                key={item.key ?? idx}
                type="button"
                onClick={item.onClick}
                className={[
                  "w-full rounded-md px-3 py-1.5 text-left text-xs transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
