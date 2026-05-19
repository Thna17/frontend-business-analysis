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
import { StateMessage } from "@/components/shared/state-message";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
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
  full: "bg-secondary text-secondary-foreground",
  limited: "bg-surface-subtle text-muted-foreground",
  tickets: "bg-surface-subtle text-muted-foreground",
};

// Admin settings workspace manages branding, maintenance, roles, and platform controls.
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
  const [saveError, setSaveError] = useState<string | null>(null);
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
      setSaveError(null);
      try {
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
      } catch {
        setSaveError("Unable to save admin settings right now. Please try again.");
      }
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
        <StateMessage tone="success" message={`Admin settings saved at ${savedAt}.`} />
      ) : null}

      {saving ? (
        <StateMessage tone="loading" icon={<Loader2 className="mt-0.5 size-4 shrink-0 animate-spin" />} message="Saving settings..." />
      ) : null}

      {saveError ? (
        <StateMessage tone="danger" message={saveError} />
      ) : null}

      <section>
        <h1 className="dashboard-title">Admin Platform Settings</h1>
        <p className="dashboard-subtitle mt-2">
          Control global branding, security posture, and operational safeguards from one consistent workspace.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[2.2fr_1fr]">
        <article className="dashboard-surface p-6 shadow-none">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h3 className="dashboard-section-title">Platform Configurations</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Define your global brand identity and UI defaults.
              </p>
            </div>
            <Button className="h-10 rounded-full px-6 text-sm">
              Update Assets
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <p className="dashboard-field-label mb-2">
                  GLOBAL BRAND NAME
                </p>
                <Input
                  value={brandName}
                  onChange={(event) => setBrandNameDraft(event.target.value)}
                  className="h-12 border-border bg-surface-subtle text-sm font-medium"
                />
              </div>

              <div>
                <p className="dashboard-field-label mb-2">
                  PRIMARY ACCENT COLOR
                </p>
                <div className="flex h-14 items-center gap-3 rounded-xl border border-border bg-surface-subtle px-3">
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
              <label className="flex h-full min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-subtle text-center transition-colors hover:bg-accent/35">
                <CloudUpload className="size-9 text-muted-foreground" />
                <p className="mt-3 text-xl font-semibold text-foreground">Logo Upload</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recommended: SVG or high-res PNG (min 400px)
                </p>
                <p className="mt-2 text-xs font-medium text-muted-foreground">{uploadedLogo}</p>
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

        <article className="dashboard-surface p-6 shadow-none">
          <h3 className="dashboard-section-title">System Health</h3>

          <div className="mt-5 space-y-4">
            {[
              ["API Services", data?.health.apiServices ?? "99.99%"],
              ["Main Database", data?.health.mainDatabase ?? "-"],
              ["Server Load", data?.health.serverLoad ?? "-"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-block size-2.5 rounded-full bg-primary" />
                  <p className="text-sm font-semibold text-foreground">{label}</p>
                </div>
                <p className="text-sm text-muted-foreground">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 border-t border-border/70 pt-5">
            <Button
              variant="ghost"
              className="h-10 w-full rounded-full text-sm font-semibold text-primary hover:bg-primary/10 hover:text-primary"
              onClick={refreshTelemetry}
            >
              View Live Telemetry
              <ChartNoAxesCombined className="size-4" />
            </Button>
            {telemetryAt ? (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Last refreshed at {telemetryAt}
              </p>
            ) : null}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <article className="dashboard-surface p-6 shadow-none">
          <div className="mb-5 inline-flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h3 className="dashboard-section-title">Security & Compliance</h3>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-surface-subtle p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground">Multi-Factor Auth (MFA)</p>
                  <p className="text-sm text-muted-foreground">Enforce 2FA for all administrative roles</p>
                </div>
                <ToggleSwitch checked={mfaEnabled} onChange={setMfaDraft} disabled={saving} />
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-foreground">AES-256 Encryption</p>
                  <p className="text-sm text-muted-foreground">Database-level field encryption</p>
                </div>
                <span className="text-sm font-bold tracking-wide text-primary">ACTIVE</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="h-12 w-full rounded-xl border-border bg-surface-subtle text-sm font-semibold tracking-[0.08em] text-foreground hover:bg-accent/45"
              onClick={exportAuditLogs}
            >
              DOWNLOAD AUDIT LOGS (Q3)
            </Button>
          </div>
        </article>

        <article className="dashboard-surface p-6 shadow-none">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="dashboard-section-title">User Roles</h3>
            <button type="button" className="rounded-lg p-1 text-muted-foreground hover:bg-accent/45">
              <EllipsisVertical className="size-5" />
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-border/70 text-left text-xs font-semibold tracking-wider text-muted-foreground">
                <th className="pb-3">ROLE</th>
                <th className="pb-3">MEMBERS</th>
                <th className="pb-3">ACCESS</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((row) => (
                <tr key={row.id} className="border-b border-border/60 last:border-none">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="inline-block size-2 rounded-full bg-primary" />
                      <button
                        type="button"
                        className="text-base font-semibold text-foreground hover:text-primary"
                        onClick={() => rotateRoleAccess(row.id)}
                      >
                        {row.role}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-base font-medium text-secondary-foreground">{row.members}</td>
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
            <button type="button" className="text-base font-semibold text-primary hover:text-primary/80">
              Manage Permissions
            </button>
            <span className="text-sm text-muted-foreground">{roleTotal} assigned members</span>
          </div>
        </article>
      </section>

      <section className="settings-danger-surface rounded-2xl p-6">
        <div className="mb-5 inline-flex items-center gap-2">
          <AlertTriangle className="size-5 text-destructive" />
          <h3 className="text-[1.75rem] font-semibold tracking-tight text-destructive">Danger Zone</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.1fr_auto_1.1fr_auto] md:items-center">
          <div>
            <p className="text-2xl font-semibold tracking-tight text-foreground">Platform Maintenance</p>
            <p className="mt-1 text-base text-muted-foreground">
              Temporarily disable all user access for core updates.
            </p>
          </div>
          <Button
            variant="outline"
            className={cn(
              "h-11 min-w-[110px] rounded-xl border text-base font-semibold",
              maintenanceMode
                ? "border-destructive bg-destructive text-white hover:bg-destructive/90"
                : "border-destructive bg-transparent text-destructive hover:bg-destructive/10",
            )}
            onClick={() => setMaintenanceDraft(!maintenanceMode)}
          >
            {maintenanceMode ? "Disable" : "Enable"}
          </Button>

          <div>
            <p className="text-2xl font-semibold tracking-tight text-foreground">Purge Cache</p>
            <p className="mt-1 text-base text-muted-foreground">
              Flush global CDN and local system caching layers.
            </p>
          </div>
          <Button
            variant="destructive"
            className="h-11 min-w-[110px] rounded-xl text-base font-semibold"
            onClick={purgeCache}
          >
            Purge Now
          </Button>
        </div>

        {cachePurgedAt ? (
          <p className="mt-4 text-sm text-destructive">Cache purged successfully at {cachePurgedAt}.</p>
        ) : null}

        {maintenanceMode ? (
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-destructive">
            <Shield className="size-4" />
            Maintenance mode is enabled for platform admins.
          </p>
        ) : null}
      </section>
    </div>
  );
}
