import {
  createProjectService,
  getWorkspaceProjectsService,
  updateProjectService,
  deleteProjectService,
} from "./project.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

export const createProject = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const project = await createProjectService(workspaceId, req.body);

    return apiResponse(res, {
      statusCode: 201,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceProjects = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const projects = await getWorkspaceProjectsService(workspaceId);

    return apiResponse(res, {
      statusCode: 200,
      message: "Projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { workspaceId, projectId } = req.params;

    const project = await updateProjectService(workspaceId, projectId, req.body);

    return apiResponse(res, {
      statusCode: 200,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { workspaceId, projectId } = req.params;

    await deleteProjectService(workspaceId, projectId);

    return apiResponse(res, {
      statusCode: 200,
      message: "Project deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};