"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const users_controller_1 = require("../controllers/users.controller");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = express_1.default.Router();
router.get("/users", auth_middleware_1.protectRoute, users_controller_1.getUsersForSidebar);
router.get("/:id", auth_middleware_1.protectRoute, users_controller_1.getMessage);
router.post("/send/:id", auth_middleware_1.protectRoute, upload.single("image"), users_controller_1.sendMessage);
exports.default = router;
