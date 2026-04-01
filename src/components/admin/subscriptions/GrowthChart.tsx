"use client";

import { useEffect, useState } from "react";

type GrowthItem = {
  month: string;
  value: number;
};

const API_URL = "http://localhost:5000";

export default function GrowthChart() {
  const [data, setData] = useState<GrowthItem[]>([]);

  useEffect(() => {
    async function loadGrowth() {
      try {
        const res = await fetch(`${API_URL}/api/admin/subscriptions/growth`, {
          cache: "no-store",
        });
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Failed to load growth chart:", error);
      }
    }

    loadGrowth();
  }, []);

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <section className="growth-chart-card">
      <div className="growth-chart-header">
        <div>
          <h2>Subscriber Growth Trend</h2>
          <p>12-month historical projection and performance</p>
        </div>

        <div className="chart-range-tabs">
          <button className="active">1Y</button>
          <button>6M</button>
          <button>3M</button>
        </div>
      </div>

      <div className="growth-chart-area">
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
      </div>
    </section>
  );
}