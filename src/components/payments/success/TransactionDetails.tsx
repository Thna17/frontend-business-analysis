import { transactionDetails } from "@/data/payment-success";

export default function TransactionDetails() {
  return (
    <div className="transaction-card">
      <p className="transaction-label">{transactionDetails.label}</p>

      <div className="transaction-row">
        <span>Plan</span>
        <strong>{transactionDetails.plan}</strong>
      </div>

      <div className="transaction-divider" />

      <div className="transaction-row">
        <span>Amount</span>
        <strong>{transactionDetails.amount}</strong>
      </div>

      <div className="transaction-divider" />

      <div className="transaction-row">
        <span>Date</span>
        <strong>{transactionDetails.date}</strong>
      </div>

      <div className="transaction-divider" />

      <div className="transaction-row">
        <span>Status</span>
        <span className="paid-badge">
          <span className="paid-badge-dot" />
          {transactionDetails.status}
        </span>
      </div>
    </div>
  );
}
