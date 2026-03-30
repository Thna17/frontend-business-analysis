import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  GenerateReportRequest,
  ReportsDashboardResponse,
} from "@/store/api/types";

export const reportsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReportsDashboard: builder.query<ReportsDashboardResponse, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "/reports/dashboard",
        params: params ?? { page: 1, limit: 5 },
      }),
      transformResponse: (response: ApiEnvelope<ReportsDashboardResponse>) => response.data,
      providesTags: ["User"],
    }),
    generateReport: builder.mutation<
      ReportsDashboardResponse["history"][number] & {
        result: { totalRevenue: number; totalOrders: number; totalUnits: number };
      },
      GenerateReportRequest
    >({
      query: (body) => ({
        url: "/reports",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<
        ReportsDashboardResponse["history"][number] & {
          result: { totalRevenue: number; totalOrders: number; totalUnits: number };
        }
      >) => response.data,
      invalidatesTags: ["User"],
    }),
    deleteReport: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/reports/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetReportsDashboardQuery,
  useGenerateReportMutation,
  useDeleteReportMutation,
} = reportsApi;
