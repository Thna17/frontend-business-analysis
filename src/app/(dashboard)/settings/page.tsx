import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { SettingsPageActions } from "@/components/dashboard/settings-page-actions";
import { SettingsWorkspace } from "@/components/dashboard/settings-workspace";

export default function SettingsPage() {
  return (
    <DashboardPage
      title="Settings"
      description="Manage your account, business information, and application preferences."
      actions={<SettingsPageActions />}
      footer="© 2026 Syntrix SaaS Platform. All rights reserved. Privacy Policy | Terms of Service"
    >
      <SettingsWorkspace />
    </DashboardPage>
  );
}
