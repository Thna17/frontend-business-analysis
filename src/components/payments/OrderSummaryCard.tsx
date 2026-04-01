import Link from "next/link";
import { Lock } from "lucide-react";
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

      <Link href="/payments/success" className="subscribe-btn">
        {orderSummary.buttonText}
      </Link>

      <p className="summary-note">{orderSummary.note}</p>

      <div className="summary-security">
        <Lock className="size-3.5" />
        {orderSummary.securityText}
      </div>
    </div>
  );
}
