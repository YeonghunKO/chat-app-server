import { Router } from "express";
import { addMessage, getMessages } from "../controller/MessageController";

const router = Router();

router.get("/get-messages/:from/:to", getMessages);
router.post("/add-message", addMessage);

export default router;
