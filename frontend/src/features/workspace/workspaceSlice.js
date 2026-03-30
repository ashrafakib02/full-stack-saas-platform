import { createSlice } from "@reduxjs/toolkit";
import { storage } from "../../lib/storage";

const initialState = {
  activeWorkspaceId: storage.getActiveWorkspaceId(),
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setActiveWorkspace: (state, action) => {
      state.activeWorkspaceId = action.payload;
      storage.setActiveWorkspaceId(action.payload);
    },
    clearActiveWorkspace: (state) => {
      state.activeWorkspaceId = null;
      storage.removeActiveWorkspaceId();
    },
  },
});

export const { setActiveWorkspace, clearActiveWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;