import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));

// middleware
app.use(cookieParser());
app.use(express.json({ limit: "4mb" }));

// socket.io supports this http server only
const server = http.createServer(app);

// initialize socket.io server
export const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }
});

// Helper to parse cookies from handshake headers
const parseCookies = (cookieString) => {
  if (!cookieString) return {};
  return cookieString.split(';').reduce((res, item) => {
    const parts = item.split('=');
    res[parts[0].trim()] = (parts[1] || '').trim();
    return res;
  }, {});
};

// Socket auth using HTTP-only cookie token
io.use((socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) return next(new Error("Not authenticated - no cookies"));

    const parsedCookies = parseCookies(cookies);
    const token = parsedCookies.token;
    if (!token) return next(new Error("Not authenticated - no token"));

    const decoded = jwt.verify(token, process.env.JWTSECRET_KEY);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    return next(new Error("Not authenticated - invalid token"));
  }
});

// store online users
export const userSocketMap = {};  // {userId: socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.userId;

  socket.join(userId); // 🔥 personal room

  userSocketMap[userId] = socket.id;
  io.emit("getonlineusers", Object.keys(userSocketMap));

  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", { senderId: userId });
    }
  });

  socket.on("stop_typing", ({ receiverId }) => {
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing_stopped", { senderId: userId });
    }
  });

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getonlineusers", Object.keys(userSocketMap));
  });
});

// routes 
app.use("/api/status", (req, res) => {
  res.send("server is live!");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);
app.all("/health", (req, res) => {
  res.status(200).send("OK");
});

// connect to database
await connectDB();

const PORT = process.env.PORT || 7001;

server.listen(PORT, () => {
  console.log("server running on PORT:", PORT);
});

// export server for vercel
export default server;
