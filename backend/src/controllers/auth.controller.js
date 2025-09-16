// Import required dependencies
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { ENV } from "../lib/env.js";
import { sendWelcomeEmail } from "../emails/emailHandellers.js";

/**
 * User signup controller
 * Handles user registration with validation, password hashing, and welcome email
 * @param {Object} req - Express request object containing user data
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data or error message
 */
export const signup = async (req, res) => {
  // Extract user data from request body
  const { fullName, email, password } = req.body;
  
  try {
    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "جميع الحقول مطلوبة!" });
    }
    
    // Validate password length (minimum 6 characters)
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
    
    // Check if user already exists in database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "المستخدم موجود بالفعل!" });
    }
    
    // Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create a new user instance
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });
    
    // Check if user was created successfully
    if (newUser) {
      // Generate JWT token for authentication
      generateToken(newUser._id, res);
      
      // Save user to database
      const saveUser = await newUser.save();
      
      // Return user data (excluding password) with success status
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
      
      // Send welcome email to new user (non-blocking)
      try {
        await sendWelcomeEmail(
          saveUser.email,
          saveUser.fullName,
          ENV.CLIENT_URL
        );
      } catch (error) {
        // Log email error but don't fail the signup process
        console.error("Error sending welcome email:", error);
      }
    } else {
      // Handle case where user creation failed
      res.status(400).json({ message: "بيانات المستخدم غير صالحة." });
    }
  } catch (error) {
    // Handle any unexpected errors during signup process
    console.error("Error during signup:", error);
    res.status(500).json({ message: "حدث خطأ في الخادم." });
  }
};
