// settting
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

// routes
import AuthRoutes from "./routes/AuthRoutes";
import MessageRoutes from "./routes/MessageRoutes";

import errorHandle from "./utils/errorHandle";
import { TOnlineUser, onlineUsers } from "./utils/onlineUser";
import { IUserInfo } from "./type/user";
import { addUser } from "./socket/user";
import { updateChatList } from "./socket/common";

dotenv.config();

const app = express();
app.set("trust proxy", true); // trust first proxy

if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
      credentials: true,
    })
  );
}

app.use(express.json());
app.use(cookieParser());

// static 파일을 css,image,js파일을 그대로 서빙한다는 말임
// 이제부터 host/uploads/images/파일이름 경로로 요청하면 여기 안에 있는 정적파일을 클라이언트로 넘겨준다는 말임.

app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/recordings", express.static("uploads/recordings"));

// api/auth가 base url이고 AuthRoutes안에 지정된 path가 sub path이다
app.use("/auth", AuthRoutes);
app.use("/message", MessageRoutes);

app.use(errorHandle);
const server = app.listen(process.env.PORT, () => {
  console.log(`server is listening to ${process.env.PORT}`);
});

export const io = new Server(server, {
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
      const isOtherLoggedIn = onlineUsers.isUserLoggedIn(other);
      const otherSocketId = onlineUsers.getSocketIdByUserId(other);

      if (isOtherLoggedIn && otherSocketId) {
        // priviate room 을 만들려면 socketId를 to에 pass하면 됨.
        updateChatList(socket, { from: me, to: other, otherSocketId });
      }
    }
  );

  socket.on("mark-read", ({ to, from }: { to: number; from: number }) => {
    const otherSocketId = onlineUsers.getSocketIdByUserId(to);

    if (!otherSocketId) {
      return;
    }
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
