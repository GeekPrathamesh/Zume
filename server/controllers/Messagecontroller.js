import cloudinary from "../lib/cloudinary.js";
import Message from "../models/MessageModel.js";
import User from "../models/Usermodel.js";
import { io, userSocketMap } from "../server.js";

// get all users except current logged-in user
export const getUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    // count messages that are not seen
    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });
    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get all messages of selected user
export const getMessagesselecteduser = async (req, res) => {
  try {
    const { id: selectedId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: selectedId },
        { senderId: selectedId, receiverId: userId },
      ],
    });

    await Message.updateMany(
      { senderId: selectedId, receiverId: userId },
      { seen: true }
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// api to make message as seen while chatting
export const markMessageseen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// send message to selected user
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const userId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      senderId: userId,
      receiverId,
      text,
      image: imageUrl,
    });

    // emit new message to receiver socket room directly (identified by receiverId)
    io.to(receiverId).emit("newMessage", newMessage);

    res.json({ success: true, newMessage });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
