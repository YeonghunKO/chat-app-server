import { createServer } from "node:http";
import { type AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import { Server, type Socket as ServerSocket } from "socket.io";
import { setNewUser } from "../socket/user";
import { server as expressServer } from "..";

describe("socket test", () => {
  // * express server should be turned off while testing
  let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo).port;
      clientSocket = ioc(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.disconnect();
    expressServer.close();
  });

  describe("test add user flow", () => {
    const MOCKED_USER_ID = 10;
    test("register new user and emit updated usersList", (done) => {
      // arrange
      const { loggedInUsers } = setNewUser(MOCKED_USER_ID, serverSocket.id);

      // act
      io.emit("get-onlineUsers", {
        onlineUsers: JSON.stringify(loggedInUsers),
      });

      // assert
      clientSocket.on(
        "get-onlineUsers",
        ({ onlineUsers }: { onlineUsers: any }) => {
          const parsedOnlineUsers = JSON.parse(onlineUsers) as Array<
            [number, { chatRoomId: number; socketId: string }]
          >;
          const [userId, { socketId }] = parsedOnlineUsers[0];
          expect(socketId).toBe(serverSocket.id);
          expect(userId).toBe(MOCKED_USER_ID);
          done();
        }
      );
    });
  });
});
