"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Camera, Mail, Phone, ShieldUser, UserRound } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { PageSummaryStrip } from "@/components/shared/page-summary-strip";
import { StateMessage } from "@/components/shared/state-message";
import { getProfileImageStorageKey } from "@/lib/profile-image-storage";
import { useGetAdminProfileQuery, useGetCurrentUserQuery, useUpdateAdminProfileMutation } from "@/store/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function humanRole(role: string) {
  if (role === "admin") return "Administrator";
  if (role === "business_owner") return "Business Owner";
  return role;
}

export default function AdminProfilePage() {
  const { data, isLoading, isFetching } = useGetAdminProfileQuery();
  const { data: currentUser } = useGetCurrentUserQuery();
  const [updateAdminProfile, { isLoading: isSaving }] = useUpdateAdminProfileMutation();

  const [fullNameDraft, setFullNameDraft] = useState<string | null>(null);
  const [phoneDraft, setPhoneDraft] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: "success" | "danger"; text: string } | null>(null);
  const profileImageStorageKey = getProfileImageStorageKey(currentUser);
  const [uploadedImage, setUploadedImage] = useState<string>("");

  const loading = isLoading || isFetching;
  const fullName = fullNameDraft ?? data?.fullName ?? "";
  const email = data?.email ?? "";
  const phone = phoneDraft ?? data?.phone ?? "";
  const roleLabel = humanRole(data?.role ?? "admin");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage(null);

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;

      setUploadedImage(base64);
      if (profileImageStorageKey) {
        localStorage.setItem(profileImageStorageKey, base64);
      }

      window.dispatchEvent(new Event("admin-profile-updated"));
      window.dispatchEvent(new Event("owner-profile-updated"));
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setMessage(null);

    try {
      await updateAdminProfile({
        fullName,
        phone: phone || null,
      }).unwrap();

      if (uploadedImage && profileImageStorageKey) {
        localStorage.setItem(profileImageStorageKey, uploadedImage);
      }

      window.dispatchEvent(new Event("admin-profile-updated"));
      window.dispatchEvent(new Event("owner-profile-updated"));
      setMessage({ tone: "success", text: "Profile updated successfully." });
    } catch {
      setMessage({ tone: "danger", text: "Failed to update profile. Please try again." });
    }
  };

  const persistedImage = useMemo(() => {
    if (typeof window === "undefined" || !profileImageStorageKey) return "";
    return localStorage.getItem(profileImageStorageKey) || "";
  }, [profileImageStorageKey]);

  const avatarSrc = useMemo(
    () => uploadedImage || persistedImage || "",
    [persistedImage, uploadedImage],
  );

  return (
    <DashboardPage
      title="Profile"
      description="Manage your admin profile information."
      footer="(c) 2026 Syntrix Admin Console. All rights reserved."
    >
      <PageSummaryStrip
        eyebrow="Admin Identity"
        title="Profile details used across the admin console"
        description="Keep administrator information clear and current so ownership, approvals, and security activity stay attributable."
        items={[
          {
            label: "Name",
            value: fullName || "Admin",
            helper: "Displayed across admin activity surfaces",
          },
          {
            label: "Email",
            value: email || "Not set",
            helper: "Primary login and security contact",
          },
          {
            label: "Phone",
            value: phone || "Not set",
            helper: "Optional escalation contact",
          },
          {
            label: "Role",
            value: roleLabel,
            helper: "Current console permission level",
          },
        ]}
      />

        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading profile...</div>
        ) : (
          <section className="grid md:grid-cols-[1fr_2fr] gap-6">
            <div className="dashboard-surface p-6 flex flex-col items-center text-center space-y-4 shadow-sm">
              <div className="relative isolate flex justify-center group w-fit">
                <div className="w-32 h-32 rounded-full overflow-hidden border border-border shadow-sm bg-background flex items-center justify-center relative">
                  {avatarSrc ? (
                    <Image src={avatarSrc} alt="Admin profile" fill unoptimized className="object-cover" />
                  ) : (
                    <UserRound className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-md cursor-pointer hover:bg-primary/90 transition-transform active:scale-95 group-hover:scale-110">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" className="hidden" aria-hidden="true" onChange={handleImageUpload} />
                </label>
              </div>

              <div className="space-y-1 mt-2">
                <h2 className="text-xl font-bold text-foreground">{fullName || "Admin"}</h2>
                <p className="text-sm text-muted-foreground">{roleLabel}</p>
              </div>

              <div className="w-full pt-4">
                <Button variant="outline" className="w-full rounded-md gap-2" asChild>
                  <label className="cursor-pointer">
                    Change Photo
                    <input type="file" accept="image/*" className="hidden" aria-hidden="true" onChange={handleImageUpload} />
                  </label>
                </Button>
              </div>
            </div>

            <div className="dashboard-surface p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
                  <p className="border-border text-sm text-muted-foreground">Update your account details below</p>
                </div>
                <span className="px-3 py-1 bg-accent/50 text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-md border border-border">
                  Admin Account
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="admin-full-name" className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <UserRound className="w-4 h-4 text-muted-foreground" />
                    Full Name
                  </label>
                  <Input
                    id="admin-full-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullNameDraft(e.target.value);
                      setMessage(null);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="admin-email" className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </label>
                  <Input id="admin-email" type="email" value={email} readOnly disabled className="bg-muted/30" />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="admin-phone" className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </label>
                  <Input
                    id="admin-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => {
                      setPhoneDraft(e.target.value);
                      setMessage(null);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="admin-role" className="text-sm font-medium flex items-center gap-2 text-foreground">
                    <ShieldUser className="w-4 h-4 text-muted-foreground" />
                    Role
                  </label>
                  <Input id="admin-role" type="text" value={roleLabel} readOnly disabled className="bg-muted/30" />
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-8 text-primary-foreground max-w-xl">
                <h3 className="font-semibold text-sm mb-1 text-foreground">Profile Tip</h3>
                <p className="text-sm text-muted-foreground">
                  Keep your personal details updated so your account remains easy to identify and professional inside the Syntrix admin platform.
                </p>
              </div>

              <div className="min-h-6">
                {message ? <StateMessage tone={message.tone} compact message={message.text} /> : null}
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <Button variant="gold" className="min-w-[140px]" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </section>
        )}

    </DashboardPage>
  );
}
