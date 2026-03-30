import { baseApi } from "../../api/baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (workspaceId) => `/workspaces/${workspaceId}/projects`,
      providesTags: ["Project"],
    }),
    createProject: builder.mutation({
      query: ({ workspaceId, body }) => ({
        url: `/workspaces/${workspaceId}/projects`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project", "Dashboard"],
    }),
    updateProject: builder.mutation({
      query: ({ workspaceId, projectId, body }) => ({
        url: `/workspaces/${workspaceId}/projects/${projectId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Project", "Dashboard"],
    }),
    deleteProject: builder.mutation({
      query: ({ workspaceId, projectId }) => ({
        url: `/workspaces/${workspaceId}/projects/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project", "Dashboard"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApi;