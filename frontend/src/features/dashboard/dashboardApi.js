import { baseApi } from "../../api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaceDashboard: builder.query({
      query: (workspaceId) => `/workspaces/${workspaceId}/dashboard`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetWorkspaceDashboardQuery } = dashboardApi;