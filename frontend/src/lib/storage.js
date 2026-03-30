const ACCESS_TOKEN_KEY = "accessToken";
const ACTIVE_WORKSPACE_KEY = "activeWorkspaceId";

export const storage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  removeAccessToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),

  getActiveWorkspaceId: () => localStorage.getItem(ACTIVE_WORKSPACE_KEY),
  setActiveWorkspaceId: (id) => localStorage.setItem(ACTIVE_WORKSPACE_KEY, id),
  removeActiveWorkspaceId: () => localStorage.removeItem(ACTIVE_WORKSPACE_KEY),
};