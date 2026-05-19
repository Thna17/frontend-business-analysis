import { api } from "@/store/api/core";
import type { ApiEnvelope, TelegramLinkCodeResponse, TelegramLinkStatusResponse } from "@/store/api/types";

// Telegram link endpoints support the account-link handshake with the bot.
export const telegramLinkApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createTelegramLinkCode: builder.mutation<TelegramLinkCodeResponse, void>({
      query: () => ({
        url: "/telegram/link-code",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<TelegramLinkCodeResponse>) => response.data,
      invalidatesTags: ["User"],
    }),
    getTelegramLinkStatus: builder.query<TelegramLinkStatusResponse, void>({
      query: () => "/telegram/link/status",
      transformResponse: (response: ApiEnvelope<TelegramLinkStatusResponse>) => response.data,
      providesTags: ["User"],
    }),
  }),
});

export const {
  useCreateTelegramLinkCodeMutation,
  useGetTelegramLinkStatusQuery,
} = telegramLinkApi;
