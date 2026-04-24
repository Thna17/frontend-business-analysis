import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RankingItem } from "@/features/owner-dashboard/dashboard-mock";
import { EmptyState } from "@/components/shared/empty-state";

interface ProductRankingCardProps {
  items: RankingItem[];
}

export function ProductRankingCard({ items }: ProductRankingCardProps) {
  return (
    <Card className="dashboard-surface dashboard-surface-hover h-full shadow-none">
      <CardHeader className="px-7 pb-2 pt-7">
        <CardTitle className="dashboard-section-title">
          Product Revenue Ranking
        </CardTitle>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Top performers are highlighted to help you spot durable revenue leaders, not just one-off spikes.
        </p>
      </CardHeader>
      <CardContent className="space-y-5 px-7 pb-8 pt-4">
        {items.map((item, index) => (
          <div key={item.name} className="dashboard-soft-tile">
            <div className="mb-3 flex items-center justify-between gap-3 text-lg">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{item.name}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Rank {index + 1}
                </p>
              </div>
              <span className="shrink-0 font-medium text-primary">${item.value.toLocaleString()}</span>
            </div>
            <div className="h-3 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${item.width}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{item.width}% of the current ranking benchmark.</p>
          </div>
        ))}
        {items.length === 0 ? (
          <EmptyState
            title="Ranking appears once product revenue settles"
            description="Add a few product sales and this panel will start surfacing the products that consistently drive revenue."
          />
        ) : null}
      </CardContent>
    </Card>
  );
}
