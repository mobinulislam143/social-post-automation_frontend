import baseApi from "@/store/api/baseApi";
import type {
  AuthUser,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  ResetPasswordRequest,
} from "@/types/api";

// ─────────────────────────────────────────────────────────────────────────────
// Auth endpoints against the real backend (Express boilerplate).
// Backend envelope: { success, message, data: { user, tokens } } — mapped here
// to the flat shapes the UI consumes.
// ─────────────────────────────────────────────────────────────────────────────

interface BackendUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  roles: string[];
  createdAt: string;
}

interface BackendLoginEnvelope {
  success: boolean;
  message: string;
  data: {
    user: BackendUser;
    tokens: { accessToken: string; refreshToken: string };
  };
}

function toAuthUser(u: BackendUser): AuthUser {
  return {
    id: u.id,
    email: u.email,
    name: `${u.firstName} ${u.lastName}`.trim(),
    // Anyone with the backend `admin` role manages; everyone else is a viewer.
    role: u.roles.includes("admin") ? "admin" : "viewer",
    profileImage: u.avatar,
    phone: null,
    createdAt: u.createdAt,
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (res: BackendLoginEnvelope): LoginResponse => ({
        accessToken: res.data.tokens.accessToken,
        refreshToken: res.data.tokens.refreshToken,
        user: toAuthUser(res.data.user),
      }),
      invalidatesTags: ["Auth"],
    }),

    // Self-registration — account lands in "pending approval" state.
    register: builder.mutation<
      { message: string },
      { firstName: string; lastName: string; email: string; password: string }
    >({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      transformResponse: (res: { message: string }) => ({ message: res.message }),
    }),

    logout: builder.mutation<void, { refreshToken: string | null }>({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body: body.refreshToken ? { refreshToken: body.refreshToken } : {},
      }),
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation<{ message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, ResetPasswordRequest>({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password, confirmPassword: password },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
