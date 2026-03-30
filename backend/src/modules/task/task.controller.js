import {
  createTaskService,
  getTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
} from "./task.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

export const createTask = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const task = await createTaskService(
      workspaceId,
      req.user.id,
      req.body
    );

    return apiResponse(res, {
      statusCode: 201,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const tasks = await getTasksService(workspaceId, req.query);

    return apiResponse(res, {
      statusCode: 200,
      message: "Tasks fetched",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const { workspaceId, taskId } = req.params;

    const task = await getTaskByIdService(workspaceId, taskId);

    return apiResponse(res, {
      statusCode: 200,
      message: "Task fetched",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { workspaceId, taskId } = req.params;

    const task = await updateTaskService(workspaceId, taskId, req.body);

    return apiResponse(res, {
      statusCode: 200,
      message: "Task updated",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { workspaceId, taskId } = req.params;

    await deleteTaskService(workspaceId, taskId);

    return apiResponse(res, {
      statusCode: 200,
      message: "Task deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};