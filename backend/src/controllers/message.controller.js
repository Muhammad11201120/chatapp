import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";

// GET all contacts
export const getAllContacts = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getAllContacts:", error);
    res.status(500).json({ message: "حدث خطأ في الخادم." });
  }
};

// GET messages by user id
export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id;
    const partnerId = req.params.id;
    const messages = await Message.find({
      // OR condition to get messages from both sides
      $or: [
        { sender: myId, receiver: partnerId },
        { sender: partnerId, receiver: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessagesByUserId:", error);
    res.status(500).json({ message: "حدث خطأ في الخادم." });
  }
};
// POST send message
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "يجب أن يكون لديك نص أو صورة للإرسال." });
    }
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "لا يمكنك إرسال رسالة لنفسك." });
    }
    const receiverExists = await User.exists({ _id: receiverId });
    if (!receiverExists) {
      return res.status(404).json({ message: "المستخدم غير موجود." });
    }
    let imageUrl = null;
    if (image) {
      const result = await cloudinary.uploader.upload(image);
      imageUrl = result.secure_url;
    }
    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    // todo: send message in real-time if user is online using socket.io

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "حدث خطأ في الخادم." });
  }
};
// GET chat partners
export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    //find all messages where sender is loggedInUser or receiver is loggedInUser
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });
    const chatPartners = messages.map((message) => {
      return message.senderId.toString() === loggedInUserId.toString()
        ? message.receiverId.toString()
        : message.senderId.toString();
    });
    res.status(200).json(chatPartners);
    //remove duplicates
    const uniqueChatPartners = [...new Set(chatPartners)];
    //find users by their ids
    const chatPartnersUsers = await User.find({
      _id: { $in: uniqueChatPartners },
    }).select("-password");
    res.status(200).json(chatPartnersUsers);
  } catch (error) {
    console.error("Error in getChatPartners:", error);
    res.status(500).json({ message: "حدث خطأ في الخادم." });
  }
};
