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
router.post("/test/:id", async (req, res, next) => {
  const { email, password } = req.body;
  const { id } = req.params;
  const primsa = getPrismaInstance();
  console.log("primsa", primsa);
  console.log("id", id);

  const result = await primsa.user.create({
    data: {
      email,
      password,
    },
  });

  console.log("test result", result);

  return res.status(201).json(result);
});

export default router;
