import { Router } from "express";
import {
  addAudioMessage,
  addImageMessage,
  addMessage,
  filterMessages,
  getMessages,
  sendUpdatedChatListsData,
} from "../controller/MessageController";

import multer from "multer";

const router = Router();

const uploadImage = multer({ dest: "uploads/images/" });
const uploadAudio = multer({ dest: "uploads/recordings/" });

router.get("/get-messages/:from/:to", getMessages);
router.post("/add-message", addMessage);
router.post("/add-image-message", uploadImage.single("image"), addImageMessage);
router.post("/add-audio-message", uploadAudio.single("audio"), addAudioMessage);
router.get("/get-updated-chat-list/:from", sendUpdatedChatListsData);
router.get("/filter-message/:from/:message", filterMessages);

export default router;
