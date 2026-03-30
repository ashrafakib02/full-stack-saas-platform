import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";

export const createProjectService = async (workspaceId, data) => {
  const { name, description } = data;

  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  if (!name || !name.trim()) {
    throw new ApiError(400, "Project name is required");
  }
  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const project = await prisma.project.create({
    data: {
      name,
      description,
      workspaceId,
    },
  });

  return project;
};

export const getWorkspaceProjectsService = async (workspaceId) => {
  return prisma.project.findMany({
    where: { workspaceId },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const updateProjectService = async (workspaceId, projectId, data) => {
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
    },
  });

  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      name: data.name ?? existingProject.name,
      description: data.description ?? existingProject.description,
    },
  });

  return updatedProject;
};

export const deleteProjectService = async (workspaceId, projectId) => {
  const existingProject = await prisma.project.findFirst({
    where: {
      id: projectId,
      workspaceId,
    },
  });

  if (!existingProject) {
    throw new ApiError(404, "Project not found");
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return null;
};
