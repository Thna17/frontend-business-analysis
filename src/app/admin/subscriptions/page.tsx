import SubscriptionHeader from "@/components/admin/subscriptions/SubscriptionHeader";
import SubscriptionStats from "@/components/admin/subscriptions/SubscriptionStats";
import GrowthChart from "@/components/admin/subscriptions/GrowthChart";
import PlanTierSection from "@/components/admin/subscriptions/PlanTierSection";
import BillingTable from "@/components/admin/subscriptions/BillingTable";
import { DashboardPage } from "@/components/dashboard/dashboard-page";

export default function SubscriptionsPage() {
  return (
    <DashboardPage footer="(c) 2026 Syntrix Admin Console. All rights reserved.">
      <SubscriptionHeader />
      <SubscriptionStats />
      <GrowthChart />
      <PlanTierSection />
      <BillingTable />
    </DashboardPage>
  );
}
