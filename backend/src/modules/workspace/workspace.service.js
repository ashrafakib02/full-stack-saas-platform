import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import slugify from "slugify";

export const createWorkspaceService = async (userId, data) => {
  const { name } = data;

  const slug = slugify(name, { lower: true, strict: true });

  // check slug uniqueness
  const existing = await prisma.workspace.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new ApiError(409, "Workspace name already exists");
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      slug,
      ownerId: userId,
      members: {
        create: {
          userId,
          role: "OWNER",
        },
      },
    },
  });

  return workspace;
};

export const getUserWorkspacesService = async (userId) => {
  return prisma.workspaceMember.findMany({
    where: { userId },
    include: {
      workspace: true,
    },
  });
};