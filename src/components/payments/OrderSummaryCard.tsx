import { orderSummary } from "@/data/payment";

export default function OrderSummaryCard() {
  return (
    <div className="order-summary-card">
      <h2>{orderSummary.title}</h2>

      <div className="summary-row summary-plan">
        <div>
          <h3>{orderSummary.planName}</h3>
          <p>{orderSummary.description}</p>
        </div>
        <span>{orderSummary.price}</span>
      </div>

      <div className="summary-row">
        <span>Tax</span>
        <span>{orderSummary.tax}</span>
      </div>

      <div className="summary-divider" />

      <div className="summary-total">
        <div>
          <p>Total</p>
        </div>

        <div className="summary-total-price">
          <h3>{orderSummary.total}</h3>
          <span>{orderSummary.totalLabel}</span>
        </div>
      </div>

      <button className="subscribe-btn">{orderSummary.buttonText}</button>

      <p className="summary-note">{orderSummary.note}</p>

      <div className="summary-security">
        <span>🔒</span>
        {orderSummary.securityText}
      </div>
    </div>
  );
}