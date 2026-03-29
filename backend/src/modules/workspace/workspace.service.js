import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import slugify from "slugify";

export const createWorkspaceService = async (userId, data) => {
  const { name } = data;

  const slug = slugify(name, { lower: true, strict: true });

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

export const addWorkspaceMemberService = async (
  workspaceId,
  email,
  role = "MEMBER",
) => {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
  });
  const allowedRoles = ["OWNER", "ADMIN", "MEMBER"];
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, "Invalid role");
  }
  if (!workspace) {
    throw new ApiError(404, "Workspace not found");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "User not found with this email");
  }

  const existingMembership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: user.id,
        workspaceId,
      },
    },
  });

  if (existingMembership) {
    throw new ApiError(409, "User is already a member of this workspace");
  }

  const member = await prisma.workspaceMember.create({
    data: {
      userId: user.id,
      workspaceId,
      role,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return member;
};

export const getWorkspaceMembersService = async (workspaceId) => {
  return prisma.workspaceMember.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      joinedAt: "asc",
    },
  });
};
