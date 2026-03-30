import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  ChangeSubscriptionPlanRequest,
  SubscriptionDashboardResponse,
} from "@/store/api/types";

export const subscriptionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptionDashboard: builder.query<
      SubscriptionDashboardResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/subscriptions/dashboard",
        params: params ?? { page: 1, limit: 3 },
      }),
      transformResponse: (response: ApiEnvelope<SubscriptionDashboardResponse>) => response.data,
      providesTags: ["User"],
    }),
    changeSubscriptionPlan: builder.mutation<{ message: string }, ChangeSubscriptionPlanRequest>({
      query: (body) => ({
        url: "/subscriptions/plan",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    cancelSubscription: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/subscriptions/cancel",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    reactivateSubscription: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/subscriptions/reactivate",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetSubscriptionDashboardQuery,
  useChangeSubscriptionPlanMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
} = subscriptionApi;
