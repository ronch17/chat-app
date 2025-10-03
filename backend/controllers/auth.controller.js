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
exports.checkAuth = exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../lib/utils");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (typeof password !== "string" || password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }
        const user = yield user_model_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new user_model_1.default({
            fullName,
            email,
            password: hashedPassword,
        });
        (0, utils_1.generateToken)(newUser._id, res);
        yield newUser.save();
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });
    }
    catch (err) {
        console.log("Error in signup controller", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials." });
        }
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid credentials." });
        }
        (0, utils_1.generateToken)(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    }
    catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.login = login;
const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.logout = logout;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Profile pic is required" });
        }
        const userId = req.user._id;
        // מעלים ל־Cloudinary בעזרת buffer
        const uploadResponse = yield new Promise((resolve, reject) => {
            var _a;
            const stream = cloudinary_1.default.uploader.upload_stream((error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            stream.end((_a = req.file) === null || _a === void 0 ? void 0 : _a.buffer);
        });
        const updatedUser = yield user_model_1.default.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Error in updateProfile Function", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProfile = updateProfile;
const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        return res.status(200).json(req.user);
    }
    catch (error) {
        console.log("Error in checkAuth Function", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.checkAuth = checkAuth;
