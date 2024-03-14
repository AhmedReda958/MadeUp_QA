import message from "#database/models/message.mjs";
import notification from "#database/models/notification.mjs";
import authMiddleware, {
  requiredAuthMiddleware,
} from "#middlewares/authorization.mjs";
import express from "express";
const router = express.Router();

router.get(
  "/unseen",
  authMiddleware,
  requiredAuthMiddleware,
  async (req, res, next) => {
    try {
      const notificationsCount = await notification.countDocuments({
        user: req.userId,
        seen: false,
      });
      const messagesCount = await message.countDocuments({
        receiver: req.userId,
        seen: false,
      });
      res.status(200).json({ notificationsCount, messagesCount });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
