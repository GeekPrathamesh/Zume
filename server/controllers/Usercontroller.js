import User from "../models/Usermodel.js";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";

// Helper to set cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// SIGN UP
export const Signup = async (req, res) => {
  try {
    const { email, fullName, password, bio } = req.body;

    if (!email || !fullName || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio: bio || "",
    });

    const token = generateToken(newUser._id);
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic || "",
      },
      message: "Account created successfully",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic || "",
      },
      message: "Login successful",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ success: true, message: "Logged out successfully" });
};

// Check auth (User already verified by protectedRoute middleware)
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      ).select("-password");
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      ).select("-password");
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
