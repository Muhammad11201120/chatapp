// Import required dependencies
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { ENV } from "../lib/env.js";
import { sendWelcomeEmail } from "../emails/emailHandellers.js";
import cloudinary from "../lib/cloudinary.js";

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

    // check if emailis valid: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "عنوان البريد الإلكتروني غير صالح!" });
    }

    const user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "المستخدم موجود بالفعل!" });

    // 123456 => $dnjasdkasj_?dmsakmk
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // before CR:
      // generateToken(newUser._id, res);
      // await newUser.save();

      // after CR:
      // Persist user first, then issue auth cookie
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullName,
          ENV.CLIENT_URL
        );
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "بيانات المستخدم غير صالحة." });
    }
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "حدث خطأ في الخادم." });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة!" });
    }

    // Simple email regex for validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "عنوان البريد الإلكتروني غير صالح!" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "البيانات غير صحيحة." });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "البيانات غير صحيحة." });
    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "حدث خطأ في الخادم." });
  }
};
export const logout = (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0), maxAge: 0 });
  res.status(200).json({ message: "تم تسجيل الخروج بنجاح." });
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName } = req.body;
    //validate required fields
    if (!fullName) return res.status(400).json({ message: "الاسم مطلوب" });
    if (!profilePic) return res.status(400).json({ message: "الصورة مطلوبة" });
    if (profilePic.size > 1024 * 1024 * 5)
      return res.status(400).json({ message: "الصورة يجب أن تكون أقل من 5MB" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    // Upload new profile picture to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profile_pics",
      width: 150,
      height: 150,
      crop: "fill",
    });
    // Update user's profilePic field with the new URL
    user.profilePic = uploadResponse.secure_url;
    user.fullName = fullName;
    await user.save();
    res.status(200).json({ profilePic: user.profilePic });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "حدث خطأ في الخادم." });
  }
};
