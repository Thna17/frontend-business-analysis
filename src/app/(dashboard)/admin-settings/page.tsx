"use client";

import { AdminSettingsWorkspace } from "@/components/dashboard/admin-settings-workspace";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { Button } from "@/components/ui/button";
import { adminTopNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function AdminSettingsPage() {
  return (
    <div className="dashboard-shell pb-14">
      <TopNavigation
        items={adminTopNavItems}
        settingsHref="/admin-settings"
        profileHref="/admin/profile"
        notificationHref="/admin/notification"
        notificationCount={1}
      />

      <div className="dashboard-container mt-10 space-y-7">
        <section className="flex items-center justify-end">
          <Button
            className="h-11 rounded-full bg-[#d4af35] px-6 text-sm font-semibold text-[#1f2937] hover:bg-[#c9a62f]"
            onClick={() => window.dispatchEvent(new Event("admin-settings:save"))}
          >
            Save Changes
          </Button>
        </section>

        <AdminSettingsWorkspace />

        <footer className="pt-10 text-center text-sm text-[#98a2b3]">
          © 2026 Syntrix Admin Platform. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
