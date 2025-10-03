import express from "express";
import { protectRoute } from "../middleware/auth.middleware";
import {
  getMessage,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/users.controller";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessage);

router.post("/send/:id", protectRoute, sendMessage);

export default router;
