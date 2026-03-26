import TransactionDetails from "@/components/payments/success/TransactionDetails";
import { paymentSuccessInfo } from "@/data/payment-success";

export default function SuccessCard() {
  return (
    <div className="payment-success-card">
      <div className="success-icon-wrap">
        <div className="success-icon-circle">
          <span>✓</span>
        </div>
      </div>

      <h1 className="payment-success-title">{paymentSuccessInfo.title}</h1>

      <p className="payment-success-description">
        {paymentSuccessInfo.description}
      </p>

      <TransactionDetails />

      <div className="payment-success-actions">
        <a
          href={paymentSuccessInfo.primaryButtonHref}
          className="success-primary-btn"
        >
          {paymentSuccessInfo.primaryButtonText}
        </a>

        <button className="success-secondary-btn">
          {paymentSuccessInfo.secondaryButtonText}
        </button>
      </div>

      <p className="payment-success-help">
        {paymentSuccessInfo.helpText}{" "}
        <a href={paymentSuccessInfo.helpLinkHref}>
          {paymentSuccessInfo.helpLinkText}
        </a>
      </p>
    </div>
  );
}