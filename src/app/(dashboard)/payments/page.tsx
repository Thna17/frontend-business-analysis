import { Suspense } from "react";
import PaymentsPageClient from "@/components/payments/PaymentsPageClient";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function PaymentsPage() {
  return (
    <main className="payments-page">
      <TopNavigation items={topNavItems} />
      <Suspense
        fallback={
          <div className="dashboard-container mt-10 flex items-center justify-center py-24">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#d4af35] border-t-transparent" />
              <p className="text-sm text-[#667085]">Loading checkout...</p>
            </div>
          </div>
        }
      >
        <PaymentsPageClient />
      </Suspense>
    </main>
  );
}
