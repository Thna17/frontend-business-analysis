"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "@/store/api";
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

        await dispatch(
          api.endpoints.getCurrentUser.initiate(undefined, { forceRefetch: true }),
        ).unwrap();
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
