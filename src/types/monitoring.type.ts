// ─── Social Posting Monitor ──────────────────────────────────────────────────
// Mirrors the backend Prisma enums + API envelope (success/message/data/meta).

export type SocialPlatform =
  | "INSTAGRAM"
  | "YOUTUBE"
  | "TIKTOK"
  | "FACEBOOK"
  | "LINKEDIN"
  | "X";

export type ClientStatus = "COMPLETE" | "PARTIAL" | "MISSING" | "ERROR" | "PENDING";

export type ProfileCheckStatus = "POSTED" | "NO_RECENT_POST" | "ERROR";

export type CheckTrigger = "SCHEDULED" | "MANUAL";

export interface SocialProfile {
  id: string;
  platform: SocialPlatform;
  username: string;
  url: string;
  isActive: boolean;
  lastStatus: ProfileCheckStatus | null;
  lastPostAt: string | null;
  lastCheckedAt: string | null;
  lastError: string | null;
  followers: number | null;
  following: number | null;
  postCount: number | null;
}

// ─── Metrics ────────────────────────────────────────────────────────────────

export interface MetricPoint {
  capturedAt: string;
  followers: number | null;
  following: number | null;
  postCount: number | null;
}

export interface ClientMetrics {
  client: { id: string; name: string };
  profiles: Array<{
    id: string;
    platform: SocialPlatform;
    username: string;
    followers: number | null;
    following: number | null;
    postCount: number | null;
    lastCheckedAt: string | null;
  }>;
  series: Array<{
    profileId: string;
    platform: SocialPlatform;
    username: string;
    points: MetricPoint[];
  }>;
}

export interface MonitoredClient {
  id: string;
  name: string;
  slug: string;
  division: string;
  description: string;
  website: string | null;
  logoUrl: string | null;
  notes: string;
  isActive: boolean;
  lastStatus: ClientStatus;
  lastCheckedAt: string | null;
  profiles: SocialProfile[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfileCheckResult {
  id: string;
  profileId: string;
  platform: SocialPlatform;
  status: ProfileCheckStatus;
  lastPostAt: string | null;
  error: string | null;
}

export interface ClientCheck {
  id: string;
  clientId: string;
  status: ClientStatus;
  triggeredBy: CheckTrigger;
  checkedAt: string;
  profileResults: ProfileCheckResult[];
}

export interface DashboardSummary {
  totals: Record<ClientStatus | "ALL", number>;
  lastCheckedAt: string | null;
  supportedWindowHours: number;
}

export interface CheckRunSummary {
  clientId: string;
  clientName: string;
  status: ClientStatus;
  checkedAt: string;
  profiles: Array<{
    platform: SocialPlatform;
    username: string;
    status: ProfileCheckStatus;
    lastPostAt: string | null;
    error: string | null;
  }>;
}

export interface CheckRunResponse {
  total: number;
  summaries: CheckRunSummary[];
  startedAt: string;
  finishedAt: string;
}

export interface ProfileInput {
  platform: SocialPlatform;
  username: string;
  url?: string;
  isActive?: boolean;
}

export interface ClientInput {
  name: string;
  division?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  notes?: string;
  isActive?: boolean;
  profiles?: ProfileInput[];
}

// ─── Backend response envelope ───────────────────────────────────────────────

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
