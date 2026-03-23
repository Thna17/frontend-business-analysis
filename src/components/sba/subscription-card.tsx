import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Subscription, SubscriptionPlan } from "@/types/domain";

interface SubscriptionCardProps {
  subscription: Subscription;
}

const plans: SubscriptionPlan[] = ["FREE", "PRO", "BUSINESS"];

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Subscription Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between rounded-lg border border-cyan-100 bg-cyan-50 p-3">
          <div>
            <p className="text-xs text-cyan-700">Current Plan</p>
            <p className="text-sm font-semibold text-cyan-900">{subscription.plan}</p>
          </div>
          <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">{subscription.status}</Badge>
        </div>
        <p className="mb-3 text-xs text-slate-500">Renew date: {subscription.renewDate}</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan} className="rounded-lg border bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-900">{plan}</p>
              <p className="mb-2 text-xs text-slate-500">Plan for SaaS users</p>
              <Button variant={plan === subscription.plan ? "secondary" : "outline"} size="sm" className="w-full">
                {plan === subscription.plan ? (
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Active
                  </span>
                ) : (
                  "Upgrade"
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-slate-500">Connect ABA PayWay API when backend is ready.</p>
      </CardFooter>
    </Card>
  );
}
