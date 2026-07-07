import Cookies from "js-cookie";

// ─────────────────────────────────────────────────────────────────────────────
// Auth token cookies.
// Cookies (not just localStorage) so the Next.js proxy can guard /dashboard
// routes server-side before any page renders.
// ─────────────────────────────────────────────────────────────────────────────

export const ACCESS_COOKIE = "omira_access";
export const REFRESH_COOKIE = "omira_refresh";

const COOKIE_OPTS: Cookies.CookieAttributes = {
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  // Refresh tokens live 7 days on the backend — match it.
  expires: 7,
};

export function setAuthCookies(accessToken: string, refreshToken?: string): void {
  Cookies.set(ACCESS_COOKIE, accessToken, COOKIE_OPTS);
  if (refreshToken) Cookies.set(REFRESH_COOKIE, refreshToken, COOKIE_OPTS);
}

export function clearAuthCookies(): void {
  Cookies.remove(ACCESS_COOKIE);
  Cookies.remove(REFRESH_COOKIE);
}
