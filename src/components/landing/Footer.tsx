import Link from "next/link";
import { BrandLogo } from "@/components/shared/brand-logo";

export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-grid">
          {/* Brand */}
          <div className="lp-footer-brand">
            <BrandLogo
              href="/"
              size="sm"
              className="lp-footer-logo"
              iconClassName="rounded-[16px]"
              nameClassName="text-[1.08rem] text-[var(--lp-text)]"
              showSubtitle
              subtitle="Business Analytics"
              subtitleClassName="text-[var(--lp-muted)]"
            />
            <p className="lp-footer-tagline">
              A smart analytics platform built for small business owners who
              want clarity, not complexity.
            </p>
          </div>

          {/* Product */}
          <div className="lp-footer-col">
            <p className="lp-footer-col-title">Product</p>
            <a href="#platform">Platform</a>
            <a href="#solutions">Features</a>
            <a href="#pricing">Pricing</a>
            <Link href="/login">Dashboard</Link>
          </div>

          {/* Resources */}
          <div className="lp-footer-col">
            <p className="lp-footer-col-title">Company</p>
            <Link href="/login">Documentation</Link>
            <Link href="/login">Support</Link>
            <Link href="/login">Changelog</Link>
          </div>

          {/* Legal */}
          <div className="lp-footer-col">
            <p className="lp-footer-col-title">Legal</p>
            <Link href="/signup">Privacy Policy</Link>
            <Link href="/signup">Terms of Service</Link>
            <Link href="/signup">Cookie Policy</Link>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <p className="lp-footer-copy">
            © {new Date().getFullYear()} Syntrix Analysis Platform. All rights reserved.
          </p>
          <div className="lp-footer-legal">
            <Link href="/signup">Privacy</Link>
            <Link href="/signup">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
