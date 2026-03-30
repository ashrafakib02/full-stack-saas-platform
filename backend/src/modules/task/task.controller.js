import {
  createTaskService,
  getTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
} from "./task.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

import { asyncHandler } from "../../utils/asyncHandler.js";

export const createTask = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const task = await createTaskService(workspaceId, req.user.id, req.body);

  return apiResponse(res, {
    statusCode: 201,
    message: "Task created successfully",
    data: task,
  });
});

export const getTasks = asyncHandler(async (req, res, next) => {
  const { workspaceId } = req.params;

  const result = await getTasksService(workspaceId, req.query);

  return apiResponse(res, {
    statusCode: 200,
    message: "Tasks fetched",
    data: result,
  });
});

export const getTaskById = asyncHandler(async (req, res, next) => {
  const { workspaceId, taskId } = req.params;

  const task = await getTaskByIdService(workspaceId, taskId);

  return apiResponse(res, {
    statusCode: 200,
    message: "Task fetched",
    data: task,
  });
});

export const updateTask = asyncHandler(async (req, res, next) => {
  const { workspaceId, taskId } = req.params;

  const task = await updateTaskService(workspaceId, taskId, req.body);

  return apiResponse(res, {
    statusCode: 200,
    message: "Task updated",
    data: task,
  });
});

export const deleteTask = asyncHandler(async (req, res, next) => {
  const { workspaceId, taskId } = req.params;

  await deleteTaskService(workspaceId, taskId);

  return apiResponse(res, {
    statusCode: 200,
    message: "Task deleted",
    data: null,
  });
});
