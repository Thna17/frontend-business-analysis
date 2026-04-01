import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  NotificationItem,
  NotificationListResponse,
} from "@/store/api/types";

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationListResponse,
      {
        search?: string;
        type?: "sales" | "subscription" | "billing" | "user" | "report" | "system";
        archived?: boolean;
        page?: number;
        limit?: number;
      } | void
    >({
      query: (params) => ({
        url: "/notifications",
        params: params ?? { page: 1, limit: 20, archived: false },
      }),
      transformResponse: (response: ApiEnvelope<NotificationItem[]>) => {
        const meta = (response.meta ?? {}) as Record<string, unknown>;
        return {
          items: response.data,
          meta: {
            count: Number(meta.count ?? 0),
            total: Number(meta.total ?? 0),
            page: Number(meta.page ?? 1),
            limit: Number(meta.limit ?? 20),
            hasNextPage: Boolean(meta.hasNextPage),
            unreadCount: Number(meta.unreadCount ?? 0),
            archivedCount: Number(meta.archivedCount ?? 0),
          },
        };
      },
      providesTags: ["Admin"],
    }),
    markNotificationRead: builder.mutation<NotificationItem, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiEnvelope<NotificationItem>) => response.data,
      invalidatesTags: ["Admin"],
    }),
    markAllNotificationsRead: builder.mutation<{ modifiedCount: number }, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      transformResponse: (response: ApiEnvelope<{ modifiedCount: number }>) => response.data,
      invalidatesTags: ["Admin"],
    }),
    archiveNotification: builder.mutation<NotificationItem, string>({
      query: (id) => ({
        url: `/notifications/${id}/archive`,
        method: "PATCH",
      }),
      transformResponse: (response: ApiEnvelope<NotificationItem>) => response.data,
      invalidatesTags: ["Admin"],
    }),
    archiveAllNotifications: builder.mutation<{ modifiedCount: number }, void>({
      query: () => ({
        url: "/notifications/archive-all",
        method: "PATCH",
      }),
      transformResponse: (response: ApiEnvelope<{ modifiedCount: number }>) => response.data,
      invalidatesTags: ["Admin"],
    }),
    deleteNotification: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiEnvelope<{ message: string }>) => response.data,
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useArchiveNotificationMutation,
  useArchiveAllNotificationsMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
