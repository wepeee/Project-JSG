import { auth } from "~/server/auth";
import SuperadminShell from "./_components/superadmin-shell";

export default async function SuperadminPage() {
  const session = await auth();

  // harusnya udah di-guard oleh dashboard/layout.tsx, tapi kita tetap defensive
  const name = session?.user?.name ?? session?.user?.email ?? "superadmin";
  const role = session?.user?.role ?? "SUPERADMIN";
  const rawDepartment = (session?.user as any)?.department;
  const department =
    typeof rawDepartment === "string" ? rawDepartment : undefined;

  return (
    <div>
      <SuperadminShell user={{ name, role, department }} />
    </div>
  );
}
