import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة!" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل!" });
    }
    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "عنوان البريد الإلكتروني غير صالح!" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "المستخدم موجود بالفعل!" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create a new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
      //todo: send welcome email
    } else {
      res.status(400).json({ message: "بيانات المستخدم غير صالحة." });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "حدث خطأ في الخادم." });
  }
};
