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

describe("Auth API", () => {

  let token;

  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("should login user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "test@test.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

});