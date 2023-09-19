import { Router } from "express";
import {
  addAudioMessage,
  addImageMessage,
  addMessage,
  getMessages,
} from "../controller/MessageController";

import multer from "multer";

const router = Router();

const uploadImage = multer({ dest: "uploads/images/" });
const uploadAudio = multer({ dest: "uploads/recordings/" });

router.get("/get-messages/:from/:to", getMessages);
router.post("/add-message", addMessage);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);
router.post("/add-audio-message", uploadImage.single("audio"), addAudioMessage);

export default router;
