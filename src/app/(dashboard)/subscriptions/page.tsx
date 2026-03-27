import { SubscriptionsPageActions } from "@/components/dashboard/subscriptions-page-actions";
import { SubscriptionsWorkspace } from "@/components/dashboard/subscriptions-workspace";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function SubscriptionsPage() {
  return (
    <div className="dashboard-shell pb-14">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-7">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="dashboard-title">Subscription Management</h1>
            <p className="dashboard-subtitle mt-2 max-w-xl">
              Manage your subscription plan, billing details, and payment history.
            </p>
          </div>
          <SubscriptionsPageActions />
        </section>

        <SubscriptionsWorkspace />

        <footer className="pt-10 text-center text-sm text-[#98a2b3]">© 2026 Syntrix Analytics. All rights reserved.</footer>
      </div>
    </div>
  );
}
