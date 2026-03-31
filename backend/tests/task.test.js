import request from "supertest";
import app from "../src/app.js";
import {
  createProject,
  createTask,
  createUserAndLogin,
  createWorkspace,
} from "./helpers/testUtils.js";

describe("Task API", () => {
  it("should create a task", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Task Workspace");
    const workspaceId = workspaceRes.body.data.id;

    const res = await createTask(token, workspaceId, {
      title: "Build API",
      description: "Finish backend task module",
      priority: "HIGH",
      status: "TODO",
    });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Build API");
    expect(res.body.data.workspaceId).toBe(workspaceId);
  });

  it("should get tasks list", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Task List Workspace");
    const workspaceId = workspaceRes.body.data.id;

    await createTask(token, workspaceId, { title: "Task One" });

    const res = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/tasks`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // supports both old array response and paginated response
    const payload = res.body.data;
    const tasks = Array.isArray(payload) ? payload : payload.data;

    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("should get single task by id", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Single Task Workspace");
    const workspaceId = workspaceRes.body.data.id;

    const taskRes = await createTask(token, workspaceId, {
      title: "Single Task",
    });

    const taskId = taskRes.body.data.id;

    const res = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(taskId);
  });

  it("should update a task", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Update Task Workspace");
    const workspaceId = workspaceRes.body.data.id;

    const taskRes = await createTask(token, workspaceId, {
      title: "Old Task Title",
      status: "TODO",
    });

    const taskId = taskRes.body.data.id;

    const res = await request(app)
      .patch(`/api/v1/workspaces/${workspaceId}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task Title",
        status: "IN_PROGRESS",
        priority: "HIGH",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Updated Task Title");
    expect(res.body.data.status).toBe("IN_PROGRESS");
    expect(res.body.data.priority).toBe("HIGH");
  });

  it("should delete a task", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Delete Task Workspace");
    const workspaceId = workspaceRes.body.data.id;

    const taskRes = await createTask(token, workspaceId, {
      title: "Delete Me Task",
    });

    const taskId = taskRes.body.data.id;

    const deleteRes = await request(app)
      .delete(`/api/v1/workspaces/${workspaceId}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const getRes = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect([404, 400]).toContain(getRes.statusCode);
  });

  it("should filter tasks by status", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Filter Task Workspace");
    const workspaceId = workspaceRes.body.data.id;

    await createTask(token, workspaceId, {
      title: "Todo Task",
      status: "TODO",
    });

    await createTask(token, workspaceId, {
      title: "Done Task",
      status: "DONE",
    });

    const res = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/tasks?status=TODO`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const payload = res.body.data;
    const tasks = Array.isArray(payload) ? payload : payload.data;

    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.every((task) => task.status === "TODO")).toBe(true);
  });

  it("should support search, sorting, and pagination", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Query Task Workspace");
    const workspaceId = workspaceRes.body.data.id;

    await createTask(token, workspaceId, {
      title: "Backend API Task",
      priority: "HIGH",
    });

    await createTask(token, workspaceId, {
      title: "Frontend UI Task",
      priority: "LOW",
    });

    const res = await request(app)
      .get(
        `/api/v1/workspaces/${workspaceId}/tasks?search=API&sortBy=createdAt&sortOrder=desc&page=1&limit=10`
      )
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const payload = res.body.data;
    const tasks = Array.isArray(payload) ? payload : payload.data;

    expect(Array.isArray(tasks)).toBe(true);
    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.some((task) => task.title.includes("API"))).toBe(true);
  });

  it("should create task under a project", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Task Project Workspace");
    const workspaceId = workspaceRes.body.data.id;

    const projectRes = await createProject(token, workspaceId, {
      name: "Main Project",
    });

    const projectId = projectRes.body.data.id;

    const taskRes = await createTask(token, workspaceId, {
      title: "Task With Project",
      projectId,
    });

    expect([200, 201]).toContain(taskRes.statusCode);
    expect(taskRes.body.success).toBe(true);
    expect(taskRes.body.data.projectId).toBe(projectId);
  });
});