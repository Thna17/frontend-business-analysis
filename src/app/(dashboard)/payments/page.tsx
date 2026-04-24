import { Suspense } from "react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import PaymentsPageClient from "@/components/payments/PaymentsPageClient";

export default function PaymentsPage() {
  return (
    <DashboardPage footer={false}>
      <Suspense
        fallback={
          <div className="dashboard-container mt-10 flex items-center justify-center py-24">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading checkout...</p>
            </div>
          </div>
        }
      >
        <PaymentsPageClient />
      </Suspense>
    </DashboardPage>
  );
}
