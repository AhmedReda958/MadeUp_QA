import message from "#database/models/message.mjs";
import notification from "#database/models/notification.mjs";
import authMiddleware, {
  requiredAuthMiddleware,
} from "#middlewares/authorization.mjs";
import express from "express";
const router = express.Router();

// get unseen notifications count
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

// mark notifications and messages as unseen
router.patch(
  "/mark-as-seen",
  authMiddleware,
  requiredAuthMiddleware,
  async (req, res, next) => {
    try {
      const { type } = req.query;
      const markNotifications = async () =>
        await notification.updateMany(
          {
            user: req.userId,
            seen: false,
          },
          { seen: true }
        );

      const markMessages = async () =>
        await message.updateMany(
          {
            receiver: req.userId,
            seen: false,
          },
          { seen: true }
        );

      if (type === "notificatoins") {
        await markNotifications();
        res.json({ message: "All unseen notifications marked as seen" });
      } else if (type === "messages") {
        await markMessages();
        res.json({ message: "All unseen messages marked as seen" });
      } else {
        await markNotifications();
        await markMessages();
        res.json({ message: "All unseen marked as seen" });
      }
    } catch (error) {
      next(error);
    }
  }
);

export default router;
