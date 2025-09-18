import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetMiddleware } from "../middleware/arcjet.middleware.js";

const router = express.Router();
// Apply arcjet middleware and protectRoute to all routes
// All middlewares executed in order so requests is rate limited first then authenticated
// this is actually more efficient since authontcated requests get blocked if they are rate limited
// before hitting the auth middleware
router.use(arcjetMiddleware, protectRoute);
// Apply arcjet middleware to all routes
router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;
