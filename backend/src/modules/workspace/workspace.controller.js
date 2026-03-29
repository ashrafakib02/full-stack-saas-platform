import {
  createWorkspaceService,
  getUserWorkspacesService,
  addWorkspaceMemberService,
  getWorkspaceMembersService,
} from "./workspace.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

export const createWorkspace = async (req, res, next) => {
  try {
    const workspace = await createWorkspaceService(req.user.id, req.body);

    return apiResponse(res, {
      statusCode: 201,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserWorkspaces = async (req, res, next) => {
  try {
    const workspaces = await getUserWorkspacesService(req.user.id);

    return apiResponse(res, {
      statusCode: 200,
      message: "Workspaces fetched",
      data: workspaces,
    });
  } catch (error) {
    next(error);
  }
};

export const addWorkspaceMember = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const member = await addWorkspaceMemberService(workspaceId, email, role);

    return apiResponse(res, {
      statusCode: 201,
      message: "Member added successfully",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceMembers = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const members = await getWorkspaceMembersService(workspaceId);

    return apiResponse(res, {
      statusCode: 200,
      message: "Workspace members fetched successfully",
      data: members,
    });
  } catch (error) {
    next(error);
  }
};