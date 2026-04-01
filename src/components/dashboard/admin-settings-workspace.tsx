"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ChartNoAxesCombined,
  CloudUpload,
  EllipsisVertical,
  Loader2,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  useGetAdminSettingsQuery,
  useUpdateAdminBrandingMutation,
  useUpdateAdminMaintenanceMutation,
  useUpdateAdminRolesMutation,
  useUpdateAdminSecurityMutation,
} from "@/store/api";
import type { AdminRoleAccess } from "@/store/api";

type AccessTone = AdminRoleAccess;

interface RoleRow {
  id: string;
  role: string;
  members: number;
  access: AccessTone;
}

const accessLabels: Record<AccessTone, string> = {
  full: "Full",
  limited: "Limited",
  tickets: "Tickets",
};

const accessOrder: AccessTone[] = ["full", "limited", "tickets"];

const accessBadgeClass: Record<AccessTone, string> = {
  full: "bg-[#f2f4f7] text-[#344054]",
  limited: "bg-[#eaecf0] text-[#475467]",
  tickets: "bg-[#eaecf0] text-[#475467]",
};

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
      className={cn(
        "relative h-7 w-14 rounded-full transition-colors",
        checked ? "bg-[#d4af35]" : "bg-[#d0d5dd]",
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-8" : "translate-x-1",
        )}
      />
    </button>
  );
}

export function AdminSettingsWorkspace() {
  const { data, isLoading, refetch } = useGetAdminSettingsQuery();
  const [updateBranding, { isLoading: isSavingBranding }] = useUpdateAdminBrandingMutation();
  const [updateSecurity, { isLoading: isSavingSecurity }] = useUpdateAdminSecurityMutation();
  const [updateMaintenance, { isLoading: isSavingOperations }] = useUpdateAdminMaintenanceMutation();
  const [updateRoles, { isLoading: isSavingRoles }] = useUpdateAdminRolesMutation();

  const [brandNameDraft, setBrandNameDraft] = useState<string | null>(null);
  const [accentColorDraft, setAccentColorDraft] = useState<string | null>(null);
  const [uploadedLogo, setUploadedLogo] = useState("No file uploaded");
  const [mfaDraft, setMfaDraft] = useState<boolean | null>(null);
  const [telemetryAt, setTelemetryAt] = useState<string | null>(null);
  const [cachePurgedAt, setCachePurgedAt] = useState<string | null>(null);
  const [maintenanceDraft, setMaintenanceDraft] = useState<boolean | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [rolesDraft, setRolesDraft] = useState<RoleRow[] | null>(null);

  const brandName = brandNameDraft ?? data?.branding.brandName ?? "Syntrix";
  const accentColor = accentColorDraft ?? data?.branding.accentColor ?? "#D4AF37";
  const mfaEnabled = mfaDraft ?? data?.security.mfaEnforced ?? true;
  const maintenanceMode = maintenanceDraft ?? data?.operations.maintenanceMode ?? false;
  const roles = useMemo(() => rolesDraft ?? data?.roles ?? [], [data?.roles, rolesDraft]);

  const roleTotal = useMemo(
    () => roles.reduce((total, role) => total + role.members, 0),
    [roles],
  );

  const rotateRoleAccess = (id: string) => {
    setRolesDraft((prev) => {
      const source = prev ?? data?.roles ?? [];
      return source.map((role) => {
        if (role.id !== id) return role;
        const currentIndex = accessOrder.indexOf(role.access);
        const nextAccess = accessOrder[(currentIndex + 1) % accessOrder.length];
        return { ...role, access: nextAccess };
      });
    });
  };

  const exportAuditLogs = () => {
    const payload = [
      "timestamp,event,actor",
      `${new Date().toISOString()},ROLE_AUDIT_EXPORT,admin_console`,
      `${new Date().toISOString()},MFA_STATE_${mfaEnabled ? "ON" : "OFF"},admin_console`,
    ].join("\n");

    const blob = new Blob([payload], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "syntrix-audit-logs-q3.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const refreshTelemetry = () => {
    void refetch();
    setTelemetryAt(
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  };

  const purgeCache = () => {
    setCachePurgedAt(
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  };

  useEffect(() => {
    const onSave = async () => {
      await Promise.all([
        updateBranding({ brandName, accentColor }).unwrap(),
        updateSecurity({ mfaEnforced: mfaEnabled }).unwrap(),
        updateMaintenance({ maintenanceMode }).unwrap(),
        updateRoles({
          roles: roles.map((role) => ({
            id: role.id as "role-admin" | "role-owner" | "role-support",
            access: role.access,
          })),
        }).unwrap(),
      ]);

      setSavedAt(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    const listener = () => {
      void onSave();
    };

    window.addEventListener("admin-settings:save", listener);
    return () => window.removeEventListener("admin-settings:save", listener);
  }, [accentColor, brandName, maintenanceMode, mfaEnabled, roles, updateBranding, updateMaintenance, updateRoles, updateSecurity]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const saving = isSavingBranding || isSavingSecurity || isSavingOperations || isSavingRoles;

  return (
    <div className="space-y-6">
      {savedAt ? (
        <div className="rounded-xl border border-[#d7f2e3] bg-[#ecfbf2] px-4 py-2 text-sm font-medium text-[#067647]">
          Admin settings saved at {savedAt}.
        </div>
      ) : null}

      {saving ? (
        <div className="rounded-xl border border-[#f0e5c2] bg-[#fffaf0] px-4 py-2 text-sm font-medium text-[#8a6b0b]">
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" />
            Saving settings...
          </span>
        </div>
      ) : null}

      <section>
        <h1 className="dashboard-title">Welcome in, Admin!</h1>
        <p className="dashboard-subtitle mt-2">
          Here&apos;s what&apos;s happening across your platform today.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[2.2fr_1fr]">
        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h3 className="dashboard-section-title">Platform Configurations</h3>
              <p className="mt-1 text-sm text-[#667085]">
                Define your global brand identity and UI defaults.
              </p>
            </div>
            <Button className="h-10 rounded-full bg-[#d4af35] px-6 text-sm font-semibold text-[#1f2937] hover:bg-[#c9a62f]">
              Update Assets
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wider text-[#475467]">
                  GLOBAL BRAND NAME
                </p>
                <Input
                  value={brandName}
                  onChange={(event) => setBrandNameDraft(event.target.value)}
                  className="h-12 border-[#d7dce3] bg-[#f3f5f8] text-sm font-medium"
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold tracking-wider text-[#475467]">
                  PRIMARY ACCENT COLOR
                </p>
                <div className="flex h-14 items-center gap-3 rounded-xl border border-[#d7dce3] bg-[#f3f5f8] px-3">
                  <input
                    type="color"
                    aria-label="Primary accent color"
                    value={accentColor}
                    onChange={(event) => setAccentColorDraft(event.target.value.toUpperCase())}
                    className="h-8 w-8 cursor-pointer rounded-full border-none bg-transparent p-0"
                  />
                  <Input
                    value={accentColor}
                    onChange={(event) => setAccentColorDraft(event.target.value.toUpperCase())}
                    className="h-9 border-none bg-transparent px-0 text-sm font-medium shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col justify-end">
              <label className="flex h-full min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#d7dce3] bg-[#fafbfc] text-center transition-colors hover:bg-[#f7f9fc]">
                <CloudUpload className="size-9 text-[#7c6f53]" />
                <p className="mt-3 text-xl font-semibold text-[#1f2937]">Logo Upload</p>
                <p className="mt-1 text-sm text-[#667085]">
                  Recommended: SVG or high-res PNG (min 400px)
                </p>
                <p className="mt-2 text-xs font-medium text-[#98a2b3]">{uploadedLogo}</p>
                <input
                  type="file"
                  className="hidden"
                  accept=".svg,.png,.jpg,.jpeg,.webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    setUploadedLogo(file.name);
                  }}
                />
              </label>
            </div>
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">System Health</h3>

          <div className="mt-5 space-y-4">
            {[
              ["API Services", data?.health.apiServices ?? "99.99%"],
              ["Main Database", data?.health.mainDatabase ?? "-"],
              ["Server Load", data?.health.serverLoad ?? "-"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-[#e8ebf0] bg-white px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2.5 rounded-full bg-[#856700]" />
                  <p className="text-sm font-semibold text-[#101828]">{label}</p>
                </div>
                <p className="text-sm text-[#667085]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 border-t border-[#eef1f4] pt-5">
            <Button
              variant="ghost"
              className="h-10 w-full rounded-full text-sm font-semibold text-[#8a6b0b] hover:bg-[#fff7de] hover:text-[#745806]"
              onClick={refreshTelemetry}
            >
              View Live Telemetry
              <ChartNoAxesCombined className="size-4" />
            </Button>
            {telemetryAt ? (
              <p className="mt-2 text-center text-xs text-[#98a2b3]">
                Last refreshed at {telemetryAt}
              </p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <div className="mb-5 inline-flex items-center gap-2">
            <ShieldCheck className="size-5 text-[#9b7a08]" />
            <h3 className="dashboard-section-title">Security & Compliance</h3>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-[#e4e7ec] bg-[#f6f8fb] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[#101828]">Multi-Factor Auth (MFA)</p>
                  <p className="text-sm text-[#667085]">Enforce 2FA for all administrative roles</p>
                </div>
                <Toggle checked={mfaEnabled} onChange={setMfaDraft} />
              </div>
            </div>

            <div className="rounded-xl border border-[#e4e7ec] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-[#101828]">AES-256 Encryption</p>
                  <p className="text-sm text-[#667085]">Database-level field encryption</p>
                </div>
                <span className="text-sm font-bold tracking-wide text-[#8a6b0b]">ACTIVE</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="h-12 w-full rounded-xl border-[#d7dce3] bg-[#f2f4f7] text-sm font-semibold tracking-[0.08em] text-[#1f2937] hover:bg-[#eaedf2]"
              onClick={exportAuditLogs}
            >
              DOWNLOAD AUDIT LOGS (Q3)
            </Button>
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="dashboard-section-title">User Roles</h3>
            <button type="button" className="rounded-lg p-1 text-[#667085] hover:bg-[#f2f4f7]">
              <EllipsisVertical className="size-5" />
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-[#edf0f5] text-left text-xs font-semibold tracking-wider text-[#667085]">
                <th className="pb-3">ROLE</th>
                <th className="pb-3">MEMBERS</th>
                <th className="pb-3">ACCESS</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((row) => (
                <tr key={row.id} className="border-b border-[#f0f2f6] last:border-none">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-block size-2 rounded-full bg-[#d4af35]" />
                      <button
                        type="button"
                        className="text-base font-semibold text-[#101828] hover:text-[#6e5504]"
                        onClick={() => rotateRoleAccess(row.id)}
                      >
                        {row.role}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-base font-medium text-[#1f2937]">{row.members}</td>
                  <td className="py-4">
                    <span className={cn("rounded-md px-3 py-1 text-sm font-medium", accessBadgeClass[row.access])}>
                      {accessLabels[row.access]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 flex items-center justify-between">
            <button type="button" className="text-base font-semibold text-[#8a6b0b] hover:text-[#745806]">
              Manage Permissions
            </button>
            <span className="text-sm text-[#98a2b3]">{roleTotal} assigned members</span>
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-[#f6c8c8] bg-[#fff8f8] p-6">
        <div className="mb-5 inline-flex items-center gap-2">
          <AlertTriangle className="size-5 text-[#d92d20]" />
          <h3 className="text-[1.75rem] font-semibold tracking-tight text-[#b42318]">Danger Zone</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr_auto_1.1fr_auto] md:items-center">
          <div>
            <p className="text-2xl font-semibold tracking-tight text-[#101828]">Platform Maintenance</p>
            <p className="mt-1 text-base text-[#4b5563]">
              Temporarily disable all user access for core updates.
            </p>
          </div>
          <Button
            variant="outline"
            className={cn(
              "h-11 min-w-[110px] rounded-xl border text-base font-semibold",
              maintenanceMode
                ? "border-[#d92d20] bg-[#d92d20] text-white hover:bg-[#b42318]"
                : "border-[#d92d20] bg-transparent text-[#d92d20] hover:bg-[#ffecec]",
            )}
            onClick={() => setMaintenanceDraft(!maintenanceMode)}
          >
            {maintenanceMode ? "Disable" : "Enable"}
          </Button>

          <div>
            <p className="text-2xl font-semibold tracking-tight text-[#101828]">Purge Cache</p>
            <p className="mt-1 text-base text-[#4b5563]">
              Flush global CDN and local system caching layers.
            </p>
          </div>
          <Button
            className="h-11 min-w-[110px] rounded-xl bg-[#d92d20] text-base font-semibold text-white hover:bg-[#b42318]"
            onClick={purgeCache}
          >
            Purge Now
          </Button>
        </div>

        {cachePurgedAt ? (
          <p className="mt-4 text-sm text-[#b42318]">Cache purged successfully at {cachePurgedAt}.</p>
        ) : null}

        {maintenanceMode ? (
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[#b42318]">
            <Shield className="size-4" />
            Maintenance mode is enabled for platform admins.
          </p>
        ) : null}
      </section>
    </div>
  );
}
