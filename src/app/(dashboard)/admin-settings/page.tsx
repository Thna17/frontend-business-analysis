"use client";

import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { AdminSettingsWorkspace } from "@/components/dashboard/admin-settings-workspace";
import { Button } from "@/components/ui/button";

// Admin settings page entrypoint for platform controls and branding.
export default function AdminSettingsPage() {
  return (
    <DashboardPage
      header={
        <section className="flex items-center justify-end">
          <Button
            className="px-6"
            onClick={() => window.dispatchEvent(new Event("admin-settings:save"))}
          >
            Save Changes
          </Button>
        </section>
      }
      footer="© 2026 Syntrix Admin Platform. All rights reserved."
    >
      <AdminSettingsWorkspace />
    </DashboardPage>
  );
}
