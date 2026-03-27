import { paymentSuccessFooter } from "@/data/payment-success";

export default function SuccessFooter() {
  return (
    <footer className="payment-success-footer">
      <div className="payment-success-footer-left">
        <h3>{paymentSuccessFooter.brand}</h3>
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