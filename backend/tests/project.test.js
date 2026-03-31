import request from "supertest";
import app from "../src/app.js";
import {
  createProject,
  createUserAndLogin,
  createWorkspace,
} from "./helpers/testUtils.js";

describe("Project API", () => {
  it("should create a project inside a workspace", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Project Workspace");
    const workspaceId = workspaceRes.body.data.id;

    const res = await createProject(token, workspaceId, {
      name: "Backend Project",
      description: "Main backend project",
    });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Backend Project");
    expect(res.body.data.workspaceId).toBe(workspaceId);
  });

  it("should get projects of a workspace", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Projects Workspace");
    const workspaceId = workspaceRes.body.data.id;

    await createProject(token, workspaceId, {
      name: "Project One",
    });

    const res = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/projects`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should update a project", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Update Project Workspace");
    const workspaceId = workspaceRes.body.data.id;

    const projectRes = await createProject(token, workspaceId, {
      name: "Old Project Name",
    });

    const projectId = projectRes.body.data.id;

    const res = await request(app)
      .patch(`/api/v1/workspaces/${workspaceId}/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Project Name",
        description: "Updated description",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Updated Project Name");
  });

  it("should delete a project", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Delete Project Workspace");
    const workspaceId = workspaceRes.body.data.id;

    const projectRes = await createProject(token, workspaceId, {
      name: "Delete Me Project",
    });

    const projectId = projectRes.body.data.id;

    const deleteRes = await request(app)
      .delete(`/api/v1/workspaces/${workspaceId}/projects/${projectId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const listRes = await request(app)
      .get(`/api/v1/workspaces/${workspaceId}/projects`)
      .set("Authorization", `Bearer ${token}`);

    expect(listRes.statusCode).toBe(200);
    const deletedProject = listRes.body.data.find((p) => p.id === projectId);
    expect(deletedProject).toBeUndefined();
  });

  it("should not allow project creation without token", async () => {
    const { token } = await createUserAndLogin();

    const workspaceRes = await createWorkspace(token, "Unauthorized Project Workspace");
    const workspaceId = workspaceRes.body.data.id;

    const res = await request(app)
      .post(`/api/v1/workspaces/${workspaceId}/projects`)
      .send({
        name: "Unauthorized Project",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});