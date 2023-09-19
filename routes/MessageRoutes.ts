import { Router } from "express";
import {
  addImageMessage,
  addMessage,
  getMessages,
} from "../controller/MessageController";

import multer from "multer";

const router = Router();

const uploadImage = multer({ dest: "uploads/images/" });

router.get("/get-messages/:from/:to", getMessages);
router.post("/add-message", addMessage);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);

export default router;
