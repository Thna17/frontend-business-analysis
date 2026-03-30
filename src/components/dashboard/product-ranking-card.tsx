import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RankingItem } from "@/features/owner-dashboard/dashboard-mock";

interface ProductRankingCardProps {
  items: RankingItem[];
}

export function ProductRankingCard({ items }: ProductRankingCardProps) {
  return (
    <Card className="dashboard-surface h-full border-[#e7e9ee] shadow-none">
      <CardHeader className="px-7 pt-7 pb-2">
        <CardTitle className="dashboard-section-title">
          Product Revenue Ranking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 px-7 pb-8 pt-4">
        {items.map((item, index) => (
          <div key={item.name}>
            <div className="mb-2 flex items-center justify-between text-lg">
              <span className="font-medium text-[#344054]">{item.name}</span>
              <span className="font-medium text-[#d4af35]">${item.value.toLocaleString()}</span>
            </div>
            <div className="h-4 rounded-full bg-[#eceff3]">
              <div
                className="h-full rounded-full bg-[#d4af35]"
                style={{ width: `${item.width}%`, opacity: 1 - index * 0.17 }}
              />
            </div>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="text-sm text-[#98a2b3]">No product ranking data yet.</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
