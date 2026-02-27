import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // wajib login
  if (!session?.user) redirect("/login");

  return <>{children}</>;
}
