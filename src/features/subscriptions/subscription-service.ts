import { ownerSubscription } from "@/lib/mock-data";
import { Subscription, SubscriptionPlan } from "@/types/domain";

export async function getSubscription(): Promise<Subscription> {
  return ownerSubscription;
}

export async function upgradeSubscription(plan: SubscriptionPlan): Promise<Subscription> {
  return {
    ...ownerSubscription,
    plan,
  };
}
