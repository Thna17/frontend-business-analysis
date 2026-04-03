"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, Mail, Phone, ShieldUser, UserRound } from "lucide-react";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";
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
    <main className="dashboard-shell pb-14">
      <TopNavigation
        items={topNavItems}
        settingsHref="/settings"
        profileHref="/profile"
        notificationHref="/notification"
      />

      <div className="dashboard-container mt-10 space-y-7">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="dashboard-title">Profile</h1>
            <p className="dashboard-subtitle mt-2 max-w-2xl">
              Manage your account profile information.
            </p>
          </div>
        </section>

        {isError ? (
          <section className="dashboard-surface flex items-center justify-between p-6">
            <p className="text-sm text-[#475467]">Unable to load your profile information.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex h-10 items-center rounded-full bg-[#111827] px-5 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </section>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <article className="dashboard-surface flex flex-col items-center p-8 text-center">
              <div className="relative h-28 w-28">
                <img
                  src={resolveProfileImage(form.profileImage)}
                  alt="Profile"
                  className="h-28 w-28 rounded-full object-cover shadow"
                />
                <label className="absolute bottom-1 right-0 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#efd24a] text-[#1f1f1f] shadow">
                  <Camera className="size-4" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <h2 className="mt-5 text-2xl font-semibold text-[#111827]">
                {isLoading ? "Loading..." : form.fullName || "Your Name"}
              </h2>
              <p className="mt-1 text-sm text-[#667085]">
                {isLoading ? "" : (form.role || "business_owner").replaceAll("_", " ")}
              </p>

              <label className="mt-6 inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white">
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
                  <h2 className="text-2xl font-semibold text-[#111827]">Personal Information</h2>
                  <p className="mt-1 text-sm text-[#667085]">Update your account details below</p>
                </div>
                <span className="rounded-full bg-[#f1e8bf] px-4 py-2 text-sm font-semibold text-[#8b6f00] capitalize">
                  {form.role ? form.role.replaceAll("_", " ") : "Owner"}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { key: "fullName", label: "Full Name", icon: UserRound, type: "text", editable: true },
                  { key: "email", label: "Email Address", icon: Mail, type: "email", editable: false },
                  { key: "phone", label: "Phone Number", icon: Phone, type: "text", editable: true },
                  { key: "role", label: "Role", icon: ShieldUser, type: "text", editable: false },
                ].map((field) => {
                  const Icon = field.icon;
                  const value = form[field.key as keyof ProfileForm];

                  return (
                    <label key={field.key} className="rounded-2xl bg-[#f7f6f3] p-4">
                      <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#1f2937]">
                        <Icon className="size-4 text-[#8f7200]" />
                        {field.label}
                      </span>
                      <input
                        type={field.type}
                        name={field.key}
                        value={value}
                        disabled={!field.editable || isLoading}
                        onChange={handleChange}
                        className="h-11 w-full rounded-full border border-[#e4e7ec] bg-white px-4 text-sm text-[#101828] outline-none focus:ring-2 focus:ring-[#efd24a]/40 disabled:cursor-not-allowed disabled:bg-[#f3f4f6] disabled:text-[#667085]"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 min-h-6 text-sm text-[#667085]">
                {isFetching && !isLoading ? "Refreshing profile..." : message}
              </div>

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isLoading || isSaving || !isDirty}
                  className="inline-flex h-11 items-center rounded-full bg-[#efd24a] px-6 text-sm font-semibold text-[#1f1f1f] transition hover:bg-[#e3c53b] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </article>
          </section>
        )}

        <footer className="pt-8 text-center text-sm text-[#98a2b3]">
          (c) 2026 Syntrix SaaS Platform. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
