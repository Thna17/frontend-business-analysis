export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <h3>Syntrix</h3>
          <p>
            High-fidelity business analysis for institutional-grade decision
            making.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Product</h4>
            <a href="#">Platform</a>
            <a href="#">Security</a>
            <a href="#">Pricing</a>
          </div>

          <div>
            <h4>Resources</h4>
            <a href="#">Documentation</a>
            <a href="#">Support</a>
            <a href="#">API Reference</a>
          </div>

          <div>
            <h4>Company</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Compliance</a>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2024 SYNTRIX ANALYSIS PLATFORM. ALL RIGHTS RESERVED.</p>
        <p>◉ GLOBAL ENGLISH</p>
      </div>
    </footer>
  );
}