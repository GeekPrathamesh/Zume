import express from "express";
import { Signup, login, checkAuth, updateProfile, logout } from "../controllers/Usercontroller.js";
import { protectedRoute } from "../middleware/Auth.js";

const userRouter = express.Router();

userRouter.post("/signup", Signup);
userRouter.post("/login", login);
userRouter.post("/logout", logout);
userRouter.get("/check", protectedRoute, checkAuth);
userRouter.put("/update-profile", protectedRoute, updateProfile);

export default userRouter;
