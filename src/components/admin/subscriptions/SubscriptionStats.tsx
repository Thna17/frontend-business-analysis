import { subscriptionStats } from "@/data/subscription";

export default function SubscriptionStats() {
  return (
    <section className="subscription-stats-grid">
      {subscriptionStats.map((item) => (
        <div className="subscription-stat-card" key={item.title}>
          <div className="subscription-stat-head">
            <p>{item.title}</p>
            <span className="stat-icon">{item.icon}</span>
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
      ))}
    </section>
  );
}