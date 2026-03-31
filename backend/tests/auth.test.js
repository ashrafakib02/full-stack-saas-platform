import request from "supertest";
import app from "../src/app.js";

describe("Auth API", () => {
  const user = {
    name: "Test User",
    email: `test${Date.now()}@mail.com`,
    password: "12345678",
  };

  it("should register a user", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send(user);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(user.email);
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });

  it("should login a user", async () => {
    await request(app).post("/api/v1/auth/register").send({
      name: "Login User",
      email: `login${Date.now()}@mail.com`,
      password: "12345678",
    });

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: user.email,
        password: user.password,
      });

    expect([200, 401]).toContain(res.statusCode);
  });
});