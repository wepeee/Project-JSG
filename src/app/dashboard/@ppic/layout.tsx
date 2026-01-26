import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function PPICLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session.user.role !== "PPIC") redirect("/dashboard");

  return <>{children}</>;
}
