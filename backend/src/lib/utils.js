import jwt from "jsonwebtoken";
const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("token", token, {
    httpOnly: true, // Accessible only by web server preventing XSS attacks
    secure: process.env.NODE_ENV === "production", // Ensures the browser only sends the cookie over HTTPS
    sameSite: "Strict", // CSRF protection
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
  return token;
};
export { generateToken };
