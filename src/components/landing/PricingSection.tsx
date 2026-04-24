import Link from "next/link";

const plans = [
  {
    tier: "Starter",
    tierLabel: "Free",
    price: "$0",
    suffix: "/mo",
    desc: "Perfect for new businesses. Get full access to core sales tracking at no cost.",
    features: [
      "1 business profile",
      "Add, edit & delete sales records",
      "Basic revenue overview",
      "Simple dashboard",
      "Search & filter by date and category",
    ],
    action: { label: "Get started free", style: "outline" },
    featured: false,
    badge: null,
  },
  {
    tier: "Growth",
    tierLabel: "Pro",
    price: "$19",
    suffix: "/mo",
    desc: "For growing businesses ready to leverage analytics to make better decisions.",
    features: [
      "Everything in Free",
      "Revenue trends & growth analytics",
      "Top product insights",
      "Export reports as CSV",
      "Voice input via Telegram",
      "Telegram notifications",
    ],
    action: { label: "Start Pro trial", style: "primary" },
    featured: true,
    badge: "Most popular",
  },
  {
    tier: "Scale",
    tierLabel: "Business",
    price: "$49",
    suffix: "/mo",
    desc: "For serious operators who want AI-driven insights and team collaboration.",
    features: [
      "Everything in Pro",
      "AI business insights panel",
      "Predictive revenue forecasting",
      "Deeper operational recommendations",
      "Team member accounts",
      "Priority support",
    ],
    action: { label: "Get Business", style: "outline" },
    featured: false,
    badge: null,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="lp-section lp-section-alt">
      <div className="lp-container">
        <div className="lp-pricing-header">
          <div>
            <p className="lp-section-tag">✦ Pricing</p>
            <h2 className="lp-section-title">Simple, transparent pricing</h2>
            <p className="lp-section-text">
              Start free and upgrade when you&apos;re ready. No hidden fees, no long-term contracts.
            </p>
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--lp-muted)", textAlign: "right" }}>
            <strong style={{ color: "var(--lp-text)" }}>14-day free trial</strong>
            <br />No credit card required
          </div>
        </div>

        <div className="lp-pricing-grid">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`lp-plan${plan.featured ? " featured" : ""}`}
            >
              {plan.badge && (
                <div className="lp-plan-badge">{plan.badge}</div>
              )}

              <p className="lp-plan-tier">{plan.tier}</p>
              <h3 className="lp-plan-name">{plan.tierLabel}</h3>

              <div className="lp-plan-price-row">
                <span className="lp-plan-price">{plan.price}</span>
                <span className="lp-plan-suffix">{plan.suffix}</span>
              </div>

              <p className="lp-plan-desc">{plan.desc}</p>

              <ul className="lp-plan-features">
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <span className="lp-plan-check">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`lp-plan-action ${plan.action.style === "primary" ? "lp-plan-action-primary" : "lp-plan-action-outline"}`}
              >
                {plan.action.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="lp-testimonial-grid" style={{ marginTop: "3.5rem" }}>
          {[
            {
              initials: "KS",
              name: "Kosal Sorn",
              role: "Retail shop owner, Phnom Penh",
              text: "Before Syntrix, I tracked everything in notebooks. Now I can see which products bring the most profit every single day. It changed how I run my store.",
            },
            {
              initials: "LB",
              name: "Linda Breckenridge",
              role: "Food & Beverage, Singapore",
              text: "The voice input feature is a game-changer. I just talk to Telegram after each sale and everything is logged. My accountant loves the reports.",
            },
            {
              initials: "RM",
              name: "Rath Mengly",
              role: "Education services, Cambodia",
              text: "The AI insights helped me notice seasonal revenue dips I never saw before. I adjusted my student intake timing and revenue jumped 22% in one quarter.",
            },
          ].map((t) => (
            <div className="lp-testimonial" key={t.name}>
              <div className="lp-testimonial-stars">
                {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
              </div>
              <p className="lp-testimonial-text">&ldquo;{t.text}&rdquo;</p>
              <div className="lp-testimonial-author">
                <div className="lp-testimonial-avatar">{t.initials}</div>
                <div>
                  <p className="lp-testimonial-name">{t.name}</p>
                  <p className="lp-testimonial-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
