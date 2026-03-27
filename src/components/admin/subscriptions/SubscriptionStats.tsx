import { subscriptionStats } from "@/data/subscription";

export default function SubscriptionStats() {
  return (
    <section className="subscription-stats-grid">
      {subscriptionStats.map((item) => {
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
              {item.change && (
                <span
                  className={
                    item.positive
                      ? "stat-change-positive"
                      : "stat-change-negative"
                  }
                >
                  {item.change}
                </span>
              )}

              <span className="stat-note">{item.note}</span>
            </div>
          </div>
        );
      })}
    </section>
  );
}