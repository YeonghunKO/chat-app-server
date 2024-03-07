import request from "supertest";
import { app, server } from "..";
import {
  mockedPrismaMessagesDB,
  type IMessages,
  SINKYO_USER,
  AEIKA_USER,
  mockedPrismaUserDB,
} from "./fixtures/mockedPrismaDB";
import { signAccess, signRefresh } from "../middleware/jwtAuth";

describe("message", () => {
  // arrange
  let accessToken: string;
  let refreshToken: string;
  const SENDER = SINKYO_USER;
  const RECIEVER = AEIKA_USER;

  beforeAll(() => {
    mockedPrismaUserDB.set(SENDER.email, SENDER);
    mockedPrismaUserDB.set(RECIEVER.email, RECIEVER);
  });

  beforeEach(() => {
    accessToken = signAccess(SENDER.email);
    refreshToken = signRefresh(SENDER.email);

    server.close();
  });

  describe("get", () => {
    it("given from and to are passsed and returns all messages between from and to", async () => {
      // act
      const response = await request(app)
        .get(`/message/from/${SENDER.id}/to/${RECIEVER.id}`)
        .set(
          "Cookie",
          `accessToken=${accessToken};refreshTokenIdx=${SENDER.email}`
        )
        .expect(201);

      // assert
      const [date, messages] = response.body[0];

      const areAllMessagesBetweenSenderAndReciever = (
        messages as IMessages[]
      ).every((message) => {
        return (
          (message.senderId === SENDER.id &&
            message.recieverId === RECIEVER.id) ||
          (message.senderId === RECIEVER.id && message.recieverId === SENDER.id)
        );
      });

      expect(areAllMessagesBetweenSenderAndReciever).toBe(true);
    });

    it("given from and to are not passsed and throws error message", async () => {
      // act
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

  describe("add", () => {
    it("given from and to are and newMessage are passed and check newMessage is added to DB", async () => {
      // arrange
      const newMessage = "안녕 난 짝돌이야";

      // act
      const response = await request(app)
        .post("/message")
        .send({
          from: SENDER.id,
          to: RECIEVER.id,
          message: newMessage,
        })
        .set(
          "Cookie",
          `accessToken=${accessToken};refreshTokenIdx=${SENDER.email}`
        )
        .expect(201);

      // assert
      const { id: newMessageId } = response.body as IMessages;

      const {
        message: addedNewMessage,
        recieverId,
        senderId,
      } = mockedPrismaMessagesDB.find((message) => message.id === newMessageId);
      expect(addedNewMessage).toBe(newMessage);
      expect(recieverId).toBe(RECIEVER.id);
      expect(senderId).toBe(SENDER.id);
    });

    it("given from and to are not passed and throws error message", async () => {
      // arrange
      const newMessage = "안녕 난 짝돌이야";

      // act
      const response = await request(app)
        .post("/message")
        .send({
          message: newMessage,
        })
        .set(
          "Cookie",
          `accessToken=${accessToken};refreshTokenIdx=${SENDER.email}`
        )
        .expect(401);

      // assert
      const errMessage = response.body.message;
      expect(errMessage).toBe("sender, reciever and message are required");
    });
  });
});
