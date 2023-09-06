// settting
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// routes
import AuthRoutes from "./routes/AuthRoutes";
import MessageRoutes from "./routes/MessageRoutes";

import errorHandle from "./utils/errorHandle";

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
app.use("/api/message,", MessageRoutes);

app.use(errorHandle);
const server = app.listen(process.env.PORT, () => {
  console.log(`server is listening to ${process.env.PORT}`);
});
