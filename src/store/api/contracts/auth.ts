import type { AuthUser } from "@/store/slices/authSlice";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface VerifyEmailOtpRequest {
  email: string;
  code: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AuthSessionResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterResponse {
  verificationRequired: boolean;
  user: AuthUser;
}
