import dotenv from "dotenv";
dotenv.config();
import request from "supertest";
import app from "../src/app.js";
import { connectTestDB, closeTestDB } from "../src/config/test-db.js";
import { jest } from "@jest/globals";
jest.setTimeout(20000);

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

describe("Task API", () => {

  let token;
  let userId;
  let taskId;

  beforeAll(async () => {
    // create user + login
    const register = await request(app).post("/api/auth/register").send({
      email: "task@test.com",
      password: "123456",
    });

    token = register.body.token;
    userId = register.body.user.id;
  });

  it("should create task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Task",
        assignedTo: userId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Task");

    taskId = res.body._id;
  });

  it("should get tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.tasks.length).toBeGreaterThan(0);
  });

  it("should update task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Task",
      });

    expect(res.body.title).toBe("Updated Task");
  });

  it("should delete task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

});
