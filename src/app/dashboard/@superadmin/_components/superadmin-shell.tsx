"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/theme-toggle";

import CreateUserForm from "./modules/users/create-users-form";
import MachineManager from "./modules/machines/machine-manager";
import VerificationList from "./modules/verification/verification-list";
import ProductionArchive from "./modules/archive/production-archive";
import DashboardOverview from "./modules/overview/dashboard-overview";
import WipMonitor from "./modules/inventory/wip-monitor";
import StdOutput from "./modules/std-output/std-output";
import MachineAccessManager from "./modules/machines/machine-access-manager";
import OeeDashboard from "./modules/oee/oee-dashboard";
import AuditLog from "./modules/audit/audit-log";

type Props = {
  user: {
    name: string;
    role: string;
    department?: string;
  };
};

type NavKey =
  | "dashboard"
  | "users"
  | "settings"
  | "audit"
  | "machines_paper"
  | "machines_rigid"
  | "inventory_paper"
  | "inventory_rigid"
  | "verification_paper"
  | "verification_rigid"
  | "report_archive_paper"
  | "report_archive_rigid"
  | "std_output_paper"
  | "std_output_rigid"
  | "machine_access"
  | "oee_paper";

const SUPERADMIN_PATH_BY_KEY: Record<NavKey, string> = {
  dashboard: "/dashboard",
  users: "/dashboard/users",
  settings: "/dashboard/settings",
  audit: "/dashboard/audit",
  machines_paper: "/dashboard/paper/machines",
  machines_rigid: "/dashboard/rigid/machines",
  inventory_paper: "/dashboard/paper/wip-monitor",
  inventory_rigid: "/dashboard/rigid/wip-monitor",
  verification_paper: "/dashboard/paper/verification",
  verification_rigid: "/dashboard/rigid/verification",
  report_archive_paper: "/dashboard/paper/reports",
  report_archive_rigid: "/dashboard/rigid/reports",
  std_output_paper: "/dashboard/paper/std-output",
  std_output_rigid: "/dashboard/rigid/std-output",
  machine_access: "/dashboard/machine-access",
  oee_paper: "/dashboard/oee",
};

function resolveSuperadminNav(pathname: string): NavKey {
  if (pathname === "/dashboard") return "dashboard";
  if (pathname.startsWith("/dashboard/users")) return "users";
  if (pathname.startsWith("/dashboard/settings")) return "settings";
  if (pathname.startsWith("/dashboard/audit")) return "audit";
  if (pathname.startsWith("/dashboard/machine-access")) return "machine_access";
  if (pathname.startsWith("/dashboard/oee")) return "oee_paper";

  if (pathname.startsWith("/dashboard/paper/machines")) return "machines_paper";
  if (pathname.startsWith("/dashboard/paper/wip-monitor")) return "inventory_paper";
  if (pathname.startsWith("/dashboard/paper/verification")) return "verification_paper";
  if (pathname.startsWith("/dashboard/paper/reports")) return "report_archive_paper";
  if (pathname.startsWith("/dashboard/paper/std-output")) return "std_output_paper";

  if (pathname.startsWith("/dashboard/rigid/machines")) return "machines_rigid";
  if (pathname.startsWith("/dashboard/rigid/wip-monitor")) return "inventory_rigid";
  if (pathname.startsWith("/dashboard/rigid/verification")) return "verification_rigid";
  if (pathname.startsWith("/dashboard/rigid/reports")) return "report_archive_rigid";
  if (pathname.startsWith("/dashboard/rigid/std-output")) return "std_output_rigid";

  return "dashboard";
}

export default function SuperadminShell({ user }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const active = React.useMemo(
    () => resolveSuperadminNav(pathname || "/dashboard"),
    [pathname],
  );

  const navigate = React.useCallback(
    (key: NavKey) => {
      router.push(SUPERADMIN_PATH_BY_KEY[key]);
      setOpen(false);
    },
    [router],
  );

  const title = React.useMemo(() => {
    switch (active) {
      case "dashboard":
        return "Dashboard Overview";
      case "users":
        return "Kelola Akun";
      case "settings":
        return "Pengaturan";
      case "audit":
        return "Audit Log";

      case "machines_paper":
        return "Kelola Mesin Paper";
      case "inventory_paper":
        return "WIP Monitor Paper";
      case "oee_paper":
        return user.department === "RIGID"
          ? "OEE Analytics - Rigid"
          : "OEE Analytics - Paper";
      case "verification_paper":
        return "Verifikasi Laporan Paper";
      case "report_archive_paper":
        return "Daftar Laporan Paper";
      case "std_output_paper":
        return "Std Output Paper";

      case "machines_rigid":
        return "Kelola Mesin Rigid";
      case "inventory_rigid":
        return "WIP Monitor Rigid";
      case "verification_rigid":
        return "Verifikasi Laporan Rigid";
      case "report_archive_rigid":
        return "Daftar Laporan Rigid";
      case "std_output_rigid":
        return "Std Output Rigid";
      case "machine_access":
        return "Akses Mesin Operator";

      default:
        return "Dashboard";
    }
  }, [active, user.department]);

  // Filter Logic
  const showPaper = !user.department || user.department === "PAPER";
  const showRigid = !user.department || user.department === "RIGID";

  const SidebarContent = () => (
    <nav className="flex flex-1 flex-col gap-1 px-2">
      <div className="text-nav-section mb-1 px-3 text-[10px] font-bold tracking-wider">
        OVERVIEW
      </div>
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
            OPERASIONAL PAPER
          </div>
          <SidebarItem
            label="WIP Monitor"
            active={active === "inventory_paper"}
            onClick={() => navigate("inventory_paper")}
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
          <SidebarItem
            label="Kelola Mesin"
            active={active === "machines_paper"}
            onClick={() => navigate("machines_paper")}
          />
        </>
      )}

      {showRigid && (
        <>
          <div className="text-nav-section mt-4 mb-1 px-3 text-[10px] font-bold tracking-wider">
            OPERASIONAL RIGID
          </div>
          <SidebarItem
            label="WIP Monitor"
            active={active === "inventory_rigid"}
            onClick={() => navigate("inventory_rigid")}
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
          <SidebarItem
            label="Kelola Mesin"
            active={active === "machines_rigid"}
            onClick={() => navigate("machines_rigid")}
          />
        </>
      )}

      <div className="mt-4 mb-2 border-t border-dashed" />
      <div className="text-nav-section mb-1 px-3 text-[10px] font-bold tracking-wider">
        ADMINISTRASI SISTEM
      </div>
      <SidebarItem
        label="Kelola Akun"
        active={active === "users"}
        onClick={() => navigate("users")}
      />
      <SidebarItem
        label="Akses Mesin Operator"
        active={active === "machine_access"}
        onClick={() => navigate("machine_access")}
      />
      <SidebarItem
        label="Audit Log"
        active={active === "audit"}
        onClick={() => navigate("audit")}
      />
      <SidebarItem
        label="Pengaturan"
        active={active === "settings"}
        onClick={() => navigate("settings")}
      />
    </nav>
  );

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
            {user.department && (
              <div className="text-role-highlight text-[10px] font-bold">
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

        {/* Main */}
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">
          {/* Desktop header */}
          <div className="mb-6 hidden items-center justify-between lg:flex">
            <div>
              <h1 className="text-xl font-semibold">{title}</h1>
              <p className="text-sm opacity-70">
                Kelola sistem sesuai hak akses.
              </p>
            </div>
          </div>

          {active === "dashboard" && (
            <DashboardOverview department={user.department} />
          )}
          {active === "users" && <CreateUserForm />}
          {active === "audit" && <AuditLog />}
          {active === "settings" && (
            <div className="rounded-md border p-4 text-sm opacity-80">
              Pengaturan belum dibuat. Nanti kita rapihin.
            </div>
          )}

          {/* Paper Components */}
          {active === "machines_paper" && (
            <MachineManager machineType="PAPER" />
          )}
          {active === "inventory_paper" && (
            <WipMonitor userDepartment="PAPER" />
          )}
          {active === "verification_paper" && (
            <VerificationList userDepartment="PAPER" />
          )}
          {active === "report_archive_paper" && (
            <ProductionArchive userDepartment="PAPER" />
          )}

          {/* Rigid Components */}
          {active === "machines_rigid" && (
            <MachineManager machineType="RIGID" />
          )}
          {active === "inventory_rigid" && (
            <WipMonitor userDepartment="RIGID" />
          )}
          {active === "verification_rigid" && (
            <VerificationList userDepartment="RIGID" />
          )}
          {active === "report_archive_rigid" && (
            <ProductionArchive userDepartment="RIGID" />
          )}

          {/* Std Output */}
          {active === "std_output_paper" && (
            <StdOutput userDepartment="PAPER" />
          )}
          {active === "std_output_rigid" && (
            <StdOutput userDepartment="RIGID" />
          )}

          {/* OEE Analytics */}
          {active === "oee_paper" && (
            <OeeDashboard
              defaultProType={user.department === "RIGID" ? "RIGID" : "PAPER"}
              showProTypeFilter={!user.department}
            />
          )}

          {/* Machine Access */}
          {active === "machine_access" && <MachineAccessManager />}
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
