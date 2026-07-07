"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserPlus,
  Image as ImageIcon,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  BarChart3,
  Layers,
} from "lucide-react";
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
  BarChart,
  Bar,
} from "recharts";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";
import {
  useGetMonitorClientsQuery,
  useGetMonitorMetricsQuery,
  useGetMonitorMetricsOverviewQuery,
  useRunMonitorCheckMutation,
} from "@/store/api/monitoringApi";
import { SocialPlatform } from "@/types/monitoring.type";
import PlatformIcon from "./PlatformIcon";

type ChartMetric = "followers" | "following" | "postCount";

const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM: "#E1306C",
  YOUTUBE: "#FF0000",
  TIKTOK: "#111111",
  LINKEDIN: "#0A66C2",
  X: "#555555",
  FACEBOOK: "#1877F2",
};

const METRIC_LABELS: Record<ChartMetric, string> = {
  followers: "Followers",
  following: "Following",
  postCount: "Posts",
};

const RANGES = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

const TRACKED: SocialPlatform[] = ["INSTAGRAM", "YOUTUBE", "TIKTOK", "LINKEDIN"];

function formatCount(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function GrowthBadge({
  delta,
  percent,
}: {
  delta: number | null;
  percent: number | null;
}) {
  if (delta === null || delta === 0) {
    return <span className="text-xs text-gray-400">no change yet</span>;
  }
  const up = delta > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        up ? "text-emerald-600" : "text-red-500"
      }`}
    >
      <Icon className="w-3 h-3" />
      {up ? "+" : ""}
      {formatCount(delta)}
      {percent !== null && ` (${up ? "+" : ""}${percent}%)`}
    </span>
  );
}

export default function MetricsView() {
  const isAdmin = useAppSelector((s) => s.auth.user?.role === "admin");

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
  const [chartMetric, setChartMetric] = useState<ChartMetric>("followers");
  const [refreshing, setRefreshing] = useState(false);

  const activeClientId = clientId || clients[0]?.id || "";
  const daysNum = parseInt(days, 10);

  useEffect(() => {
    if (!clientId && clients[0]?.id) setClientId(clients[0].id);
  }, [clientId, clients]);

  const {
    data: metricsRes,
    isLoading: loadingMetrics,
    isFetching: fetchingMetrics,
    isError: metricsError,
    refetch: refetchMetrics,
  } = useGetMonitorMetricsQuery(
    { clientId: activeClientId, days: daysNum },
    { skip: !activeClientId, pollingInterval: 60_000 }
  );

  const { data: overviewRes, isLoading: loadingOverview } =
    useGetMonitorMetricsOverviewQuery({ days: daysNum });

  const [runCheck] = useRunMonitorCheckMutation();
  const metrics = metricsRes?.data;
  const overview = overviewRes?.data;

  const chartData = useMemo(() => {
    if (!metrics) return [];
    const byTime = new Map<number, Record<string, number | string>>();
    for (const s of metrics.series) {
      for (const p of s.points) {
        const value = p[chartMetric];
        if (value === null || value === undefined) continue;
        const t = new Date(p.capturedAt).getTime();
        const row = byTime.get(t) ?? { t };
        row[s.platform] = value;
        byTime.set(t, row);
      }
    }
    return [...byTime.values()].sort((a, b) => (a.t as number) - (b.t as number));
  }, [metrics, chartMetric]);

  const platformsInChart = useMemo(
    () =>
      (metrics?.series ?? [])
        .filter((s) => s.points.some((p) => p[chartMetric] !== null))
        .map((s) => s.platform),
    [metrics, chartMetric]
  );

  const platformBarData = useMemo(() => {
    if (!metrics) return [];
    return metrics.profiles
      .filter((p) => TRACKED.includes(p.platform))
      .map((p) => ({
        platform: p.platform.charAt(0) + p.platform.slice(1).toLowerCase(),
        followers: p.followers ?? 0,
        following: p.following ?? 0,
        posts: p.postCount ?? 0,
      }));
  }, [metrics]);

  const handleRefresh = async () => {
    if (!activeClientId) return;
    setRefreshing(true);
    try {
      if (isAdmin) {
        await runCheck({ clientId: activeClientId }).unwrap();
        toast.success("Metrics refreshed");
      }
      await refetchMetrics();
    } catch {
      toast.error("Could not refresh metrics");
    } finally {
      setRefreshing(false);
    }
  };

  const noClients = !loadingClients && clients.length === 0;
  const showSkeleton = loadingClients || (activeClientId && loadingMetrics && !metrics);

  return (
    <div className="space-y-5 animate-fade-up min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Metrics</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Audience numbers across Instagram, YouTube, TikTok, and LinkedIn — updated every check.
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <Select value={activeClientId} onValueChange={setClientId} disabled={noClients}>
            <SelectTrigger className="w-full sm:w-56 h-9">
              <SelectValue placeholder={loadingClients ? "Loading…" : "Select client"} />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                  {c.division ? ` · ${c.division}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={days} onValueChange={setDays}>
            <SelectTrigger className="w-full sm:w-40 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGES.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeClientId && (
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={handleRefresh}
              disabled={refreshing || fetchingMetrics}
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
              {isAdmin ? "Refresh" : "Reload"}
            </Button>
          )}
        </div>
      </div>

      {/* Ecosystem overview */}
      {loadingOverview ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : overview ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Users className="w-3.5 h-3.5" /> Total audience
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCount(overview.totalFollowers)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                across {overview.clientCount} clients
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <UserPlus className="w-3.5 h-3.5" /> Total following
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCount(overview.totalFollowing)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                {overview.profilesWithData}/{overview.profileCount} profiles with data
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ImageIcon className="w-3.5 h-3.5" /> Total posts
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCount(overview.totalPosts)}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">published content count</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Layers className="w-3.5 h-3.5" /> By platform
              </div>
              <div className="mt-2 space-y-1">
                {overview.byPlatform
                  .filter((p) => TRACKED.includes(p.platform))
                  .slice(0, 4)
                  .map((p) => (
                    <div key={p.platform} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-gray-600">
                        <PlatformIcon platform={p.platform} />
                        {p.platform.charAt(0) + p.platform.slice(1).toLowerCase()}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatCount(p.followers)}
                      </span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {noClients && (
        <Card>
          <CardContent className="py-12 text-center text-sm text-gray-500">
            No clients with social profiles yet. Add clients from the Monitoring page first.
          </CardContent>
        </Card>
      )}

      {metricsError && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-6 text-center text-sm text-red-600">
            Could not load metrics. Try refreshing or run a new check.
          </CardContent>
        </Card>
      )}

      {showSkeleton ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      ) : metrics ? (
        <>
          {/* Client summary row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card className="col-span-2 lg:col-span-1">
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500">{metrics.client.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCount(metrics.summary.totalFollowers)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">total followers</p>
                <div className="mt-2">
                  <GrowthBadge
                    delta={metrics.summary.followerGrowth.delta}
                    percent={metrics.summary.followerGrowth.percent}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500">Following</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCount(metrics.summary.totalFollowing)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500">Posts</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCount(metrics.summary.totalPosts)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <p className="text-xs text-gray-500">Coverage</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {metrics.summary.platformsWithData}/{metrics.summary.platformsTracked}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {metrics.summary.snapshotCount} snapshots
                  {metrics.summary.lastCheckedAt &&
                    ` · ${formatDistanceToNow(new Date(metrics.summary.lastCheckedAt), { addSuffix: true })}`}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Per-platform cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {metrics.profiles
              .filter((p) => TRACKED.includes(p.platform))
              .map((p) => (
                <Card key={p.id} className="min-w-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <PlatformIcon platform={p.platform as SocialPlatform} />
                      {p.platform.charAt(0) + p.platform.slice(1).toLowerCase()}
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-normal text-gray-400 truncate hover:text-gray-600"
                      >
                        @{p.username}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Users className="w-3 h-3" /> Followers
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCount(p.followers)}
                        </p>
                        <GrowthBadge
                          delta={p.growth.followers.delta}
                          percent={p.growth.followers.percent}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <UserPlus className="w-3 h-3" /> Following
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCount(p.following)}
                        </p>
                        <GrowthBadge
                          delta={p.growth.following.delta}
                          percent={p.growth.following.percent}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <ImageIcon className="w-3 h-3" /> Posts
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatCount(p.postCount)}
                        </p>
                        <GrowthBadge
                          delta={p.growth.postCount.delta}
                          percent={p.growth.postCount.percent}
                        />
                      </div>
                    </div>
                    {p.lastCheckedAt && (
                      <p className="text-[11px] text-gray-400 mt-2">
                        updated{" "}
                        {formatDistanceToNow(new Date(p.lastCheckedAt), { addSuffix: true })}
                      </p>
                    )}
                    {p.followers === null && p.following === null && p.postCount === null && (
                      <p className="text-[11px] text-amber-600 mt-2">
                        No data yet — run a check to capture numbers
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            {metrics.profiles.filter((p) => TRACKED.includes(p.platform)).length === 0 && (
              <p className="text-sm text-gray-500 col-span-full">
                This client has no tracked social profiles yet.
              </p>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <Card className="min-w-0 xl:col-span-2">
              <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  {METRIC_LABELS[chartMetric]} over time — {metrics.client.name}
                </CardTitle>
                <Select
                  value={chartMetric}
                  onValueChange={(v) => setChartMetric(v as ChartMetric)}
                >
                  <SelectTrigger className="w-36 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="following">Following</SelectItem>
                    <SelectItem value="postCount">Posts</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {chartData.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <p className="text-sm text-gray-500">
                      No {METRIC_LABELS[chartMetric].toLowerCase()} history in this range yet.
                    </p>
                    <p className="text-xs text-gray-400">
                      Snapshots are saved on every check — run one now and the chart will start filling in.
                    </p>
                    {isAdmin && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={handleRefresh}
                        disabled={refreshing}
                      >
                        <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
                        Run check now
                      </Button>
                    )}
                  </div>
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
                          formatter={(value, name) => [
                            formatCount(value as number),
                            String(name).charAt(0) + String(name).slice(1).toLowerCase(),
                          ]}
                        />
                        <Legend />
                        {platformsInChart.map((platform) => (
                          <Line
                            key={platform}
                            type="monotone"
                            dataKey={platform}
                            stroke={PLATFORM_COLORS[platform] ?? "#888"}
                            strokeWidth={2}
                            dot={chartData.length <= 3}
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

            {platformBarData.some((d) => d.followers > 0 || d.following > 0 || d.posts > 0) && (
              <Card className="min-w-0 xl:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold text-gray-700">
                    Current snapshot by platform
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={platformBarData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="platform" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                        <YAxis
                          tickFormatter={(v) => formatCount(v as number)}
                          tick={{ fontSize: 12 }}
                          stroke="#9ca3af"
                          width={50}
                        />
                        <Tooltip formatter={(value) => formatCount(value as number)} />
                        <Legend />
                        <Bar dataKey="followers" name="Followers" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="following" name="Following" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="posts" name="Posts" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Top clients leaderboard */}
          {overview && overview.topClients.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-700">
                  Top clients by audience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100">
                  {overview.topClients.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setClientId(c.id)}
                      className={`w-full flex items-center justify-between py-2.5 text-left hover:bg-gray-50 -mx-2 px-2 rounded-md transition-colors ${
                        c.id === activeClientId ? "bg-indigo-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-medium text-gray-400 w-4">{i + 1}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                          {c.division && (
                            <p className="text-xs text-gray-400 truncate">{c.division}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCount(c.totalFollowers)}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {c.platformsWithData} platform{c.platformsWithData !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : null}
    </div>
  );
}
