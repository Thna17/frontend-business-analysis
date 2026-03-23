import { ownerAnalytics } from "@/lib/mock-data";
import { RevenueAnalytics } from "@/types/domain";

export async function getRevenueAnalytics(): Promise<RevenueAnalytics> {
  return ownerAnalytics;
}
