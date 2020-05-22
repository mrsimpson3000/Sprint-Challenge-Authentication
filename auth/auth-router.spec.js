const supertest = require("supertest");

const server = require("../api/server");
const db = require("../database/dbConfig");

afterEach(async () => {
  await db("users").truncate();
});

describe("server", () => {
  it("can run the tests", () => {
    expect(true).toBeTruthy();
  });
  describe("post /register", () => {
    it("should return a status code of 201", () => {
      return supertest(server)
        .post("/api/auth/register")
        .send({
          username: "Chad Simpson",
          password: "password",
        })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });
    it("should return the newly created username", () => {
      return supertest(server)
        .post("/api/auth/register")
        .send({
          username: "Chad Simpson",
          password: "password",
        })
        .then((res) => {
          expect(res.body.data.username).toBe("Chad Simpson");
        });
    });
  });
  describe("post /login", () => {
    beforeEach(async () => {
      await supertest(server).post("/api/auth/register").send({
        username: "Chad Simpson",
        password: "password",
      });
    });

    it("should return a status code of 200", () => {
      return supertest(server)
        .post("/api/auth/login")
        .send({
          username: "Chad Simpson",
          password: "password",
        })
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
    it("should return a welcome message", () => {
      return supertest(server)
        .post("/api/auth/login")
        .send({
          username: "Chad Simpson",
          password: "password",
        })
        .then((res) => {
          expect(res.body.message).toBe("Welcome to our API");
        });
    });
  });
});
