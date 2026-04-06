"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";
import RigidOverview from "~/app/dashboard/@superadmin/_components/modules/overview/rigid-overview";
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

const ADMIN_PATH_BY_KEY: Record<NavKey, string> = {
  dashboard: "/dashboard",
  oee_paper: "/dashboard/oee",
  monitor_paper: "/dashboard/paper/wip-monitor",
  monitor_rigid: "/dashboard/rigid/wip-monitor",
  verification_paper: "/dashboard/paper/verification",
  verification_rigid: "/dashboard/rigid/verification",
  report_archive_paper: "/dashboard/paper/reports",
  report_archive_rigid: "/dashboard/rigid/reports",
  std_output_paper: "/dashboard/paper/std-output",
  std_output_rigid: "/dashboard/rigid/std-output",
};

function resolveAdminNav(pathname: string): NavKey {
  if (pathname === "/dashboard") return "dashboard";
  if (pathname.startsWith("/dashboard/oee")) return "oee_paper";
  if (pathname.startsWith("/dashboard/paper/wip-monitor")) return "monitor_paper";
  if (pathname.startsWith("/dashboard/paper/verification")) return "verification_paper";
  if (pathname.startsWith("/dashboard/paper/reports")) return "report_archive_paper";
  if (pathname.startsWith("/dashboard/paper/std-output")) return "std_output_paper";
  if (pathname.startsWith("/dashboard/rigid/wip-monitor")) return "monitor_rigid";
  if (pathname.startsWith("/dashboard/rigid/verification")) return "verification_rigid";
  if (pathname.startsWith("/dashboard/rigid/reports")) return "report_archive_rigid";
  if (pathname.startsWith("/dashboard/rigid/std-output")) return "std_output_rigid";
  return "dashboard";
}

export default function AdminShell({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const active = React.useMemo(
    () => resolveAdminNav(pathname || "/dashboard"),
    [pathname],
  );

  const navigate = React.useCallback(
    (key: NavKey) => {
      router.push(ADMIN_PATH_BY_KEY[key]);
      setOpen(false);
    },
    [router],
  );

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
    <nav className="flex flex-col gap-1 px-2">
      <SidebarItem
        label="Dashboard"
        active={active === "dashboard"}
        onClick={() => navigate("dashboard")}
      />
      <SidebarItem
        label="OEE Analytics"
        active={active === "oee_paper"}
        onClick={() => navigate("oee_paper")}
      />

      {showPaper && (
        <>
          <div className="text-nav-section mt-4 mb-1 px-3 text-[10px] font-bold tracking-wider">
            PAPER
          </div>
          <SidebarItem
            label="Monitor"
            active={active === "monitor_paper"}
            onClick={() => navigate("monitor_paper")}
          />
          <SidebarItem
            label="Verifikasi Laporan"
            active={active === "verification_paper"}
            onClick={() => navigate("verification_paper")}
          />
          <SidebarItem
            label="Daftar Laporan"
            active={active === "report_archive_paper"}
            onClick={() => navigate("report_archive_paper")}
          />
          <SidebarItem
            label="Std Output"
            active={active === "std_output_paper"}
            onClick={() => navigate("std_output_paper")}
          />
        </>
      )}

      {showRigid && (
        <>
          <div className="text-nav-section mt-4 mb-1 px-3 text-[10px] font-bold tracking-wider">
            RIGID
          </div>
          <SidebarItem
            label="Monitor"
            active={active === "monitor_rigid"}
            onClick={() => navigate("monitor_rigid")}
          />
          <SidebarItem
            label="Verifikasi Laporan"
            active={active === "verification_rigid"}
            onClick={() => navigate("verification_rigid")}
          />
          <SidebarItem
            label="Daftar Laporan"
            active={active === "report_archive_rigid"}
            onClick={() => navigate("report_archive_rigid")}
          />
          <SidebarItem
            label="Std Output"
            active={active === "std_output_rigid"}
            onClick={() => navigate("std_output_rigid")}
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
        <aside className="bg-background sticky top-0 hidden h-screen w-64 shrink-0 overflow-hidden border-r lg:flex lg:flex-col">
          <div className="px-4 py-4">
            <div className="text-lg font-semibold">Dashboard</div>
            <div className="text-xs opacity-70">ADMIN</div>
            {user.department && (
              <div className="text-role-highlight text-[10px] font-bold">
                {user.department}
              </div>
            )}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto py-2">
            <SidebarContent />
          </div>

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
            <div className="bg-background absolute top-0 left-0 flex h-full w-72 flex-col border-r">
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

              <div className="min-h-0 flex-1 overflow-y-auto py-3">
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
            <RigidOverview department={user.department} />
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
