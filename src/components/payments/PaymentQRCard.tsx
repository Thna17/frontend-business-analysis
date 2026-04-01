import Image from "next/image";
import { paymentInfo } from "@/data/payment";

export default function PaymentQRCard() {
  return (
    <div className="payment-qr-wrap">
      <div className="qr-card">
        <p className="qr-card-label">KHQR / ABA PAY</p>
        <Image
          src={paymentInfo.qrImage}
          alt="QR Code Payment"
          className="qr-image"
          width={230}
          height={230}
          unoptimized
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
    </div>
  );
}
