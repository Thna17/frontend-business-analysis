import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueAnalytics } from "@/types/domain";

interface RevenueAnalyticsCardProps {
  analytics: RevenueAnalytics;
}

export function RevenueAnalyticsCard({ analytics }: RevenueAnalyticsCardProps) {
  const max = Math.max(...analytics.monthlyComparison.map((item) => item.amount));

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Monthly Revenue Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {analytics.monthlyComparison.map((item) => {
          const width = `${Math.round((item.amount / max) * 100)}%`;
          return (
            <div key={item.month}>
              <div className="mb-1 flex items-center justify-between text-sm text-slate-600">
                <span>{item.month}</span>
                <span>${item.amount.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-cyan-600" style={{ width }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
