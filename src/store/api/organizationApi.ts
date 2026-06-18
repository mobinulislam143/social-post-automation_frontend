import baseApi from "@/store/api/baseApi";
import type {
  CreateOrgRequest,
  Invite,
  InviteMemberRequest,
  Member,
  Organization,
  UpdateMemberRoleRequest,
  UpdateOrgRequest,
} from "@/types/api";

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizations: builder.query<Organization[], void>({
      query: () => "/organizations",
      providesTags: ["Organization"],
    }),

    getOrganization: builder.query<Organization, string>({
      query: (orgId) => `/organizations/${orgId}`,
      providesTags: (_result, _error, orgId) => [{ type: "Organization", id: orgId }],
    }),

    createOrganization: builder.mutation<Organization, CreateOrgRequest>({
      query: (body) => ({
        url: "/organizations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Organization"],
    }),

    updateOrganization: builder.mutation<Organization, { orgId: string } & UpdateOrgRequest>({
      query: ({ orgId, ...body }) => ({
        url: `/organizations/${orgId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { orgId }) => [{ type: "Organization", id: orgId }],
    }),

    deleteOrganization: builder.mutation<void, string>({
      query: (orgId) => ({
        url: `/organizations/${orgId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Organization"],
    }),

    // Members
    getMembers: builder.query<Member[], string>({
      query: (orgId) => `/organizations/${orgId}/members`,
      providesTags: (_result, _error, orgId) => [{ type: "Member", id: orgId }],
    }),

    removeMember: builder.mutation<void, { orgId: string; userId: string }>({
      query: ({ orgId, userId }) => ({
        url: `/organizations/${orgId}/members/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { orgId }) => [{ type: "Member", id: orgId }],
    }),

    updateMemberRole: builder.mutation<Member, { orgId: string; userId: string } & UpdateMemberRoleRequest>({
      query: ({ orgId, userId, ...body }) => ({
        url: `/organizations/${orgId}/members/${userId}/role`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { orgId }) => [{ type: "Member", id: orgId }],
    }),

    // Invites
    getInvites: builder.query<Invite[], string>({
      query: (orgId) => `/organizations/${orgId}/invites`,
      providesTags: (_result, _error, orgId) => [{ type: "Invite", id: orgId }],
    }),

    inviteMember: builder.mutation<Invite, { orgId: string } & InviteMemberRequest>({
      query: ({ orgId, ...body }) => ({
        url: `/organizations/${orgId}/invites`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { orgId }) => [{ type: "Invite", id: orgId }],
    }),

    revokeInvite: builder.mutation<void, { orgId: string; inviteId: string }>({
      query: ({ orgId, inviteId }) => ({
        url: `/organizations/${orgId}/invites/${inviteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { orgId }) => [{ type: "Invite", id: orgId }],
    }),

    resendInvite: builder.mutation<void, { orgId: string; inviteId: string }>({
      query: ({ orgId, inviteId }) => ({
        url: `/organizations/${orgId}/invites/${inviteId}/resend`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetMembersQuery,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
  useGetInvitesQuery,
  useInviteMemberMutation,
  useRevokeInviteMutation,
  useResendInviteMutation,
} = organizationApi;
