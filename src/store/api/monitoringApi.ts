import baseApi from "@/store/api/baseApi";
import {
  ApiEnvelope,
  CheckRunResponse,
  ClientCheck,
  ClientInput,
  ClientMetrics,
  ClientStatus,
  DashboardSummary,
  MetricsOverview,
  MonitoredClient,
} from "@/types/monitoring.type";

// ─────────────────────────────────────────────────────────────────────────────
// Social Posting Monitor API slice — the core of the app.
// ─────────────────────────────────────────────────────────────────────────────

export interface ListClientsArgs {
  page?: number;
  limit?: number;
  search?: string;
  status?: ClientStatus | "";
}

export const monitoringApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMonitorDashboard: builder.query<ApiEnvelope<DashboardSummary>, void>({
      query: () => ({ url: "/checks/dashboard", method: "GET" }),
      providesTags: ["MonitorCheck"],
    }),

    getMonitorClients: builder.query<
      ApiEnvelope<MonitoredClient[]>,
      ListClientsArgs
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args.page) params.set("page", String(args.page));
        if (args.limit) params.set("limit", String(args.limit));
        if (args.search) params.set("search", args.search);
        if (args.status) params.set("status", args.status);
        return { url: `/clients?${params.toString()}`, method: "GET" };
      },
      providesTags: ["MonitorClient"],
    }),

    getMonitorClient: builder.query<ApiEnvelope<MonitoredClient>, string>({
      query: (id) => ({ url: `/clients/${id}`, method: "GET" }),
      providesTags: ["MonitorClient"],
    }),

    addMonitorClient: builder.mutation<ApiEnvelope<MonitoredClient>, ClientInput>({
      query: (data) => ({ url: "/clients", method: "POST", body: data }),
      invalidatesTags: ["MonitorClient", "MonitorCheck"],
    }),

    updateMonitorClient: builder.mutation<
      ApiEnvelope<MonitoredClient>,
      { id: string; data: Partial<ClientInput> }
    >({
      query: ({ id, data }) => ({ url: `/clients/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["MonitorClient", "MonitorCheck"],
    }),

    deleteMonitorClient: builder.mutation<void, string>({
      query: (id) => ({ url: `/clients/${id}`, method: "DELETE" }),
      invalidatesTags: ["MonitorClient", "MonitorCheck"],
    }),

    // "Check Now" — one client when clientId given, full sweep when omitted.
    runMonitorCheck: builder.mutation<
      ApiEnvelope<CheckRunResponse>,
      { clientId?: string }
    >({
      query: (body) => ({ url: "/checks/run", method: "POST", body }),
      invalidatesTags: ["MonitorClient", "MonitorCheck"],
    }),

    getMonitorMetrics: builder.query<
      ApiEnvelope<ClientMetrics>,
      { clientId: string; days?: number }
    >({
      query: ({ clientId, days = 30 }) => ({
        url: `/checks/metrics/${clientId}?days=${days}`,
        method: "GET",
      }),
      providesTags: (_res, _err, { clientId }) => [
        { type: "MonitorCheck", id: `metrics-${clientId}` },
      ],
    }),

    getMonitorMetricsOverview: builder.query<
      ApiEnvelope<MetricsOverview>,
      { days?: number } | void
    >({
      query: (args) => ({
        url: `/checks/metrics/overview?days=${args?.days ?? 30}`,
        method: "GET",
      }),
      providesTags: ["MonitorCheck"],
    }),

    getMonitorHistory: builder.query<
      ApiEnvelope<ClientCheck[]>,
      { clientId: string; page?: number; limit?: number }
    >({
      query: ({ clientId, page = 1, limit = 20 }) => ({
        url: `/checks/history/${clientId}?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["MonitorCheck"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMonitorDashboardQuery,
  useGetMonitorClientsQuery,
  useGetMonitorClientQuery,
  useAddMonitorClientMutation,
  useUpdateMonitorClientMutation,
  useDeleteMonitorClientMutation,
  useRunMonitorCheckMutation,
  useGetMonitorHistoryQuery,
  useGetMonitorMetricsQuery,
  useGetMonitorMetricsOverviewQuery,
} = monitoringApi;
