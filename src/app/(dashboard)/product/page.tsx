"use client";

import { ProductManagementWorkspace } from "@/components/dashboard/product-management-workspace";
import { ProductPageActions } from "@/components/dashboard/product-page-actions";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  type MetricItem,
  topNavItems,
} from "@/features/owner-dashboard/dashboard-mock";
import { useGetOwnerProductsOverviewQuery } from "@/store/api";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function toMetricItems(data?: {
  kpi: {
    totalProducts: number;
    bestSeller: string | null;
    productRevenue: number;
    lowStockCount: number;
    revenueGrowthPercentage: number;
  };
}): MetricItem[] {
  const growth = data?.kpi.revenueGrowthPercentage ?? 0;
  const growthText = `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;

  return [
    {
      title: "Total Products",
      value: String(data?.kpi.totalProducts ?? 0),
      change: "",
      changeDirection: "up",
      compareLabel: "catalog items",
      icon: "product",
    },
    {
      title: "Best Seller",
      value: data?.kpi.bestSeller ?? "N/A",
      change: growthText,
      changeDirection: growth >= 0 ? "up" : "down",
      compareLabel: "vs last month",
      icon: "star",
    },
    {
      title: "Product Revenue",
      value: formatCurrency(data?.kpi.productRevenue ?? 0),
      change: "",
      changeDirection: "up",
      compareLabel: "lifetime",
      icon: "revenue",
    },
    {
      title: "Low Stock",
      value: `${data?.kpi.lowStockCount ?? 0} items`,
      change: "",
      changeDirection: "down",
      compareLabel: "stock ≤ 10",
      icon: "alert",
    },
  ];
}

export default function ProductPage() {
  const { data: overview } = useGetOwnerProductsOverviewQuery();
  const metrics = toMetricItems(overview);

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
          {metrics.map((item) => (
            <KpiCard key={item.title} item={item} />
          ))}
        </section>

        <ProductManagementWorkspace />

        <footer className="pt-10 text-center text-sm text-[#98a2b3]">© 2026 Syntrix Analytics. All rights reserved.</footer>
      </div>
    </div>
  );
}
