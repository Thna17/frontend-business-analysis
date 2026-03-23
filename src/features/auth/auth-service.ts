import { currentAdmin, currentOwner } from "@/lib/mock-data";
import { User, UserRole } from "@/types/domain";

export interface LoginInput {
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
