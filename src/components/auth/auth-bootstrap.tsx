"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "@/redux/services/api";
import {
  loadUserFromStorage,
  logout,
  setAuthStatus,
  setCredentials,
} from "@/redux/features/auth/authSlice";
import type { AppDispatch } from "@/redux/store";

export function AuthBootstrap() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let alive = true;

    const bootstrapAuth = async () => {
      dispatch(loadUserFromStorage());
      dispatch(setAuthStatus("checking"));

      try {
        const currentUser = await dispatch(
          api.endpoints.getCurrentUser.initiate(undefined, { forceRefetch: true }),
        ).unwrap();

        if (!alive) return;

        const existingToken =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (existingToken) {
          dispatch(
            setCredentials({
              token: existingToken,
              user: currentUser,
            }),
          );
          return;
        }
      } catch {
        // Continue to refresh fallback below.
      }

      try {
        const refreshed = await dispatch(
          api.endpoints.refresh.initiate(undefined),
        ).unwrap();

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
