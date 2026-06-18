// ─── Shared ────────────────────────────────────────────────────────────────

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export type Role = "owner" | "admin" | "member";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  profileImage: string | null;
  phone: string | null;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: AuthUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

// ─── Organization ────────────────────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
}

export interface Member {
  id: string;
  userId: string;
  orgId: string;
  role: Role;
  user: Pick<AuthUser, "id" | "name" | "email" | "profileImage">;
  joinedAt: string;
}

export interface Invite {
  id: string;
  email: string;
  role: Role;
  orgId: string;
  expiresAt: string;
  createdAt: string;
}

export interface CreateOrgRequest {
  name: string;
  slug: string;
}

export interface UpdateOrgRequest {
  name?: string;
  logoUrl?: string;
}

export interface InviteMemberRequest {
  email: string;
  role: Role;
}

export interface UpdateMemberRoleRequest {
  role: Role;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface AdminUser extends AuthUser {
  orgCount: number;
  lastLoginAt: string | null;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  meta: Record<string, unknown>;
  createdAt: string;
  user: Pick<AuthUser, "id" | "name" | "email">;
}

export interface AdminStats {
  totalUsers: number;
  totalOrgs: number;
  activeUsersToday: number;
  newUsersThisMonth: number;
}

export interface UpdateUserRoleRequest {
  role: Role;
}
