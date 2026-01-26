import { Server } from "socket.io";
export const clerk=
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// 🔐 Clerk auth middleware for socket
io.use((socket, next) => {
  const clerkUserId = socket.handshake.auth.clerkUserId;

  if (!clerkUserId) {
    return next(new Error("Not authenticated"));
  }

  socket.userId = clerkUserId; // attach to socket
  next();
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.userId);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.userId);
  });
});
