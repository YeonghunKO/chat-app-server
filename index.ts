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

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// static 파일을 css,image,js파일을 그대로 서빙한다는 말임
// 이제부터 host/uploads/images/파일이름 경로로 요청하면 여기 안에 있는 정적파일을 클라이언트로 넘겨준다는 말임.

app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/recordings", express.static("uploads/recordings"));

// api/auth가 base url이고 AuthRoutes안에 지정된 path가 sub path이다
app.use("/api/auth", AuthRoutes);
app.use("/api/message", MessageRoutes);

app.use(errorHandle);
const server = app.listen(process.env.PORT, () => {
  console.log(`server is listening to ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("add-user", ({ me, other }: { me: number; other: number }) => {
    if (me) {
      onlineUsers.setUserValueById({
        userId: me,
        value: {
          chatRoomId: undefined,
          socketId: socket.id,
        },
      });
      const users = Array.from(onlineUsers.onlineUsersData);
      const currentChatUser = users.find(
        ([userId, { chatRoomId, socketId }]) => chatRoomId === me
      );

      if (currentChatUser) {
        const [currentChatUserId, { socketId }] = currentChatUser;
        socket.to(socketId).emit("recieve-msg", {
          from: me,
          to: currentChatUserId,
        });
      }
    }
  });

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

  // client에서 send-msg 보낸것을 서버에서 받은다음 다시 서버에서 클라이언트로 recieve-msg를 전송한다.
  // 그럼 client에서 recieve-msg를 받는다.
  socket.on(
    "send-msg",
    (data: { to: number; from: number; message: string }) => {
      const isOtherLoggedIn = onlineUsers.isUserLoggedIn(data.to);

      const socketIdByUserId = onlineUsers.getSocketIdByUserId(data.to);
      if (isOtherLoggedIn && socketIdByUserId) {
        // priviate room 을 만들려면 socketId를 to에 pass하면 됨.
        socket.to(socketIdByUserId).emit("recieve-msg", {
          from: data.from,
          to: data.to,
        });

        socket.to(socketIdByUserId).emit("update-chat-list-status", {
          to: data.to,
        });
      }
    }
  );
});
