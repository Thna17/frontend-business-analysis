import {
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout as clearAuthState, setCredentials } from "@/store/slices/authSlice";
import type { ApiEnvelope } from "@/store/api/types";
import { extractRouteFromArgs, shouldSkipAutoRefresh, transformAuthSession } from "@/store/api/utils";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as { auth?: { token?: string | null } };
    const token = state.auth?.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const statusCode = typeof result.error?.status === "number" ? result.error.status : null;
  const route = extractRouteFromArgs(args);
  if (statusCode !== 401 || shouldSkipAutoRefresh(route)) {
    return result;
  }

  const refreshResult = await rawBaseQuery(
    {
      url: "/auth/refresh",
      method: "POST",
    },
    api,
    extraOptions,
  );

  if (refreshResult.data) {
    const session = transformAuthSession(
      refreshResult.data as ApiEnvelope<{ accessToken: string; user: unknown }>,
    );
    api.dispatch(
      setCredentials({
        token: session.accessToken,
        user: session.user,
      }),
    );

    result = await rawBaseQuery(args, api, extraOptions);
    return result;
  }

  api.dispatch(clearAuthState());
  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Product", "User", "Cart", "Admin"],
  endpoints: () => ({}),
});
