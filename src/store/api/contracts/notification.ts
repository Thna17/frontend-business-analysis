export type NotificationType =
  | "sales"
  | "subscription"
  | "billing"
  | "user"
  | "report"
  | "system";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  isArchived: boolean;
  link: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  meta: {
    count: number;
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    unreadCount: number;
    archivedCount: number;
  };
}
