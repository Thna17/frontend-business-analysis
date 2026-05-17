import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { PageHeader } from "@/components/shared/page-header";
import { SubscriptionsPageActions } from "@/components/dashboard/subscriptions-page-actions";
import { SubscriptionsWorkspace } from "@/components/dashboard/subscriptions-workspace";

export default function SubscriptionsPage() {
  return (
    <DashboardPage
      header={(
        <section className="dashboard-surface p-6 md:p-8">
          <PageHeader
            eyebrow="Plan Management"
            title="Subscriptions"
            description="Manage your subscription plan, billing details, and payment history."
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Subscriptions" },
            ]}
            actions={<SubscriptionsPageActions />}
          />
        </section>
      )}
    >
      <SubscriptionsWorkspace />
    </DashboardPage>
  );
}
