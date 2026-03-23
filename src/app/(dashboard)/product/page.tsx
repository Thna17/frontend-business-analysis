import { KpiCard } from "@/components/dashboard/kpi-card";
import { ProductManagementWorkspace } from "@/components/dashboard/product-management-workspace";
import { ProductPageActions } from "@/components/dashboard/product-page-actions";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import {
  productMetrics,
  productRankingItems,
  productRows,
  topNavItems,
} from "@/features/owner-dashboard/dashboard-mock";

export default function ProductPage() {
  return (
    <div className="dashboard-shell pb-14">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-7">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="dashboard-title">Products Management</h1>
            <p className="dashboard-subtitle mt-2">Manage your products and monitor their sales performance.</p>
          </div>
          <ProductPageActions />
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {productMetrics.map((item) => (
            <KpiCard key={item.title} item={item} />
          ))}
        </section>

        <ProductManagementWorkspace initialRows={productRows} rankingItems={productRankingItems} />

        <footer className="pt-10 text-center text-sm text-[#98a2b3]">© 2026 Syntrix Analytics. All rights reserved.</footer>
      </div>
    </div>
  );
}
