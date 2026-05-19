import { NotificationCenter } from "@/components/dashboard/notification-center";

// Admin notification page entrypoint for platform inbox management.
export default function AdminNotificationPage() {
  return (
    <NotificationCenter
      title="Notifications"
      footerText="(c) 2026 Syntrix Admin Platform. All rights reserved."
    />
  );
}
