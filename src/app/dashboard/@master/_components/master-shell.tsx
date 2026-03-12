"use client";

import * as React from "react";
import { signOut } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";
import DashboardOverview from "~/app/dashboard/@superadmin/_components/modules/overview/dashboard-overview";
import OeeDashboard from "~/app/dashboard/@superadmin/_components/modules/oee/oee-dashboard";
import ProTargetGap from "./pro-target-gap";

type Props = {
  user: {
    name: string;
    role: string;
    department?: string;
  };
};

type NavKey = "dashboard" | "oee_paper" | "oee_rigid" | "pro_target_gap";

export default function MasterShell({ user }: Props) {
  const [active, setActive] = React.useState<NavKey>("dashboard");
  const [open, setOpen] = React.useState(false);

  const title = React.useMemo(() => {
    switch (active) {
      case "dashboard":
        return "Dashboard Overview";
      case "oee_paper":
        return "OEE Analytics - Paper";
      case "oee_rigid":
        return "OEE Analytics - Rigid";
      case "pro_target_gap":
        return "Monitor Gap Target PRO";
      default:
        return "Dashboard";
    }
  }, [active]);

  const SidebarContent = () => (
    <nav className="flex flex-1 flex-col gap-1 px-2">
      <SidebarItem
        label="Dashboard"
        active={active === "dashboard"}
        onClick={() => {
          setActive("dashboard");
          setOpen(false);
        }}
      />
      <SidebarItem
        label="OEE Analytics - Paper"
        active={active === "oee_paper"}
        onClick={() => {
          setActive("oee_paper");
          setOpen(false);
        }}
      />
      <SidebarItem
        label="OEE Analytics - Rigid"
        active={active === "oee_rigid"}
        onClick={() => {
          setActive("oee_rigid");
          setOpen(false);
        }}
      />
      <SidebarItem
        label="Gap Target PRO"
        active={active === "pro_target_gap"}
        onClick={() => {
          setActive("pro_target_gap");
          setOpen(false);
        }}
      />
    </nav>
  );

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
        <ThemeToggle />
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded-md border px-3 py-2 text-sm"
        >
          Logout
        </button>
      </div>

      <div className="mx-auto flex w-full gap-0 lg:gap-6">
        <aside className="bg-background sticky top-0 hidden h-screen w-64 shrink-0 border-r lg:flex lg:flex-col">
          <div className="px-4 py-4">
            <div className="text-lg font-semibold">Dashboard</div>
            <div className="text-xs opacity-70">MASTER</div>
            {user.department && (
              <div className="text-[10px] font-bold text-blue-500">
                {user.department}
              </div>
            )}
          </div>

          <SidebarContent />

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
                  <div className="text-xs opacity-70">MASTER</div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-md border px-3 py-2 text-sm"
                >
                  Tutup
                </button>
              </div>

              <div className="py-3">
                <SidebarContent />
              </div>

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

        <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">
          <div className="mb-6 hidden items-center justify-between lg:flex">
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-sm opacity-70">
                Read-only analytics untuk monitoring dan analisis produksi.
              </p>
            </div>
          </div>

          {active === "dashboard" && (
            <DashboardOverview department={user.department} />
          )}
          {active === "oee_paper" && <OeeDashboard defaultProType="PAPER" />}
          {active === "oee_rigid" && <OeeDashboard defaultProType="RIGID" />}
          {active === "pro_target_gap" && <ProTargetGap />}
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
