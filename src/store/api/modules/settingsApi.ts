import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  BusinessProfile,
  SettingsDashboardResponse,
  UpdateSettingsAccountInput,
  UpdateSettingsBusinessInput,
  UpdateSettingsNotificationsInput,
  UpdateSettingsPreferencesInput,
  UpdateSettingsSecurityInput,
} from "@/store/api/types";

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessProfile: builder.query<BusinessProfile, void>({
      query: () => "/businesses/current",
      transformResponse: (response: ApiEnvelope<BusinessProfile>) => response.data,
      providesTags: ["User"],
    }),
    getSettingsDashboard: builder.query<SettingsDashboardResponse, void>({
      query: () => "/settings/dashboard",
      transformResponse: (response: ApiEnvelope<SettingsDashboardResponse>) => response.data,
      providesTags: ["User"],
    }),
    updateSettingsAccount: builder.mutation<
      SettingsDashboardResponse["account"],
      UpdateSettingsAccountInput
    >({
      query: (body) => ({
        url: "/settings/account",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SettingsDashboardResponse["account"]>) => response.data,
      invalidatesTags: ["User"],
    }),
    updateSettingsBusiness: builder.mutation<
      SettingsDashboardResponse["business"],
      UpdateSettingsBusinessInput
    >({
      query: (body) => ({
        url: "/settings/business",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SettingsDashboardResponse["business"]>) => response.data,
      invalidatesTags: ["User"],
    }),
    updateSettingsNotifications: builder.mutation<
      SettingsDashboardResponse["notifications"],
      UpdateSettingsNotificationsInput
    >({
      query: (body) => ({
        url: "/settings/notifications",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SettingsDashboardResponse["notifications"]>) => response.data,
      invalidatesTags: ["User"],
    }),
    updateSettingsPreferences: builder.mutation<
      SettingsDashboardResponse["preferences"],
      UpdateSettingsPreferencesInput
    >({
      query: (body) => ({
        url: "/settings/preferences",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SettingsDashboardResponse["preferences"]>) => response.data,
      invalidatesTags: ["User"],
    }),
    updateSettingsSecurity: builder.mutation<
      SettingsDashboardResponse["security"],
      UpdateSettingsSecurityInput
    >({
      query: (body) => ({
        url: "/settings/security",
        method: "PATCH",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SettingsDashboardResponse["security"]>) => response.data,
      invalidatesTags: ["User"],
    }),
    requestAccountDeactivation: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/settings/deactivate",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    requestAccountDeletion: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/settings/delete-request",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetBusinessProfileQuery,
  useGetSettingsDashboardQuery,
  useUpdateSettingsAccountMutation,
  useUpdateSettingsBusinessMutation,
  useUpdateSettingsNotificationsMutation,
  useUpdateSettingsPreferencesMutation,
  useUpdateSettingsSecurityMutation,
  useRequestAccountDeactivationMutation,
  useRequestAccountDeletionMutation,
} = settingsApi;
