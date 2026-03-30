import { OwnerDashboardWorkspace } from "@/components/dashboard/owner-dashboard-workspace";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function OwnerDashboardPage() {
  return (
    <div className="dashboard-shell pb-10">
      <TopNavigation items={topNavItems} />
      <OwnerDashboardWorkspace />
    </div>
  );
}
