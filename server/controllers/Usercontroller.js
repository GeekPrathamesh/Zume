// import { generateToken } from "../lib/utils.js";
import User from "../models/Usermodel.js";
// import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import clerkClient from "@clerk/clerk-sdk-node";

//sign up new user


// Sync Clerk user to MongoDB
export const clerkSync = async (req, res) => {
  try {
    const clerkId = req.auth.userId;

    const clerkUser = await clerkClient.users.getUser(clerkId);

    const email = clerkUser.emailAddresses[0].emailAddress;
    const fullName = clerkUser.firstName || "User";

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email,
        fullName,
        bio: "",
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Clerk Sync Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// Check auth (Clerk already verified)
export const checkAuth = (req, res) => {
  res.json({ success: true, userId: req.auth.userId });
};


// // SIGN UP
// export const Signup = async (req, res) => {
//   try {
//     const { email, fullName, password, bio } = req.body;

//     if (!email || !fullName || !password || !bio) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing details",
//       });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already exists",
//       });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = await User.create({
//       fullName,
//       email,
//       password: hashedPassword,
//       bio,
//     });

//     const token = generateToken(newUser._id);

//     res.status(201).json({
//       success: true,
//       userData: {
//         _id: newUser._id,
//         fullName: newUser.fullName,
//         email: newUser.email,
//         bio: newUser.bio,
//       },
//       token,
//       message: "Account created successfully",
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// //login a user and return him token
// // LOGIN
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const userData = await User.findOne({ email });
//     if (!userData) {
//       return res.status(401).json({
//         success: false,
//         message: "Create account first",
//       });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, userData.password);

//     if (!isPasswordCorrect) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const token = generateToken(userData._id);

//     res.json({
//       success: true,
//       userData: {
//         _id: userData._id,
//         fullName: userData.fullName,
//         email: userData.email,
//         bio: userData.bio,
//       },
//       token,
//       message: "Login successful",
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// check if user authenticated



// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const clerkId = req.auth.userId;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findOneAndUpdate(
        { clerkId },
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findOneAndUpdate(
        { clerkId },
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// controller to update user profile details
// export const updateProfile = async (req, res) => {
//   try {
//     const { profilePic, bio, fullName } = req.body;
//     const userId = req.user._id;
//     let updatedUser;
//     if (!profilePic) {
//       updatedUser = await User.findByIdAndUpdate(
//         userId,
//         { bio, fullName },
//         { new: true }
//       );
//     } else {
//       const upload = await cloudinary.uploader.upload(profilePic);
//       updatedUser = await User.findByIdAndUpdate(
//         userId,
//         {
//           profilePic: upload.secure_url,
//           bio,
//           fullName,
//         },
//         { new: true }
//       );
//     }
//     res.json({success:true,user:updatedUser})
//   } catch (error) {
//     console.log(error.message);
    
//         res.json({success:false,message:error.message})

//   }
// };
