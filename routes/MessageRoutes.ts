import { Router } from "express";
import {
  addAudioMessage,
  addImageMessage,
  addMessages,
  filterMessages,
  getMessages,
  sendUpdatedChatListsData,
} from "../controller/MessageController";

import multer from "multer";

const router = Router();

const uploadImage = multer({ dest: "uploads/images/" });
const uploadAudio = multer({ dest: "uploads/recordings/" });

router.get("/messages/from/:from/to/:to", getMessages);
router.post("", addMessages);
router.post("/image", uploadImage.single("image"), addImageMessage);
router.post("/audio", uploadAudio.single("audio"), addAudioMessage);
router.get("/get-updated-chat-list/:from", sendUpdatedChatListsData);
router.get("/filter-message/:from/:message", filterMessages);

export default router;
