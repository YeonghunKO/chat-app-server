import { Server as SocketServer } from "socket.io";

import { TOnlineUser, onlineUsers } from "../utils/onlineUser";
import { IUserInfo } from "../type/user";
import { addUser } from "../socket/user";
import { updateChatList } from "../socket/common";
import { IncomingMessage, Server as HttpServer, ServerResponse } from "http";

const initSocket = (
  appServer: HttpServer<typeof IncomingMessage, typeof ServerResponse>
) => {
  const io = new SocketServer(appServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    socket.on("add-user", (arg) => addUser(arg, socket));

    socket.on(
      "set-onlineUsers",
      ({ userId, value }: { userId: number; value: TOnlineUser }) => {
        onlineUsers.setUserValueById({ userId, value });

        // send to all clients
        io.emit("get-onlineUsers", {
          onlineUsers: JSON.stringify([...onlineUsers.onlineUsersData]),
        });
      }
    );

    socket.on(
      "send-msg",
      ({
        to: other,
        from: me,
      }: {
        to: number;
        from: number;
        message: string;
      }) => {
        const otherSocketId = onlineUsers.getSocketIdByUserId(other);
        updateChatList(socket, { from: me, to: other, otherSocketId });
      }
    );

    socket.on("mark-read", ({ to, from }: { to: number; from: number }) => {
      const otherSocketId = onlineUsers.getSocketIdByUserId(to);
      updateChatList(socket, {
        from,
        to,
        otherSocketId,
      });
    });

    socket.on("disconnecting", () => {
      const userId = onlineUsers.getKeyBySocketId(socket.id);
      if (userId) {
        onlineUsers.deleteUser(userId);
      }

      io.emit("get-onlineUsers", {
        onlineUsers: JSON.stringify([...onlineUsers.onlineUsersData]),
      });
    });

    socket.on("logout", () => {
      const userId = onlineUsers.getKeyBySocketId(socket.id);
      if (userId) {
        onlineUsers.deleteUser(userId);
      }

      io.emit("get-onlineUsers", {
        onlineUsers: JSON.stringify([...onlineUsers.onlineUsersData]),
      });
    });

    socket.on(
      "callUser",
      ({
        userToCall,
        signal,
        callerInfo,
      }: {
        userToCall: number;
        signal: any;
        callerInfo: IUserInfo;
      }) => {
        const userToCallSocketId = onlineUsers.getSocketIdByUserId(userToCall);
        if (userToCallSocketId) {
          io.to(userToCallSocketId).emit("callUser", { signal, callerInfo });
        }
      }
    );

    socket.on("answerCall", ({ to, signal }: { to: number; signal?: any }) => {
      const userToCallSocketId = onlineUsers.getSocketIdByUserId(to);
      if (!userToCallSocketId) {
        return;
      }
      socket.to(userToCallSocketId).emit("callAccepted", signal);
    });

    socket.on("rejectCall", ({ to }: { to: number }) => {
      const userToCallSocketId = onlineUsers.getSocketIdByUserId(to);
      if (!userToCallSocketId) {
        return;
      }
      socket.to(userToCallSocketId).emit("callRejected");
    });

    socket.on("cancelCall", ({ to }: { to: number }) => {
      const userToCallSocketId = onlineUsers.getSocketIdByUserId(to);
      if (!userToCallSocketId) {
        return;
      }
      socket.to(userToCallSocketId).emit("callCanceled");
    });
  });

  return io;
};

export default initSocket;
