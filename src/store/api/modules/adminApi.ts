import { api } from "@/store/api/core";
import type {
  AdminAnalyticsResponse,
  AdminDashboardResponse,
  AdminProfileResponse,
  AdminPaymentsListResponse,
  AdminSubscriptionPlanConfig,
  AdminSubscriptionPlanConfigListResponse,
  AdminSubscriptionOverviewResponse,
  AdminSubscriptionsListResponse,
  AdminSettingsResponse,
  ApiEnvelope,
  UpsertAdminSubscriptionPlanConfigInput,
  UpdateAdminBrandingInput,
  UpdateAdminMaintenanceInput,
  UpdateAdminProfileInput,
  UpdateAdminRolesInput,
  UpdateAdminSecurityInput,
} from "@/store/api/types";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboardResponse, void>({
      query: () => "/admin/dashboard",
      transformResponse: (response: ApiEnvelope<AdminDashboardResponse>) => response.data,
      providesTags: ["Admin"],
    }),
    getAdminAnalytics: builder.query<AdminAnalyticsResponse, void>({
      query: () => "/admin/analytics",
      transformResponse: (response: ApiEnvelope<AdminAnalyticsResponse>) => response.data,
      providesTags: ["Admin"],
    }),
    getAdminSubscriptionOverview: builder.query<AdminSubscriptionOverviewResponse, void>({
      query: () => "/admin/subscriptions/overview",
      transformResponse: (response: ApiEnvelope<AdminSubscriptionOverviewResponse>) => response.data,
      providesTags: ["Admin"],
    }),
    getAdminSubscriptionPlans: builder.query<AdminSubscriptionPlanConfigListResponse, void>({
      query: () => "/admin/subscription-plans",
      transformResponse: (response: ApiEnvelope<AdminSubscriptionPlanConfigListResponse>) => response.data,
      providesTags: ["Admin"],
    }),
    getAdminSettings: builder.query<AdminSettingsResponse, void>({
      query: () => "/admin/settings",
      transformResponse: (response: ApiEnvelope<AdminSettingsResponse>) => response.data,
      providesTags: ["Admin"],
    }),
    getAdminProfile: builder.query<AdminProfileResponse, void>({
      query: () => "/admin/profile",
      transformResponse: (response: ApiEnvelope<AdminProfileResponse>) => response.data,
      providesTags: ["Admin", "User"],
    }),
    getAdminPayments: builder.query<AdminPaymentsListResponse, { page?: number; limit?: number; status?: string } | void>({
      query: (params) => ({
        url: "/admin/payments",
        params: params ?? { page: 1, limit: 10 },
      }),
      transformResponse: (response: ApiEnvelope<AdminPaymentsListResponse["items"]>) => {
        const meta = (response.meta ?? {}) as Record<string, unknown>;

        return {
          items: response.data,
          meta: {
            count: Number(meta.count ?? 0),
            total: Number(meta.total ?? 0),
            page: Number(meta.page ?? 1),
            limit: Number(meta.limit ?? 10),
            hasNextPage: Boolean(meta.hasNextPage),
            pendingCount: Number(meta.pendingCount ?? 0),
            succeededCount: Number(meta.succeededCount ?? 0),
            failedCount: Number(meta.failedCount ?? 0),
            bakongCount: Number(meta.bakongCount ?? 0),
            succeededUsdAmount: Number(meta.succeededUsdAmount ?? 0),
          },
        };
      },
      providesTags: ["Admin"],
    }),
    getAdminSubscriptions: builder.query<AdminSubscriptionsListResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/admin/subscriptions",
        params: params ?? { page: 1, limit: 20 },
      }),
      transformResponse: (response: ApiEnvelope<AdminSubscriptionsListResponse["items"]>) => {
        const meta = (response.meta ?? {}) as Record<string, unknown>;

        return {
          items: response.data,
          meta: {
            count: Number(meta.count ?? 0),
            total: Number(meta.total ?? 0),
            page: Number(meta.page ?? 1),
            limit: Number(meta.limit ?? 20),
            hasNextPage: Boolean(meta.hasNextPage),
            activeCount: Number(meta.activeCount ?? 0),
          },
        };
      },
      providesTags: ["Admin"],
    }),
    createAdminSubscriptionPlan: builder.mutation<
      AdminSubscriptionPlanConfig,
      UpsertAdminSubscriptionPlanConfigInput
    >({
      query: (body) => ({
        url: "/admin/subscription-plans",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<AdminSubscriptionPlanConfig>) => response.data,
      invalidatesTags: ["Admin"],
    }),
    updateAdminSubscriptionPlan: builder.mutation<
      AdminSubscriptionPlanConfig,
      { id: string; body: Partial<UpsertAdminSubscriptionPlanConfigInput> }
    >({
      query: ({ id, body }) => ({
        url: `/admin/subscription-plans/${id}`,
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<AdminSubscriptionPlanConfig>) => response.data,
      invalidatesTags: ["Admin"],
    }),
    deleteAdminSubscriptionPlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/subscription-plans/${id}`,
        method: "DELETE",
      }),
      transformResponse: () => undefined,
      invalidatesTags: ["Admin"],
    }),
    updateAdminBranding: builder.mutation<
      AdminSettingsResponse["branding"],
      UpdateAdminBrandingInput
    >({
      query: (body) => ({
        url: "/admin/settings/branding",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<AdminSettingsResponse["branding"]>) => response.data,
      invalidatesTags: ["Admin"],
    }),
    updateAdminSecurity: builder.mutation<
      AdminSettingsResponse["security"],
      UpdateAdminSecurityInput
    >({
      query: (body) => ({
        url: "/admin/settings/security",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<AdminSettingsResponse["security"]>) => response.data,
      invalidatesTags: ["Admin"],
    }),
    updateAdminMaintenance: builder.mutation<
      AdminSettingsResponse["operations"],
      UpdateAdminMaintenanceInput
    >({
      query: (body) => ({
        url: "/admin/settings/maintenance",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<AdminSettingsResponse["operations"]>) => response.data,
      invalidatesTags: ["Admin"],
    }),
    updateAdminRoles: builder.mutation<
      { roleAdmin: string; roleOwner: string; roleSupport: string },
      UpdateAdminRolesInput
    >({
      query: (body) => ({
        url: "/admin/settings/roles",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<{ roleAdmin: string; roleOwner: string; roleSupport: string }>) =>
        response.data,
      invalidatesTags: ["Admin"],
    }),
    updateAdminProfile: builder.mutation<AdminProfileResponse, UpdateAdminProfileInput>({
      query: (body) => ({
        url: "/admin/profile",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<AdminProfileResponse>) => response.data,
      invalidatesTags: ["Admin", "User"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetAdminAnalyticsQuery,
  useGetAdminProfileQuery,
  useGetAdminSubscriptionOverviewQuery,
  useGetAdminSubscriptionPlansQuery,
  useGetAdminSettingsQuery,
  useGetAdminPaymentsQuery,
  useGetAdminSubscriptionsQuery,
  useCreateAdminSubscriptionPlanMutation,
  useUpdateAdminSubscriptionPlanMutation,
  useDeleteAdminSubscriptionPlanMutation,
  useUpdateAdminBrandingMutation,
  useUpdateAdminSecurityMutation,
  useUpdateAdminMaintenanceMutation,
  useUpdateAdminProfileMutation,
  useUpdateAdminRolesMutation,
} = adminApi;
