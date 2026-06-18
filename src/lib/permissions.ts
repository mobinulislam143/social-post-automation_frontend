import type { Role } from "@/types/api";

export type Action =
  | "manage_users"
  | "manage_billing"
  | "manage_settings"
  | "view_audit_log"
  | "invite_members"
  | "remove_members"
  | "update_member_role";

const PERMISSIONS: Record<Role, Action[]> = {
  owner: [
    "manage_users",
    "manage_billing",
    "manage_settings",
    "view_audit_log",
    "invite_members",
    "remove_members",
    "update_member_role",
  ],
  admin: [
    "manage_users",
    "manage_settings",
    "view_audit_log",
    "invite_members",
    "remove_members",
    "update_member_role",
  ],
  member: ["invite_members"],
};

export function can(role: Role | undefined, action: Action): boolean {
  if (!role) return false;
  return PERMISSIONS[role]?.includes(action) ?? false;
}
