import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { AdminAnalyticsWorkspace } from "@/components/dashboard/admin-analytics-workspace";

export default function AdminAnalyticsPage() {
  return (
    <DashboardPage footer="(c) 2026 Syntrix Analytics. All rights reserved.">
      <AdminAnalyticsWorkspace />
    </DashboardPage>
  );
}
