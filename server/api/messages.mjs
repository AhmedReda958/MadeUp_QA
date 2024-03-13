import DatabaseError from "#errors/database.mjs";
import User from "#database/models/user.mjs";
import Message from "#database/models/message.mjs";
import { isValidObjectId } from "mongoose";
import authMiddleware, {
  requiredAuthMiddleware,
} from "#middlewares/authorization.mjs";
import paginationMiddleware from "#middlewares/pagination.mjs";

import express from "express";
import Notification from "#database/models/notification.mjs";
const router = express.Router();

router.use(authMiddleware);

router.use(
  ["/message/:messageId", "/likes/message/:messageId"],
  (req, res, next) => {
    let { messageId } = req.params;
    if ("messageId" in req.params && !isValidObjectId(messageId))
      return res.status(400).json({ code: "INVALID_MESSAGE_ID" });
    next();
  }
);

router.use(
  ["/user/:targetUserId", "/likes/user/:targetUserId"],
  (req, res, next) => {
    let { targetUserId } = req.params;
    if ("targetUserId" in req.params && !isValidObjectId(targetUserId))
      return res.status(400).json({ code: "INVALID_USER_ID" });
    next();
  }
);

// Fetch the not answered received message
router.get(
  "/inbox",
  requiredAuthMiddleware,
  paginationMiddleware,
  (req, res, next) => {
    Message.userInbox(req.userId, req.pagination, {
      includes: req.query.include,
      users: req.query.user,
    })
      .then((userInbox) => res.status(200).json(userInbox))
      .catch(next);
  }
);

// Fetch the sent messages
router.get(
  "/sent",
  requiredAuthMiddleware,
  paginationMiddleware,
  (req, res, next) => {
    Message.sentByUser(req.userId, req.pagination, {
      includes: req.query.include,
      allow: ["anonymous"],
      users: req.query.user,
    })
      .then((sentByUser) => res.status(200).json(sentByUser))
      .catch(next);
  }
);

router
  .route("/user/:targetUserId")
  // Fetch Answered Messages
  .get(paginationMiddleware, (req, res, next) => {
    Message.answeredByUser(
      req.params.targetUserId,
      req.pagination,
      req.userId != req.params.targetUserId,
      {
        includes: req.query.include,
        users: req.query.user,
      }
    )
      .then((answeredByUser) => res.status(200).json(answeredByUser))
      .catch(next);
  })
  // Send Message
  .post(async (req, res, next) => {
    try {
      const user = await User.findById(req.params.targetUserId, { _id: 1 });
      if (!user) return res.status(404).json({ code: "USER_NOT_FOUND" });

      const { content, anonymously } = req.body;
      const message = new Message({
        content,
        anonymous: req.userId ? anonymously : true,
        sender: req.userId || null,
        receiver: user._id,
      });

      try {
        await message.save();
      } catch (err) {
        throw new DatabaseError("SAVE_MESSAGE", err);
      }

      try {
        await new Notification({
          user: user._id,
          title: "Received a new message",
          content,
          url: "/message/messages/replay?id=" + message._id,
        }).save();
      } catch (err) {
        console.error(err); // TODO: handle notification error
      }

      return res
        .status(201)
        .json(
          Object.fromEntries(
            ["_id", "content", "sender", "receiver", "timestamp"].map(
              (field) => [field, message[field]]
            )
          )
        );
    } catch (err) {
      next(err);
    }
  });

router
  .route("/message/:messageId")
  // Fetch a message
  .get((req, res, next) => {
    Message.fetch(req.params.messageId, req.userId, {
      includes: req.query.include,
      users: req.query.user,
    })
      .then((message) => {
        if (message != null) res.status(200).json(message);
        else res.status(404).json({ code: "MESSAGE_NOT_FOUND" });
      })
      .catch(next);
  })
  // Reply to a message
  .post(requiredAuthMiddleware, async (req, res, next) => {
    try {
      const message = await Message.findById(req.params.messageId, {
        receiver: 1,
        "reply.content": 1,
      });
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
        throw new DatabaseError("UPDATE_MESSAGE_REPLY", err);
      }

      return res.status(201).json(reply);
    } catch (err) {
      next(err);
    }
  });

router
  .route("/likes/message/:messageId")
  // Fetch user(s) that liked a message
  .get(paginationMiddleware, (req, res, next) => {
    Message.likes(
      req.params.messageId,
      Object.assign(req.pagination, {
        usersId: "usersId" in req.query,
        usersBrief: "usersBrief" in req.query,
      })
    )
      .then((likes) => {
        if (likes != null) res.status(200).send(likes);
        else res.status(404).send({ code: "MESSAGE_NOT_FOUND" });
      })
      .catch(next);
  })
  // Like a message
  .put(requiredAuthMiddleware, (req, res, next) => {
    Message.setLikeBy(req.params.messageId, req.userId, true)
      .then(({ found, updated }) => {
        if (found) res.status(200).send({ like: true, updated });
        else res.status(404).send({ code: "MESSAGE_NOT_FOUND" });
      })
      .catch(next);
  })
  // Remove a message like
  .delete(requiredAuthMiddleware, (req, res, next) => {
    Message.setLikeBy(req.params.messageId, req.userId, false)
      .then(({ found, updated }) => {
        if (found) res.status(200).send({ like: false, updated });
        else res.status(404).send({ code: "MESSAGE_NOT_FOUND" });
      })
      .catch(next);
  });

// If user liked a message
router.get("/likes/message/:messageId/liked", (req, res, next) => {
  let targetUserId = req.query.userId;
  if (!isValidObjectId(targetUserId)) {
    if (req.userId) targetUserId = req.userId;
    else res.status(400).json({ code: "INVALID_USER_ID" });
  }

  Message.isLikedBy(req.params.messageId, targetUserId)
    .then((liked) => {
      if (liked != null) res.status(200).send({ liked });
      else res.status(404).send({ code: "MESSAGE_NOT_FOUND" });
    })
    .catch(next);
});

router
  .route("/likes/user/:targetUserId")
  // Fetch messages that are liked by a user
  .get(paginationMiddleware, (req, res, next) => {
    Message.likedBy(req.params.targetUserId, req.pagination, {
      includes: req.query.include,
      users: req.query.user,
    })
      .then((likedByUser) => res.status(200).json(likedByUser))
      .catch(next);
  });

export default router;
