import request from "supertest";
import { app, server } from "..";

describe("auth", () => {
  afterEach(() => {
    server.close();
  });
  describe("signIn", () => {
    describe("given the user and password are valid", () => {});
  });

  describe("signUp", () => {});

  it.only("supertest", async () => {
    const response = await request(app)
      .post("/auth/test/3")
      .send({
        name: "고짝돌",
        about: "공남이 친구",
        password: "짝짝",
        id: "test",
      })
      .expect(201);

    console.log("response.body", response.body);
  });
});
