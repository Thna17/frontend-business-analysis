"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, CircleUserRound, Settings } from "lucide-react";
import { getProfileImageStorageKey } from "@/lib/profile-image-storage";
import { useGetCurrentUserQuery } from "@/store/api";

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Analytics", href: "/admin-analytics" },
  { label: "Subscriptions", href: "/admin/subscriptions" },
];

export default function AdminTopNav() {
  const pathname = usePathname();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { data: currentUser } = useGetCurrentUserQuery();
  const profileImageStorageKey = getProfileImageStorageKey(currentUser);

  useEffect(() => {
    const loadProfileImage = () => {
      if (!profileImageStorageKey) {
        setProfileImage(null);
        return;
      }
      setProfileImage(localStorage.getItem(profileImageStorageKey));
    };

    loadProfileImage();
    window.addEventListener("storage", loadProfileImage);
    window.addEventListener("admin-profile-updated", loadProfileImage);

    return () => {
      window.removeEventListener("storage", loadProfileImage);
      window.removeEventListener("admin-profile-updated", loadProfileImage);
    };
  }, [profileImageStorageKey]);

  return (
    <header className="admin-topnav">
      <div className="admin-brand">
        <div className="admin-brand-logo">
          <Image
            src="/logo-ui.png"
            alt="Syntrix logo"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
        </div>
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



