import { NotificationCenter } from "@/components/dashboard/notification-center";
import { adminTopNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function AdminNotificationPage() {
  return (
    <NotificationCenter
      navItems={adminTopNavItems}
      settingsHref="/admin-settings"
      profileHref="/admin/profile"
      notificationHref="/admin/notification"
      title="Notifications"
      footerText="(c) 2026 Syntrix Admin Platform. All rights reserved."
    />
  );
}
