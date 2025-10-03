"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/signup", auth_controller_1.signup);
router.post("/login", auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
router.put("/update-profile", auth_middleware_1.protectRoute, upload.single("profilePic"), auth_controller_1.updateProfile);
router.get("/check", auth_middleware_1.protectRoute, auth_controller_1.checkAuth);
exports.default = router;
