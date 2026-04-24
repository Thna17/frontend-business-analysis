"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Camera, Mail, Phone, ShieldUser, UserRound } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { PageSummaryStrip } from "@/components/shared/page-summary-strip";
import { StateMessage } from "@/components/shared/state-message";
import { Button } from "@/components/ui/button";
import {
  useGetSettingsProfileQuery,
  useUpdateSettingsProfileMutation,
} from "@/store/api";

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  profileImage: string;
};

const PROFILE_PLACEHOLDER_IMAGE = "https://ui-avatars.com/api/?name=User&background=e5e7eb&color=111827&bold=true&size=256";

function resolveProfileImage(image?: string | null): string {
  if (!image) {
    return PROFILE_PLACEHOLDER_IMAGE;
  }

  const normalized = image.trim();
  return normalized.length > 0 ? normalized : PROFILE_PLACEHOLDER_IMAGE;
}

const EMPTY_FORM: ProfileForm = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  profileImage: "",
};

export default function OwnerProfilePage() {
  const { data: profile, isLoading, isFetching, isError, refetch } = useGetSettingsProfileQuery();
  const [updateProfile, { isLoading: isSaving }] = useUpdateSettingsProfileMutation();

  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      profileImage: profile.profileImage,
    });
  }, [profile]);

  const isDirty = useMemo(() => {
    if (!profile) {
      return false;
    }

    return (
      form.fullName !== profile.fullName
      || form.phone !== profile.phone
      || form.profileImage !== profile.profileImage
    );
  }, [form, profile]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const value = typeof reader.result === "string" ? reader.result : "";
      setForm((prev) => ({ ...prev, profileImage: value }));
      setMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const handleSave = async () => {
    if (!profile || !isDirty) {
      return;
    }

    try {
      await updateProfile({
        fullName: form.fullName,
        phone: form.phone || null,
        profileImage: form.profileImage || null,
      }).unwrap();
      setMessage("Profile updated successfully.");
      window.dispatchEvent(new Event("owner-profile-updated"));
    } catch {
      setMessage("Unable to update profile. Please try again.");
    }
  };

  return (
    <DashboardPage
      title="Profile"
      description="Manage your account profile information."
      footer="(c) 2026 Syntrix SaaS Platform. All rights reserved."
    >
      <PageSummaryStrip
        eyebrow="Profile Overview"
        title="Account identity and workspace presence"
        description="Keep your core account information current so teammates, reports, and notifications stay tied to the right person."
        items={[
          {
            label: "Name",
            value: form.fullName || "Not set",
            helper: "Primary identity shown across the workspace",
          },
          {
            label: "Email",
            value: form.email || "Not set",
            helper: "Used for login and critical account alerts",
          },
          {
            label: "Phone",
            value: form.phone || "Not set",
            helper: "Optional contact detail for account recovery",
          },
          {
            label: "Role",
            value: form.role ? form.role.replaceAll("_", " ") : "business owner",
            helper: "Current workspace permission level",
          },
        ]}
      />
      {isError ? (
        <section className="dashboard-surface flex items-center justify-between p-6">
          <p className="text-sm text-muted-foreground">Unable to load your profile information.</p>
          <Button type="button" variant="dark" size="sm" className="rounded-full px-5" onClick={() => refetch()}>
            Retry
          </Button>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <article className="dashboard-surface flex flex-col items-center p-8 text-center">
            <div className="relative h-28 w-28">
              <Image
                src={resolveProfileImage(form.profileImage)}
                alt="Profile"
                fill
                unoptimized
                className="rounded-full object-cover shadow-[var(--shadow-control)]"
              />
              <label className="absolute bottom-1 right-0 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-control)]">
                <Camera className="size-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-foreground">
              {isLoading ? "Loading..." : form.fullName || "Your Name"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading ? "" : (form.role || "business_owner").replaceAll("_", " ")}
            </p>

            <label className="mt-6 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-foreground px-6 text-sm font-semibold text-background shadow-[var(--shadow-control)]">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </article>

          <article className="dashboard-surface p-6 md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Personal Information</h2>
                <p className="mt-1 text-sm text-muted-foreground">Update your account details below</p>
              </div>
              <span className="rounded-full bg-primary/12 px-4 py-2 text-sm font-semibold text-primary capitalize">
                {form.role ? form.role.replaceAll("_", " ") : "Owner"}
              </span>
            </div>

            <div className="dashboard-form-grid-two">
              {[
                { key: "fullName", label: "Full Name", icon: UserRound, type: "text", editable: true },
                { key: "email", label: "Email Address", icon: Mail, type: "email", editable: false },
                { key: "phone", label: "Phone Number", icon: Phone, type: "text", editable: true },
                { key: "role", label: "Role", icon: ShieldUser, type: "text", editable: false },
              ].map((field) => {
                const Icon = field.icon;
                const value = form[field.key as keyof ProfileForm];

                return (
                  <label key={field.key} className="dashboard-workflow-card dashboard-workflow-card-muted p-4">
                    <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-secondary-foreground">
                      <Icon className="size-4 text-primary" />
                      {field.label}
                    </span>
                    <input
                      type={field.type}
                      name={field.key}
                      value={value}
                      disabled={!field.editable || isLoading}
                      onChange={handleChange}
                      className="h-11 w-full rounded-full border border-border bg-card px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-4 min-h-6">
              {isFetching && !isLoading ? (
                <StateMessage tone="loading" compact message="Refreshing profile..." />
              ) : message ? (
                <StateMessage
                  tone={message.toLowerCase().includes("unable") ? "danger" : "success"}
                  compact
                  message={message}
                />
              ) : null}
            </div>

            <div className="mt-2 flex justify-end">
              <Button
                type="button"
                onClick={handleSave}
                disabled={isLoading || isSaving || !isDirty}
                className="h-11 rounded-full px-6 text-sm"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </article>
        </section>
      )}
    </DashboardPage>
  );
}
