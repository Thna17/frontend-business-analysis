import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  VoiceSaleConfirmResponse,
  VoiceSaleJob,
  VoiceSaleJobConfirmPayload,
  VoiceSaleJobListQuery,
  VoiceSaleJobListResponse,
} from "@/store/api/types";
import { normalizeSalesListMeta } from "@/store/api/utils";

export const voiceJobsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getVoiceJobs: builder.query<VoiceSaleJobListResponse, VoiceSaleJobListQuery | void>({
      query: (params) => ({
        url: "/sales/voice-jobs",
        params: params ?? { page: 1, limit: 10 },
      }),
      transformResponse: (response: ApiEnvelope<VoiceSaleJob[]>) => ({
        items: response.data,
        meta: normalizeSalesListMeta(response.meta),
      }),
      providesTags: ["User"],
    }),
    getVoiceJobById: builder.query<VoiceSaleJob, string>({
      query: (id) => `/sales/voice-jobs/${id}`,
      transformResponse: (response: ApiEnvelope<VoiceSaleJob>) => response.data,
      providesTags: ["User"],
    }),
    createVoiceJob: builder.mutation<VoiceSaleJob, { file: File; businessId?: string }>({
      query: ({ file, businessId }) => {
        const body = new FormData();
        body.append("file", file);
        if (businessId) body.append("businessId", businessId);
        return {
          url: "/sales/voice-jobs",
          method: "POST",
          body,
        };
      },
      transformResponse: (response: ApiEnvelope<VoiceSaleJob>) => response.data,
      invalidatesTags: ["User"],
    }),
    confirmVoiceJob: builder.mutation<
      VoiceSaleConfirmResponse,
      { id: string; body: VoiceSaleJobConfirmPayload }
    >({
      query: ({ id, body }) => ({
        url: `/sales/voice-jobs/${id}/confirm`,
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<VoiceSaleJob>) => ({
        job: response.data,
        createdCount: Number((response.meta as { createdCount?: number } | undefined)?.createdCount ?? 0),
        productSync: (response.meta as { productSync?: VoiceSaleConfirmResponse["productSync"] } | undefined)?.productSync,
      }),
      invalidatesTags: ["User"],
    }),
    retryVoiceJob: builder.mutation<VoiceSaleJob, string>({
      query: (id) => ({
        url: `/sales/voice-jobs/${id}/retry`,
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<VoiceSaleJob>) => response.data,
      invalidatesTags: ["User"],
    }),
    cancelVoiceJob: builder.mutation<VoiceSaleJob, string>({
      query: (id) => ({
        url: `/sales/voice-jobs/${id}/cancel`,
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<VoiceSaleJob>) => response.data,
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetVoiceJobsQuery,
  useGetVoiceJobByIdQuery,
  useCreateVoiceJobMutation,
  useConfirmVoiceJobMutation,
  useRetryVoiceJobMutation,
  useCancelVoiceJobMutation,
} = voiceJobsApi;
