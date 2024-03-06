import {
  signIn,
  onSignUpUser,
  refresh,
  getUserInfo,
  getAllUsers,
} from "../controller/AuthController";
import { Router } from "express";

import { validateToken } from "../middleware/validateToken";

const router = Router();

// signup, signin , logout
router.post("/sign-up", onSignUpUser);
router.post("/sign-in", signIn);
router.post("/refresh", refresh);
router.get("/user/:email", validateToken, getUserInfo);
router.get("/users", validateToken, getAllUsers);

export default router;
