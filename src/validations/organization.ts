import { z } from "zod";

export const createOrgSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
  slug: z
    .string()
    .min(2)
    .max(48)
    .regex(/^[a-z0-9-]+$/, { message: "Slug may only contain lowercase letters, numbers, and hyphens" }),
});

export const updateOrgSchema = z.object({
  name: z.string().min(2).optional(),
  logoUrl: z.string().url().optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  role: z.enum(["admin", "member"] as const, { message: "Select a role" }),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(["owner", "admin", "member"] as const),
});

export type CreateOrgFormValues = z.infer<typeof createOrgSchema>;
export type UpdateOrgFormValues = z.infer<typeof updateOrgSchema>;
export type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;
