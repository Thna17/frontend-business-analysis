import type { AuthUser } from "@/store/slices/authSlice";
import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  AuthSessionResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterResponse,
  ResetPasswordRequest,
  SignupRequest,
  VerifyEmailOtpRequest,
} from "@/store/api/types";
import { normalizeAuthUser, transformAuthSession } from "@/store/api/utils";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, SignupRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response: ApiEnvelope<{ verificationRequired: boolean; user: unknown }>) => ({
        verificationRequired: Boolean(response.data.verificationRequired),
        user: normalizeAuthUser(response.data.user),
      }),
      invalidatesTags: ["User"],
    }),
    verifyEmailOtp: builder.mutation<AuthSessionResponse, VerifyEmailOtpRequest>({
      query: (data) => ({
        url: "/auth/verify-email-otp",
        method: "POST",
        body: data,
      }),
      transformResponse: transformAuthSession,
      invalidatesTags: ["User"],
    }),
    resendVerificationOtp: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/auth/resend-verification-otp",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({
        message: response.message,
      }),
    }),
    login: builder.mutation<AuthSessionResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: transformAuthSession,
      invalidatesTags: ["User"],
    }),
    refresh: builder.mutation<AuthSessionResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      transformResponse: transformAuthSession,
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => "/auth/current",
      transformResponse: (response: ApiEnvelope<unknown>) => normalizeAuthUser(response.data),
      providesTags: ["User"],
    }),
    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
    }),
    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
    }),
    changePassword: builder.mutation<AuthSessionResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      transformResponse: transformAuthSession,
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailOtpMutation,
  useResendVerificationOtpMutation,
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
