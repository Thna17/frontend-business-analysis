import AdminTopNav from "@/components/admin/AdminTopNav";
import SubscriptionHeader from "@/components/admin/subscriptions/SubscriptionHeader";
import SubscriptionStats from "@/components/admin/subscriptions/SubscriptionStats";
import GrowthChart from "@/components/admin/subscriptions/GrowthChart";
import PlanTierSection from "@/components/admin/subscriptions/PlanTierSection";
import BillingTable from "@/components/admin/subscriptions/BillingTable";

export default function SubscriptionsPage() {
  return (
    <main className="subscriptions-page">
      <div className="admin-shell">
        <AdminTopNav />
        <SubscriptionHeader />
        <SubscriptionStats />
        <GrowthChart />
        <PlanTierSection />
        <BillingTable />
      </div>
    </main>
  );
}