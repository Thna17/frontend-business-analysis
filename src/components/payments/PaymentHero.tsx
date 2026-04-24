import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { paymentInfo } from "@/data/payment";

export default function PaymentHero() {
  return (
    <section className="payment-hero">
      <Link href="/subscriptions" className="payment-back-link">
        <ChevronLeft className="size-4" />
        Back to subscriptions
      </Link>

      <div className="payment-hero-badge">Secure Checkout</div>
      <h1 className="payment-title">{paymentInfo.title}</h1>
      <p className="payment-subtitle">{paymentInfo.subtitle}</p>
    </section>
  );
}
