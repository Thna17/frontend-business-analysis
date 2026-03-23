import { KpiCard } from "@/components/dashboard/kpi-card";
import { ProductRankingCard } from "@/components/dashboard/product-ranking-card";
import { RecentSalesCard } from "@/components/dashboard/recent-sales-card";
import { RevenueAnalyticsCard } from "@/components/dashboard/revenue-analytics-card";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import {
  metricItems,
  rankingItems,
  salesTransactions,
  topNavItems,
} from "@/features/owner-dashboard/dashboard-mock";

export default function OwnerDashboardPage() {
  return (
    <div className="dashboard-shell pb-10">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-7">
        <section>
          <h1 className="dashboard-title text-5xl">Dashboard</h1>
          <p className="mt-2 text-xl text-[#667085]">
            Welcome back, Alex. Here&apos;s what&apos;s happening today.
          </p>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {metricItems.map((item) => (
            <KpiCard key={item.title} item={item} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <RevenueAnalyticsCard />
          <ProductRankingCard items={rankingItems} />
        </section>

        <RecentSalesCard rows={salesTransactions} />
      </div>
    </div>
  );
}
