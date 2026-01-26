import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function DashboardLayout({
  children, // slot bawaan
  superadmin,
  admin,
  ppic,
  operator,
  master,
}: {
  children: React.ReactNode;
  superadmin: React.ReactNode;
  admin: React.ReactNode;
  ppic: React.ReactNode;
  operator: React.ReactNode;
  master: React.ReactNode;
}) {
  const session = await auth();

  // wajib login
  if (!session?.user) redirect("/login");

  // wajib punya role
  const role = session.user.role;
  if (!role) redirect("/login");

  // pilih UI berdasarkan role (if/else, no switch)
  if (role === "SUPERADMIN") return <>{superadmin}</>;
  if (role === "ADMIN") return <>{admin}</>;
  if (role === "PPIC") return <>{ppic}</>;
  if (role === "OPERATOR") return <>{operator}</>;
  if (role === "MASTER") return <>{master}</>;

  // role aneh -> kick
  redirect("/login");
}
