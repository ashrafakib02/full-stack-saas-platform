import request from "supertest";
import app from "../src/app.js";
import { createUserAndLogin } from "./helpers/testUtils.js";

describe("Workspace API", () => {
  it("should create a workspace for authenticated user", async () => {
    const { token } = await createUserAndLogin();

    const res = await request(app)
      .post("/api/v1/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "My Workspace" });

    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.name).toBe("My Workspace");
    expect(res.body.data.slug).toBe("my-workspace");
  });

  it("should not create workspace without token", async () => {
    const res = await request(app)
      .post("/api/v1/workspaces")
      .send({ name: "Unauthorized Workspace" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should get user workspaces", async () => {
    const { token } = await createUserAndLogin();

    await request(app)
      .post("/api/v1/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Workspace One" });

    const res = await request(app)
      .get("/api/v1/workspaces")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("should reject duplicate workspace slug/name if route enforces uniqueness", async () => {
    const { token } = await createUserAndLogin();

    await request(app)
      .post("/api/v1/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Duplicate Workspace" });

    const res = await request(app)
      .post("/api/v1/workspaces")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Duplicate Workspace" });

    expect([400, 409]).toContain(res.statusCode);
    expect(res.body.success).toBe(false);
  });
});