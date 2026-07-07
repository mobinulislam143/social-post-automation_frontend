import { NextResponse, type NextRequest } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// Route guard (Next.js proxy — the middleware successor).
//   - /dashboard/** requires the auth cookies set at login; otherwise → /login
//   - /login and / bounce already-authenticated users to the dashboard
// Cookie presence is the gate here; actual token validity is enforced by the
// backend on every API call (invalid/expired sessions get logged out client-side).
// ─────────────────────────────────────────────────────────────────────────────

const REFRESH_COOKIE = "omira_refresh";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(REFRESH_COOKIE)?.value);

  if (pathname.startsWith("/dashboard") && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if ((pathname === "/login" || pathname === "/register" || pathname === "/") && hasSession) {
    return NextResponse.redirect(new URL("/dashboard/monitoring", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/"],
};
