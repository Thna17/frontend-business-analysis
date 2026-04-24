"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authApi } from "@/store/api/modules/authApi";
import {
  loadUserFromStorage,
  logout,
  setAuthStatus,
  setCredentials,
} from "@/store/slices/authSlice";
import type { AppDispatch } from "@/store";

export function AuthBootstrap() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let alive = true;

    const bootstrapAuth = async () => {
      dispatch(loadUserFromStorage());
      dispatch(setAuthStatus("checking"));

      try {
        const currentUser = await dispatch(
          authApi.endpoints.getCurrentUser.initiate(undefined, { forceRefetch: true }),
        ).unwrap();

        if (!alive) return;

        dispatch(
          setCredentials({
            token: "",
            user: currentUser,
          }),
        );
        return;
      } catch {
        // Fall back to refresh when current user cannot be fetched with existing session state.
      }

      try {
        const refreshed = await dispatch(authApi.endpoints.refresh.initiate(undefined)).unwrap();

        if (!alive) return;

        dispatch(
          setCredentials({
            token: refreshed.accessToken,
            user: refreshed.user,
          }),
        );

      } catch {
        if (!alive) return;
        dispatch(logout());
      }
    };

    void bootstrapAuth();

    return () => {
      alive = false;
    };
  }, [dispatch]);

  return null;
}
