import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types/api";
import { setAuthCookies, clearAuthCookies } from "@/lib/authCookies";

interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  user: null,
};

// Cookie writes are safe here: this store only runs in the browser, and the
// cookies must stay in lock-step with the tokens no matter which action fired.
const isBrowser = typeof window !== "undefined";

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: AuthUser }>
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      if (isBrowser) setAuthCookies(action.payload.accessToken, action.payload.refreshToken);
    },
    /**
     * Store a rotated token pair. The backend rotates the refresh token on
     * every /auth/refresh-token call — both tokens MUST be replaced together,
     * otherwise the next refresh uses a revoked token and force-logs-out.
     */
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      if (isBrowser) setAuthCookies(action.payload.accessToken, action.payload.refreshToken);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      if (isBrowser) clearAuthCookies();
    },
  },
});

export const { setCredentials, setTokens, logout } = authSlice.actions;
export default authSlice.reducer;
