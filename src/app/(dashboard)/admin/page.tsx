import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { AdminDashboardWorkspace } from "@/components/dashboard/admin-dashboard-workspace";

export default function AdminDashboardPage() {
  return (
    <DashboardPage footer="(c) 2026 Syntrix Admin Console. All rights reserved.">
      <AdminDashboardWorkspace />
    </DashboardPage>
  );
}
