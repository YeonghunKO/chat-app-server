import request from "supertest";
import { app, server } from "..";
import {
  mockedPrismaMessagesDB,
  type IUserCreateInfo,
} from "./fixtures/mockedPrismaDB";

describe("message", () => {
  beforeEach(() => {
    server.close();
    mockedPrismaMessagesDB.length = 0;
  });
  describe("get", () => {
    it.only("given from and to are passsed", async () => {
      const resonse = await request(app)
        .get("/message/from/3/to/7")
        .expect(201);
    });

    it("given from and to are not passsed", async () => {});
  });
  describe("add", () => {});
});
