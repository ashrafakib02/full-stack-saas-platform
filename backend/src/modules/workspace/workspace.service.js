import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";
import slugify from "slugify";
import { createActivityLog } from "../activity/activity.service.js";

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
  await createActivityLog({
    action: "ADD_MEMBER",
    entityType: "WORKSPACE",
    entityId: workspaceId,
    message: `User ${user.email} added to workspace`,
    workspaceId,
    userId: addedByUserId, // 👈 VERY IMPORTANT
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
export const updateWorkspaceMemberRoleService = async (
  workspaceId,
  memberUserId,
  newRole,
  updatedByUserId,
) => {
  const allowedRoles = ["OWNER", "ADMIN", "MEMBER"];
  if (memberUserId === updatedByUserId) {
    throw new ApiError(400, "You cannot change your own role");
  }
  if (!allowedRoles.includes(newRole)) {
    throw new ApiError(400, "Invalid role");
  }

  const membership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: memberUserId,
        workspaceId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  if (!membership) {
    throw new ApiError(404, "Member not found in this workspace");
  }

  if (membership.role === "OWNER") {
    throw new ApiError(400, "Owner role cannot be changed");
  }

  const updatedMember = await prisma.workspaceMember.update({
    where: {
      userId_workspaceId: {
        userId: memberUserId,
        workspaceId,
      },
    },
    data: {
      role: newRole,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });

  await createActivityLog({
    action: "UPDATE_ROLE",
    entityType: "WORKSPACE_MEMBER",
    entityId: memberUserId,
    message: `Role for ${membership.user.email} changed from ${membership.role} to ${newRole}`,
    workspaceId,
    userId: updatedByUserId,
  });

  return updatedMember;
};
export const removeWorkspaceMemberService = async (
  workspaceId,
  memberUserId,
  removedByUserId,
) => {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: memberUserId,
        workspaceId,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
  if (memberUserId === removedByUserId) {
    throw new ApiError(400, "You cannot remove yourself from the workspace");
  }
  if (!membership) {
    throw new ApiError(404, "Member not found in this workspace");
  }

  if (membership.role === "OWNER") {
    throw new ApiError(400, "Owner cannot be removed from workspace");
  }

  await prisma.workspaceMember.delete({
    where: {
      userId_workspaceId: {
        userId: memberUserId,
        workspaceId,
      },
    },
  });

  await createActivityLog({
    action: "REMOVE_MEMBER",
    entityType: "WORKSPACE_MEMBER",
    entityId: memberUserId,
    message: `User ${membership.user.email} removed from workspace`,
    workspaceId,
    userId: removedByUserId,
  });

  return null;
};
