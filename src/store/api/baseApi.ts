import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { env } from "@/config/env";
import { logout, setTokens } from "@/store/slices/authSlice";
import type { RootState } from "@/store/store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const { accessToken } = state.auth;

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

// Backend refresh endpoint: POST /auth/refresh-token → envelope
// { success, data: { accessToken, refreshToken } }.
// The backend ROTATES the refresh token (old one is revoked), so both new
// tokens must be stored — keeping the old refresh token logs the user out
// on the next refresh.
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
        { url: "/auth/refresh-token", method: "POST", body: { refreshToken } },
        api,
        extraOptions
      );

      const refreshed = (refreshResult.data as
        | { data?: { accessToken?: string; refreshToken?: string } }
        | undefined)?.data;

      if (refreshed?.accessToken && refreshed.refreshToken) {
        api.dispatch(
          setTokens({
            accessToken: refreshed.accessToken,
            refreshToken: refreshed.refreshToken,
          })
        );
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
  tagTypes: ["Auth", "User", "MonitorClient", "MonitorCheck"],
  endpoints: () => ({}),
});

export default baseApi;
