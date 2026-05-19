"use client";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { ProductManagementWorkspace } from "@/components/dashboard/product-management-workspace";
import { ProductPageActions } from "@/components/dashboard/product-page-actions";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  type MetricItem,
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

// Product page entrypoint for catalog management and product insights.
export default function ProductPage() {
  const { data: overview } = useGetOwnerProductsOverviewQuery();
  const metrics = toMetricItems(overview);

  return (
    <DashboardPage
      title="Products"
      description="Manage your catalog and monitor product-level sales performance."
      actions={<ProductPageActions />}
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <KpiCard key={item.title} item={item} />
        ))}
      </section>

      <ProductManagementWorkspace />
    </DashboardPage>
  );
}
