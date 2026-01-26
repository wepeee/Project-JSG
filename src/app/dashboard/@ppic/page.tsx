import { auth } from "~/server/auth";
import PPICShell from "./_components/ppic-shell";

export default async function PPICPage() {
  const session = await auth();

  const name = session?.user?.name ?? session?.user?.email ?? "ppic";
  const role = session?.user?.role ?? "PPIC";

  return (
    <div>
      <PPICShell user={{ name, role }} />
    </div>
  );
}
