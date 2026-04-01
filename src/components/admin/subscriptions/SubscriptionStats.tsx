"use client";

import { useEffect, useState } from "react";
import { CreditCard, TrendingUp, Users } from "lucide-react";

type SubscriptionStatsData = {
  total: number;
  active: number;
  revenue: number;
};

const API_URL = "http://localhost:5000";

export default function SubscriptionStats() {
  const [data, setData] = useState<SubscriptionStatsData | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`${API_URL}/api/admin/subscriptions/stats`, {
          cache: "no-store",
        });
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to load subscription stats:", error);
      }
    }

    loadStats();
  }, []);

  const stats = [
    {
      title: "Total Subscribers",
      value: data?.total ?? 0,
      note: "All subscription accounts",
      change: "",
      positive: true,
      icon: Users,
    },
    {
      title: "Active Subscribers",
      value: data?.active ?? 0,
      note: "Currently active plans",
      change: "",
      positive: true,
      icon: TrendingUp,
    },
    {
      title: "Subscription Revenue",
      value: `$${(data?.revenue ?? 0).toLocaleString()}`,
      note: "Total recurring revenue",
      change: "",
      positive: true,
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
              {item.change ? (
                <span
                  className={
                    item.positive
                      ? "stat-change-positive"
                      : "stat-change-negative"
                  }
                >
                  {item.change}
                </span>
              ) : null}

              <span className="stat-note">{item.note}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}