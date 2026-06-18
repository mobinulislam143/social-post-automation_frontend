"use client";

import { useAuth } from "@/hooks/useAuth";
import { can, type Action } from "@/lib/permissions";
import type { Role } from "@/types/api";

export function usePermission(action: Action): boolean {
  const { user } = useAuth();
  return can(user?.role as Role | undefined, action);
}
