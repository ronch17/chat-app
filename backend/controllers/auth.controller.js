import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils";
import cloudinary from "../lib/cloudinary";
export const signup = async (req, res) => {
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
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });
        generateToken(newUser._id, res);
        await newUser.save();
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
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials." });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid credentials." });
        }
        generateToken(user._id, res);
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
};
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logout successfully" });
    }
    catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const updateProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Profile pic is required" });
        }
        const userId = req.user._id;
        // מעלים ל־Cloudinary בעזרת buffer
        const uploadResponse = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream((error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            stream.end(req.file?.buffer);
        });
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Error in updateProfile Function", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const checkAuth = (req, res) => {
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
