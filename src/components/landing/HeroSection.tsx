import Link from "next/link";

export default function HeroSection() {
  return (
    <section id="platform" className="lp-hero">
      <div className="lp-container">
        <div className="lp-hero-inner">

          {/* Left — Copy */}
          <div className="lp-animate">
            <div className="lp-eyebrow">
              <span className="lp-eyebrow-dot" />
              Built for small business owners
            </div>

            <h1 className="lp-hero-title">
              Track sales,<br />
              grow with<br />
              <em>confidence.</em>
            </h1>

            <p className="lp-hero-desc">
              Syntrix gives you a clear view of your revenue, products, and business
              performance — all in one place. No spreadsheets. No guesswork.
            </p>

            <div className="lp-hero-actions">
              <Link href="/signup" className="lp-btn lp-btn-primary lp-btn-lg">
                Start for free
                <span aria-hidden>→</span>
              </Link>
              <Link href="#solutions" className="lp-btn lp-btn-ghost lp-btn-lg">
                See how it works
              </Link>
            </div>

            <div className="lp-hero-trust">
              <div className="lp-hero-trust-avatars">
                <span>JT</span>
                <span>SK</span>
                <span>AN</span>
                <span>RB</span>
              </div>
              <span>Trusted by 200+ business owners</span>
            </div>
          </div>

          {/* Right — Dashboard preview */}
          <div className="lp-hero-visual lp-animate lp-delay-1">
            <div className="lp-dashboard-preview">
              {/* Browser bar */}
              <div className="lp-dp-topbar">
                <span className="lp-dp-dot" />
                <span className="lp-dp-dot" />
                <span className="lp-dp-dot" />
                <div className="lp-dp-url" />
              </div>

              {/* Dashboard body */}
              <div className="lp-dp-body">
                {/* KPI row */}
                <div className="lp-dp-kpis">
                  <div className="lp-dp-kpi featured">
                    <div className="lp-dp-kpi-label" />
                    <div className="lp-dp-kpi-value" />
                  </div>
                  <div className="lp-dp-kpi">
                    <div className="lp-dp-kpi-label" />
                    <div className="lp-dp-kpi-value" />
                  </div>
                  <div className="lp-dp-kpi">
                    <div className="lp-dp-kpi-label" />
                    <div className="lp-dp-kpi-value" />
                  </div>
                </div>

                {/* Chart */}
                <div className="lp-dp-chart">
                  <div className="lp-dp-bar" style={{ height: "40%" }} />
                  <div className="lp-dp-bar" style={{ height: "60%" }} />
                  <div className="lp-dp-bar" style={{ height: "50%" }} />
                  <div className="lp-dp-bar accent" style={{ height: "82%" }} />
                  <div className="lp-dp-bar" style={{ height: "70%" }} />
                  <div className="lp-dp-bar accent" style={{ height: "92%" }} />
                  <div className="lp-dp-bar" style={{ height: "65%" }} />
                  <div className="lp-dp-bar" style={{ height: "78%" }} />
                </div>

                {/* Rows */}
                <div className="lp-dp-rows">
                  <div className="lp-dp-row" />
                  <div className="lp-dp-row" />
                  <div className="lp-dp-row" />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="lp-hero-badge">
              <div className="lp-hero-badge-icon">📈</div>
              <div>
                <strong>Revenue up 28%</strong>
                <span className="lp-hero-badge-sub">vs last month</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Logos strip */}
      <div className="lp-logos" style={{ marginTop: "clamp(3rem, 6vw, 5rem)" }}>
        <div className="lp-container">
          <div className="lp-logos-inner">
            <span className="lp-logos-label">Trusted by teams at</span>
            <span className="lp-logo-item">RetailHub</span>
            <span className="lp-logo-item">FoodCo</span>
            <span className="lp-logo-item">EduSmart</span>
            <span className="lp-logo-item">StyleBridge</span>
            <span className="lp-logo-item">MarketLane</span>
          </div>
        </div>
      </div>
    </section>
  );
}
