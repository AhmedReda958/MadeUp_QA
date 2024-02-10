import User from "#database/models/user.js";
import Message from "#database/models/message.js";
import { isValidObjectId } from "mongoose";
import authMiddleware, { requiredAuthMiddleware } from "../middlewares/authorization.js";

import express from "express";
const router = express.Router();

let allowedIncludes = ['content', 'sender', 'receiver', 'reply.content', 'reply.timestamp', 'timestamp'];
function createParseIncludeMiddleware(stickyProjection = { _id: 1 }) {
  return (req, res, next) => {
    let { include } = req.query;
    let includes = 'include' in req.query ? (Array.isArray(include) ? include : [include]) : [];
    req.preProjection = Object.fromEntries(includes
      .filter(include => allowedIncludes.includes(include))
      .map(include => [include, 1])
    )
    req.projection = Object.assign(req.preProjection, stickyProjection);
    next();
  }
}

function applyMessagesAnonymity(messages) {
  messages.forEach(message => {
    if (message.anonymous) message.sender = null; 
    delete message.anonymous;
  });
}

router.get('/view/message/:messageId', authMiddleware,
createParseIncludeMiddleware({ anonymous: 1, sender: 1, receiver: 1, 'reply.done': 1 }),
async (req, res, next) => { try {
  let { messageId } = req.params;
  if (!isValidObjectId(messageId)) return res.status(400).json({ message: "Invalid message id." });

  let message = await Message.findById(messageId, req.projection);
  if (!message || !((req.userId == message.sender || req.userId == message.receiver) || message.reply.done))
  return res.status(404).json({ message: "Message not found." });
  if (!req.preProjection.sender || message.anonymous) delete message.sender; delete message.anonymous;
  if (!req.preProjection.receiver) delete message.receiver;
  delete message.reply.done; if (Object.keys(message.reply).length == 0) delete message.reply;

  res.status(200).json(message);
} catch (err) { next(err); }});

router.get('/view/user/:receiver', createParseIncludeMiddleware({ anonymous: 1 }),
async (req, res, next) => { try {
  let { receiver } = req.params;
  if (!isValidObjectId(receiver)) return res.status(400).json({ message: "Invalid receiver." });

  let messages = await Message.find({ receiver, 'reply.done': true }, req.projection);
  if (req.preProjection.sender) applyMessagesAnonymity(messages);
  else messages.forEach(message => delete message.anonymous);

  res.status(200).json(messages);
} catch (err) { next(err); }});

router.get('/view/inbox', authMiddleware, requiredAuthMiddleware,
createParseIncludeMiddleware({ anonymous: 1 }),
async (req, res, next) => { try {
  let messages = await Message.find(
    { receiver: req.userId, 'reply.done': false },
    req.projection
  );
  if (req.preProjection.sender) applyMessagesAnonymity(messages);
  else messages.forEach(message => delete message.anonymous);

  res.status(200).json(messages);
} catch (err) { next(err); }});

router.get('/view/sent', authMiddleware, requiredAuthMiddleware,
createParseIncludeMiddleware(),
async (req, res, next) => { try {
  let messages = await Message.find({ sender: req.userId }, req.projection);

  res.status(200).json(messages);
} catch (err) { next(err); }});

router.post("/send/:username", authMiddleware,
async (req, res, next) => { try {
  const { content, anonymously } = req.body;

  const receiver = await User.findOne({ username: req.params.username }, { _id: 1 });
  if (!receiver) return res.status(404).json({ message: "Receiver not found." });

  const message = new Message({
    content, anonymous: typeof anonymously == 'boolean' ? anonymously : true,
    sender: req.userId || null, receiver: receiver._id
  });

  await message.save();

  return res.status(201).json(message);
} catch (err) { next(err); }});

router.post("/reply/:messageId", authMiddleware, requiredAuthMiddleware,
async (req, res, next) => { try {
  let { messageId } = req.params;
  if (!isValidObjectId(messageId)) return res.status(404).json({ message: "Invalid message." });
  
  const message = await Message.findById(messageId, { _id: 0, receiver: 1, 'reply.done': 1 });
  if (!message) return res.status(404).json({ message: "Message not found." });
  if (message.receiver != req.userId) return res.status(403).json({ message: "You are not the receiver." });
  if (message.reply.done) return res.status(409).json({ message: "This message is already replied to." });
  
  const reply = { done: true, content: req.body.content, timestamp: new Date() };
  await Message.updateOne({ _id: messageId }, { $set: { reply } });

  return res.status(201).json({ reply });
} catch (err) { next(err); }});

export default router;
