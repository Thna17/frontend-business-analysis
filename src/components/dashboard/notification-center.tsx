"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Archive, CheckCheck, Inbox, MailCheck, Search, Trash2 } from "lucide-react";
import { DashboardPage } from "@/components/dashboard/dashboard-page";
import { PageSummaryStrip } from "@/components/shared/page-summary-strip";
import { StateMessage } from "@/components/shared/state-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useArchiveAllNotificationsMutation,
  useArchiveNotificationMutation,
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/store/api";

interface NotificationCenterProps {
  title: string;
  footerText?: string;
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
    <DashboardPage title={title} footer={footerText ?? false}>
      <div className="space-y-5">
        <PageSummaryStrip
          eyebrow="Inbox"
          title={unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
          description={unreadCount > 0 ? "Review and clear events below." : "No new notifications right now."}
          items={[
            {
              label: "Unread",
              value: unreadCount.toString(),
              helper: "Needs your attention",
            },
            {
              label: "Showing",
              value: items.length.toString(),
              helper: "In the current view",
            },
            {
              label: "Filter",
              value: search.trim() ? "Active" : "None",
              helper: search.trim() ? `"${search}"` : "Showing all notifications",
            },
          ]}
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex h-11 flex-1 items-center gap-2 rounded-[var(--radius-control)] border border-[color:var(--control-border)] bg-[var(--control-bg)] px-4 text-sm text-muted-foreground shadow-[var(--shadow-control)]">
            <Search className="size-4" />
            <Input
              type="text"
              aria-label="Search notifications"
              placeholder="Search..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </label>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => void markAllRead()}
              disabled={isActionLoading || unreadCount === 0}
            >
              <CheckCheck className="size-4" />
              Mark all read
            </Button>
            <Button
              variant="outline"
              onClick={() => void archiveAll()}
              disabled={isActionLoading || items.length === 0}
            >
              <Archive className="size-4" />
              Archive all
            </Button>
          </div>
        </div>

        <section className="space-y-3">
          {isLoading ? (
            <StateMessage
              tone="loading"
              className="rounded-3xl px-5 py-8"
              title="Loading"
              message="Fetching your latest alerts."
            />
          ) : items.length === 0 ? (
            <StateMessage
              tone="info"
              className="rounded-3xl px-5 py-8"
              title="Nothing here"
              message={search.trim() ? "Try a different search term or clear the filter." : "You're all caught up."}
            />
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="grid grid-cols-1 gap-3 rounded-[calc(var(--radius-panel)-2px)] border border-border/80 bg-card px-4 py-4 shadow-[var(--shadow-control)] md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-5"
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`mt-[5px] h-2 w-2 shrink-0 rounded-full ${
                      item.isRead ? "bg-border" : "bg-primary"
                    }`}
                  />
                  <div className="space-y-1">
                    <h2 className="text-sm font-semibold leading-snug text-foreground">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">{item.message}</p>
                    {item.link ? (
                      <Link href={item.link} className="text-xs font-semibold text-primary hover:underline">
                        Open
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 text-muted-foreground">
                  <span className="mr-1 rounded-full border border-border/80 bg-surface-subtle px-3 py-1 text-xs font-semibold text-muted-foreground whitespace-nowrap">
                    {formatTime(item.createdAt)}
                  </span>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Mark as Read"
                    onClick={() => void markOneRead(item.id)}
                    disabled={isActionLoading || item.isRead}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <MailCheck className="size-[18px]" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Archive"
                    onClick={() => void archiveOne(item.id)}
                    disabled={isActionLoading}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Inbox className="size-[18px]" />
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    aria-label="Delete"
                    onClick={() => void deleteOne(item.id)}
                    disabled={isActionLoading}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-[18px]" />
                  </Button>
                </div>
              </article>
            ))
          )}
        </section>

      </div>
    </DashboardPage>
  );
}
