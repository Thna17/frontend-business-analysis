"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  Shield,
  TriangleAlert,
  User,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
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
  useRequestAccountDeactivationMutation,
  useRequestAccountDeletionMutation,
  useUpdateSettingsAccountMutation,
  useUpdateSettingsBusinessMutation,
  useUpdateSettingsNotificationsMutation,
  useUpdateSettingsPreferencesMutation,
  useUpdateSettingsSecurityMutation,
} from "@/store/api";

function normalizeError(error: unknown) {
  const payload = error as { data?: { message?: string } };
  return payload?.data?.message ?? "Something went wrong. Please try again.";
}

function currencyCode(label: string): string {
  if (!label) return "USD";
  const match = label.match(/[A-Z]{3}/);
  return match?.[0] ?? "USD";
}

function humanRole(role: string): string {
  if (role === "business_owner") return "Business Owner";
  if (role === "admin") return "Administrator";
  return role;
}

const BUSINESS_TYPE_OPTIONS = [
  "Software as a Service",
  "Retail",
  "Food & Beverage",
  "Education",
] as const;

export function SettingsWorkspace() {
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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

  const { data, isLoading, isFetching } = useGetSettingsDashboardQuery();

  const [updateAccount, { isLoading: isSavingAccount }] = useUpdateSettingsAccountMutation();
  const [updateBusiness, { isLoading: isSavingBusiness }] = useUpdateSettingsBusinessMutation();
  const [updateNotifications, { isLoading: isSavingNotifications }] = useUpdateSettingsNotificationsMutation();
  const [updatePreferences, { isLoading: isSavingPreferences }] = useUpdateSettingsPreferencesMutation();
  const [updateSecurity, { isLoading: isSavingSecurity }] = useUpdateSettingsSecurityMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [requestDeactivation, { isLoading: isRequestingDeactivate }] = useRequestAccountDeactivationMutation();
  const [requestDeletion, { isLoading: isRequestingDeletion }] = useRequestAccountDeletionMutation();

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
    || isRequestingDeletion;

  const saveAll = useCallback(async () => {
    setActionError(null);

    if (
      security.currentPassword
      || security.newPassword
      || security.confirmPassword
    ) {
      if (!security.currentPassword || !security.newPassword || !security.confirmPassword) {
        setActionError("Please fill current, new, and confirm password fields to change password.");
        return;
      }

      if (security.newPassword !== security.confirmPassword) {
        setActionError("New password and confirm password do not match.");
        return;
      }
    }

    try {
      await Promise.all([
        updateAccount({
          fullName: account.fullName,
          phone: account.phone || null,
        }).unwrap(),
        updateBusiness({
          name: business.name,
          type: business.type,
          website: business.website,
          address: business.address,
          description: business.description,
          currency: business.currency || currencyCode(preferences.currency),
        }).unwrap(),
        updateNotifications(notifications).unwrap(),
        updatePreferences(preferences).unwrap(),
        updateSecurity({ twoFactorEnabled }).unwrap(),
      ]);

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

      setSavedAt(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    } catch (error) {
      setActionError(normalizeError(error));
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
    setActionError(null);
    try {
      await requestDeactivation().unwrap();
      setSavedAt("deactivation request submitted");
      setOpenDeactivate(false);
    } catch (error) {
      setActionError(normalizeError(error));
    }
  };

  const handleDelete = async () => {
    setActionError(null);
    try {
      await requestDeletion().unwrap();
      setSavedAt("deletion request submitted");
      setOpenDelete(false);
    } catch (error) {
      setActionError(normalizeError(error));
    }
  };

  const saveAccountOnly = async () => {
    setActionError(null);
    try {
      await updateAccount({
        fullName: account.fullName,
        phone: account.phone || null,
      }).unwrap();
      setSavedAt("account profile updated");
    } catch (error) {
      setActionError(normalizeError(error));
    }
  };

  const saveBusinessOnly = async () => {
    setActionError(null);
    try {
      await updateBusiness({
        name: business.name,
        type: business.type,
        website: business.website,
        address: business.address,
        description: business.description,
        currency: business.currency,
      }).unwrap();
      setSavedAt("business profile updated");
    } catch (error) {
      setActionError(normalizeError(error));
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
      <section className="rounded-2xl border border-[#e7e9ee] bg-white p-6 text-sm text-[#667085]">
        Loading settings...
      </section>
    );
  }

  return (
    <section className="space-y-5">
      {savedAt ? (
        <div className="rounded-xl border border-[#d7f2e3] bg-[#ecfbf2] px-4 py-2 text-sm font-medium text-[#067647]">
          Settings saved successfully at {savedAt}.
        </div>
      ) : null}
      {actionError ? (
        <div className="rounded-xl border border-[#f7c7c7] bg-[#fff5f5] px-4 py-2 text-sm font-medium text-[#b42318]">
          {actionError}
        </div>
      ) : null}
      {statusNote ? (
        <div className="rounded-xl border border-[#fef3d2] bg-[#fff8e8] px-4 py-2 text-sm font-medium text-[#9d6b08]">
          {statusNote}
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
          <div className="mb-4 inline-flex items-center gap-2">
            <User className="size-5 text-[#d4af35]" />
            <h3 className="dashboard-section-title">Account Information</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Name</label>
              <Input value={account.fullName} onChange={(e) => setAccountDraft((p) => ({ ...p, fullName: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Email</label>
              <Input value={account.email} disabled />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Phone</label>
              <Input value={account.phone} onChange={(e) => setAccountDraft((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Role</label>
              <Input value={account.role} disabled />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={saveAccountOnly} disabled={isBusy}>
              Edit Profile
            </Button>
            <Button className="rounded-full bg-[#f7e8b6] text-[#8a6b0b] hover:bg-[#f3df9f]" onClick={saveAll} disabled={isBusy}>
              Save Profile
            </Button>
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
          <div className="mb-4 inline-flex items-center gap-2">
            <Building2 className="size-5 text-[#d4af35]" />
            <h3 className="dashboard-section-title">Business Profile</h3>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Business Name</label>
              <Input value={business.name} onChange={(e) => setBusinessDraft((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#475467]">Type</label>
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
              <div>
                <label className="mb-1 block text-sm font-medium text-[#475467]">Website</label>
                <Input value={business.website} onChange={(e) => setBusinessDraft((p) => ({ ...p, website: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Address</label>
              <Input value={business.address} onChange={(e) => setBusinessDraft((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <Button className="h-11 rounded-full bg-[#0f172a] text-sm text-white hover:bg-[#1e293b]" onClick={saveBusinessOnly} disabled={isBusy}>
              Update Business Info
            </Button>
          </div>
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
          <div className="mb-4 inline-flex items-center gap-2">
            <Shield className="size-5 text-[#d4af35]" />
            <h3 className="dashboard-section-title">Security</h3>
          </div>
          <div className="grid gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Current Password</label>
              <Input type="password" value={security.currentPassword} onChange={(e) => setSecurity((p) => ({ ...p, currentPassword: e.target.value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#475467]">New Password</label>
                <Input type="password" value={security.newPassword} onChange={(e) => setSecurity((p) => ({ ...p, newPassword: e.target.value }))} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#475467]">Confirm Password</label>
                <Input type="password" value={security.confirmPassword} onChange={(e) => setSecurity((p) => ({ ...p, confirmPassword: e.target.value }))} />
              </div>
            </div>
            <div className="rounded-xl border border-[#e4e7ec] bg-[#f8fafc] p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Two-Factor Authentication</p>
                  <p className="text-xs text-[#667085]">Secure your account with 2FA codes.</p>
                </div>
                <ToggleSwitch
                  checked={twoFactorEnabled}
                  onChange={(next) => setSecurity((p) => ({ ...p, twoFactorEnabled: next }))}
                  disabled={isBusy}
                />
              </div>
            </div>
            <Button
              className="h-10 rounded-full bg-[#d4af35] text-sm font-semibold text-[#111827] hover:bg-[#c39f2f]"
              onClick={saveAll}
              disabled={isBusy}
            >
              Save Security Settings
            </Button>
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
          <div className="mb-4 inline-flex items-center gap-2">
            <Bell className="size-5 text-[#d4af35]" />
            <h3 className="dashboard-section-title">Notifications</h3>
          </div>
          <div className="divide-y divide-[#eef1f4] rounded-xl border border-[#e4e7ec] bg-white">
            {[
              ["Email Notifications", notifications.emailNotifications, (v: boolean) => setNotificationsDraft((p) => ({ ...p, emailNotifications: v }))],
              ["Sales Alerts", notifications.salesAlerts, (v: boolean) => setNotificationsDraft((p) => ({ ...p, salesAlerts: v }))],
              ["Weekly Reports", notifications.weeklyReports, (v: boolean) => setNotificationsDraft((p) => ({ ...p, weeklyReports: v }))],
              ["Product Updates", notifications.productUpdates, (v: boolean) => setNotificationsDraft((p) => ({ ...p, productUpdates: v }))],
            ].map(([label, value, setter]) => (
              <div key={label as string} className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-medium text-[#344054]">{label as string}</p>
                <ToggleSwitch checked={value as boolean} onChange={setter as (next: boolean) => void} disabled={isBusy} />
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
        <div className="mb-4 inline-flex items-center gap-2">
          <Wrench className="size-5 text-[#d4af35]" />
          <h3 className="dashboard-section-title">System Preferences</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#475467]">Language</label>
            <Select value={preferences.language} onValueChange={(value) => setPreferencesDraft((p) => ({ ...p, language: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="English (US)">English (US)</SelectItem>
                <SelectItem value="Khmer">Khmer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#475467]">Timezone</label>
            <Select value={preferences.timezone} onValueChange={(value) => setPreferencesDraft((p) => ({ ...p, timezone: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GMT+7 (Indochina Time)">GMT+7 (Indochina Time)</SelectItem>
                <SelectItem value="GMT+8">GMT+8</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#475467]">Date Format</label>
            <Select value={preferences.dateFormat} onValueChange={(value) => setPreferencesDraft((p) => ({ ...p, dateFormat: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#475467]">Currency</label>
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
      </article>

      <article className="dashboard-surface border-[#f7c7c7] bg-[#fff5f5] p-5 shadow-none">
        <div className="mb-2 inline-flex items-center gap-2">
          <TriangleAlert className="size-5 text-[#dc2626]" />
          <h3 className="text-2xl font-semibold text-[#7f1d1d]">Danger Zone</h3>
        </div>
        <p className="max-w-4xl text-sm text-[#b42318]">
          Deactivating or deleting your account will result in permanent loss of access to all business data and records associated with Syntrix.
        </p>
        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <Button
            variant="outline"
            className="rounded-full border-[#f7c7c7] text-[#b42318] hover:bg-[#fee4e2]"
            onClick={() => setOpenDeactivate(true)}
          >
            Deactivate
          </Button>
          <Button className="rounded-full bg-[#dc2626] text-white hover:bg-[#b42318]" onClick={() => setOpenDelete(true)}>
            Delete Account
          </Button>
        </div>
      </article>

      <Dialog open={openDeactivate} onOpenChange={setOpenDeactivate}>
        <DialogContent className="max-w-[460px] rounded-2xl border-[#e4e7ec]">
          <DialogHeader>
            <DialogTitle>Deactivate Account</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#667085]">
            Your account will be temporarily disabled. You can reactivate later by contacting support.
          </p>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDeactivate(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#b42318] text-white hover:bg-[#912018]"
              onClick={handleDeactivate}
              disabled={isRequestingDeactivate}
            >
              Confirm Deactivate
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="max-w-[460px] rounded-2xl border-[#e4e7ec]">
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#667085]">
            This action is permanent. Your deletion request will be sent to support for final confirmation.
          </p>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#dc2626] text-white hover:bg-[#b42318]"
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
