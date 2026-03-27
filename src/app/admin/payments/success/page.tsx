import AdminTopNav from "@/components/admin/AdminTopNav";
import SuccessCard from "@/components/payments/success/SuccessCard";
import SuccessFooter from "@/components/payments/success/SuccessFooter";

export default function PaymentSuccessPage() {
  return (
    <main className="payment-success-page">
      <div className="admin-shell">
        <AdminTopNav />

        <section className="payment-success-section">
          <SuccessCard />
        </section>

        <SuccessFooter />
      </div>
    </main>
  );
}