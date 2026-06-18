import { http, HttpResponse } from "msw";
import { env } from "@/config/env";

const base = env.API_BASE_URL;

const MOCK_USER = {
  id: "usr_1",
  email: "admin@example.com",
  name: "Demo Admin",
  role: "owner" as const,
  profileImage: null,
  phone: null,
  createdAt: new Date().toISOString(),
};

const MOCK_ORG = {
  id: "org_1",
  name: "Acme Corp",
  slug: "acme",
  logoUrl: null,
  plan: "free" as const,
  createdAt: new Date().toISOString(),
};

export const handlers = [
  // ─── Auth ──────────────────────────────────────────────────────────────────

  http.post(`${base}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (body.password.length < 8) {
      return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
    return HttpResponse.json({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: { ...MOCK_USER, email: body.email },
    });
  }),

  http.post(`${base}/users/register`, async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string };
    return HttpResponse.json(
      { message: "Registration successful", user: { ...MOCK_USER, ...body } },
      { status: 201 }
    );
  }),

  http.post(`${base}/auth/refresh`, () =>
    HttpResponse.json({ accessToken: "mock-refreshed-access-token" })
  ),

  http.post(`${base}/auth/logout`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${base}/users/me`, () => HttpResponse.json(MOCK_USER)),

  http.post(`${base}/auth/forgot-password`, () =>
    HttpResponse.json({ message: "OTP sent to your email" })
  ),

  http.post(`${base}/auth/verify-otp`, () =>
    HttpResponse.json({ message: "OTP verified" })
  ),

  http.post(`${base}/auth/reset-password`, () =>
    HttpResponse.json({ message: "Password reset successful" })
  ),

  http.put(`${base}/users/change-password`, () =>
    HttpResponse.json({ message: "Password changed" })
  ),

  http.put(`${base}/users/profile`, async ({ request }) => {
    const body = (await request.json()) as Partial<typeof MOCK_USER>;
    return HttpResponse.json({ ...MOCK_USER, ...body });
  }),

  // ─── Organizations ─────────────────────────────────────────────────────────

  http.get(`${base}/organizations`, () => HttpResponse.json([MOCK_ORG])),

  http.get(`${base}/organizations/:orgId`, ({ params }) =>
    HttpResponse.json({ ...MOCK_ORG, id: params.orgId })
  ),

  http.post(`${base}/organizations`, async ({ request }) => {
    const body = (await request.json()) as { name: string; slug: string };
    return HttpResponse.json({ ...MOCK_ORG, ...body, id: "org_new" }, { status: 201 });
  }),

  http.put(`${base}/organizations/:orgId`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<typeof MOCK_ORG>;
    return HttpResponse.json({ ...MOCK_ORG, id: params.orgId, ...body });
  }),

  http.delete(`${base}/organizations/:orgId`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  http.get(`${base}/organizations/:orgId/members`, () =>
    HttpResponse.json([
      {
        id: "mem_1",
        userId: MOCK_USER.id,
        orgId: MOCK_ORG.id,
        role: "owner",
        user: { id: MOCK_USER.id, name: MOCK_USER.name, email: MOCK_USER.email, profileImage: null },
        joinedAt: new Date().toISOString(),
      },
    ])
  ),

  http.delete(`${base}/organizations/:orgId/members/:userId`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  http.patch(`${base}/organizations/:orgId/members/:userId/role`, async ({ request }) => {
    const body = (await request.json()) as { role: string };
    return HttpResponse.json({ role: body.role });
  }),

  http.get(`${base}/organizations/:orgId/invites`, () => HttpResponse.json([])),

  http.post(`${base}/organizations/:orgId/invites`, async ({ params, request }) => {
    const body = (await request.json()) as { email: string; role: string };
    return HttpResponse.json(
      {
        id: "inv_1",
        email: body.email,
        role: body.role,
        orgId: params.orgId,
        expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.delete(`${base}/organizations/:orgId/invites/:inviteId`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  http.post(`${base}/organizations/:orgId/invites/:inviteId/resend`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  // ─── Admin ──────────────────────────────────────────────────────────────────

  http.get(`${base}/admin/stats`, () =>
    HttpResponse.json({
      totalUsers: 128,
      totalOrgs: 14,
      activeUsersToday: 23,
      newUsersThisMonth: 31,
    })
  ),

  http.get(`${base}/admin/users`, () =>
    HttpResponse.json({
      data: [{ ...MOCK_USER, orgCount: 1, lastLoginAt: new Date().toISOString() }],
      total: 1,
      page: 1,
      limit: 20,
      totalPages: 1,
    })
  ),

  http.patch(`${base}/admin/users/:userId/role`, async ({ request }) => {
    const body = (await request.json()) as { role: string };
    return HttpResponse.json({ ...MOCK_USER, role: body.role });
  }),

  http.delete(`${base}/admin/users/:userId`, () =>
    new HttpResponse(null, { status: 204 })
  ),

  http.get(`${base}/admin/audit-logs`, () =>
    HttpResponse.json({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 })
  ),
];
