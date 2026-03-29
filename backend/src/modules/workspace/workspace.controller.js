import {
  createWorkspaceService,
  getUserWorkspacesService,
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