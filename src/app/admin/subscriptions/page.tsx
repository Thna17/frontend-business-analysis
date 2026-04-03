import SubscriptionHeader from "@/components/admin/subscriptions/SubscriptionHeader";
import SubscriptionStats from "@/components/admin/subscriptions/SubscriptionStats";
import GrowthChart from "@/components/admin/subscriptions/GrowthChart";
import PlanTierSection from "@/components/admin/subscriptions/PlanTierSection";
import BillingTable from "@/components/admin/subscriptions/BillingTable";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { adminTopNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function SubscriptionsPage() {
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
        <SubscriptionHeader />
        <SubscriptionStats />
        <GrowthChart />
        <PlanTierSection />
        <BillingTable />
        <footer className="pt-10 text-center text-sm text-[#98a2b3]">
          (c) 2026 Syntrix Admin Console. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
