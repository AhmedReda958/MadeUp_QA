import { CommonError } from "#middlewares/errors-handler.js";
import User from "#database/models/user.js";
import Message from "#database/models/message.js";
import { isValidObjectId } from "mongoose";
import authMiddleware, {
  requiredAuthMiddleware,
} from "../middlewares/authorization.js";

import express from "express";
const router = express.Router();

// TODO: pagination

router.use(authMiddleware);

// Fetch the not answered received message
router.get(
  "/inbox",
  requiredAuthMiddleware,
  (req, res, next) => {
    Message.userInbox(req.userId, {
      include: req.query.include,
      detailUser: req.query.detailUser
    }).then(userInbox => res.status(200).json(userInbox))
    .catch(next); 
  }
);

// Fetch the sent messages
router.get(
  "/sent",
  requiredAuthMiddleware,
  (req, res, next) => {
    Message.sentByUser(req.userId, {
      include: req.query.include,
      allow: ["anonymous"],
      detailUser: req.query.detailUser
    }).then(sentByUser => res.status(200).json(sentByUser))
    .catch(next);
  }
);

router.use("/user/:targetId", (req, res, next) => {
  if (!isValidObjectId(req.params.targetId))
    return res.status(400).json({ code: "INVALID_USER_ID" });
  next();
});

router
  .route("/user/:targetId")
  // Fetch Answered Messages
  .get((req, res, next) => {
    Message.answeredByUser(
      req.params.targetId,
      req.userId != req.params.targetId,
      {
        include: req.query.include,
        detailUser: req.query.detailUser
      }
    ).then(answeredByUser => res.status(200).json(answeredByUser))
    .catch(next);
  })
  // Send Message
  .post(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.targetId, { _id: 1 });
      if (!user) return res.status(404).json({ code: "USER_NOT_FOUND" });

      const { content, anonymously } = req.body;
      const message = new Message({
        content,
        anonymous: req.userId ? anonymously : true,
        sender: req.userId || null,
        receiver: user._id,
      });

      try { await message.save(); } catch (err) {
        throw new CommonError("SEND_MESSAGE", err);
      }

      return res.status(201).json(Object.fromEntries(
        [
          "_id",
          "content",
          "sender",
          "receiver",
          "timestamp"
        ].map(field => [field, message[field]])
      ))
    } catch (err) {
      next(err);
    }
  });

router.use("/message/:messageId", (req, res, next) => {
  if (!isValidObjectId(req.params.messageId))
    return res.status(400).json({ code: "INVALID_MESSAGE_ID" });
  next();
});

router
  .route("/message/:messageId")
  // Fetch a message
  .get((req, res, next) => {
    Message.fetch(req.params.messageId, req.userId, {
      include: req.query.include,
      detailUser: req.query.detailUser
    }).then(message => res.status(200).json(message))
    .catch(next);
  })
  // Reply to a message
  .post(requiredAuthMiddleware, async (req, res, next) => {
    try {
      const message = await Message.findById(
        req.params.messageId, { receiver: 1, "reply.content": 1, }
      );
      if (!message) return res.status(404).json({ code: "MESSAGE_NOT_FOUND" });
      if (message.receiver != req.userId)
        return res.status(403).json({ code: "NOT_THE_RECEIVER" });
      if (message.reply.content != null)
        return res.status(409).json({ code: "ALREADY_REPLIED" });

      let { privately, content } = req.body;
      const reply = { content };
      if (!(typeof content == "string" && content.length > 0))
        return res.status(400).json({ code: "INVALID_CONTENT" });
      if ("privately" in req.body) reply.private = privately;
      reply.timestamp = new Date();

      try {
        await Message.updateOne({ _id: message._id }, { $set: { reply } });
      } catch (err) {
        throw new CommonError("REPLY_MESSAGE", err);
      }

      return res.status(201).json(reply);
    } catch (err) {
      next(err);
    }
  });

export default router;
