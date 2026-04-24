import { type ReactNode } from "react";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function SettingsSection({
  title,
  description,
  icon,
  action,
  children,
  className,
  bodyClassName,
}: SettingsSectionProps) {
  return (
    <DashboardPanel
      title={title}
      description={description}
      action={action}
      className={className}
      bodyClassName={bodyClassName}
      headerClassName="settings-section-header"
    >
      {icon ? (
        <div className="mb-4 inline-flex items-center gap-2 text-primary">
          {icon}
        </div>
      ) : null}
      {children}
    </DashboardPanel>
  );
}
