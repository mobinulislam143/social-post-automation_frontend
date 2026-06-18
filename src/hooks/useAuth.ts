"use client";

import { useAppSelector } from "@/store/hooks";
import { useGetMeQuery } from "@/store/api/authApi";

export function useAuth() {
  const { isAuthenticated, accessToken, user } = useAppSelector(
    (state) => state.auth
  );

  const { data: me, isLoading } = useGetMeQuery(undefined, {
    skip: !accessToken,
  });

  return {
    isAuthenticated,
    isLoading,
    user: me ?? user,
  };
}
