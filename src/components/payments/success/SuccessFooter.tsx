import { BrandLogo } from "@/components/shared/brand-logo";
import { paymentSuccessFooter } from "@/data/payment-success";

export default function SuccessFooter() {
  return (
    <footer className="payment-success-footer">
      <div className="payment-success-footer-left">
        <BrandLogo
          href="/"
          size="sm"
          className="payment-success-footer-brand"
          iconClassName="rounded-[14px]"
          nameClassName="text-[1rem] text-foreground"
        />
        <p>{paymentSuccessFooter.copyright}</p>
      </div>

      <div className="payment-success-footer-links">
        {paymentSuccessFooter.links.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
