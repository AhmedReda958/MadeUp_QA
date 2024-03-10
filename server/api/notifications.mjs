import { isValidObjectId } from "mongoose";
import Notification from "#database/models/notification.mjs";
import { subscribeUser } from "#utils/webpush.mjs";
import paginationMiddleware from "#middlewares/pagination.mjs";
import authMiddleware, {
  requiredAuthMiddleware,
} from "#middlewares/authorization.mjs";
import express from "express";
const router = express.Router();

router.post(
  "/subscribe",
  authMiddleware,
  requiredAuthMiddleware,
  (req, res) => {
    let subscription = req.body;
    subscribeUser(req.userId, subscription);
    res.status(200).json({ code: "SUBSCRIBED" });
  }
);

router.get(
  "/inbox",
  authMiddleware,
  requiredAuthMiddleware,
  paginationMiddleware,
  async (req, res, next) => {
    Notification.forUser(req.userId, req.pagination)
      .then(forUser => res.status(200).json(forUser))
      .catch(next);
  }
);

router.get(
  "/inbox/:id",
  authMiddleware,
  requiredAuthMiddleware,
  async (req, res, next) => {
    try {
      let { id } = req.params;
      if (!isValidObjectId(id)) return res.status(404).json({ code: "NOTIFICATION_NOT_FOUND" });
      let notification = await Notification.findById(id);
      if (!(notification && notification.user == req.userId)) return res.status(409).json({ code: "NOTIFICATION_NOT_FOUND" });
      return res.status(200).json(notification);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
