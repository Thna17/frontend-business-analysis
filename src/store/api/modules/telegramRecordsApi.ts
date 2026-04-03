import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  TelegramRecordsResponse,
  TelegramRecordsSummary,
} from "@/store/api/types";

export const telegramRecordsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTelegramRecords: builder.query<
      TelegramRecordsResponse,
      { page?: number; limit?: number; messageType?: "sale" | "expense" | "voice" | "file" } | void
    >({
      query: (params) => ({
        url: "/telegram-records",
        params: params ?? { page: 1, limit: 20 },
      }),
      transformResponse: (response: ApiEnvelope<TelegramRecordsResponse["data"]>) => {
        const meta = (response.meta ?? {}) as Record<string, unknown>;

        return {
          data: response.data,
          meta: {
            count: Number(meta.count ?? 0),
            total: Number(meta.total ?? 0),
            page: Number(meta.page ?? 1),
            limit: Number(meta.limit ?? 20),
            hasNextPage: Boolean(meta.hasNextPage),
          },
        };
      },
      providesTags: ["Admin"],
    }),
    getTelegramSummary: builder.query<TelegramRecordsSummary, void>({
      query: () => "/telegram-records/summary",
      transformResponse: (response: ApiEnvelope<TelegramRecordsSummary>) => response.data,
      providesTags: ["Admin"],
    }),
  }),
});

export const { useGetTelegramRecordsQuery, useGetTelegramSummaryQuery } = telegramRecordsApi;
