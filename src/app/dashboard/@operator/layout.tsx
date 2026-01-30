import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (session.user.role !== "OPERATOR") redirect("/dashboard");

  return <div className="min-h-screen bg-background">{children}</div>;
}
