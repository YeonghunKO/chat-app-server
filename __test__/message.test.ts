import request from "supertest";
import { app, server } from "..";
import {
  mockedPrismaMessagesDB,
  IMessages,
  SINKYO_USER,
  AEIKA_USER,
} from "./fixtures/mockedPrismaDB";

describe("message", () => {
  beforeEach(() => {
    server.close();
  });

  afterEach(() => {
    mockedPrismaMessagesDB.length = 0;
  });
  describe("get", () => {
    it("given from and to are passsed", async () => {
      // arrange
      const SENDER_ID = SINKYO_USER.id;
      const RECIEVER_ID = AEIKA_USER.id;

      // act
      const response = await request(app)
        .get(`/message/from/${SENDER_ID}/to/${RECIEVER_ID}`)
        .expect(201);

      // assert
      const [date, messages] = response.body[0];

      const isMessageBetweenSenderAndReciever = (messages as IMessages[]).every(
        (message) => {
          return (
            (message.senderId === SENDER_ID &&
              message.recieverId === RECIEVER_ID) ||
            (message.senderId === RECIEVER_ID &&
              message.recieverId === SENDER_ID)
          );
        }
      );

      expect(isMessageBetweenSenderAndReciever).toBe(true);
    });

    it("given from and to are not passsed", async () => {
      // arrange and act
      const response = await request(app)
        .get(`/message/from/undefined/to/undefined`)
        .expect(401);

      const errMessage = response.body.message;

      // assert
      expect(errMessage).toBe("from and to are required");
    });
  });
  describe("add", () => {});
});
