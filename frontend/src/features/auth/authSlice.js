import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../../lib/storage";

const initialState = {
  accessToken: storage.getAccessToken(),
  user: null,
  isAuthenticated: Boolean(storage.getAccessToken()),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload;

      state.accessToken = accessToken;
      state.user = user;
      state.isAuthenticated = true;

      storage.setAccessToken(accessToken);
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isAuthenticated = false;

      storage.removeAccessToken();
      storage.removeActiveWorkspaceId();
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;