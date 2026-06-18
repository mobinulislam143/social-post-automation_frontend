import baseApi from "@/store/api/baseApi";
import type {
  AdminStats,
  AdminUser,
  AuditLogEntry,
  PaginatedResponse,
  UpdateUserRoleRequest,
} from "@/types/api";

interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface ListAuditLogsParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query<AdminStats, void>({
      query: () => "/admin/stats",
      providesTags: ["User"],
    }),

    getAdminUsers: builder.query<PaginatedResponse<AdminUser>, ListUsersParams>({
      query: (params = {}) => ({
        url: "/admin/users",
        params,
      }),
      providesTags: ["User"],
    }),

    updateAdminUserRole: builder.mutation<AdminUser, { userId: string } & UpdateUserRoleRequest>({
      query: ({ userId, ...body }) => ({
        url: `/admin/users/${userId}/role`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    deleteAdminUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/admin/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    getAuditLogs: builder.query<PaginatedResponse<AuditLogEntry>, ListAuditLogsParams>({
      query: (params = {}) => ({
        url: "/admin/audit-logs",
        params,
      }),
      providesTags: ["AuditLog"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminStatsQuery,
  useGetAdminUsersQuery,
  useUpdateAdminUserRoleMutation,
  useDeleteAdminUserMutation,
  useGetAuditLogsQuery,
} = adminApi;
