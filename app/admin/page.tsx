import MetricsPanels from "@/components/admin/MetricsPanels";
import { snapshot } from "@/lib/analytics/store";

export const dynamic = "force-dynamic";

// Gated by ADMIN_SECRET. Visit /admin?secret=YOUR_SECRET. Blank page otherwise.
export default function AdminPage({
  searchParams,
}: {
  searchParams: { secret?: string };
}) {
  if (!process.env.ADMIN_SECRET || searchParams.secret !== process.env.ADMIN_SECRET) {
    return null;
  }
  return <MetricsPanels data={snapshot()} />;
}
