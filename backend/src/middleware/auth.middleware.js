import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";
export const protectRoute = async (req, res, next) => {
  try {
    // Get token from cookies
    const token = req.cookies?.token;
    // Check if token exists
    if (!token)
      return res.status(401).json({ message: "غير مصرح، يرجى تسجيل الدخول!" });
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    // Check if token is valid
    if (!decoded)
      return res.status(401).json({ message: "غير مصرح، يرجى تسجيل الدخول!" });
    // Optionally, you can check if the user still exists in the database
    // Our JWT payload is { id: userId }, so use decoded.id
    // Also ensure we await the DB call
    const user = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ message: "غير مصرح، يرجى تسجيل الدخول!" });
    // Attach user information to request object
    req.user = user;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res
      .status(500)
      .json({ message: "خطأ في الخادم يرجى المحاولة لاحقا !" });
  }
};
