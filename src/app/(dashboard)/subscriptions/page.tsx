import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { SubscriptionsPageActions } from "@/components/dashboard/subscriptions-page-actions";
import { SubscriptionsWorkspace } from "@/components/dashboard/subscriptions-workspace";

export default function SubscriptionsPage() {
  return (
    <DashboardPage
      title="Subscriptions"
      description="Manage your subscription plan, billing details, and payment history."
      actions={<SubscriptionsPageActions />}
    >
      <SubscriptionsWorkspace />
    </DashboardPage>
  );
}
