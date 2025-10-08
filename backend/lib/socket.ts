import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

const userSocketMap: Record<string, string> = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // הבטחת טיפוס – ייקח תמיד מחרוזת אחת בלבד
  const queryUserId = socket.handshake.query.userId;
  const userId =
    Array.isArray(queryUserId) && queryUserId.length > 0
      ? queryUserId[0]
      : typeof queryUserId === "string"
        ? queryUserId
        : undefined;

  // אם יש userId תקין – שמור אותו במפה
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    if (userId) {
      delete userSocketMap[userId];
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
