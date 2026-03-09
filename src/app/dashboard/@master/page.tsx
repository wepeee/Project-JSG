import { auth } from "~/server/auth";
import MasterShell from "./_components/master-shell";

export default async function MasterPage() {
  const session = await auth();

  const name = session?.user?.name ?? session?.user?.email ?? "master";
  const role = session?.user?.role ?? "MASTER";
  const rawDepartment = (session?.user as any)?.department;
  const department =
    typeof rawDepartment === "string" ? rawDepartment : undefined;

  return (
    <div>
      <MasterShell user={{ name, role, department }} />
    </div>
  );
}
