import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueAnalytics } from "@/types/domain";

interface TopProductsCardProps {
  analytics: RevenueAnalytics;
}

export function TopProductsCard({ analytics }: TopProductsCardProps) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Top-Performing Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {analytics.topProducts.map((product, index) => (
            <div key={product.name} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{index + 1}. {product.name}</p>
                <p className="text-xs text-slate-500">Revenue contribution</p>
              </div>
              <p className="text-sm font-semibold text-slate-700">${product.revenue.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
