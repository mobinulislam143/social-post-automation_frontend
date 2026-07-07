import baseApi from "@/store/api/baseApi";
import { ApiEnvelope } from "@/types/monitoring.type";

// ─────────────────────────────────────────────────────────────────────────────
// User management — lets the admin create Admin / Viewer accounts
// ("Admin vs viewer roles — you control who can see what").
// Backend roles: `admin` (manage + trigger) and `user` (read-only viewer).
// ─────────────────────────────────────────────────────────────────────────────

export interface ManagedUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isApproved: boolean;
  roles: Array<{ id: string; name: string }>;
  createdAt: string;
}

export interface BackendRole {
  id: string;
  name: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiEnvelope<ManagedUser[]>, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 50 }) => ({
        url: `/users?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getRoles: builder.query<ApiEnvelope<BackendRole[]>, void>({
      query: () => ({ url: "/roles", method: "GET" }),
      providesTags: ["User"],
    }),

    createUser: builder.mutation<ApiEnvelope<ManagedUser>, CreateUserInput>({
      // Two-step: create the (pre-approved) account, then assign the viewer role.
      async queryFn(input, _api, _extra, fetchWithBQ) {
        const created = await fetchWithBQ({
          url: "/users",
          method: "POST",
          body: input,
        });
        if (created.error) return { error: created.error };

        const user = (created.data as ApiEnvelope<ManagedUser>).data;

        const roles = await fetchWithBQ({ url: "/roles", method: "GET" });
        if (!roles.error) {
          const viewer = (roles.data as ApiEnvelope<BackendRole[]>).data.find(
            (r) => r.name === "user"
          );
          if (viewer) {
            await fetchWithBQ({
              url: `/users/${user.id}/roles`,
              method: "POST",
              body: { roleId: viewer.id },
            });
          }
        }

        return { data: created.data as ApiEnvelope<ManagedUser> };
      },
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),

    approveUser: builder.mutation<ApiEnvelope<ManagedUser>, string>({
      query: (id) => ({ url: `/users/${id}/approve`, method: "POST" }),
      invalidatesTags: ["User"],
    }),

    // Block / unblock via the existing isActive flag.
    setUserActive: builder.mutation<
      ApiEnvelope<ManagedUser>,
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: { isActive },
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useApproveUserMutation,
  useSetUserActiveMutation,
} = usersApi;
