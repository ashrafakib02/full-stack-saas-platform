import {
  createProjectService,
  getWorkspaceProjectsService,
  updateProjectService,
  deleteProjectService,
} from "./project.service.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createProject = asyncHandler(async (req, res, next) => {
  const { workspaceId } = req.params;

  const project = await createProjectService(workspaceId, req.body);

  return apiResponse(res, {
    statusCode: 201,
    message: "Project created successfully",
    data: project,
  });
});

export const getWorkspaceProjects = asyncHandler(async (req, res, next) => {
  const { workspaceId } = req.params;

  const projects = await getWorkspaceProjectsService(workspaceId);

  return apiResponse(res, {
    statusCode: 200,
    message: "Projects fetched successfully",
    data: projects,
  });
});

export const updateProject = asyncHandler(async (req, res, next) => {
  const { workspaceId, projectId } = req.params;

  const project = await updateProjectService(workspaceId, projectId, req.body);

  return apiResponse(res, {
    statusCode: 200,
    message: "Project updated successfully",
    data: project,
  });
});

export const deleteProject = asyncHandler(async (req, res, next) => {
  const { workspaceId, projectId } = req.params;

  await deleteProjectService(workspaceId, projectId);

  return apiResponse(res, {
    statusCode: 200,
    message: "Project deleted successfully",
    data: null,
  });
});
