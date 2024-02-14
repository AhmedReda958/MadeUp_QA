import User from "#database/models/user.js";
import Message from "#database/models/message.js";
import { isValidObjectId } from "mongoose";
import authMiddleware, {
  requiredAuthMiddleware,
} from "../middlewares/authorization.js";

import express from "express";
const router = express.Router();

// TODO: pagination

let allowedIncludes = [
  "content",
  "sender",
  "receiver",
  "reply.content",
  "reply.timestamp",
  "timestamp",
], reachableUserIncludes = [
  "sender",
  "receiver"
]

function arrayIfElement(input) {
  return Array.isArray(input) ? input : [input];
}

function parseQueryMessageTenor(req, res, next) {
  let { include, detailUser } = req.query;
  let includes = "include" in req.query ? arrayIfElement(include) : [],
  detailUsers = "detailUser" in req.query ? arrayIfElement(detailUser) : [];

  req.projection = Object.fromEntries(
    [ '_id',
      ...includes
        .filter((include) => allowedIncludes.includes(include))
    ].map((include) => [include, 1])
  );

  req.detailUsers = detailUsers.filter((include) => reachableUserIncludes.includes(include));
  for (let detailUser of req.detailUsers)
    if (!req.projection[detailUser]) req.projection[detailUser] = 1;

  next();
}

async function detailMessageUsers(detailUsers, message) {
  if (message.anonymous) {
    detailUsers = detailUsers.slice();
    detailUsers.splice(detailUsers.indexOf("sender"), 1);
  }

  let users = await User.find({ _id: { $in: detailUsers.map(detailUser => message[detailUser]) } }, {
    _id: 1, username: 1, fullName: 1
    // TODO: add those later on
    // "hasStory", "verified", "online"
  });

  for (let detailUser of detailUsers) {
    message[detailUser] = users.find(user =>
      user._id.toString() == message[detailUser]
    ) || message[detailUser];
  }
}

// Fetch the not answered received message
router.get(
  "/inbox",
  authMiddleware,
  requiredAuthMiddleware,
  parseQueryMessageTenor,
  async (req, res, next) => {
    try {
      let messages = await Message.find(
        { receiver: req.userId, "reply.done": false },
        Object.assign({}, req.projection, { anonymous: 1 })
      );

      if (req.detailUsers.length > 0)
        for (let message of messages)
          await detailMessageUsers(req.detailUsers, message);

      let response = messages.map((message) => {
        let singleResponse = {};
        for (let field in req.projection)
          singleResponse[field] = message[field];
        if (singleResponse.sender && message.anonymous)
          singleResponse.sender = null;
        return singleResponse;
      });

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
);

// Fetch the sent messages
router.get(
  "/sent",
  authMiddleware,
  requiredAuthMiddleware,
  parseQueryMessageTenor,
  async (req, res, next) => {
    try {
      let messages = await Message.find({ sender: req.userId }, req.projection);
      
      if (req.detailUsers.length > 0)
        for (let message of messages)
          await detailMessageUsers(req.detailUsers, message);

      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  }
);

router.use("/user/:userId", (req, res, next) => {
  if (!isValidObjectId(req.params.userId))
    return res.status(400).json({ code: "INVALID_USER_ID" });
  next();
});

router
  .route("/user/:userId")
  // Fetch Answered Messages
  .get(parseQueryMessageTenor, async (req, res, next) => {
    try {
      let messages = await Message.find(
        { receiver: req.params.userId, "reply.done": true },
        Object.assign({}, req.projection, { anonymous: 1 })
      );

      if (req.detailUsers.length > 0)
      for (let message of messages)
        await detailMessageUsers(req.detailUsers, message);

      let response = messages.map((message) => {
        let singleResponse = {};
        for (let field in req.projection)
          singleResponse[field] = message[field];
        if (singleResponse.sender && message.anonymous)
          singleResponse.sender = null;
        return singleResponse;
      });
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  })
  // Send Message
  .post(authMiddleware, async (req, res, next) => {
    try {
      const { content, anonymously } = req.body; // TODO: validate

      const user = await User.findById(req.params.userId, { _id: 1 });
      if (!user) return res.status(404).json({ code: "USER_NOT_FOUND" });

      const message = new Message({
        content,
        anonymous:
          req.userId && typeof anonymously == "boolean" ? anonymously : true,
        sender: req.userId || null,
        receiver: user._id,
      });

      await message.save();

      return res.status(201).json({
        _id: message._id,
        content: message.content,
        sender: message.sender,
        receiver: message.receiver,
        timestamp: message.timestamp,
      });
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
  .get(authMiddleware, parseQueryMessageTenor, async (req, res, next) => {
    try {
      let message = await Message.findById(
        req.params.messageId,
        Object.assign({}, req.projection, {
          anonymous: 1,
          sender: 1,
          receiver: 1,
          "reply.done": 1,
        })
      );
      if (
        !message ||
        !(
          req.userId == message.sender ||
          req.userId == message.receiver ||
          message.reply.done
        )
      ) return res.status(404).json({ code: "MESSAGE_NOT_FOUND" });

      if (req.detailUsers.length > 0)
        await detailMessageUsers(req.detailUsers, message);

      message = message.toObject();
      if (!req.projection.sender || message.anonymous) delete message.sender;
      delete message.anonymous;
      if (!req.projection.receiver) delete message.receiver;
      delete message.reply.done;
      if (Object.keys(message.reply).length == 0) delete message.reply;

      res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  })
  // Reply to a message
  .post(authMiddleware, requiredAuthMiddleware, async (req, res, next) => {
    try {
      const message = await Message.findById(req.params.messageId, {
        receiver: 1,
        "reply.done": 1,
      });
      if (!message) return res.status(404).json({ code: "MESSAGE_NOT_FOUND" });
      if (message.receiver != req.userId)
        return res.status(403).json({ code: "NOT_THE_RECEIVER" });
      if (message.reply.done)
        return res.status(409).json({ code: "ALREADY_REPLIED" });

      const reply = {
        done: true,
        content: req.body.content,
        timestamp: new Date(),
      };
      await Message.updateOne({ _id: message._id }, { $set: { reply } });

      delete reply.done;
      return res.status(201).json(reply);
    } catch (err) {
      next(err);
    }
  });

export default router;
