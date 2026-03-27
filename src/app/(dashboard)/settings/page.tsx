import { SettingsPageActions } from "@/components/dashboard/settings-page-actions";
import { SettingsWorkspace } from "@/components/dashboard/settings-workspace";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function SettingsPage() {
  return (
    <div className="dashboard-shell pb-14">
      <TopNavigation items={topNavItems} />

      <div className="dashboard-container mt-10 space-y-7">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="dashboard-title">Settings</h1>
            <p className="dashboard-subtitle mt-2 max-w-2xl">
              Manage your account, business information, and application preferences.
            </p>
          </div>
          <SettingsPageActions />
        </section>

        <SettingsWorkspace />

        <footer className="pt-10 text-center text-sm text-[#98a2b3]">
          © 2026 Syntrix SaaS Platform. All rights reserved. Privacy Policy | Terms of Service
        </footer>
      </div>
    </div>
  );
}
