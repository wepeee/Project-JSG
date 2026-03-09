import { auth } from "~/server/auth";
import AdminShell from "./_components/admin-shell";

export default async function AdminPage() {
  const session = await auth();

  const name = session?.user?.name ?? session?.user?.email ?? "admin";
  const role = session?.user?.role ?? "ADMIN";
  const rawDepartment = (session?.user as any)?.department;
  const department =
    typeof rawDepartment === "string" ? rawDepartment : undefined;

  return (
    <div>
      <AdminShell user={{ name, role, department }} />
    </div>
  );
}
