import { adminMetrics, recentUsers } from "@/lib/mock-data";
import { AdminMetrics, User } from "@/types/domain";

export async function getAdminMetrics(): Promise<AdminMetrics> {
  return adminMetrics;
}

export async function getRecentUsers(): Promise<User[]> {
  return recentUsers;
}
