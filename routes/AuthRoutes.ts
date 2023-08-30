import { signIn, onSignUpUser, refresh } from "../controller/AuthController";
import { Router } from "express";

const router = Router();

// signup, signin , logout
router.post("/sign-up", onSignUpUser);
router.post("/sign-in", signIn);
router.post("/refresh", refresh);

export default router;
