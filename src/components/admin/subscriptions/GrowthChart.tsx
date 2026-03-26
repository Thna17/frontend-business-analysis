import { subscriptionChartData } from "@/data/subscription";

export default function GrowthChart() {
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
          {subscriptionChartData.map((item, index) => (
            <div className="growth-bar-item" key={item.month}>
              <div
                className={`growth-bar ${
                  index === subscriptionChartData.length - 1 ? "is-active" : ""
                }`}
                style={{ height: `${item.value}%` }}
              />
              <span>{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}