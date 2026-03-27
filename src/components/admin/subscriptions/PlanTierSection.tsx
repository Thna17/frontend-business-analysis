import { subscriptionPlans } from "@/data/subscription";

export default function PlanTierSection() {
  return (
    <section className="plan-tier-section">
      <div className="plan-tier-header">
        <h2>Plan Tier Architecture</h2>
      </div>

      <div className="plan-tier-grid">
        {subscriptionPlans.map((plan) => (
          <article
            key={plan.name}
            className={`plan-tier-card ${plan.highlighted ? "highlighted" : ""}`}
          >
            {plan.badge ? (
              <div className="plan-tier-badge">{plan.badge}</div>
            ) : null}

            <div className="plan-tier-edit">✎</div>

            <h3>{plan.name}</h3>
            <p className="plan-tier-subtitle">{plan.subtitle}</p>

            <div className="plan-tier-price-row">
              <span className="plan-tier-price">{plan.price}</span>
              <span className="plan-tier-suffix">{plan.suffix}</span>
            </div>

            <div className="plan-tier-users">
              <span>Active Users</span>
              <strong>{plan.users}</strong>
            </div>

            <ul className="plan-tier-features">
              {plan.features.map((feature) => (
                <li
                  key={feature.text}
                  className={feature.disabled ? "disabled" : ""}
                >
                  <span className="feature-dot">
                    {feature.disabled ? "⊗" : "●"}
                  </span>
                  {feature.text}
                </li>
              ))}
            </ul>

            <button
              className={`plan-tier-manage-btn ${
                plan.highlighted ? "gold" : "light"
              }`}
            >
              Manage Features
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}