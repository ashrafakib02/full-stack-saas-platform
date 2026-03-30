import {
  createWorkspaceService,
  getUserWorkspacesService,
  addWorkspaceMemberService,
  getWorkspaceMembersService,
} from "./workspace.service.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createWorkspace = asyncHandler(async (req, res, next) => {
  const workspace = await createWorkspaceService(req.user.id, req.body);

  return apiResponse(res, {
    statusCode: 201,
    message: "Workspace created successfully",
    data: workspace,
  });
});

export const getUserWorkspaces = asyncHandler(async (req, res, next) => {
  const workspaces = await getUserWorkspacesService(req.user.id);

  return apiResponse(res, {
    statusCode: 200,
    message: "Workspaces fetched",
    data: workspaces,
  });
});

export const addWorkspaceMember = asyncHandler(async (req, res, next) => {
  const { workspaceId } = req.params;
  const { email, role } = req.body;

  const member = await addWorkspaceMemberService(workspaceId, email, role);

  return apiResponse(res, {
    statusCode: 201,
    message: "Member added successfully",
    data: member,
  });
});

export const getWorkspaceMembers = asyncHandler(async (req, res, next) => {
  const { workspaceId } = req.params;

  const members = await getWorkspaceMembersService(workspaceId);

  return apiResponse(res, {
    statusCode: 200,
    message: "Workspace members fetched successfully",
    data: members,
  });
});
