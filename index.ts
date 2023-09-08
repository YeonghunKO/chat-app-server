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
import { onlineUser } from "./utils/onlineUser";

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
  socket.on("add-user", (userId: number) => {
    if (userId) {
      onlineUser.setUserBySocketId(userId, socket.id);
    }
  });

  // client에서 send-msg 보낸것을 서버에서 받은다음 다시 서버에서 클라이언트로 recieve-msg를 전송한다.
  // 그럼 client에서 recieve-msg를 받는다.
  socket.on(
    "send-msg",
    (data: { to: number; from: number; message: string }) => {
      const recievedUserLoggedIn = onlineUser.isUserLoggedIn(data.to);

      if (recievedUserLoggedIn) {
        const socketIdByUserId = onlineUser.getSocketIdByUserId(data.to);
        socket.to(socketIdByUserId).emit("recieve-msg", {
          from: data.from,
          to: data.to,
          message: data.message,
        });
      }
    }
  );
});
