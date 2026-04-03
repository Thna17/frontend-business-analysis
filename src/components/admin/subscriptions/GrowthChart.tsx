"use client";

import { useGetAdminSubscriptionOverviewQuery } from "@/store/api";

type GrowthItem = {
  month: string;
  value: number;
};

export default function GrowthChart() {
  const { data: overview, isLoading, isError } = useGetAdminSubscriptionOverviewQuery();

  const data: GrowthItem[] = (Array.isArray(overview?.trend) ? overview.trend : []).map(
    (item) => ({
      month: item.month,
      value: Number(item.subscribers || 0),
    }),
  );

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <section className="growth-chart-card">
      <div className="growth-chart-header">
        <div>
          <h2 className="dashboard-section-title">Subscriber Growth Trend</h2>
          <p className="dashboard-subtitle mt-1 text-sm">12-month real subscription acquisition trend</p>
        </div>

        <div className="chart-range-tabs">
          <button className="active">1Y</button>
          <button>6M</button>
          <button>3M</button>
        </div>
      </div>

      <div className="growth-chart-area">
        {isLoading ? <p className="px-6 py-4 text-sm text-[#667085]">Loading growth data...</p> : null}
        {isError ? <p className="px-6 py-4 text-sm text-[#b42318]">Unable to load growth data. Please check admin login.</p> : null}
        {!isLoading && !isError && data.length === 0 ? (
          <p className="px-6 py-4 text-sm text-[#667085]">No subscription growth data yet.</p>
        ) : null}

        {!isLoading && !isError && data.length > 0 ? (
          <div className="growth-bars">
            {data.map((item, index) => {
              const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;

              return (
                <div className="growth-bar-item" key={item.month}>
                  <div
                    className={`growth-bar ${
                      index === data.length - 1 ? "is-active" : ""
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                  <span>{item.month}</span>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
}
