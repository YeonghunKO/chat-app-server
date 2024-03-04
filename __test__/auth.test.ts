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
    mockedPrismaUserDB.clear();
  });

  describe("signIn", () => {
    it("given the user and password are valid", async () => {
      // arrange
      registerUser(MOCKED_NEW_USER);

      // act
      const response = await request(app)
        .post("/auth/sign-in")
        .send({
          email: MOCKED_NEW_USER.email,
          password: MOCKED_NEW_USER.password,
        })
        .expect(201);

      // assert
      const signedInUser = response.body.user.email;
      expect(signedInUser).toBe(MOCKED_NEW_USER.email);
    });

    it("given the unregistered user", async () => {
      // arrange and act
      const response = await request(app)
        .post("/auth/sign-in")
        .send({
          email: MOCKED_NEW_USER.email,
          password: MOCKED_NEW_USER.password,
        })
        .expect(401);

      // assert
      const errorMessage = response.body.message;
      expect(errorMessage).toBe("user does not exist");
    });

    it("given registered user but type wrong password", async () => {
      // arrange
      registerUser(MOCKED_NEW_USER);

      // act
      const response = await request(app)
        .post("/auth/sign-in")
        .send({
          email: MOCKED_NEW_USER.email,
          password: "wrong-password",
        })
        .expect(401);
      // assert

      const errorMessage = response.body.message;
      expect(errorMessage).toBe("password is incorrect");
    });
  });

  describe("signUp", () => {
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

      // assert
      const errorMessage = JSON.parse(response.text).message;
      const expected = [expect.stringMatching(/User already registered/i)];

      expect([errorMessage]).toEqual(expect.arrayContaining(expected));
    });
  });
});
