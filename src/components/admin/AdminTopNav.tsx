"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, CircleUserRound, Settings } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Analytics", href: "/admin-analytics" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
];

export default function AdminTopNav() {
  const pathname = usePathname();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfileImage = () => {
      setProfileImage(localStorage.getItem("adminProfileImage"));
    };

    loadProfileImage();
    window.addEventListener("storage", loadProfileImage);
    window.addEventListener("admin-profile-updated", loadProfileImage);

    return () => {
      window.removeEventListener("storage", loadProfileImage);
      window.removeEventListener("admin-profile-updated", loadProfileImage);
    };
  }, []);

  return (
    <header className="admin-topnav">
      <div className="admin-brand">
        <div className="admin-brand-logo">
          <span className="admin-brand-smile" aria-hidden="true">◡</span>
        </div>
        <span className="admin-brand-text">Syntrix</span>
      </div>

      <nav className="admin-topnav-menu">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={pathname === item.href ? "active" : ""}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="admin-topnav-actions">
        <Link href="/admin-settings" className="admin-circle-btn with-text">
          <Settings className="admin-icon-svg" />
          Setting
        </Link>

        <Link href="/admin/notification" className="admin-circle-btn" aria-label="Notifications">
          <Bell className="admin-icon-svg" />
        </Link>

        <Link href="/admin/profile" className="admin-circle-btn" aria-label="Profile">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="h-11 w-11 rounded-full object-cover"
            />
          ) : (
            <CircleUserRound className="admin-icon-svg" />
          )}
        </Link>
      </div>
    </header>
  );
}

