import express from "express";
import authRouter from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// 🧭 הגדרה נכונה של __dirname ב־ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://chat-frontend.onrender.com" // לשים כאן את הדומיין של הפרונט שלך ב־Render
        : "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
