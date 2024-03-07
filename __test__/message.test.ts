import request from "supertest";
import { app, server } from "..";
import {
  mockedPrismaMessagesDB,
  IMessages,
  SINKYO_USER,
  AEIKA_USER,
  mockedPrismaUserDB,
} from "./fixtures/mockedPrismaDB";
import { signAccess, signRefresh } from "../middleware/jwtAuth";

describe("message", () => {
  let accessToken: string;
  let refreshToken: string;
  const SENDER = SINKYO_USER;
  const RECIEVER = AEIKA_USER;

  beforeEach(() => {
    accessToken = signAccess(SENDER.email);
    refreshToken = signRefresh(SENDER.email);
    mockedPrismaUserDB.set(SENDER.email, SENDER);
    mockedPrismaUserDB.set(RECIEVER.email, RECIEVER);

    server.close();
  });

  afterEach(() => {
    mockedPrismaMessagesDB.length = 0;
  });

  describe("get", () => {
    it.only("given from and to are passsed", async () => {
      // arrange and act
      const response = await request(app)
        .get(`/message/from/${SENDER.id}/to/${RECIEVER.id}`)
        .set(
          "Cookie",
          `accessToken=${accessToken};refreshTokenIdx=${SENDER.email}`
        )
        .expect(201);

      // assert
      const [date, messages] = response.body[0];

      const isMessagesBetweenSenderAndReciever = (
        messages as IMessages[]
      ).every((message) => {
        return (
          (message.senderId === SENDER.id &&
            message.recieverId === RECIEVER.id) ||
          (message.senderId === RECIEVER.id && message.recieverId === SENDER.id)
        );
      });

      expect(isMessagesBetweenSenderAndReciever).toBe(true);
    });

    it("given from and to are not passsed", async () => {
      // arrange and act
      const response = await request(app)
        .get(`/message/from/undefined/to/undefined`)
        .set(
          "Cookie",
          `accessToken=${accessToken};refreshTokenIdx=${SENDER.email}`
        )
        .expect(401);

      const errMessage = response.body.message;

      // assert
      expect(errMessage).toBe("from and to are required");
    });
  });
  describe("add", () => {});
});
