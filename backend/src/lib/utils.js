import jwt from "jsonwebtoken";
import { ENV } from "./env.js";
const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!ENV.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = jwt.sign({ id: userId }, ENV.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("token", token, {
    httpOnly: true, // Accessible only by web server preventing XSS attacks
    secure: ENV.NODE_ENV === "development" ? false : true, // Ensures the browser only sends the cookie over HTTPS
    sameSite: "Strict", // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  return token;
};
export { generateToken };
