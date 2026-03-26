import { paymentInfo } from "@/data/payment";

export default function PaymentQRCard() {
  return (
    <>
      <div className="qr-card">
        <img
          src={paymentInfo.qrImage}
          alt="QR Code Payment"
          className="qr-image"
        />
      </div>

      <div className="payment-status-pill">
        <span className="status-dot-gold" />
        {paymentInfo.status}
      </div>

      <div className="payment-methods">
        {paymentInfo.methods.map((method) => (
          <span key={method}>{method}</span>
        ))}
      </div>
    </>
  );
}