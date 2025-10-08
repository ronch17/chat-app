import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getMessage,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/users.controller.js";

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessage);

router.post("/send/:id", protectRoute, upload.single("image"), sendMessage);

export default router;
