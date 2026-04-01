import { AdminAnalyticsWorkspace } from "@/components/dashboard/admin-analytics-workspace";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { adminTopNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function AdminAnalyticsPage() {
  return (
    <div className="dashboard-shell pb-14">
      <TopNavigation
        items={adminTopNavItems}
        settingsHref="/admin-settings"
        profileHref="/admin/profile"
        notificationHref="/admin/notification"
        notificationCount={1}
      />

      <div className="dashboard-container mt-10 space-y-7">
        <AdminAnalyticsWorkspace />

        <footer className="pt-10 text-center text-sm text-[#98a2b3]">
          (c) 2026 Syntrix Analytics. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
