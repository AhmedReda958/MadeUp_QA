import message from "##/database/models/message.mjs";
import notification from "##/database/models/notification.mjs";
import authMiddleware, {
  requiredAuthMiddleware,
} from "##/middlewares/authorization.mjs";
import express from "express";
const router = express.Router();

// TODO: replace with websocket

// get unseen notifications count
router.get(
  "/unseen-count",
  authMiddleware,
  requiredAuthMiddleware,
  async (req, res, next) => {
    try {
      const notifications = await notification.countDocuments({
        user: req.userId,
        seen: false,
      });
      const messages = await message.countDocuments({
        receiver: req.userId,
        seen: false,
      });
      res.status(200).json({ notifications, messages });
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

      const notifications = await notification.countDocuments({
        user: req.userId,
        seen: false,
      });
      const messages = await message.countDocuments({
        receiver: req.userId,
        seen: false,
      });

      if (type === "notificatoins") {
        await markNotifications();
      } else if (type === "messages") {
        await markMessages();
      } else {
        await markNotifications();
        await markMessages();
      }
      res.json({ notifications, messages });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
