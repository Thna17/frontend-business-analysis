"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Archive, CheckCheck, Inbox, MailCheck, Search, Trash2 } from "lucide-react";
import { TopNavigation } from "@/components/dashboard/top-navigation";
import type { DashboardNavItem } from "@/features/owner-dashboard/dashboard-mock";
import {
  useArchiveAllNotificationsMutation,
  useArchiveNotificationMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/store/api";

interface NotificationCenterProps {
  navItems: DashboardNavItem[];
  settingsHref: string;
  profileHref: string;
  notificationHref: string;
  title: string;
  footerText: string;
}

function formatTime(dateString: string | null) {
  if (!dateString) return "Unknown time";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function NotificationCenter({
  navItems,
  settingsHref,
  profileHref,
  notificationHref,
  title,
  footerText,
}: NotificationCenterProps) {
  const [search, setSearch] = useState("");
  const params = useMemo(
    () => ({
      search: search.trim() || undefined,
      archived: false,
      page: 1,
      limit: 50,
    }),
    [search],
  );

  const { data, isLoading } = useGetNotificationsQuery(params);
  const [markOneRead, { isLoading: isMarkingRead }] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: isMarkingAllRead }] = useMarkAllNotificationsReadMutation();
  const [archiveOne, { isLoading: isArchivingOne }] = useArchiveNotificationMutation();
  const [archiveAll, { isLoading: isArchivingAll }] = useArchiveAllNotificationsMutation();
  const [deleteOne, { isLoading: isDeleting }] = useDeleteNotificationMutation();

  const items = data?.items ?? [];
  const unreadCount = data?.meta.unreadCount ?? 0;
  const isActionLoading =
    isMarkingRead || isMarkingAllRead || isArchivingOne || isArchivingAll || isDeleting;

  return (
    <main className="dashboard-shell pb-14">
      <TopNavigation
        items={navItems}
        settingsHref={settingsHref}
        profileHref={profileHref}
        notificationHref={notificationHref}
        notificationCount={unreadCount}
      />

      <div className="dashboard-container mt-7 space-y-5">
        <h1 className="dashboard-title">{title}</h1>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex h-12 flex-1 items-center gap-2 rounded-full border border-[#ece9e1] bg-white px-4 text-sm text-slate-500 shadow-sm">
            <Search className="size-4" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void markAllRead()}
              disabled={isActionLoading || unreadCount === 0}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[#ece9e1] bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck className="size-4" />
              Mark all as Read
            </button>
            <button
              type="button"
              onClick={() => void archiveAll()}
              disabled={isActionLoading || items.length === 0}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[#ece9e1] bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Archive className="size-4" />
              Archive All
            </button>
          </div>
        </div>

        <section className="space-y-3">
          {isLoading ? (
            <div className="rounded-3xl border border-[#ece9e1] bg-white px-5 py-8 text-center text-slate-500 shadow-sm">
              Loading notifications...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-[#ece9e1] bg-white px-5 py-8 text-center text-slate-500 shadow-sm">
              No notifications found.
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="grid grid-cols-1 gap-3 rounded-3xl border border-[#ece9e1] bg-white px-4 py-4 shadow-sm md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-5"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`mt-2 h-3 w-3 rounded-full ${
                      item.isRead ? "bg-slate-300" : "bg-[#f0c533]"
                    }`}
                  />
                  <div className="space-y-1">
                    <h2 className="text-[22px] font-medium text-slate-900">{item.title}</h2>
                    <p className="text-sm text-slate-500">{item.message}</p>
                    {item.link ? (
                      <Link href={item.link} className="text-xs font-semibold text-[#8a6f04] hover:underline">
                        Open
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 text-slate-500">
                  <span className="mr-1 rounded-full bg-[#f7f6f3] px-3 py-1 text-xs font-semibold text-slate-600 whitespace-nowrap">
                    {formatTime(item.createdAt)}
                  </span>
                  <button
                    type="button"
                    aria-label="Mark as Read"
                    onClick={() => void markOneRead(item.id)}
                    disabled={isActionLoading || item.isRead}
                    className="transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <MailCheck className="size-[18px]" />
                  </button>
                  <button
                    type="button"
                    aria-label="Archive"
                    onClick={() => void archiveOne(item.id)}
                    disabled={isActionLoading}
                    className="transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Inbox className="size-[18px]" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete"
                    onClick={() => void deleteOne(item.id)}
                    disabled={isActionLoading}
                    className="transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="size-[18px]" />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <footer className="pt-7 text-center text-sm text-[#98a2b3]">{footerText}</footer>
      </div>
    </main>
  );
}
