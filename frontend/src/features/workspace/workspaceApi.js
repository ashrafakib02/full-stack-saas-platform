import { baseApi } from "../../api/baseApi";

export const workspaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWorkspaces: builder.query({
      query: () => "/workspaces",
      providesTags: ["Workspace"],
    }),
    createWorkspace: builder.mutation({
      query: (body) => ({
        url: "/workspaces",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Workspace"],
    }),
  }),
});

export const {
  useGetWorkspacesQuery,
  useCreateWorkspaceMutation,
} = workspaceApi;