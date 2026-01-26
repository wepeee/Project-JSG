import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session.user.role !== "SUPERADMIN") redirect("/dashboard");

  return <>{children}</>;
}
