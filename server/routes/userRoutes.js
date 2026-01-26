import express from "express";
import { clerkSync, checkAuth, updateProfile } from "../controllers/Usercontroller.js";

const userRouter = express.Router();

userRouter.post("/clerk-sync", clerkSync);
userRouter.get("/check", checkAuth);
userRouter.put("/update-profile", updateProfile);

export default userRouter;
