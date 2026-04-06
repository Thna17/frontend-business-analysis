import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  BusinessAiInsightQuery,
  BusinessAiInsightResponse,
} from "@/store/api/types";

export const insightsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessAiInsight: builder.query<BusinessAiInsightResponse, BusinessAiInsightQuery | void>({
      query: (params) => ({
        url: "/insights",
        params: params ?? { lookbackDays: 90 },
      }),
      transformResponse: (response: ApiEnvelope<BusinessAiInsightResponse>) => response.data,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetBusinessAiInsightQuery,
} = insightsApi;
