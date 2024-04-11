import DatabaseError from "##/errors/database.mjs";
import events from "##/events/emitter.mjs";
import User from "##/database/models/user/index.mjs";
import Message from "##/database/models/message.mjs";
import { isValidObjectId } from "mongoose";
import authMiddleware, {
  requiredAuthMiddleware,
} from "##/middlewares/authorization.mjs";
import paginationMiddleware from "##/middlewares/pagination.mjs";

import express from "express";
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
    Message.userInbox({
      userId: req.userId,
      pagination: req.pagination,
      briefUsers: !("onlyids" in req.query),
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
    Message.sentByUser({
      userId: req.userId,
      pagination: req.pagination,
      briefUsers: !("onlyids" in req.query),
    })
      .then((sentByUser) => res.status(200).json(sentByUser))
      .catch(next);
  }
);

router
  .route("/user/:targetUserId")
  // Fetch Answered Messages
  .get(paginationMiddleware, async (req, res, next) => {
    try {
      res.status(200).json(
        (
          await Promise.all([
            Message.answeredByUser({
              userId: req.params.targetUserId,
              pagination: req.pagination,
              briefUsers: !("onlyids" in req.query),
              viewer: req.userId,
              publicly: true,
              pinned: true,
            }),
            Message.answeredByUser({
              userId: req.params.targetUserId,
              pagination: req.pagination,
              briefUsers: !("onlyids" in req.query),
              viewer: req.userId,
              publicly: true,
              pinned: false,
            }),
          ])
        ).reduce((pinned, answered) => pinned.concat(answered))
      );
    } catch (err) {
      next(err);
    }
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

      events.emit(
        "MessageSent",
        message.content,
        message.receiver,
        message.sender,
        message.anonymous
      );

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
    Message.fetch({
      messageId: req.params.messageId,
      briefUsers: !("onlyids" in req.query),
      viewer: req.userId,
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
      const { messageId } = req.params;
      const message = await Message.findById(messageId, {
        receiver: 1,
        sender: 1,
        "reply.content": 1,
      });
      if (!message) return res.status(404).json({ code: "MESSAGE_NOT_FOUND" });
      if (message.receiver != req.userId)
        return res.status(403).json({ code: "NOT_THE_RECEIVER" });
      if (message.reply.content != null)
        return res.status(409).json({ code: "ALREADY_REPLIED" });

      let { privately, content } = req.body;
      if (privately && !message.sender)
        return res.status(406).json({ code: "DENIED_PRIVATE_REPLAY" });

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

      events.emit(
        "MessageReplied",
        messageId,
        content,
        message.receiver,
        message.sender
      );

      return res.status(201).json(reply);
    } catch (err) {
      next(err);
    }
  })
  // Message's reply actions
  .patch(async (req, res, next) => {
    let action = req.body.action?.toUpperCase();
    if (!action) return res.status(400).json({ code: "MISSING_ACTION" });
    let { messageId } = req.params;
    const message = await Message.findById(messageId, {
      receiver: 1,
      "reply.private": 1,
      "reply.content": 1,
      pinned: 1,
    });
    if (!message) return res.status(404).json({ code: "MESSAGE_NOT_FOUND" });
    if (message.receiver != req.userId)
      return res.status(403).json({ code: "NOT_THE_RECEIVER" });
    switch (action) {
      case "PRIVATE":
        var state = !!req.body.state;
        if (message.reply.private == state)
          return res
            .status(409)
            .json({ code: state ? "ALREADY_HIDDEN" : "NOT_HIDDEN" });
        try {
          await Message.updateOne(
            { _id: messageId },
            { $set: { "reply.private": state } }
          );
          res
            .status(200)
            .json({ code: "CHANGED_REPLY_PRIVACY", private: state });
        } catch (err) {
          throw new DatabaseError("UPDATE_MESSAGE_REPLY_PRIVACY", err);
        }
        break;
      case "CANCEL":
        if (!message.reply.content)
          return res.status(409).json({ code: "NOT_REPLIED" });
        try {
          await Message.updateOne(
            { _id: messageId },
            {
              $unset: { "reply.content": "", "reply.timestamp": "" },
              $set: {
                "reply.private": false,
              },
            }
          );
          res.status(200).json({ code: "CANCELED_REPLY" });
        } catch (err) {
          throw new DatabaseError("CANCEL_MESSAGE_REPLY", err);
        }
        break;
      case "PIN":
        var state = !!req.body.state;
        if (!!message.pinned == state)
          return res
            .status(409)
            .json({ code: state ? "ALREADY_PINNED" : "NOT_PINNED" });
        try {
          // TODO: apply a limit to pinned messages
          await Message.updateOne(
            { _id: messageId },
            { [state ? "$set" : "$unset"]: { pinned: state ? true : "" } }
          );
          res
            .status(200)
            .json({ code: "CHANGED_REPLY_PRIVACY", private: state });
        } catch (err) {
          throw new DatabaseError("UPDATE_MESSAGE_REPLY_PRIVACY", err);
        }
        break;
      default:
        res.status(400).json({ code: "INVALID_ACTION" });
    }
  })
  // Delete a received message
  .delete(async (req, res, next) => {
    let { messageId } = req.params;
    const message = await Message.findById(messageId, {
      receiver: 1,
      "reply.content": 1,
    });
    if (!message) return res.status(404).json({ code: "MESSAGE_NOT_FOUND" });
    if (message.receiver != req.userId)
      return res.status(403).json({ code: "NOT_THE_RECEIVER" });
    try {
      await Message.deleteOne({ _id: messageId });
      res.status(200).json({ code: "DELETED_MESSAGE" });
    } catch (err) {
      throw new DatabaseError("DELETE_MESSAGE", err);
    }
  });

router
  .route("/likes/message/:messageId")
  // Fetch user(s) that liked a message
  .get(paginationMiddleware, (req, res, next) => {
    Message.likes(
      Object.assign(
        {
          messageId: req.params.messageId,
          usersView: req.query.usersView?.toLowerCase(),
        },
        req.pagination
      )
    )
      .then((likes) => {
        if (likes != null) res.status(200).send(likes);
        else res.status(404).send({ code: "MESSAGE_NOT_FOUND" });
      })
      .catch(next);
  })
  // Like a message
  .put(requiredAuthMiddleware, (req, res, next) => {
    let { messageId } = req.params;
    Message.setLikeBy({
      messageId,
      userId: req.userId,
      status: true,
    })
      .then(({ found, updated }) => {
        if (found) {
          if (updated) events.emit("MessageLiked", messageId, req.userId);
          res.status(200).send({ like: true, updated });
        } else res.status(404).send({ code: "MESSAGE_NOT_FOUND" });
      })
      .catch(next);
  })
  // Remove a message like
  .delete(requiredAuthMiddleware, (req, res, next) => {
    Message.setLikeBy({
      messageId: req.params.messageId,
      userId: req.userId,
      status: false,
    })
      .then(({ found, updated }) => {
        if (found) res.status(200).send({ like: false, updated });
        else res.status(404).send({ code: "MESSAGE_NOT_FOUND" });
      })
      .catch(next);
  });

// If user liked a message
router.get("/likes/message/:messageId/liked", async (req, res, next) => {
  let targetUserId = req.query.userId;
  if (!isValidObjectId(targetUserId)) targetUserId = req.userId;

  try {
    let liked = targetUserId
      ? await Message.isLikedBy({
          messageId: req.params.messageId,
          userId: targetUserId,
        })
      : await Message.findById(req.params.messageId, { _id: 1 });
    if (liked != null) res.status(200).send({ liked });
    else res.status(404).send({ code: "MESSAGE_NOT_FOUND" });
  } catch (err) {
    next(err);
  }
});

router
  .route("/likes/user/:targetUserId")
  // Fetch messages that are liked by a user
  .get(paginationMiddleware, (req, res, next) => {
    Message.likedBy({
      userId: req.params.targetUserId,
      pagination: req.pagination,
      briefUsers: !("onlyids" in req.query),
      viewer: req.userId,
    })
      .then((likedByUser) => res.status(200).json(likedByUser))
      .catch(next);
  });

export default router;
