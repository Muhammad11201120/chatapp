import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const result = await aj.protect(req);
    if (result.isDenied()) {
      if (result.reason.isRateLimit())
        return res.status(429).json({ message: "محظور! طلبات كثيرة جداً!" });
      else if (result.reason.isBot())
        return res.status(403).json({ message: "محظور! تم اكتشاف وصول بوت!" });
      else
        return res
          .status(403)
          .json({ message: "محظور! تم اكتشاف وصول غير مصرح!" });
    }
    // check spoofed bot
    const isSpoofed = await isSpoofedBot(req);
    if (result.results.some(isSpoofedBot))
      return res.status(403).json({
        error: "spoofed_bot",
        message: "محظور! تم اكتشاف وصول بوت مزيف!",
      });
    next();
  } catch (error) {
    console.error("Error in arcjetMiddleware:", error);
    next();
  }
};
