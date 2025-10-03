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
exports.protectRoute = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_js_1 = __importDefault(require("../models/user.model.js"));
const protectRoute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.jwt; // הגנה אם אין בכלל cookies
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No Token Provided" });
        }
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (err) {
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }
        const user = yield user_model_js_1.default.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        req.user = user;
        return next(); // חייב return כדי לעצור כאן
    }
    catch (error) {
        console.error("Error in protectRoute middleware:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.protectRoute = protectRoute;
