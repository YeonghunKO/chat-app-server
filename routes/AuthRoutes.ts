import {
  signIn,
  onSignUpUser,
  refresh,
  getUserInfo,
  getAllUsers,
} from "../controller/AuthController";
import { Router } from "express";

import getPrismaInstance from "../utils/PrismaClient";

const router = Router();

// signup, signin , logout
router.post("/sign-up", onSignUpUser);
router.post("/sign-in", signIn);
router.post("/refresh", refresh);
router.get("/user/:email", getUserInfo);
router.get("/users", getAllUsers);

export default router;
