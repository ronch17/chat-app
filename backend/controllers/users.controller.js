"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessage = exports.getUsersForSidebar = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const multer_1 = __importDefault(require("multer"));
const socket_1 = require("../lib/socket");
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const getUsersForSidebar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = yield user_model_1.default.find({
            _id: { $ne: loggedInUserId },
        }).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch (error) {
        console.error("Error in getUsersForSidebar", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUsersForSidebar = getUsersForSidebar;
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const myId = req.user._id;
        const messages = yield message_model_1.default.find({
            $or: [
                { senderId: myId, receiverId: id },
                { senderId: id, receiverId: myId },
            ],
        });
        res.status(200).json(messages);
    }
    catch (error) {
        console.error("Error in getMessage", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMessage = getMessage;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;
        let imageUrl = null;
        if (req.file) {
            const uploadResult = yield new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.default.uploader.upload_stream({ resource_type: "image" }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
                uploadStream.end(req.file.buffer);
            });
            imageUrl = uploadResult.secure_url;
        }
        const newMessage = new message_model_1.default({
            text,
            image: imageUrl,
            senderId,
            receiverId,
        });
        yield newMessage.save();
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.sendMessage = sendMessage;
