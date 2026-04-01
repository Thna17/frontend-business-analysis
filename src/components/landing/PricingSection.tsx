const pricingPlans = [
  {
    tier: "TIER I",
    name: "Free",
    price: "$0",
    suffix: "/mo",
    features: [
      "Create and manage 1 business profile",
      "Add, edit, and delete sales records",
      "Basic revenue overview",
      "Simple dashboard view",
      "Search by product name",
      "Filter by date and category",
    ],
    highlighted: false,
    badge: "",
    buttonStyle: "outline-gold",
  },
  {
    tier: "TIER II",
    name: "Plus",
    price: "$19",
    suffix: "/mo",
    features: [
      "All Free features",
      "Advanced revenue analytics",
      "Daily sales trends",
      "Monthly sales comparison",
      "Growth percentage insights",
      "Top-performing product analysis",
    ],
    highlighted: true,
    badge: "RECOMMENDED",
    buttonStyle: "gold",
  },
  {
    tier: "TIER III",
    name: "Pro",
    price: "$49",
    suffix: "/mo",
    features: [
      "All Plus features",
      "Full analytics dashboard",
      "Detailed product performance insights",
      "Subscription status monitoring",
      "Priority support",
      "Best for growing businesses",
    ],
    highlighted: false,
    badge: "",
    buttonStyle: "outline-dark",
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="pricing-section">
      <div className="container">
        <div className="pricing-heading">
          <div>
            <p className="section-label">PRICING</p>
            <h2>Choose Your Plan</h2>
          </div>

          <p className="pricing-text">
            Select the plan that fits your business needs. Start free and upgrade anytime.
          </p>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.highlighted ? "highlighted" : ""}`}
            >
              {plan.badge && <div className="pricing-badge">{plan.badge}</div>}

              <p className="plan-tier">{plan.tier}</p>
              <h3 className="plan-name">{plan.name}</h3>

              <div className="plan-price-row">
                <span className="plan-price">{plan.price}</span>
                {plan.suffix ? (
                  <span className="plan-suffix">{plan.suffix}</span>
                ) : null}
              </div>

              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={`${plan.name}-${index}`}>
                    <span className="feature-icon">⊚</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`plan-button ${
                  plan.buttonStyle === "gold"
                    ? "plan-button-gold"
                    : plan.buttonStyle === "outline-dark"
                    ? "plan-button-outline-dark"
                    : "plan-button-outline-gold"
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
