// settting
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// routes
import AuthRoutes from "./routes/AuthRoutes";
import MessageRoutes from "./routes/MessageRoutes";

import errorHandle from "./utils/errorHandle";
import initSocket from "./socket";
import { validateToken } from "./middleware/validateToken";

dotenv.config();

export const app = express();
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
app.use("/message", validateToken, MessageRoutes);

app.use(errorHandle);
export const server = app.listen(process.env.PORT, () => {
  console.log(`server is listening to ${process.env.PORT}`);
});

export const io = initSocket(server);
