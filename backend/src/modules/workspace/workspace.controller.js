import {
  createWorkspaceService,
  getUserWorkspacesService,
  addWorkspaceMemberService,
  getWorkspaceMembersService,
  updateWorkspaceMemberRoleService,
  removeWorkspaceMemberService,
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

export const addWorkspaceMember = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { email, role } = req.body;

  const member = await addWorkspaceMemberService(
    workspaceId,
    email,
    role,
    req.user.id, // 👈 who is adding the member
  );

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
export const updateWorkspaceMemberRole = asyncHandler(async (req, res) => {
  const { workspaceId, memberUserId } = req.params;
  const { role } = req.body;

  const member = await updateWorkspaceMemberRoleService(
    workspaceId,
    memberUserId,
    role,
    req.user.id,
  );

  return apiResponse(res, {
    statusCode: 200,
    message: "Member role updated successfully",
    data: member,
  });
});

export const removeWorkspaceMember = asyncHandler(async (req, res) => {
  const { workspaceId, memberUserId } = req.params;

  await removeWorkspaceMemberService(workspaceId, memberUserId, req.user.id);

  return apiResponse(res, {
    statusCode: 200,
    message: "Member removed successfully",
    data: null,
  });
});
