import prisma from "../../config/prisma.js";
import { ApiError } from "../../utils/apiError.js";

export const createTaskService = async (workspaceId, userId, data) => {
  const { title, description, projectId, assigneeId, dueDate, priority } = data;

  if (!title || !title.trim()) {
    throw new ApiError(400, "Task title is required");
  }

  // optional: validate project belongs to workspace
  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, workspaceId },
    });

    if (!project) {
      throw new ApiError(404, "Project not found in this workspace");
    }
  }

  // optional: validate assignee
  if (assigneeId) {
    const member = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: assigneeId,
          workspaceId,
        },
      },
    });

    if (!member) {
      throw new ApiError(400, "Assignee must be a workspace member");
    }
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      workspaceId,
      projectId,
      assigneeId,
      dueDate: dueDate ? new Date(dueDate) : null,
      priority,
      createdById: userId,
    },
  });

  return task;
};

export const getTasksService = async (workspaceId, query) => {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    assigneeId,
    projectId,
    search,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = query;

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const where = {
    workspaceId,
    status: status || undefined,
    priority: priority || undefined,
    assigneeId: assigneeId || undefined,
    projectId: projectId || undefined,
    OR: search
      ? [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ]
      : undefined,
  };

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.task.count({ where }),
  ]);

  return {
    data: tasks,
    meta: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

export const getTaskByIdService = async (workspaceId, taskId) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      workspaceId,
    },
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

export const updateTaskService = async (workspaceId, taskId, data) => {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      workspaceId,
    },
  });

  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title ?? existingTask.title,
      description: data.description ?? existingTask.description,
      status: data.status ?? existingTask.status,
      priority: data.priority ?? existingTask.priority,
      assigneeId: data.assigneeId ?? existingTask.assigneeId,
      dueDate: data.dueDate ? new Date(data.dueDate) : existingTask.dueDate,
    },
  });

  return updatedTask;
};

export const deleteTaskService = async (workspaceId, taskId) => {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      workspaceId,
    },
  });

  if (!existingTask) {
    throw new ApiError(404, "Task not found");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return null;
};