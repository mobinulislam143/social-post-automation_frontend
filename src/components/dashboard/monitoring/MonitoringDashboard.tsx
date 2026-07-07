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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  RefreshCw,
  History,
  Pencil,
  Trash2,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useAppSelector } from "@/store/hooks";
import {
  useGetMonitorClientsQuery,
  useGetMonitorDashboardQuery,
  useRunMonitorCheckMutation,
  useDeleteMonitorClientMutation,
} from "@/store/api/monitoringApi";
import {
  ClientStatus,
  MonitoredClient,
  SocialPlatform,
  SocialProfile,
} from "@/types/monitoring.type";
import { StatusBadge } from "./StatusBadge";
import PlatformIcon from "./PlatformIcon";
import ClientFormModal from "./ClientFormModal";
import CustomPaginations from "../../common/CustomPaginations";

// ─────────────────────────────────────────────────────────────────────────────
// Social posting monitor — one row per client, one column per platform.
// Each cell answers the only question that matters: did they post in the
// last 24h?  ✓ Posted / ✗ No post / ⚠ Error / — no profile.
// ─────────────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 25;

// The platforms shown as columns — each cell answers "posted in last 24h?".
const PLATFORM_COLUMNS: SocialPlatform[] = ["INSTAGRAM", "YOUTUBE", "TIKTOK", "LINKEDIN"];

const STATUS_FILTERS: Array<{ value: ClientStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "COMPLETE", label: "Complete" },
  { value: "PARTIAL", label: "Partial" },
  { value: "MISSING", label: "Missing" },
  { value: "ERROR", label: "Error" },
  { value: "PENDING", label: "Pending" },
];

/** One table cell: the latest post result for a client's profile on a platform. */
function PlatformCell({ profile }: { profile: SocialProfile | undefined }) {
  if (!profile) {
    return (
      <div className="flex items-center gap-1.5 text-gray-300">
        <Minus className="w-4 h-4" />
      </div>
    );
  }

  if (!profile.lastStatus) {
    return (
      <a href={profile.url} target="_blank" rel="noreferrer" title={`@${profile.username} — not checked yet`}>
        <span className="text-xs text-gray-400">not checked</span>
      </a>
    );
  }

  if (profile.lastStatus === "POSTED") {
    return (
      <a
        href={profile.url}
        target="_blank"
        rel="noreferrer"
        title={`@${profile.username}`}
        className="inline-flex items-center gap-1.5"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span className="text-sm font-medium text-emerald-700">Posted</span>
        {profile.lastPostAt && (
          <span className="text-xs text-gray-400 hidden xl:inline">
            {formatDistanceToNow(new Date(profile.lastPostAt), { addSuffix: true })}
          </span>
        )}
      </a>
    );
  }

  if (profile.lastStatus === "NO_RECENT_POST") {
    return (
      <a
        href={profile.url}
        target="_blank"
        rel="noreferrer"
        title={`@${profile.username}${profile.lastPostAt ? ` — last post ${formatDistanceToNow(new Date(profile.lastPostAt), { addSuffix: true })}` : ""}`}
        className="inline-flex items-center gap-1.5"
      >
        <XCircle className="w-4 h-4 text-red-500" />
        <span className="text-sm font-medium text-red-600">No post</span>
        {profile.lastPostAt && (
          <span className="text-xs text-gray-400 hidden xl:inline">
            last {formatDistanceToNow(new Date(profile.lastPostAt), { addSuffix: true })}
          </span>
        )}
      </a>
    );
  }

  return (
    <a
      href={profile.url}
      target="_blank"
      rel="noreferrer"
      title={profile.lastError ?? "Check failed"}
      className="inline-flex items-center gap-1.5"
    >
      <AlertTriangle className="w-4 h-4 text-orange-500" />
      <span className="text-sm font-medium text-orange-600">Error</span>
    </a>
  );
}

export default function MonitoringDashboard() {
  const isAdmin = useAppSelector((s) => s.auth.user?.role === "admin");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ClientStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MonitoredClient | null>(null);
  const [deleting, setDeleting] = useState<MonitoredClient | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  const { data: summary } = useGetMonitorDashboardQuery(undefined, {
    pollingInterval: 60_000,
  });
  const { data, isLoading } = useGetMonitorClientsQuery(
    {
      page,
      limit: PAGE_SIZE,
      search: search || undefined,
      status: status === "ALL" ? "" : status,
    },
    { pollingInterval: 60_000 }
  );

  const [runCheck] = useRunMonitorCheckMutation();
  const [deleteClient, { isLoading: isDeleting }] = useDeleteMonitorClientMutation();

  const clients = data?.data ?? [];
  const meta = data?.meta;

  const profileFor = (client: MonitoredClient, platform: SocialPlatform) =>
    client.profiles.find((p) => p.platform === platform && p.isActive);

  const handleCheck = async (client?: MonitoredClient) => {
    setCheckingId(client?.id ?? "ALL");
    try {
      const res = await runCheck({ clientId: client?.id }).unwrap();
      toast.success(
        client
          ? `${client.name}: ${res.data.summaries[0]?.status ?? "checked"}`
          : `Checked ${res.data.total} clients`
      );
    } catch (err) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ?? "Check failed";
      toast.error(message);
    } finally {
      setCheckingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      await deleteClient(deleting.id).unwrap();
      toast.success(`${deleting.name} deleted`);
      setDeleting(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-5 animate-fade-up">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Social Posting Monitor</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Did each client post in the last {summary?.data.supportedWindowHours ?? 24}h?
            {summary?.data.lastCheckedAt && (
              <>
                {" · last check "}
                {formatDistanceToNow(new Date(summary.data.lastCheckedAt), {
                  addSuffix: true,
                })}
              </>
            )}
          </p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleCheck()}
              disabled={checkingId !== null}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${checkingId === "ALL" ? "animate-spin" : ""}`}
              />
              Check all now
            </Button>
            <Button onClick={() => { setEditing(null); setFormOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Add client
            </Button>
          </div>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 sm:max-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search clients…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => { setStatus(v as ClientStatus | "ALL"); setPage(1); }}
        >
          <SelectTrigger className="w-full sm:w-44 h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ── Mobile: card per client ── */}
      <div className="md:hidden space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 w-full" />)
        ) : clients.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-10">No clients found.</p>
        ) : (
          clients.map((client) => (
            <div key={client.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{client.name}</div>
                  {client.division && <div className="text-xs text-gray-400">{client.division}</div>}
                </div>
                <StatusBadge status={client.lastStatus} />
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {PLATFORM_COLUMNS.map((platform) => {
                  const profile = profileFor(client, platform);
                  if (!profile) return null;
                  return (
                    <div key={platform} className="flex items-center gap-1.5 min-w-0">
                      <PlatformIcon platform={platform} className="w-3.5 h-3.5 flex-shrink-0" />
                      <PlatformCell profile={profile} />
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                <span className="text-xs text-gray-400">
                  {client.lastCheckedAt
                    ? `checked ${formatDistanceToNow(new Date(client.lastCheckedAt), { addSuffix: true })}`
                    : "never checked"}
                </span>
                <div className="flex items-center gap-1">
                  {isAdmin && (
                    <Button variant="ghost" size="icon" title="Check now" onClick={() => handleCheck(client)} disabled={checkingId !== null}>
                      <RefreshCw className={`w-4 h-4 ${checkingId === client.id ? "animate-spin" : ""}`} />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" title="History" asChild>
                    <Link href={`/dashboard/monitoring/${client.id}`}><History className="w-4 h-4" /></Link>
                  </Button>
                  {isAdmin && (
                    <>
                      <Button variant="ghost" size="icon" title="Edit" onClick={() => { setEditing(client); setFormOpen(true); }}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Delete" className="text-red-500" onClick={() => setDeleting(client)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop / tablet: table with one platform column each ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto max-w-full">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Client</TableHead>
              {PLATFORM_COLUMNS.map((platform) => (
                <TableHead key={platform} className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <span className="inline-flex items-center gap-1.5">
                    <PlatformIcon platform={platform} className="w-3.5 h-3.5" />
                    {platform.charAt(0) + platform.slice(1).toLowerCase()}
                  </span>
                </TableHead>
              ))}
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Checked</TableHead>
              <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}><Skeleton className="h-8 w-full" /></TableCell>
                </TableRow>
              ))
            ) : clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-sm text-gray-500 py-10">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50/70 transition-colors">
                  <TableCell>
                    <div className="font-medium text-gray-900">{client.name}</div>
                    {client.division && (
                      <div className="text-xs text-gray-400">{client.division}</div>
                    )}
                  </TableCell>
                  {PLATFORM_COLUMNS.map((platform) => (
                    <TableCell key={platform}>
                      <PlatformCell profile={profileFor(client, platform)} />
                    </TableCell>
                  ))}
                  <TableCell><StatusBadge status={client.lastStatus} /></TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-gray-500 whitespace-nowrap">
                    {client.lastCheckedAt
                      ? formatDistanceToNow(new Date(client.lastCheckedAt), { addSuffix: true })
                      : "never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Check now"
                          onClick={() => handleCheck(client)}
                          disabled={checkingId !== null}
                        >
                          <RefreshCw
                            className={`w-4 h-4 ${checkingId === client.id ? "animate-spin" : ""}`}
                          />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" title="History" asChild>
                        <Link href={`/dashboard/monitoring/${client.id}`}>
                          <History className="w-4 h-4" />
                        </Link>
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            onClick={() => { setEditing(client); setFormOpen(true); }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setDeleting(client)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination ── */}
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

      {/* ── Modals ── */}
      <ClientFormModal open={formOpen} onOpenChange={setFormOpen} client={editing} />

      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleting?.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the client, its profiles, and all check history. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
