import { paymentInfo } from "@/data/payment";

export default function PaymentHero() {
  return (
    <>
      <h1 className="payment-title">{paymentInfo.title}</h1>
      <p className="payment-subtitle">{paymentInfo.subtitle}</p>
    </>
  );
}