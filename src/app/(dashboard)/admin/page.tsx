import { Activity, CreditCard, UserCog, Users } from "lucide-react";
import { RecentUsersCard } from "@/components/sba/recent-users-card";
import { StatCard } from "@/components/sba/stat-card";
import { getAdminMetrics, getRecentUsers } from "@/features/admin/admin-service";

export default async function AdminDashboardPage() {
  const [metrics, users] = await Promise.all([getAdminMetrics(), getRecentUsers()]);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-white/90 p-5">
        <p className="text-xs font-semibold tracking-[0.15em] text-amber-700 uppercase">
          Administrator Dashboard
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Platform Monitoring and User Management
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Monitor subscriptions, platform usage, and user account growth.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={metrics.totalUsers.toString()} hint="Registered accounts" icon={Users} />
        <StatCard
          title="Active Subscriptions"
          value={metrics.activeSubscriptions.toString()}
          hint="Paid + active"
          icon={CreditCard}
        />
        <StatCard
          title="Usage Rate"
          value={`${metrics.platformUsageRate}%`}
          hint="Monthly active ratio"
          icon={Activity}
        />
        <StatCard
          title="New Users"
          value={metrics.newUsersThisMonth.toString()}
          hint="This month"
          icon={UserCog}
        />
      </section>

      <RecentUsersCard users={users} />
    </div>
  );
}
