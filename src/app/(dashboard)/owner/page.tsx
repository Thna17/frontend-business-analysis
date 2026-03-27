import { BarChart3, DollarSign, Package, TrendingUp } from "lucide-react";
import { RevenueAnalyticsCard } from "@/components/sba/revenue-analytics-card";
import { SalesTable } from "@/components/sba/sales-table";
import { StatCard } from "@/components/sba/stat-card";
import { SubscriptionCard } from "@/components/sba/subscription-card";
import { TopProductsCard } from "@/components/sba/top-products-card";
import { getRevenueAnalytics } from "@/features/analytics/analytics-service";
import { getBusinessProfile } from "@/features/business/business-service";
import { getSales } from "@/features/sales/sales-service";
import { getSubscription } from "@/features/subscriptions/subscription-service";

export default async function OwnerDashboardPage() {
  const [analytics, business, sales, subscription] = await Promise.all([
    getRevenueAnalytics(),
    getBusinessProfile(),
    getSales(),
    getSubscription(),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white/90 p-5">
        <p className="text-xs font-semibold tracking-[0.15em] text-cyan-700 uppercase">
          Business Owner Dashboard
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {business.businessName}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage sales transactions, review revenue analytics, and monitor your subscription plan.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${analytics.totalRevenue.toLocaleString()}`}
          hint="Current month"
          icon={DollarSign}
        />
        <StatCard
          title="Growth"
          value={`${analytics.growthPercentage}%`}
          hint="Compared with last month"
          icon={TrendingUp}
        />
        <StatCard
          title="Sales Records"
          value={sales.length.toString()}
          hint="Tracked transactions"
          icon={Package}
        />
        <StatCard
          title="Analytics Coverage"
          value="5 metrics"
          hint="Daily and monthly"
          icon={BarChart3}
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <RevenueAnalyticsCard analytics={analytics} />
        <TopProductsCard analytics={analytics} />
      </section>

      <SalesTable sales={sales} />
      <SubscriptionCard subscription={subscription} />
    </div>
  );
}
