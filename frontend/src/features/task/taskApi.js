import { baseApi } from "../../api/baseApi";

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: ({ workspaceId, params }) => {
        const searchParams = new URLSearchParams();

        Object.entries(params || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.set(key, value);
          }
        });

        return `/workspaces/${workspaceId}/tasks?${searchParams.toString()}`;
      },
      providesTags: ["Task"],
    }),

    getTaskById: builder.query({
      query: ({ workspaceId, taskId }) =>
        `/workspaces/${workspaceId}/tasks/${taskId}`,
      providesTags: ["Task"],
    }),

    createTask: builder.mutation({
      query: ({ workspaceId, body }) => ({
        url: `/workspaces/${workspaceId}/tasks`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Task", "Dashboard", "Activity"],
    }),

    updateTask: builder.mutation({
      query: ({ workspaceId, taskId, body }) => ({
        url: `/workspaces/${workspaceId}/tasks/${taskId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Task", "Dashboard", "Activity"],
    }),

    deleteTask: builder.mutation({
      query: ({ workspaceId, taskId }) => ({
        url: `/workspaces/${workspaceId}/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task", "Dashboard", "Activity"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;