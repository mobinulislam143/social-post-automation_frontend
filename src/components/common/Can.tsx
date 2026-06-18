"use client";

import { type ReactNode } from "react";
import { usePermission } from "@/hooks/usePermission";
import type { Action } from "@/lib/permissions";

interface CanProps {
  permission: Action;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const allowed = usePermission(permission);
  return allowed ? <>{children}</> : <>{fallback}</>;
}
