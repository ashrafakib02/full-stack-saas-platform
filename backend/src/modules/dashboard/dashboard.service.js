import prisma from "../../config/prisma.js";
import { groupToObject } from "../../utils/transform.js";

export const getWorkspaceDashboardStats = async (workspaceId) => {
  const [
    totalTasks,
    tasksByStatusRaw,
    tasksByPriorityRaw,
    overdueTasks,
    totalProjects,
    totalMembers,
  ] = await Promise.all([
    prisma.task.count({
      where: { workspaceId },
    }),

    prisma.task.groupBy({
      by: ["status"],
      where: { workspaceId },
      _count: true,
    }),

    prisma.task.groupBy({
      by: ["priority"],
      where: { workspaceId },
      _count: true,
    }),

    prisma.task.count({
      where: {
        workspaceId,
        dueDate: { lt: new Date() },
        status: { not: "DONE" },
      },
    }),

    prisma.project.count({
      where: { workspaceId },
    }),

    prisma.workspaceMember.count({
      where: { workspaceId },
    }),
  ]);

  // ✅ Transform here
  const tasksByStatus = groupToObject(tasksByStatusRaw, "status");
  const tasksByPriority = groupToObject(tasksByPriorityRaw, "priority");

  return {
    totalTasks,
    tasksByStatus,
    tasksByPriority,
    overdueTasks,
    totalProjects,
    totalMembers,
  };
};