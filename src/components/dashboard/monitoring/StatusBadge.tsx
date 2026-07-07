import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  AlertOctagon,
  Clock,
} from "lucide-react";
import { ClientStatus, ProfileCheckStatus } from "@/types/monitoring.type";

// ─── Client-level status badge ───────────────────────────────────────────────

const CLIENT_STYLES: Record<
  ClientStatus,
  { label: string; className: string; Icon: typeof CheckCircle2 }
> = {
  COMPLETE: {
    label: "Complete",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Icon: CheckCircle2,
  },
  PARTIAL: {
    label: "Partial",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    Icon: AlertTriangle,
  },
  MISSING: {
    label: "Missing",
    className: "bg-red-100 text-red-700 border-red-200",
    Icon: XCircle,
  },
  ERROR: {
    label: "Error",
    className: "bg-orange-100 text-orange-700 border-orange-200",
    Icon: AlertOctagon,
  },
  PENDING: {
    label: "Pending",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    Icon: Clock,
  },
};

export function StatusBadge({ status }: { status: ClientStatus }) {
  const { label, className, Icon } = CLIENT_STYLES[status] ?? CLIENT_STYLES.PENDING;
  return (
    <Badge variant="outline" className={cn("gap-1 font-medium", className)}>
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
}

// ─── Profile-level result badge (history / expanded rows) ────────────────────

const PROFILE_STYLES: Record<ProfileCheckStatus, { label: string; className: string }> = {
  POSTED: { label: "Posted", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  NO_RECENT_POST: { label: "No post", className: "bg-red-100 text-red-700 border-red-200" },
  ERROR: { label: "Error", className: "bg-orange-100 text-orange-700 border-orange-200" },
};

export function ProfileStatusBadge({ status }: { status: ProfileCheckStatus }) {
  const { label, className } = PROFILE_STYLES[status] ?? PROFILE_STYLES.ERROR;
  return (
    <Badge variant="outline" className={cn("font-medium", className)}>
      {label}
    </Badge>
  );
}
