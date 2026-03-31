import request from "supertest";
import app from "../../src/app.js";

export const createUserAndLogin = async (overrides = {}) => {
  const unique = Date.now() + Math.floor(Math.random() * 10000);

  const user = {
    name: overrides.name || "Test User",
    email: overrides.email || `user${unique}@example.com`,
    password: overrides.password || "12345678",
  };

  const registerRes = await request(app)
    .post("/api/v1/auth/register")
    .send(user);

  if (![200, 201].includes(registerRes.statusCode)) {
    throw new Error(
      `Failed to register test user: ${registerRes.statusCode} ${JSON.stringify(registerRes.body)}`
    );
  }

  const token =
    registerRes.body?.data?.tokens?.accessToken ||
    registerRes.body?.tokens?.accessToken;

  const registeredUser =
    registerRes.body?.data?.user ||
    registerRes.body?.user;

  return {
    user,
    token,
    registeredUser,
    registerRes,
  };
};

export const createWorkspace = async (token, name = "Test Workspace") => {
  const res = await request(app)
    .post("/api/v1/workspaces")
    .set("Authorization", `Bearer ${token}`)
    .send({ name });

  return res;
};

export const createProject = async (token, workspaceId, body = {}) => {
  const res = await request(app)
    .post(`/api/v1/workspaces/${workspaceId}/projects`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: body.name || "Test Project",
      description: body.description || "Test project description",
    });

  return res;
};


export const createTask = async (token, workspaceId, body = {}) => {
  const res = await request(app)
    .post(`/api/v1/workspaces/${workspaceId}/tasks`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: body.title || "Test Task",
      description: body.description || "Test task description",
      priority: body.priority || "MEDIUM",
      status: body.status || "TODO",
      dueDate: body.dueDate,
      projectId: body.projectId,
    });
  return res;
};