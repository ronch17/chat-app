import express from "express";
import authRouter from "./routes/auth.route";
import messageRoutes from "./routes/message.route";
import dotenv from "dotenv";
import { connectDB } from "./lib/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket";

dotenv.config();

const PORT = process.env.PORT;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRoutes); // ודא שהנתיב והמופע תקינים

server.listen(PORT, () => {
  console.log("server is running at " + PORT);
  connectDB();
});
