import express from "express";
import { getMessagesselecteduser, getUsers, markMessageseen, sendMessage } from "../controllers/Messagecontroller.js";
import { protectedRoute } from "../middleware/Auth.js";

const messageRouter = express.Router();

// Apply auth middleware to all message routes
messageRouter.use(protectedRoute);

messageRouter.get("/users", getUsers);
messageRouter.get("/:id", getMessagesselecteduser);
messageRouter.put("/mark/:id", markMessageseen);
messageRouter.post("/send/:id", sendMessage);

export default messageRouter;
