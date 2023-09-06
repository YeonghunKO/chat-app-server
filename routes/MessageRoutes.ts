import { Router } from "express";
import { getMessages } from "../controller/MessageController";

const router = Router();

router.get("/get-messages", getMessages);

export default router;
