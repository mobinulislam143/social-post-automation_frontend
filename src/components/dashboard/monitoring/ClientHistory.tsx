"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  useGetMonitorClientQuery,
  useGetMonitorHistoryQuery,
} from "@/store/api/monitoringApi";
import { StatusBadge, ProfileStatusBadge } from "./StatusBadge";
import PlatformIcon from "./PlatformIcon";
import CustomPaginations from "../../common/CustomPaginations";

// ─────────────────────────────────────────────────────────────────────────────
// Per-client check history — one row per check run, expanded with the
// per-profile outcomes underneath.
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 15;

export default function ClientHistory({ clientId }: { clientId: string }) {
  const [page, setPage] = useState(1);

  const { data: clientRes, isLoading: loadingClient } = useGetMonitorClientQuery(clientId);
  const { data: historyRes, isLoading: loadingHistory } = useGetMonitorHistoryQuery({
    clientId,
    page,
    limit: PAGE_SIZE,
  });

  const client = clientRes?.data;
  const checks = historyRes?.data ?? [];
  const meta = historyRes?.meta;

  // Profile id → username lookup for readable history rows.
  const usernameOf = (profileId: string): string =>
    client?.profiles.find((p) => p.id === profileId)?.username ?? "removed profile";

  if (loadingClient) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-up">
      {/* ── Header ── */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon" asChild className="mt-0.5">
          <Link href="/dashboard/monitoring">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{client?.name}</h1>
            {client && <StatusBadge status={client.lastStatus} />}
            {client?.division && (
              <Badge variant="outline" className="text-gray-600">{client.division}</Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">{client?.description}</p>
          <div className="flex items-center gap-3 mt-2">
            {client?.profiles.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-brand"
              >
                <PlatformIcon platform={p.platform} />
                @{p.username}
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── History table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Checked</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Trigger</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profile results</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingHistory ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}><Skeleton className="h-8 w-full" /></TableCell>
                </TableRow>
              ))
            ) : checks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-gray-500 py-10">
                  No checks recorded yet — run &quot;Check Now&quot; from the dashboard
                  or wait for the next hourly sweep.
                </TableCell>
              </TableRow>
            ) : (
              checks.map((check) => (
                <TableRow key={check.id} className="hover:bg-gray-50/70 align-top">
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {format(new Date(check.checkedAt), "MMM d, HH:mm")}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(check.checkedAt), { addSuffix: true })}
                    </div>
                  </TableCell>
                  <TableCell><StatusBadge status={check.status} /></TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="text-gray-500 font-normal">
                      {check.triggeredBy === "SCHEDULED" ? "Hourly (n8n)" : "Manual"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      {check.profileResults.map((r) => (
                        <div key={r.id} className="flex items-center gap-2 text-sm">
                          <PlatformIcon platform={r.platform} />
                          <span className="text-gray-600 min-w-0 truncate">
                            @{usernameOf(r.profileId)}
                          </span>
                          <ProfileStatusBadge status={r.status} />
                          {r.lastPostAt && (
                            <span className="text-xs text-gray-400">
                              last post {formatDistanceToNow(new Date(r.lastPostAt), { addSuffix: true })}
                            </span>
                          )}
                          {r.error && (
                            <span className="text-xs text-orange-500 truncate" title={r.error}>
                              {r.error}
                            </span>
                          )}
                        </div>
                      ))}
                      {check.profileResults.length === 0 && (
                        <span className="text-xs text-gray-400">no scrapable profiles</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {meta && meta.totalPages > 1 && (
        <CustomPaginations
          currentPage={meta.page}
          totalPages={meta.totalPages}
          itemsPerPage={meta.limit}
          totalItems={meta.total}
          startIndex={(meta.page - 1) * meta.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
