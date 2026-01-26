import express from "express";
import { getMessagesselecteduser, getUsers, markMessageseen, sendMessage } from "../controllers/Messagecontroller.js";

const messageRouter = express.Router();

messageRouter.get("/users", getUsers);
messageRouter.get("/:id", getMessagesselecteduser);
messageRouter.put("/mark/:id", markMessageseen);
messageRouter.post("/send/:id", sendMessage);

export default messageRouter;
