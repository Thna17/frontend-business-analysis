import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  ChangeSubscriptionPlanRequest,
  CheckBakongPaymentRequest,
  CheckBakongPaymentResponse,
  CreatePaymentCheckoutRequest,
  PaymentCheckoutResponse,
  SimulateAbaPaywayPaymentRequest,
  SimulateAbaPaywayPaymentResponse,
  SubscriptionDashboardResponse,
} from "@/store/api/types";

// Subscription endpoints power plan management and the billing dashboard experience.
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

    // ── Payment checkout (navigates to /payments page, but API is here) ──────
    createPaymentCheckout: builder.mutation<PaymentCheckoutResponse, CreatePaymentCheckoutRequest>({
      query: (body) => ({
        url: "/payments/checkout",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<PaymentCheckoutResponse>) => response.data,
    }),

    checkBakongPayment: builder.mutation<CheckBakongPaymentResponse, CheckBakongPaymentRequest>({
      query: (body) => ({
        url: "/payments/bakong/check",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<CheckBakongPaymentResponse>) => response.data,
      invalidatesTags: ["User"],
    }),

    simulateAbaPaywayPayment: builder.mutation<
      SimulateAbaPaywayPaymentResponse,
      SimulateAbaPaywayPaymentRequest
    >({
      query: (body) => ({
        url: "/payments/aba-payway/simulate-success",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SimulateAbaPaywayPaymentResponse>) =>
        response.data,
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetSubscriptionDashboardQuery,
  useChangeSubscriptionPlanMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,
  useCreatePaymentCheckoutMutation,
  useCheckBakongPaymentMutation,
  useSimulateAbaPaywayPaymentMutation,
} = subscriptionApi;
