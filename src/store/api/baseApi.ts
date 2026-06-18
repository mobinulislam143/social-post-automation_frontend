import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { env } from "@/config/env";
import { logout, setAccessToken } from "@/store/slices/authSlice";
import type { RefreshTokenResponse } from "@/types/api";
import type { RootState } from "@/store/store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;
    const { activeOrgId } = state.session;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    if (activeOrgId) {
      headers.set("X-Org-Id", activeOrgId);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const state = api.getState() as RootState;
    const { refreshToken } = state.auth;

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST", body: { refreshToken } },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { accessToken } = refreshResult.data as RefreshTokenResponse;
        api.dispatch(setAccessToken(accessToken));
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Organization", "Member", "Invite", "User", "Role", "AuditLog"],
  endpoints: () => ({}),
});

export default baseApi;
