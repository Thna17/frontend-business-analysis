"use client";

import { useEffect, useState } from "react";
import { Camera, Mail, Phone, ShieldUser, UserRound } from "lucide-react";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { topNavItems } from "@/features/owner-dashboard/dashboard-mock";

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
};

const DEFAULT_PROFILE: ProfileForm = {
  fullName: "Alexander Wright",
  email: "alex@syntrix.io",
  phone: "+1 (555) 000-1234",
  role: "Administrator",
};

export default function OwnerProfilePage() {
  const [image, setImage] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>(DEFAULT_PROFILE);

  useEffect(() => {
    const savedImage = localStorage.getItem("profileImage");
    const savedProfile = localStorage.getItem("profileData");

    if (savedImage) setImage(savedImage);

    if (savedProfile) {
      try {
        setForm(JSON.parse(savedProfile) as ProfileForm);
      } catch (error) {
        console.error("Failed to parse profile data", error);
      }
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImage(base64);
      localStorage.setItem("profileImage", base64);
      window.dispatchEvent(new Event("owner-profile-updated"));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("profileData", JSON.stringify(form));
    window.dispatchEvent(new Event("owner-profile-updated"));
    alert("Profile updated successfully!");
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

        <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <article className="dashboard-surface flex flex-col items-center p-8 text-center">
            <div className="relative h-28 w-28">
              <img
                src={image || "https://i.pravatar.cc/300?img=13"}
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

            <h2 className="mt-5 text-3xl font-bold text-[#111827]">{form.fullName}</h2>
            <p className="mt-1 text-[#667085]">{form.role}</p>

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
                <h2 className="text-3xl font-bold text-[#111827]">Personal Information</h2>
                <p className="mt-1 text-[#667085]">Update your account details below</p>
              </div>
              <span className="rounded-full bg-[#f1e8bf] px-4 py-2 text-sm font-semibold text-[#8b6f00]">
                Owner Account
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                { key: "fullName", label: "Full Name", icon: UserRound, type: "text" },
                { key: "email", label: "Email Address", icon: Mail, type: "email" },
                { key: "phone", label: "Phone Number", icon: Phone, type: "text" },
                { key: "role", label: "Role", icon: ShieldUser, type: "text" },
              ].map((field) => {
                const Icon = field.icon;
                return (
                  <label key={field.key} className="rounded-2xl bg-[#f7f6f3] p-4">
                    <span className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#1f2937]">
                      <Icon className="size-4 text-[#8f7200]" />
                      {field.label}
                    </span>
                    <input
                      type={field.type}
                      name={field.key}
                      value={form[field.key as keyof ProfileForm]}
                      onChange={handleChange}
                      className="h-11 w-full rounded-full border border-[#e4e7ec] bg-white px-4 text-sm text-[#101828] outline-none focus:ring-2 focus:ring-[#efd24a]/40"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex h-11 items-center rounded-full bg-[#efd24a] px-6 text-sm font-semibold text-[#1f1f1f] transition hover:bg-[#e3c53b]"
              >
                Save Changes
              </button>
            </div>
          </article>
        </section>

        <footer className="pt-8 text-center text-sm text-[#98a2b3]">
          © 2026 Syntrix SaaS Platform. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

