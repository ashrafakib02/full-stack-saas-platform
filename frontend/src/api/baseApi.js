import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { storage } from "../lib/storage";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("Missing VITE_API_URL");
}

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/api/v1`,
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