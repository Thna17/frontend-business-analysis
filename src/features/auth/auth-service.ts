import { currentAdmin, currentOwner } from "@/lib/mock-data";
import { User, UserRole } from "@/types/domain";

export interface LoginInput {
  email: string;
  password: string;
  role: UserRole;
}

export interface SignupInput {
  fullName: string;
  businessName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthSession {
  user: User;
  accessToken: string;
}

export async function login(input: LoginInput): Promise<AuthSession> {
  const isOwner = input.role === "BUSINESS_OWNER";

  return {
    user: isOwner ? currentOwner : currentAdmin,
    accessToken: "mock-jwt-token-for-frontend-scaffold",
  };
}

export async function logout(): Promise<void> {
  return Promise.resolve();
}

export async function signup(input: SignupInput): Promise<AuthSession> {
  const isOwner = input.role === "BUSINESS_OWNER";
  const baseUser = isOwner ? currentOwner : currentAdmin;

  return {
    user: {
      ...baseUser,
      fullName: input.fullName,
      email: input.email,
      role: input.role,
    },
    accessToken: "mock-jwt-token-for-frontend-scaffold",
  };
}
