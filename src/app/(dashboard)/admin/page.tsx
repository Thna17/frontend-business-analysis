import { AdminDashboardWorkspace } from "@/components/dashboard/admin-dashboard-workspace";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { adminTopNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function AdminDashboardPage() {
  return (
    <div className="dashboard-shell pb-14">
      <TopNavigation items={adminTopNavItems} settingsHref="/admin-settings" />

      <div className="dashboard-container mt-10 space-y-7">
        <AdminDashboardWorkspace />

        <footer className="pt-10 text-center text-sm text-[#98a2b3]">
          © 2026 Syntrix Admin Console. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
