import { NotificationCenter } from "@/components/dashboard/notification-center";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";

export default function OwnerNotificationPage() {
  return (
    <NotificationCenter
      navItems={topNavItems}
      settingsHref="/settings"
      profileHref="/profile"
      notificationHref="/notification"
      title="Notifications"
      footerText="(c) 2026 Syntrix SaaS Platform. All rights reserved."
    />
  );
}
