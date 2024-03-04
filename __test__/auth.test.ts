import request from "supertest";
import { app, server } from "..";
import {
  mockedPrismaUserDB,
  type IUserCreateInfo,
} from "./fixtures/mockedPrismaDB";

const registerUser = (userInfo: IUserCreateInfo) => {
  mockedPrismaUserDB.set(userInfo.email, {
    ...userInfo,
    recievedMessage: [],
    refreshToken: null,
    sentMessage: [],
    id: Math.random() * Number.MAX_SAFE_INTEGER,
    profilePicture: `${userInfo.name}_profile.png`,
  });
};

const MOCKED_NEW_USER = {
  name: "고짝돌",
  email: "짝돌@짝돌.com",
  about: "팡팡유치원에 다니는 5살 고짝돌입니다",
  password: "1234",
};

describe("auth", () => {
  beforeEach(() => {
    server.close();
    // console.log("afterEach mockedPrismaUserDB", mockedPrismaUserDB);
    mockedPrismaUserDB.clear();
  });

  describe("signIn", () => {
    it("given the user and password are valid", () => {
      registerUser(MOCKED_NEW_USER);
    });
  });

  describe.only("signUp", () => {
    it("given the new user", async () => {
      // arrange and act
      const response = await request(app)
        .post("/auth/sign-up")
        .send(MOCKED_NEW_USER)
        .expect(201);

      // assert
      const registeredUserEmail = response.body.user.email;
      expect(registeredUserEmail).toBe(MOCKED_NEW_USER.email);
    });

    it("given the already registered user", async () => {
      // arrange
      registerUser(MOCKED_NEW_USER);

      // act
      const response = await request(app)
        .post("/auth/sign-up")
        .send(MOCKED_NEW_USER)
        .expect(503);

      // console.log("already registered response", response);
      // assert
      const errorMessage = JSON.parse(response.text).message;
      const expected = [expect.stringMatching(/User already registered/i)];

      expect([errorMessage]).toEqual(expect.arrayContaining(expected));
    });
  });
});
