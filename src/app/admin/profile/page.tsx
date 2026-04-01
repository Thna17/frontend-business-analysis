"use client";

import { useEffect, useState } from "react";
import { Camera, Mail, Phone, ShieldUser, UserRound } from "lucide-react";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import { adminTopNavItems } from "@/features/owner-dashboard/dashboard-mock";

type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  image: string;
};

const DEFAULT_PROFILE: ProfileForm = {
  fullName: "Admin",
  email: "admin@syntrix.com",
  phone: "+855 78264554",
  role: "Administrator",
  image: "",
};

export default function AdminProfilePage() {
  const [form, setForm] = useState<ProfileForm>(DEFAULT_PROFILE);
  const [sharedImage, setSharedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedImage =
      localStorage.getItem("adminProfileImage")
      || localStorage.getItem("profileImage")
      || "";

    if (savedImage) {
      setSharedImage(savedImage);
      setForm((prev) => ({ ...prev, image: prev.image || savedImage }));
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/profile", {
          method: "GET",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile");
        }

        const image = data.image || savedImage || "";

        if (image) {
          localStorage.setItem("adminProfileImage", image);
          localStorage.setItem("profileImage", image);
          setSharedImage(image);
        }

        setForm({
          fullName: data.fullName || "Admin",
          email: data.email || "admin@syntrix.com",
          phone: data.phone || "+855 78264554",
          role: data.role || "Administrator",
          image,
        });
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;

      setSharedImage(base64);
      localStorage.setItem("adminProfileImage", base64);
      localStorage.setItem("profileImage", base64);

      setForm((prev) => ({
        ...prev,
        image: base64,
      }));

      window.dispatchEvent(new Event("admin-profile-updated"));
      window.dispatchEvent(new Event("owner-profile-updated"));
    };

    reader.readAsDataURL(file);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      if (form.image) {
        localStorage.setItem("adminProfileImage", form.image);
        localStorage.setItem("profileImage", form.image);
        setSharedImage(form.image);
      }

      alert("Profile updated successfully!");
      window.dispatchEvent(new Event("admin-profile-updated"));
      window.dispatchEvent(new Event("owner-profile-updated"));
    } catch (error) {
      console.error("Failed to save admin profile:", error);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

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
                <img
                  src={form.image || sharedImage || "https://i.pravatar.cc/300?img=12"}
                  alt="Admin profile"
                />
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

            <h2>{form.fullName}</h2>
            <p>{form.role}</p>

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
                  value={form.fullName}
                  onChange={handleChange}
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
                  value={form.email}
                  onChange={handleChange}
                  className="admin-profile-input editable"
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
                  value={form.phone}
                  onChange={handleChange}
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
                  value={form.role}
                  onChange={handleChange}
                  className="admin-profile-input editable"
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
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </section>

        <footer className="admin-profile-footer">
          <p>Â© 2026 Syntrix Admin Platform. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
