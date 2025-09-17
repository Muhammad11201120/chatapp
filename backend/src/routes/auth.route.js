import express from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetMiddleware } from "../middleware/arcjet.middleware.js";
const router = express.Router();
// Apply arcjet middleware to all routes
router.use(arcjetMiddleware);
// Auth routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/updat  e-profile", protectRoute, updateProfile);
// Route to check if user is authenticated
router.get("/check-auth", protectRoute, (req, res) => {
  res.status(200).json({ message: "المستخدم مصرح به", user: req.user });
});
export default router;
