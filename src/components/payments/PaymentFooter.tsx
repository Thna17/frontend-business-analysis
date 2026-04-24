import { BrandLogo } from "@/components/shared/brand-logo";

export default function PaymentFooter() {
  return (
    <footer className="payment-footer">
      <BrandLogo
        href="/"
        size="sm"
        className="payment-footer-brand"
        iconClassName="rounded-[14px]"
        nameClassName="text-[1rem] text-foreground"
      />

      <div className="payment-footer-links">
        <a href="#">Terms of Service</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Refund Policy</a>
        <a href="#">Contact Support</a>
      </div>

      <div className="payment-footer-copy">(c) 2026 Syntrix Gold Business Systems. All rights reserved.</div>
    </footer>
  );
}
