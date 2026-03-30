import prisma from "../../config/prisma.js";

export const createActivityLog = async ({
  action,
  entityType,
  entityId,
  message,
  workspaceId,
  userId,
}) => {
  return prisma.activityLog.create({
    data: {
      action,
      entityType,
      entityId,
      message,
      workspaceId,
      userId,
    },
  });
};

export const getWorkspaceActivities = async (workspaceId) => {
  return prisma.activityLog.findMany({
    where: { workspaceId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};