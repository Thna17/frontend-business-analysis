import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  OwnerAnalyticsDashboardResponse,
  OwnerDashboardOverviewResponse,
  OwnerOverviewQuery,
} from "@/store/api/types";

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerDashboardOverview: builder.query<OwnerDashboardOverviewResponse, OwnerOverviewQuery | void>({
      query: (params) => ({
        url: "/analytics/owner-overview",
        params: params ?? { range: "6m" },
      }),
      transformResponse: (response: ApiEnvelope<OwnerDashboardOverviewResponse>) => response.data,
      providesTags: ["User"],
    }),
    getOwnerAnalyticsDashboard: builder.query<OwnerAnalyticsDashboardResponse, OwnerOverviewQuery | void>({
      query: (params) => ({
        url: "/analytics/owner-dashboard",
        params: params ?? { range: "6m" },
      }),
      transformResponse: (response: ApiEnvelope<OwnerAnalyticsDashboardResponse>) => response.data,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetOwnerDashboardOverviewQuery,
  useGetOwnerAnalyticsDashboardQuery,
} = analyticsApi;
