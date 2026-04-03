"use client";

import { useMemo, useState } from "react";
import { Camera, Mail, Phone, ShieldUser, UserRound } from "lucide-react";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { adminTopNavItems } from "@/features/owner-dashboard/dashboard-mock";
import { getProfileImageStorageKey } from "@/lib/profile-image-storage";
import { useGetAdminProfileQuery, useGetCurrentUserQuery, useUpdateAdminProfileMutation } from "@/store/api";

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
      alert("Profile updated successfully!");
    } catch {
      alert("Failed to update profile.");
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

  if (loading) {
    return (
      <main className="admin-profile-page">
        <div className="admin-shell">
          <TopNavigation
            items={adminTopNavItems}
            settingsHref="/admin-settings"
            profileHref="/admin/profile"
            notificationHref="/admin/notification"
            notificationCount={1}
          />

          <section className="admin-profile-header">
            <h1>Profile</h1>
            <p>Manage your admin profile information.</p>
          </section>

          <div className="admin-profile-loading">Loading profile...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-profile-page">
      <div className="admin-shell">
        <TopNavigation
          items={adminTopNavItems}
          settingsHref="/admin-settings"
          profileHref="/admin/profile"
          notificationHref="/admin/notification"
          notificationCount={1}
        />

        <section className="admin-profile-header">
          <h1>Profile</h1>
          <p>Manage your admin profile information.</p>
        </section>

        <section className="admin-profile-content">
          <div className="admin-profile-left-card">
            <div className="admin-profile-avatar-wrap">
              <div className="admin-profile-avatar">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Admin profile"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
                    <UserRound className="size-10 text-[#98a2b3]" />
                  </div>
                )}
              </div>

              <label
                className="admin-profile-camera-btn"
                aria-label="Change photo"
              >
                <Camera className="admin-profile-camera-icon" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden-file-input"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <h2>{fullName || "Admin"}</h2>
            <p>{roleLabel}</p>

            <label className="admin-profile-photo-btn">
              Change Photo
              <input
                type="file"
                accept="image/*"
                className="hidden-file-input"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="admin-profile-right-card">
            <div className="admin-profile-card-header">
              <div>
                <h2>Personal Information</h2>
                <p>Update your account details below</p>
              </div>

              <span className="admin-account-badge">Admin Account</span>
            </div>

            <div className="admin-profile-form-grid">
              <div className="admin-profile-field">
                <label>
                  <UserRound className="field-icon" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={(event) => setFullNameDraft(event.target.value)}
                  className="admin-profile-input editable"
                />
              </div>

              <div className="admin-profile-field">
                <label>
                  <Mail className="field-icon" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  readOnly
                  className="admin-profile-input"
                />
              </div>

              <div className="admin-profile-field">
                <label>
                  <Phone className="field-icon" />
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={phone}
                  onChange={(event) => setPhoneDraft(event.target.value)}
                  className="admin-profile-input editable"
                />
              </div>

              <div className="admin-profile-field">
                <label>
                  <ShieldUser className="field-icon" />
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={roleLabel}
                  readOnly
                  className="admin-profile-input"
                />
              </div>
            </div>

            <div className="admin-profile-tip-box">
              <h3>Profile Tip</h3>
              <p>
                Keep your personal details updated so your account remains easy
                to identify and professional inside the Syntrix admin platform.
              </p>
            </div>

            <div className="admin-profile-actions">
              <button
                type="button"
                className="admin-profile-save-btn"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </section>

        <footer className="admin-profile-footer">
          <p>(c) 2026 Syntrix Admin Platform. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
