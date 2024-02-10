import User from "#database/models/user.js";
import Message from "#database/models/message.js";
import { isValidObjectId } from "mongoose";
import authMiddleware, { requiredAuthMiddleware } from "../middlewares/authorization.js";

import express from "express";
const router = express.Router();

let allowedIncludes = ['content', 'sender', 'receiver', 'reply.content', 'reply.timestamp', 'timestamp'];
function parseIncludeMiddleware(req, res, next) {
  let { include } = req.query;
  let includes = 'include' in req.query ? (Array.isArray(include) ? include : [include]) : [];
  req.projection = Object.fromEntries(includes
    .filter(include => allowedIncludes.includes(include))
    .map(include => [include, 1])
  )
  next();
}

function anonymizeMessages(requestingSender, messages) {
  return messages.map(messageStruct => {
    let { anonymous, sender, ...message } = messageStruct.toObject();
    if (requestingSender) message.sender = anonymous ? null : sender;
    return message
  });
}

// Fetch the not answered received message
router.get('/inbox', authMiddleware, requiredAuthMiddleware, parseIncludeMiddleware,
async (req, res, next) => { try {
  res.status(200).json(anonymizeMessages(!!req.projection.sender, await Message.find(
    { receiver: req.userId, 'reply.done': false }, Object.assign(req.projection, { anonymous: 1 })
  )));
} catch (err) { next(err); }});

// Fetch the sent messages
router.get('/sent', authMiddleware, requiredAuthMiddleware, parseIncludeMiddleware,
async (req, res, next) => { try {
  let messages = await Message.find({ sender: req.userId }, Object.assign(req.projection, { _id: 1 }));

  res.status(200).json(messages);
} catch (err) { next(err); }});

router.use('/user/:userId', (req, res, next) => {
  if (!isValidObjectId(req.params.userId)) return res.status(400).json({ message: "Invalid user id." });
  next();
})

router.route('/user/:userId')
// Fetch Answered Messages
.get(parseIncludeMiddleware,
async (req, res, next) => { try {
  res.status(200).json(anonymizeMessages(!!req.projection.sender, await Message.find(
    { receiver: req.params.userId, 'reply.done': true }, Object.assign(req.projection, { anonymous: 1 })
  )));
} catch (err) { next(err); }})
// Send Message
.post(authMiddleware,
async (req, res, next) => { try {
  const { content, anonymously } = req.body;

  const user = await User.findById(req.params.userId, { _id: 1 });
  if (!user) return res.status(404).json({ message: "User not found." });

  const message = new Message({
    content, anonymous: (req.userId && typeof anonymously == 'boolean') ? anonymously : true,
    sender: req.userId || null, receiver: user._id
  });

  await message.save();

  return res.status(201).json({
    _id: message._id, content: message.content,
    sender: message.sender, receiver: message.receiver,
    timestamp: message.timestamp
});
} catch (err) { next(err); }});

router.use('/message/:messageId', (req, res, next) => {
  if (!isValidObjectId(req.params.messageId)) return res.status(400).json({ message: "Invalid message id." });
  next();
});

router.route('/message/:messageId')
// Fetch a message
.get(authMiddleware, parseIncludeMiddleware,
async (req, res, next) => { try {
  let message = await Message.findById(req.params.messageId, Object.assign(
    req.projection, { anonymous: 1, sender: 1, receiver: 1, 'reply.done': 1 }
  ));
  if (!message || !((req.userId == message.sender || req.userId == message.receiver) || message.reply.done))
  return res.status(404).json({ message: "Message not found." });
  message = message.toObject();
  if (!req.projection.sender || message.anonymous) delete message.sender; delete message.anonymous;
  if (!req.projection.receiver) delete message.receiver;
  delete message.reply.done; if (Object.keys(message.reply).length == 0) delete message.reply;

  res.status(200).json(message);
} catch (err) { next(err); }})
// Reply to a message
.post(authMiddleware, requiredAuthMiddleware,
async (req, res, next) => { try {
  const message = await Message.findById(req.params.messageId, { receiver: 1, 'reply.done': 1 });
  if (!message) return res.status(404).json({ message: "Message not found." });
  if (message.receiver != req.userId) return res.status(403).json({ message: "You are not the receiver." });
  if (message.reply.done) return res.status(409).json({ message: "This message is already replied to." });
  
  const reply = { done: true, content: req.body.content, timestamp: new Date() };
  await Message.updateOne({ _id: message._id }, { $set: { reply } });

  delete reply.done;
  return res.status(201).json(reply);
} catch (err) { next(err); }});

export default router;