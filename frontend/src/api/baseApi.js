import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { storage } from "../lib/storage";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.BACKEND_API_URL}/api/v1`,
    prepareHeaders: (headers) => {
      const token = storage.getAccessToken();

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "Workspace", "Project", "Task", "Dashboard", "Activity"],
  endpoints: () => ({}),
});