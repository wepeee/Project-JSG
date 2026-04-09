import { notFound } from "next/navigation";

type DashboardCatchAllPageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

const PAPER_CHILD_ROUTES = new Set([
  "machines",
  "wip-monitor",
  "verification",
  "reports",
  "std-output",
]);

const RIGID_CHILD_ROUTES = new Set([
  "overview",
  "machines",
  "wip-monitor",
  "verification",
  "reports",
  "std-output",
]);

function isKnownDashboardRoute(slug: string[]): boolean {
  if (slug.length === 0) return true;

  const [first, second] = slug;

  if (
    first === "schedule" ||
    first === "history" ||
    first === "settings" ||
    first === "users" ||
    first === "audit" ||
    first === "machine-access" ||
    first === "processes" ||
    first === "materials" ||
    first === "pro-target-gap"
  ) {
    return slug.length === 1;
  }

  if (first === "oee") {
    return (
      slug.length === 1 ||
      (slug.length === 2 && (second === "paper" || second === "rigid"))
    );
  }

  if (first === "pro-list") {
    return (
      slug.length === 1 ||
      (slug.length === 2 &&
        (second === "paper" || second === "rigid" || second === "all"))
    );
  }

  if (first === "planning") {
    return slug.length === 2 && (second === "paper" || second === "rigid");
  }

  if (first === "paper") {
    return slug.length === 2 && second != null && PAPER_CHILD_ROUTES.has(second);
  }

  if (first === "rigid") {
    return slug.length === 2 && second != null && RIGID_CHILD_ROUTES.has(second);
  }

  return false;
}

export default async function DashboardCatchAllPage({
  params,
}: DashboardCatchAllPageProps) {
  const { slug } = await params;

  if (!isKnownDashboardRoute(slug)) {
    notFound();
  }

  // Keep default slot empty: role UI is rendered through parallel routes.
  return null;
}
