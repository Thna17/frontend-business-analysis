import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "business_owner";
  isEmailVerified: boolean;
}

export type AuthStatus =
  | "idle"
  | "checking"
  | "authenticated"
  | "unauthenticated";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  status: AuthStatus;
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const userRaw = localStorage.getItem("user");
  if (!userRaw) return null;

  try {
    return JSON.parse(userRaw) as AuthUser;
  } catch {
    return null;
  }
}

const initialToken = getStoredToken();
const initialUser = getStoredUser();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken && initialUser),
  status: initialToken && initialUser ? "authenticated" : "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>,
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.status = "authenticated";

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = "unauthenticated";

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    loadUserFromStorage: (state) => {
      const token = getStoredToken();
      const user = getStoredUser();

      state.token = token;
      state.user = user;
      state.isAuthenticated = Boolean(token && user);
      state.status = token && user ? "authenticated" : "unauthenticated";
    },
    setAuthStatus: (state, action: PayloadAction<AuthStatus>) => {
      state.status = action.payload;
    },
  },
});

export const { setCredentials, logout, loadUserFromStorage, setAuthStatus } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;
