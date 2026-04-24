const features = [
  {
    icon: "📊",
    title: "Real-time Sales Tracking",
    desc: "Log every sale instantly and watch your revenue dashboard update live. Know exactly where your money is coming from.",
  },
  {
    icon: "📦",
    title: "Product Performance",
    desc: "See which products are your top performers and which ones to phase out. Make data-driven inventory decisions.",
  },
  {
    icon: "🎙️",
    title: "Voice-first Input",
    desc: "Record sales by voice using Telegram. Just speak naturally and Syntrix does the rest — perfect for on-the-go owners.",
  },
  {
    icon: "📈",
    title: "Growth Analytics",
    desc: "Track revenue trends, customer growth, and conversion rates with easy-to-read charts that actually make sense.",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    desc: "Get Telegram alerts for key business events so you're always informed, even when you're away from the dashboard.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Insights",
    desc: "Business tier users get predictive revenue outlooks and actionable AI recommendations tailored to their data.",
  },
];

const steps = [
  {
    num: "1",
    title: "Create your account",
    desc: "Sign up in seconds. Add your business profile and you're ready to start tracking.",
  },
  {
    num: "2",
    title: "Log your sales",
    desc: "Add sales manually, in bulk, or by voice. Every record automatically updates your analytics.",
  },
  {
    num: "3",
    title: "Watch your business grow",
    desc: "Use insights and reports to make smarter decisions and spot growth opportunities early.",
  },
];

export default function CompetencySection() {
  return (
    <>
      {/* Features */}
      <section id="solutions" className="lp-section lp-section-alt">
        <div className="lp-container">
          <div style={{ maxWidth: 580 }}>
            <p className="lp-section-tag">✦ Features</p>
            <h2 className="lp-section-title">
              Everything you need to run your business smarter
            </h2>
            <p className="lp-section-text">
              Syntrix is built specifically for small business owners — not enterprise software adapted down. Every feature is designed around how you actually work.
            </p>
          </div>

          <div className="lp-features-grid">
            {features.map((f) => (
              <div className="lp-feature-card" key={f.title}>
                <div className="lp-feature-icon">{f.icon}</div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="lp-stats">
        <div className="lp-stat">
          <div className="lp-stat-value"><em>200+</em></div>
          <p className="lp-stat-label">Business owners</p>
        </div>
        <div className="lp-stat">
          <div className="lp-stat-value"><em>$2M+</em></div>
          <p className="lp-stat-label">Revenue tracked</p>
        </div>
        <div className="lp-stat">
          <div className="lp-stat-value"><em>98%</em></div>
          <p className="lp-stat-label">Uptime SLA</p>
        </div>
        <div className="lp-stat">
          <div className="lp-stat-value"><em>4.9 ★</em></div>
          <p className="lp-stat-label">User satisfaction</p>
        </div>
      </div>

      {/* How it works */}
      <section className="lp-section">
        <div className="lp-container">
          <div style={{ textAlign: "center", maxWidth: 500, marginInline: "auto" }}>
            <p className="lp-section-tag">✦ How it works</p>
            <h2 className="lp-section-title">Up and running in minutes</h2>
          </div>

          <div className="lp-steps">
            {steps.map((s) => (
              <div className="lp-step" key={s.num}>
                <div className="lp-step-num">{s.num}</div>
                <div className="lp-step-body">
                  <h3 className="lp-step-title">{s.title}</h3>
                  <p className="lp-step-desc">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
