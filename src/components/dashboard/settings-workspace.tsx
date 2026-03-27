"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-14 rounded-full transition-colors ${
        checked ? "bg-[#d4af35]" : "bg-[#d0d5dd]"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-8" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function SettingsWorkspace() {
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const [account, setAccount] = useState({
    name: "Alexander Wright",
    email: "alex@syntrix.io",
    phone: "+1 (555) 000-1234",
    role: "Administrator",
  });
  const [business, setBusiness] = useState({
    name: "Syntrix Technologies Ltd.",
    type: "Software as a Service",
    website: "https://syntrix.io",
    address: "24th Floor, Tech Tower, San Francisco, CA",
  });
  const [security, setSecurity] = useState({
    currentPassword: "••••••••",
    newPassword: "",
    confirmPassword: "",
    twoFactor: true,
  });
  const [notifications, setNotifications] = useState({
    email: true,
    salesAlerts: true,
    weeklyReports: false,
    productUpdates: true,
  });
  const [preferences, setPreferences] = useState({
    language: "English (US)",
    timezone: "GMT+7 (Indochina Time)",
    dateFormat: "MM/DD/YYYY",
    currency: "USD ($)",
  });

  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  const saveAll = () => {
    setSavedAt(
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  };

  useEffect(() => {
    window.addEventListener("settings:save", saveAll);
    return () => window.removeEventListener("settings:save", saveAll);
  });

  return (
    <section className="space-y-5">
      {savedAt ? (
        <div className="rounded-xl border border-[#d7f2e3] bg-[#ecfbf2] px-4 py-2 text-sm font-medium text-[#067647]">
          Settings saved successfully at {savedAt}.
        </div>
      ) : null}
      {accountDeleted ? (
        <div className="rounded-xl border border-[#f7c7c7] bg-[#fff5f5] px-4 py-2 text-sm font-medium text-[#b42318]">
          Account marked for deletion (demo mode).
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
              <Input value={account.name} onChange={(e) => setAccount((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Email</label>
              <Input value={account.email} onChange={(e) => setAccount((p) => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Phone</label>
              <Input value={account.phone} onChange={(e) => setAccount((p) => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Role</label>
              <Input value={account.role} onChange={(e) => setAccount((p) => ({ ...p, role: e.target.value }))} />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={saveAll}>
              Edit Profile
            </Button>
            <Button className="rounded-full bg-[#f7e8b6] text-[#8a6b0b] hover:bg-[#f3df9f]" onClick={saveAll}>
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
              <Input value={business.name} onChange={(e) => setBusiness((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#475467]">Type</label>
                <Select value={business.type} onValueChange={(value) => setBusiness((p) => ({ ...p, type: value }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software as a Service">Software as a Service</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#475467]">Website</label>
                <Input value={business.website} onChange={(e) => setBusiness((p) => ({ ...p, website: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#475467]">Address</label>
              <Input value={business.address} onChange={(e) => setBusiness((p) => ({ ...p, address: e.target.value }))} />
            </div>
            <Button className="h-11 rounded-full bg-[#0f172a] text-sm text-white hover:bg-[#1e293b]" onClick={saveAll}>
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
                <Toggle checked={security.twoFactor} onChange={(next) => setSecurity((p) => ({ ...p, twoFactor: next }))} />
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
          <div className="mb-4 inline-flex items-center gap-2">
            <Bell className="size-5 text-[#d4af35]" />
            <h3 className="dashboard-section-title">Notifications</h3>
          </div>
          <div className="divide-y divide-[#eef1f4] rounded-xl border border-[#e4e7ec] bg-white">
            {[
              ["Email Notifications", notifications.email, (v: boolean) => setNotifications((p) => ({ ...p, email: v }))],
              ["Sales Alerts", notifications.salesAlerts, (v: boolean) => setNotifications((p) => ({ ...p, salesAlerts: v }))],
              ["Weekly Reports", notifications.weeklyReports, (v: boolean) => setNotifications((p) => ({ ...p, weeklyReports: v }))],
              ["Product Updates", notifications.productUpdates, (v: boolean) => setNotifications((p) => ({ ...p, productUpdates: v }))],
            ].map(([label, value, setter]) => (
              <div key={label as string} className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-medium text-[#344054]">{label as string}</p>
                <Toggle checked={value as boolean} onChange={setter as (next: boolean) => void} />
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
            <Select value={preferences.language} onValueChange={(value) => setPreferences((p) => ({ ...p, language: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="English (US)">English (US)</SelectItem>
                <SelectItem value="Khmer">Khmer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#475467]">Timezone</label>
            <Select value={preferences.timezone} onValueChange={(value) => setPreferences((p) => ({ ...p, timezone: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GMT+7 (Indochina Time)">GMT+7 (Indochina Time)</SelectItem>
                <SelectItem value="GMT+8">GMT+8</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#475467]">Date Format</label>
            <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences((p) => ({ ...p, dateFormat: value }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#475467]">Currency</label>
            <Select value={preferences.currency} onValueChange={(value) => setPreferences((p) => ({ ...p, currency: value }))}>
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
              onClick={() => {
                setOpenDeactivate(false);
                setSavedAt("deactivated");
              }}
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
            This action is permanent. In this demo, it will only mark the account as deleted in UI.
          </p>
          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpenDelete(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#dc2626] text-white hover:bg-[#b42318]"
              onClick={() => {
                setOpenDelete(false);
                setAccountDeleted(true);
              }}
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
