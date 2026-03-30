export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container hero-grid">
        <div className="hero-content fade-up">
          <div className="eyebrow-pill">● SYNTRIX ACTIVE</div>

          <h1 className="hero-title">
            Strategic
            <br />
            Intelligence
            <br />
            <span>for Visionaries.</span>
          </h1>

          <p className="hero-description">
            The elite business analysis platform designed for decision makers
            who demand precision. Transform raw enterprise data into predictive
            foresight with architectural clarity.
          </p>

          <div className="hero-actions">
            <a href="#" className="primary-btn">
              Secure Access <span>→</span>
            </a>
            <a href="#" className="secondary-btn">
              Request Audit
            </a>
          </div>
        </div>

        <div className="hero-visual fade-up delay-1">
          <div className="mockup-card">
            <div className="mockup-topbar">
              <span className="dot pink"></span>
              <span className="dot beige"></span>
              <span className="dot gray"></span>
            </div>

            <div className="mockup-body">
              <div className="mockup-left">
                <div className="mockup-line long"></div>
                <div className="mockup-line short"></div>
                <div className="mockup-card-small"></div>
              </div>

              <div className="mockup-center">
                <div className="mockup-panel panel-top"></div>
                <div className="mockup-panel panel-bottom"></div>
              </div>

              <div className="mockup-right">
                <div className="mockup-panel panel-top"></div>

                <div className="chart-box">
                  <div className="bar bar-1"></div>
                  <div className="bar bar-2"></div>
                  <div className="bar bar-3"></div>
                  <div className="bar bar-4"></div>
                  <div className="bar bar-5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}