import Link from "next/link";

export default function CTASection() {
  return (
    <section className="lp-cta">
      <div className="lp-container">
        <div className="lp-cta-inner">
          <div style={{ position: "relative", zIndex: 1 }}>
            <p className="lp-cta-label">✦ Get started today</p>
            <h2 className="lp-cta-title">
              Your business clarity<br />
              starts right now.
            </h2>
            <p className="lp-cta-sub">
              Join hundreds of business owners who use Syntrix to make faster
              decisions, spot opportunities, and grow with confidence — not guesswork.
            </p>
          </div>

          <div className="lp-cta-actions" style={{ position: "relative", zIndex: 1 }}>
            <Link href="/signup" className="lp-btn lp-btn-primary lp-btn-lg">
              Start for free →
            </Link>
            <p className="lp-cta-note">No credit card required</p>
          </div>
        </div>
      </div>
    </section>
  );
}
