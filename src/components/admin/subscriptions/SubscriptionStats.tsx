"use client";

import { CreditCard, TrendingUp, Users } from "lucide-react";
import { useGetAdminSubscriptionOverviewQuery } from "@/store/api";

export default function SubscriptionStats() {
  const { data, isError } = useGetAdminSubscriptionOverviewQuery();

  const total = data?.summary.totalSubscribers ?? 0;
  const active = data?.summary.activeSubscribers ?? 0;
  const revenue = data?.summary.totalRevenue ?? 0;
  const activeRate = data?.summary.activeRate ?? 0;

  const stats = [
    {
      title: "Total Subscribers",
      value: total,
      note: isError ? "Unable to load data" : "All subscription accounts",
      icon: Users,
    },
    {
      title: "Active Subscribers",
      value: active,
      note: isError ? "Unable to load data" : `${activeRate}% active conversion rate`,
      icon: TrendingUp,
    },
    {
      title: "Subscription Revenue",
      value: `$${revenue.toLocaleString()}`,
      note: isError ? "Unable to load data" : "Succeeded payment revenue",
      icon: CreditCard,
    },
  ];

  return (
    <section className="subscription-stats-grid">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div className="subscription-stat-card" key={item.title}>
            <div className="subscription-stat-head">
              <p>{item.title}</p>

              <div className="stat-icon">
                <Icon size={20} strokeWidth={2} />
              </div>
            </div>

            <h3>{item.value}</h3>

            <div className="subscription-stat-foot">
              <span className="stat-note">{item.note}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
