import AdminTopNav from "@/components/admin/AdminTopNav";
import PaymentQRCard from "@/components/payments/PaymentQRCard";
import OrderSummaryCard from "@/components/payments/OrderSummaryCard";
import PaymentFooter from "@/components/payments/PaymentFooter";

export default function PaymentsPage() {
  return (
    <main className="payments-page">
      <div className="admin-shell">
        <AdminTopNav />

        <section className="payment-content">
          <div className="payment-left">
            <PaymentQRCard />
          </div>

          <div className="payment-right">
            <OrderSummaryCard />
          </div>
        </section>

        <PaymentFooter />
      </div>
    </main>
  );
}