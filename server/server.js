import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http"
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";


const app=express();

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));


app.use("/api", ClerkExpressRequireAuth());
// socket.io supports this http server only
const server=http.createServer(app);

//initialize socket.io server
export const io = new Server(server,{
    cors:{origin:"*"}
})

//  Clerk socket auth
io.use((socket, next) => {
  const clerkUserId = socket.handshake.auth.clerkUserId;
  if (!clerkUserId) return next(new Error("Not authenticated"));

  socket.userId = clerkUserId;
  next();
});

// store online user
export const userSocketMap={};  //{userId:socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
  const clerkId = socket.userId;

  socket.join(clerkId); // 🔥 personal room

  userSocketMap[clerkId] = socket.id;
  io.emit("getonlineusers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[clerkId];
    io.emit("getonlineusers", Object.keys(userSocketMap));
  });
});



//middlewere
app.use(express.json({limit:"4mb"}));


//routes 
app.use("/api/status",(req,res)=>{
res.send("server is live!")
})
app.use("/api/auth",userRouter);
app.use("/api/messages",messageRouter);
app.all("/health", (req, res) => {
  res.status(200).send("OK");
});


//connect to database
await connectDB();

const PORT = process.env.PORT || 7001;

server.listen(PORT, () => {
  console.log("server running on PORT:", PORT);
});


//export server for vercel
export default server;

