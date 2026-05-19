"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  CircleCheck,
  KeyRound,
  Shield,
  Trash2,
  TriangleAlert,
  User,
  Users,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { SettingsSection } from "@/components/dashboard/settings-section";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PageSummaryStrip } from "@/components/shared/page-summary-strip";
import { DashboardDataTable } from "@/components/shared/dashboard-data-table";
import { StateMessage } from "@/components/shared/state-message";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useChangePasswordMutation,
  useGetSettingsDashboardQuery,
  useGetTeamWorkspaceQuery,
  useCreateTeamMemberMutation,
  useDeleteTeamMemberMutation,
  useRequestAccountDeactivationMutation,
  useRequestAccountDeletionMutation,
  useUpdateSettingsAccountMutation,
  useUpdateSettingsBusinessMutation,
  useUpdateSettingsNotificationsMutation,
  useUpdateSettingsPreferencesMutation,
  useUpdateSettingsSecurityMutation,
} from "@/store/api";
import { selectCurrentUser } from "@/store/slices/authSlice";

function currencyCode(label: string): string {
  if (!label) return "USD";
  const match = label.match(/[A-Z]{3}/);
  return match?.[0] ?? "USD";
}

function humanRole(role: string): string {
  if (role === "business_owner") return "Business Owner";
  if (role === "business_member") return "Team Member";
  if (role === "admin") return "Administrator";
  return role;
}

const BUSINESS_TYPE_OPTIONS = [
  "Software as a Service",
  "Retail",
  "Food & Beverage",
  "Education",
] as const;

// Settings workspace groups account, profile, business, notification, and security forms.
export function SettingsWorkspace() {
  const currentUser = useSelector(selectCurrentUser);
  const isPrimaryOwner = currentUser?.role === "business_owner";
  const [teamDraft, setTeamDraft] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [accountDraft, setAccountDraft] = useState<{
    fullName?: string;
    phone?: string;
  }>({});
  const [businessDraft, setBusinessDraft] = useState<{
    name?: string;
    type?: string;
    website?: string;
    address?: string;
    description?: string;
    currency?: string;
  }>({});
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: undefined as boolean | undefined,
  });
  const [notificationsDraft, setNotificationsDraft] = useState<{
    emailNotifications?: boolean;
    salesAlerts?: boolean;
    weeklyReports?: boolean;
    productUpdates?: boolean;
  }>({});
  const [preferencesDraft, setPreferencesDraft] = useState<{
    language?: string;
    timezone?: string;
    dateFormat?: string;
    currency?: string;
  }>({});

  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [inlineStatus, setInlineStatus] = useState<{ tone: "success" | "danger" | "info"; message: string } | null>(null);

  const { data, isLoading, isFetching } = useGetSettingsDashboardQuery();
  const { data: teamData, isFetching: isTeamFetching } = useGetTeamWorkspaceQuery();

  const [updateAccount, { isLoading: isSavingAccount }] = useUpdateSettingsAccountMutation();
  const [updateBusiness, { isLoading: isSavingBusiness }] = useUpdateSettingsBusinessMutation();
  const [updateNotifications, { isLoading: isSavingNotifications }] = useUpdateSettingsNotificationsMutation();
  const [updatePreferences, { isLoading: isSavingPreferences }] = useUpdateSettingsPreferencesMutation();
  const [updateSecurity, { isLoading: isSavingSecurity }] = useUpdateSettingsSecurityMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [requestDeactivation, { isLoading: isRequestingDeactivate }] = useRequestAccountDeactivationMutation();
  const [requestDeletion, { isLoading: isRequestingDeletion }] = useRequestAccountDeletionMutation();
  const [createTeamMember, { isLoading: isCreatingTeamMember }] = useCreateTeamMemberMutation();
  const [deleteTeamMember, { isLoading: isDeletingTeamMember }] = useDeleteTeamMemberMutation();

  const account = useMemo(() => ({
    fullName: accountDraft.fullName ?? data?.account.fullName ?? "",
    email: data?.account.email ?? "",
    phone: accountDraft.phone ?? data?.account.phone ?? "",
    role: humanRole(data?.account.role ?? ""),
  }), [accountDraft.fullName, accountDraft.phone, data?.account.email, data?.account.fullName, data?.account.phone, data?.account.role]);
  const business = useMemo(() => ({
    name: businessDraft.name ?? data?.business.name ?? "",
    type: businessDraft.type ?? data?.business.type ?? "Software as a Service",
    website: businessDraft.website ?? data?.business.website ?? "",
    address: businessDraft.address ?? data?.business.address ?? "",
    description: businessDraft.description ?? data?.business.description ?? "",
    currency: businessDraft.currency ?? data?.business.currency ?? "USD",
  }), [
    businessDraft.address,
    businessDraft.currency,
    businessDraft.description,
    businessDraft.name,
    businessDraft.type,
    businessDraft.website,
    data?.business.address,
    data?.business.currency,
    data?.business.description,
    data?.business.name,
    data?.business.type,
    data?.business.website,
  ]);
  const notifications = useMemo(() => ({
    emailNotifications: notificationsDraft.emailNotifications ?? data?.notifications.emailNotifications ?? true,
    salesAlerts: notificationsDraft.salesAlerts ?? data?.notifications.salesAlerts ?? true,
    weeklyReports: notificationsDraft.weeklyReports ?? data?.notifications.weeklyReports ?? false,
    productUpdates: notificationsDraft.productUpdates ?? data?.notifications.productUpdates ?? true,
  }), [
    data?.notifications.emailNotifications,
    data?.notifications.productUpdates,
    data?.notifications.salesAlerts,
    data?.notifications.weeklyReports,
    notificationsDraft.emailNotifications,
    notificationsDraft.productUpdates,
    notificationsDraft.salesAlerts,
    notificationsDraft.weeklyReports,
  ]);
  const preferences = useMemo(() => ({
    language: preferencesDraft.language ?? data?.preferences.language ?? "English (US)",
    timezone: preferencesDraft.timezone ?? data?.preferences.timezone ?? "GMT+7 (Indochina Time)",
    dateFormat: preferencesDraft.dateFormat ?? data?.preferences.dateFormat ?? "MM/DD/YYYY",
    currency: preferencesDraft.currency ?? data?.preferences.currency ?? "USD ($)",
  }), [
    data?.preferences.currency,
    data?.preferences.dateFormat,
    data?.preferences.language,
    data?.preferences.timezone,
    preferencesDraft.currency,
    preferencesDraft.dateFormat,
    preferencesDraft.language,
    preferencesDraft.timezone,
  ]);
  const twoFactorEnabled = security.twoFactorEnabled ?? data?.security.twoFactorEnabled ?? false;
  const businessTypeOptions = useMemo(() => {
    const currentType = business.type.trim();
    if (!currentType) {
      return [...BUSINESS_TYPE_OPTIONS];
    }
    if (BUSINESS_TYPE_OPTIONS.includes(currentType as (typeof BUSINESS_TYPE_OPTIONS)[number])) {
      return [...BUSINESS_TYPE_OPTIONS];
    }
    return [currentType, ...BUSINESS_TYPE_OPTIONS];
  }, [business.type]);

  const isBusy = isFetching
    || isSavingAccount
    || isSavingBusiness
    || isSavingNotifications
    || isSavingPreferences
    || isSavingSecurity
    || isChangingPassword
    || isRequestingDeactivate
    || isRequestingDeletion
    || isCreatingTeamMember
    || isDeletingTeamMember;

  const saveAll = useCallback(async () => {
    if (
      security.currentPassword
      || security.newPassword
      || security.confirmPassword
    ) {
      if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
        toast.error("Please fill current, new, and confirm password fields to change password.");
        return;
      }

      if (security.newPassword !== security.confirmPassword) {
        toast.error("New password and confirm password do not match.");
        setInlineStatus({ tone: "danger", message: "New password and confirm password do not match." });
        return;
      }
    }

    try {
      const tasks: Promise<unknown>[] = [
        updateAccount({
          fullName: account.fullName,
          phone: account.phone || null,
        }).unwrap(),
        updateNotifications(notifications).unwrap(),
        updatePreferences(preferences).unwrap(),
        updateSecurity({ twoFactorEnabled }).unwrap(),
      ];

      if (isPrimaryOwner) {
        tasks.push(
          updateBusiness({
            name: business.name,
            type: business.type,
            website: business.website,
            address: business.address,
            description: business.description,
            currency: business.currency || currencyCode(preferences.currency),
          }).unwrap(),
        );
      }

      await Promise.all(tasks);

      if (security.currentPassword && security.newPassword && security.confirmPassword) {
        await changePassword({
          currentPassword: security.currentPassword,
          newPassword: security.newPassword,
        }).unwrap();

        setSecurity((previous) => ({
          ...previous,
          twoFactorEnabled,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }

      toast.success(
        `Settings saved successfully at ${new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      );
      setInlineStatus({ tone: "success", message: "Settings saved successfully. Your workspace preferences and account controls are up to date." });
    } catch (error) {
      const message = getApiErrorMessage(error, "Something went wrong. Please try again.");
      toast.error(message);
      setInlineStatus({ tone: "danger", message });
    }
  }, [
    account.fullName,
    account.phone,
    business.address,
    business.currency,
    business.description,
    business.name,
    business.type,
    business.website,
    changePassword,
    isPrimaryOwner,
    notifications,
    preferences,
    security.confirmPassword,
    security.currentPassword,
    security.newPassword,
    twoFactorEnabled,
    updateAccount,
    updateBusiness,
    updateNotifications,
    updatePreferences,
    updateSecurity,
  ]);

  useEffect(() => {
    window.addEventListener("settings:save", saveAll);
    return () => window.removeEventListener("settings:save", saveAll);
  }, [saveAll]);

  const handleDeactivate = async () => {
    try {
      await requestDeactivation().unwrap();
      toast.success("Deactivation request submitted");
      setOpenDeactivate(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  const handleDelete = async () => {
    try {
      await requestDeletion().unwrap();
      toast.success("Deletion request submitted");
      setOpenDelete(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  const saveAccountOnly = async () => {
    try {
      await updateAccount({
        fullName: account.fullName,
        phone: account.phone || null,
      }).unwrap();
      toast.success("Account profile updated");
      setInlineStatus({ tone: "success", message: "Account information updated." });
    } catch (error) {
      {
        const message = getApiErrorMessage(error, "Something went wrong. Please try again.");
        toast.error(message);
        setInlineStatus({ tone: "danger", message });
      }
    }
  };

  const saveBusinessOnly = async () => {
    if (!isPrimaryOwner) return;
    try {
      await updateBusiness({
        name: business.name,
        type: business.type,
        website: business.website,
        address: business.address,
        description: business.description,
        currency: business.currency,
      }).unwrap();
      toast.success("Business profile updated");
      setInlineStatus({ tone: "success", message: "Business profile updated." });
    } catch (error) {
      {
        const message = getApiErrorMessage(error, "Something went wrong. Please try again.");
        toast.error(message);
        setInlineStatus({ tone: "danger", message });
      }
    }
  };

  const addTeamMember = async () => {
    if (!teamDraft.fullName || !teamDraft.email || !teamDraft.password) {
      toast.error("Enter full name, email, and a temporary password to add a team member.");
      return;
    }

    try {
      await createTeamMember(teamDraft).unwrap();
      setTeamDraft({ fullName: "", email: "", password: "" });
      toast.success("Team member added");
      setInlineStatus({ tone: "success", message: "Team member added and seat allocation updated." });
    } catch (error) {
      {
        const message = getApiErrorMessage(error, "Something went wrong. Please try again.");
        toast.error(message);
        setInlineStatus({ tone: "danger", message });
      }
    }
  };

  const removeTeamMember = async (id: string) => {
    try {
      await deleteTeamMember(id).unwrap();
      toast.success("Team member removed");
      setInlineStatus({ tone: "success", message: "Team member removed from the workspace." });
    } catch (error) {
      {
        const message = getApiErrorMessage(error, "Something went wrong. Please try again.");
        toast.error(message);
        setInlineStatus({ tone: "danger", message });
      }
    }
  };

  const statusNote = useMemo(() => {
    if (!data) return null;
    if (data.dangerZone.deletionRequestedAt) {
      return "Account deletion request is pending review.";
    }
    if (data.dangerZone.deactivationRequestedAt) {
      return "Account deactivation request is pending review.";
    }
    return null;
  }, [data]);

  if (isLoading) {
    return (
      <StateMessage tone="loading" title="Loading settings" message="Workspace settings are being prepared." />
    );
  }

  return (
    <section className="space-y-5">
      <PageSummaryStrip
        eyebrow="Workspace Controls"
        title="Settings that affect daily operations"
        description="Keep account details, business profile, team access, and notification behavior aligned so the rest of the product stays predictable."
        items={[
          {
            label: "Account Role",
            value: account.role || "Workspace user",
            helper: "Current permission level",
          },
          {
            label: "Business Type",
            value: business.type || "Not set",
            helper: isPrimaryOwner ? "Editable by the primary owner" : "Managed by owner",
          },
          {
            label: "Team Seats",
            value: teamData?.seatSummary.unlimited
              ? `${teamData?.seatSummary.used ?? 0} / Unlimited`
              : `${teamData?.seatSummary.used ?? 0} / ${teamData?.seatSummary.limit ?? 0}`,
            helper: "Allocated seats in this workspace",
          },
          {
            label: "Security",
            value: twoFactorEnabled ? "2FA enabled" : "Password only",
            helper: "Current account protection level",
          },
        ]}
      />

      {statusNote ? (
        <StateMessage tone="warning" message={statusNote} compact />
      ) : null}
      {inlineStatus ? (
        <StateMessage
          tone={inlineStatus.tone === "success" ? "success" : inlineStatus.tone === "danger" ? "danger" : "info"}
          message={inlineStatus.message}
          icon={inlineStatus.tone === "success" ? <CircleCheck className="mt-0.5 size-4 shrink-0" /> : undefined}
        />
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <SettingsSection
          title="Account information"
          description="Keep contact details current so reports, alerts, and account recovery stay reliable."
          icon={<User className="size-5 text-primary" />}
          bodyClassName="dashboard-workflow-stack"
        >
          <div className="dashboard-form-grid-two">
            <div className="dashboard-form-field">
              <label className="dashboard-field-label">Name</label>
              <Input value={account.fullName} onChange={(e) => setAccountDraft((p) => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div className="dashboard-form-field">
              <label className="dashboard-field-label">Email</label>
              <Input value={account.email} disabled />
            </div>
            <div className="dashboard-form-field">
              <label className="dashboard-field-label">Phone</label>
              <Input value={account.phone} onChange={(e) => setAccountDraft((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div className="dashboard-form-field">
              <label className="dashboard-field-label">Role</label>
              <Input value={account.role} disabled />
            </div>
          </div>
          <div className="dashboard-workflow-actions-start">
            <Button variant="outline" onClick={saveAccountOnly} disabled={isBusy}>
              Save This Section
            </Button>
            <Button onClick={saveAll} disabled={isBusy}>
              Save All Settings
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Business profile"
          description="Business metadata feeds report headers, currency defaults, and customer-facing exports."
          icon={<Building2 className="size-5 text-primary" />}
          bodyClassName="dashboard-workflow-stack"
        >
          <div className="dashboard-form-grid-tight">
            <div className="dashboard-form-field">
              <label className="dashboard-field-label">Business Name</label>
              <Input value={business.name} onChange={(e) => setBusinessDraft((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="dashboard-form-grid-two">
              <div className="dashboard-form-field">
                <label className="dashboard-field-label">Type</label>
                <Select value={business.type} onValueChange={(value) => setBusinessDraft((p) => ({ ...p, type: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {businessTypeOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="dashboard-form-field">
                <label className="dashboard-field-label">Website</label>
                <Input value={business.website} onChange={(e) => setBusinessDraft((p) => ({ ...p, website: e.target.value }))} />
              </div>
            </div>
            <div className="dashboard-form-field">
              <label className="dashboard-field-label">Address</label>
              <Input value={business.address} onChange={(e) => setBusinessDraft((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <div className="dashboard-workflow-actions-start">
            {isPrimaryOwner ? (
              <Button variant="dark" onClick={saveBusinessOnly} disabled={isBusy}>
                Update Business Info
              </Button>
            ) : (
              <div className="settings-inline-note">
                Business details can only be updated by the primary owner.
              </div>
            )}
            </div>
          </div>
        </SettingsSection>
      </div>

      <SettingsSection
        title="Team seats"
        description="Control team access and keep seat usage aligned with your current plan."
        icon={<Users className="size-5 text-primary" />}
        bodyClassName="space-y-4"
      >
        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
          <div className="dashboard-workflow-stack">
            <div className="dashboard-workflow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {teamData?.seatSummary.used ?? 0}
                    {teamData?.seatSummary.unlimited ? " / Unlimited" : ` / ${teamData?.seatSummary.limit ?? 0}`} seats used
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {teamData?.seatSummary.planName ?? "Current"} plan
                    {teamData?.seatSummary.unlimited
                      ? " includes unlimited team seats."
                      : ` includes ${teamData?.seatSummary.limit ?? 0} total seats.`}
                  </p>
                </div>
                <div className="settings-chip">
                  {teamData?.seatSummary.unlimited
                    ? "No seat cap"
                    : `${teamData?.seatSummary.remaining ?? 0} seats left`}
                </div>
              </div>
            </div>

            <DashboardDataTable
              ariaLabel="Team members table"
              caption="Team members with member info, access level, joined date, and actions"
              tableClassName="min-w-[720px]"
            >
                <thead>
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Access</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(teamData?.members ?? []).map((member) => (
                    <tr key={member.id}>
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">{member.fullName}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {member.type === "owner" ? "Primary owner" : "Workspace member"}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("en-US") : "—"}
                      </td>
                      <td className="px-4 py-4">
                        {isPrimaryOwner && member.type === "member" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => {
                              void removeTeamMember(member.id);
                            }}
                            disabled={isDeletingTeamMember}
                          >
                            <Trash2 className="size-4" />
                            Remove
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {member.type === "owner" ? "Included" : "View only"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!isTeamFetching && (teamData?.members?.length ?? 0) === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground">
                        No team members yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
            </DashboardDataTable>
          </div>
            <div className="dashboard-workflow-card">
            <div className="mb-4 inline-flex items-center gap-2">
              <KeyRound className="size-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Add Team Member</p>
            </div>
            {isPrimaryOwner ? (
              <div className="dashboard-workflow-stack">
                <div className="dashboard-form-field">
                  <label className="dashboard-field-label">Full Name</label>
                  <Input
                    id="team-member-name"
                    value={teamDraft.fullName}
                    onChange={(event) => setTeamDraft((previous) => ({ ...previous, fullName: event.target.value }))}
                  />
                </div>
                <div className="dashboard-form-field">
                  <label className="dashboard-field-label" htmlFor="team-member-email">Email</label>
                  <Input
                    id="team-member-email"
                    type="email"
                    value={teamDraft.email}
                    onChange={(event) => setTeamDraft((previous) => ({ ...previous, email: event.target.value }))}
                  />
                </div>
                <div className="dashboard-form-field">
                  <label className="dashboard-field-label" htmlFor="team-member-password">Temporary Password</label>
                  <Input
                    id="team-member-password"
                    type="password"
                    value={teamDraft.password}
                    onChange={(event) => setTeamDraft((previous) => ({ ...previous, password: event.target.value }))}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  This creates a real login account and consumes one seat immediately.
                </p>
                <StateMessage tone="info" compact message="Use temporary passwords only for initial access. Ask new members to update their password after first login." />
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    void addTeamMember();
                  }}
                  disabled={isCreatingTeamMember}
                >
                  Add Member
                </Button>
              </div>
            ) : (
              <div className="settings-inline-note">
                Team seats are managed by the primary owner. You can view the workspace roster here.
              </div>
            )}
          </div>
        </div>
      </SettingsSection>

      <div className="grid gap-5 xl:grid-cols-2">
        <SettingsSection
          title="Security"
          description="Change credentials and security preferences together to avoid partial updates or lockout confusion."
          icon={<Shield className="size-5 text-primary" />}
          bodyClassName="dashboard-workflow-stack"
        >
          <div className="dashboard-form-grid-tight">
            <div className="dashboard-form-field">
              <label className="dashboard-field-label">Current Password</label>
              <Input type="password" value={security.currentPassword} onChange={(e) => setSecurity((p) => ({ ...p, currentPassword: e.target.value }))} />
            </div>
            <div className="dashboard-form-grid-two">
              <div className="dashboard-form-field">
                <label className="dashboard-field-label">New Password</label>
                <Input type="password" value={security.newPassword} onChange={(e) => setSecurity((p) => ({ ...p, newPassword: e.target.value }))} />
              </div>
              <div className="dashboard-form-field">
                <label className="dashboard-field-label">Confirm Password</label>
                <Input type="password" value={security.confirmPassword} onChange={(e) => setSecurity((p) => ({ ...p, confirmPassword: e.target.value }))} />
              </div>
            </div>
            <div className="dashboard-workflow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Secure your account with 2FA codes.</p>
                </div>
                <ToggleSwitch
                  checked={twoFactorEnabled}
                  onChange={(next) => setSecurity((p) => ({ ...p, twoFactorEnabled: next }))}
                  disabled={isBusy}
                />
              </div>
            </div>
            <Button onClick={saveAll} disabled={isBusy}>
              Save Security Settings
            </Button>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Notifications"
          description="Enable only the alerts the team needs so operational signals stay useful instead of noisy."
          icon={<Bell className="size-5 text-primary" />}
          bodyClassName="dashboard-workflow-stack"
        >
          <div className="divide-y divide-border rounded-[calc(var(--radius-panel)-4px)] border border-border/80 bg-card">
            {[
              ["Email Notifications", notifications.emailNotifications, (v: boolean) => setNotificationsDraft((p) => ({ ...p, emailNotifications: v }))],
              ["Sales Alerts", notifications.salesAlerts, (v: boolean) => setNotificationsDraft((p) => ({ ...p, salesAlerts: v }))],
              ["Weekly Reports", notifications.weeklyReports, (v: boolean) => setNotificationsDraft((p) => ({ ...p, weeklyReports: v }))],
              ["Product Updates", notifications.productUpdates, (v: boolean) => setNotificationsDraft((p) => ({ ...p, productUpdates: v }))],
            ].map(([label, value, setter]) => (
              <div key={label as string} className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-medium text-foreground">{label as string}</p>
                <ToggleSwitch checked={value as boolean} onChange={setter as (next: boolean) => void} disabled={isBusy} />
              </div>
            ))}
          </div>
          <div className="dashboard-workflow-actions-start">
            <Button variant="outline" onClick={saveAll} disabled={isBusy}>
              Save Notification Settings
            </Button>
          </div>
        </SettingsSection>
      </div>

      <SettingsSection
        title="System preferences"
        description="These defaults influence how dates, currencies, and exports are displayed across the dashboard."
        icon={<Wrench className="size-5 text-primary" />}
        bodyClassName="space-y-4"
      >
        <div className="dashboard-form-grid-four">
          <div className="dashboard-form-field">
            <label className="dashboard-field-label">Language</label>
            <Select value={preferences.language} onValueChange={(value) => setPreferencesDraft((p) => ({ ...p, language: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="English (US)">English (US)</SelectItem>
                <SelectItem value="Khmer">Khmer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="dashboard-form-field">
            <label className="dashboard-field-label">Timezone</label>
            <Select value={preferences.timezone} onValueChange={(value) => setPreferencesDraft((p) => ({ ...p, timezone: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GMT+7 (Indochina Time)">GMT+7 (Indochina Time)</SelectItem>
                <SelectItem value="GMT+8">GMT+8</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="dashboard-form-field">
            <label className="dashboard-field-label">Date Format</label>
            <Select value={preferences.dateFormat} onValueChange={(value) => setPreferencesDraft((p) => ({ ...p, dateFormat: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="dashboard-form-field">
            <label className="dashboard-field-label">Currency</label>
            <Select
              value={preferences.currency}
              onValueChange={(value) => {
                setPreferencesDraft((p) => ({ ...p, currency: value }));
                setBusinessDraft((p) => ({ ...p, currency: currencyCode(value) }));
              }}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="USD ($)">USD ($)</SelectItem>
                <SelectItem value="KHR (៛)">KHR (៛)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="dashboard-workflow-actions-start">
          <Button variant="outline" onClick={saveAll} disabled={isBusy}>
            Save Preferences
          </Button>
        </div>
      </SettingsSection>

      <article className="settings-danger-surface">
        <div className="mb-2 inline-flex items-center gap-2">
          <TriangleAlert className="size-5 text-destructive" />
          <h3 className="text-2xl font-semibold text-destructive">Danger Zone</h3>
        </div>
        <p className="max-w-4xl text-sm text-destructive/90">
          Deactivating or deleting your account will result in permanent loss of access to all business data and records associated with Syntrix.
        </p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setOpenDeactivate(true)}
          >
            Deactivate
          </Button>
          <Button variant="destructive" onClick={() => setOpenDelete(true)}>
            Delete Account
          </Button>
        </div>
      </article>

      <Dialog open={openDeactivate} onOpenChange={setOpenDeactivate}>
        <DialogContent className="max-w-[460px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Deactivate Account</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Your account will be temporarily disabled. You can reactivate later by contacting support.
          </p>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDeactivate(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeactivate}
              disabled={isRequestingDeactivate}
            >
              Confirm Deactivate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="max-w-[460px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This action is permanent. Your deletion request will be sent to support for final confirmation.
          </p>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isRequestingDeletion}
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
