"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, UserPlus, Image as ImageIcon } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  useGetMonitorClientsQuery,
  useGetMonitorMetricsQuery,
} from "@/store/api/monitoringApi";
import { SocialPlatform } from "@/types/monitoring.type";
import PlatformIcon from "./PlatformIcon";

// ─────────────────────────────────────────────────────────────────────────────
// Metrics — audience numbers per client: current followers / following / posts
// per platform, plus follower growth over time (snapshots are captured on
// every hourly check, so the chart densifies automatically).
// ─────────────────────────────────────────────────────────────────────────────

const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: "#E1306C",
  YOUTUBE: "#FF0000",
  TIKTOK: "#111111",
  LINKEDIN: "#0A66C2",
  X: "#555555",
  FACEBOOK: "#1877F2",
};

const RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

// Platforms we actually collect metrics for (matches the monitoring columns).
const TRACKED: SocialPlatform[] = ["INSTAGRAM", "YOUTUBE", "TIKTOK", "LINKEDIN"];

function formatCount(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

export default function MetricsView() {
  const { data: clientsRes, isLoading: loadingClients } = useGetMonitorClientsQuery({
    page: 1,
    limit: 100,
  });
  const clients = useMemo(
    () => (clientsRes?.data ?? []).filter((c) => c.profiles.length > 0),
    [clientsRes]
  );

  const [clientId, setClientId] = useState<string>("");
  const [days, setDays] = useState("30");
  const activeClientId = clientId || clients[0]?.id || "";

  const { data: metricsRes, isLoading: loadingMetrics } = useGetMonitorMetricsQuery(
    { clientId: activeClientId, days: parseInt(days, 10) },
    { skip: !activeClientId }
  );

  const metrics = metricsRes?.data;

  // Merge all profiles' follower series into one recharts dataset keyed by time.
  const chartData = useMemo(() => {
    if (!metrics) return [];
    const byTime = new Map<number, Record<string, number | string>>();
    for (const s of metrics.series) {
      for (const p of s.points) {
        if (p.followers === null) continue;
        const t = new Date(p.capturedAt).getTime();
        const row = byTime.get(t) ?? { t };
        row[s.platform] = p.followers;
        byTime.set(t, row);
      }
    }
    return [...byTime.values()].sort((a, b) => (a.t as number) - (b.t as number));
  }, [metrics]);

  const platformsInChart = useMemo(
    () =>
      (metrics?.series ?? [])
        .filter((s) => s.points.some((p) => p.followers !== null))
        .map((s) => s.platform),
    [metrics]
  );

  return (
    <div className="space-y-5 animate-fade-up min-w-0">
      {/* ── Header + selectors ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Metrics</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Followers, following, and post counts — captured on every check.
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <Select value={activeClientId} onValueChange={setClientId}>
            <SelectTrigger className="w-full sm:w-56 h-9">
              <SelectValue placeholder={loadingClients ? "Loading…" : "Select client"} />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-full sm:w-40 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loadingMetrics || !metrics ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        <>
          {/* ── Current numbers per platform ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {metrics.profiles.map((p) => (
              <Card key={p.id} className="min-w-0">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <PlatformIcon platform={p.platform as SocialPlatform} />
                    {p.platform.charAt(0) + p.platform.slice(1).toLowerCase()}
                    <span className="text-xs font-normal text-gray-400 truncate">@{p.username}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="w-3 h-3" /> Followers
                      </div>
                      <p className="text-lg font-bold text-gray-900">{formatCount(p.followers)}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <UserPlus className="w-3 h-3" /> Following
                      </div>
                      <p className="text-lg font-bold text-gray-900">{formatCount(p.following)}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <ImageIcon className="w-3 h-3" /> Posts
                      </div>
                      <p className="text-lg font-bold text-gray-900">{formatCount(p.postCount)}</p>
                    </div>
                  </div>
                  {p.lastCheckedAt && (
                    <p className="text-[11px] text-gray-400 mt-2">
                      updated {formatDistanceToNow(new Date(p.lastCheckedAt), { addSuffix: true })}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            {metrics.profiles.length === 0 && (
              <p className="text-sm text-gray-500 col-span-full">
                This client has no active social profiles.
              </p>
            )}
          </div>

          {/* ── Follower growth chart ── */}
          <Card className="min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">
                Follower growth — {metrics.client.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length < 2 ? (
                <p className="text-sm text-gray-500 py-10 text-center">
                  Not enough snapshots yet — metrics are captured on every hourly
                  check, so this chart fills in automatically over the next days.
                </p>
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="t"
                        type="number"
                        domain={["dataMin", "dataMax"]}
                        tickFormatter={(t) => format(new Date(t), "MMM d")}
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                      />
                      <YAxis
                        tickFormatter={(v) => formatCount(v as number)}
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                        width={50}
                      />
                      <Tooltip
                        labelFormatter={(t) => format(new Date(t as number), "MMM d, HH:mm")}
                        formatter={(value) => [formatCount(value as number), ""]}
                      />
                      <Legend />
                      {platformsInChart.map((platform) => (
                        <Line
                          key={platform}
                          type="monotone"
                          dataKey={platform}
                          stroke={PLATFORM_COLORS[platform] ?? "#888"}
                          strokeWidth={2}
                          dot={false}
                          connectNulls
                          name={platform.charAt(0) + platform.slice(1).toLowerCase()}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
