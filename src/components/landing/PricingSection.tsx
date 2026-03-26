const pricingPlans = [
  {
    tier: "TIER I",
    name: "Foundation",
    price: "$2,400",
    suffix: "/mo",
    features: [
      "AI Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
    ],
    highlighted: false,
    badge: "",
    buttonStyle: "outline-gold",
  },
  {
    tier: "TIER II",
    name: "Enterprise",
    price: "$8,500",
    suffix: "/mo",
    features: [
      "All Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
    ],
    highlighted: true,
    badge: "RECOMMENDED",
    buttonStyle: "gold",
  },
  {
    tier: "TIER III",
    name: "Institutional",
    price: "Custom",
    suffix: "",
    features: [
      "All Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
      "AI Foundation Features",
    ],
    highlighted: false,
    badge: "",
    buttonStyle: "outline-dark",
  },
];

export default function PricingSection() {
  return (
    <section className="pricing-section">
      <div className="container">
        <div className="pricing-heading">
          <div>
            <p className="section-label">INVESTMENT TIERS</p>
            <h2>Capital Allocation</h2>
          </div>

          <p className="pricing-text">
            Select the tier that aligns with your institutional scope. All
            packages include our core architectural backbone.
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