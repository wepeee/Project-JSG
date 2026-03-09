"use client";

import * as React from "react";
import { signOut } from "next-auth/react";

import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";
import DashboardOverview from "~/app/dashboard/@superadmin/_components/modules/overview/dashboard-overview";
import WipMonitor from "~/app/dashboard/@superadmin/_components/modules/inventory/wip-monitor";
import VerificationList from "~/app/dashboard/@superadmin/_components/modules/verification/verification-list";
import ProductionArchive from "~/app/dashboard/@superadmin/_components/modules/archive/production-archive";
import StdOutput from "~/app/dashboard/@superadmin/_components/modules/std-output/std-output";
import OeeDashboard from "~/app/dashboard/@superadmin/_components/modules/oee/oee-dashboard";

type Props = {
  user: {
    name: string;
    role: string;
    department?: string;
  };
};

type NavKey =
  | "dashboard"
  | "oee_paper"
  | "monitor_paper"
  | "monitor_rigid"
  | "verification_paper"
  | "verification_rigid"
  | "report_archive_paper"
  | "report_archive_rigid"
  | "std_output_paper"
  | "std_output_rigid";

export default function AdminShell({ user }: Props) {
  const [active, setActive] = React.useState<NavKey>("dashboard");
  const [open, setOpen] = React.useState(false);

  const title = React.useMemo(() => {
    switch (active) {
      case "dashboard":
        return "Dashboard Overview";
      case "oee_paper":
        return "OEE Analytics - Paper";
      case "monitor_paper":
        return "Monitor Paper";
      case "monitor_rigid":
        return "Monitor Rigid";
      case "verification_paper":
        return "Verifikasi Laporan Paper";
      case "verification_rigid":
        return "Verifikasi Laporan Rigid";
      case "report_archive_paper":
        return "Daftar Laporan Paper";
      case "report_archive_rigid":
        return "Daftar Laporan Rigid";
      case "std_output_paper":
        return "Std Output Paper";
      case "std_output_rigid":
        return "Std Output Rigid";
      default:
        return "Dashboard";
    }
  }, [active]);

  const showPaper = !user.department || user.department === "PAPER";
  const showRigid = !user.department || user.department === "RIGID";

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
        label="OEE Analytics"
        active={active === "oee_paper"}
        onClick={() => {
          setActive("oee_paper");
          setOpen(false);
        }}
      />

      {showPaper && (
        <>
          <div className="mt-4 mb-1 px-3 text-[10px] font-bold tracking-wider text-slate-400">
            PAPER
          </div>
          <SidebarItem
            label="Monitor"
            active={active === "monitor_paper"}
            onClick={() => {
              setActive("monitor_paper");
              setOpen(false);
            }}
          />
          <SidebarItem
            label="Verifikasi Laporan"
            active={active === "verification_paper"}
            onClick={() => {
              setActive("verification_paper");
              setOpen(false);
            }}
          />
          <SidebarItem
            label="Daftar Laporan"
            active={active === "report_archive_paper"}
            onClick={() => {
              setActive("report_archive_paper");
              setOpen(false);
            }}
          />
          <SidebarItem
            label="Std Output"
            active={active === "std_output_paper"}
            onClick={() => {
              setActive("std_output_paper");
              setOpen(false);
            }}
          />
        </>
      )}

      {showRigid && (
        <>
          <div className="mt-4 mb-1 px-3 text-[10px] font-bold tracking-wider text-slate-400">
            RIGID
          </div>
          <SidebarItem
            label="Monitor"
            active={active === "monitor_rigid"}
            onClick={() => {
              setActive("monitor_rigid");
              setOpen(false);
            }}
          />
          <SidebarItem
            label="Verifikasi Laporan"
            active={active === "verification_rigid"}
            onClick={() => {
              setActive("verification_rigid");
              setOpen(false);
            }}
          />
          <SidebarItem
            label="Daftar Laporan"
            active={active === "report_archive_rigid"}
            onClick={() => {
              setActive("report_archive_rigid");
              setOpen(false);
            }}
          />
          <SidebarItem
            label="Std Output"
            active={active === "std_output_rigid"}
            onClick={() => {
              setActive("std_output_rigid");
              setOpen(false);
            }}
          />
        </>
      )}
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
            <div className="text-xs opacity-70">ADMIN</div>
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
                  <div className="text-xs opacity-70">ADMIN</div>
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
                Monitoring produksi dan verifikasi laporan.
              </p>
            </div>
          </div>

          {active === "dashboard" && (
            <DashboardOverview department={user.department} />
          )}
          {active === "oee_paper" && <OeeDashboard />}

          {active === "monitor_paper" && <WipMonitor userDepartment="PAPER" />}
          {active === "monitor_rigid" && <WipMonitor userDepartment="RIGID" />}

          {active === "verification_paper" && (
            <VerificationList userDepartment="PAPER" />
          )}
          {active === "verification_rigid" && (
            <VerificationList userDepartment="RIGID" />
          )}

          {active === "report_archive_paper" && (
            <ProductionArchive userDepartment="PAPER" readOnly />
          )}
          {active === "report_archive_rigid" && (
            <ProductionArchive userDepartment="RIGID" readOnly />
          )}

          {active === "std_output_paper" && (
            <StdOutput userDepartment="PAPER" readOnly />
          )}
          {active === "std_output_rigid" && (
            <StdOutput userDepartment="RIGID" readOnly />
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
