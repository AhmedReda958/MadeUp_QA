import User from "#database/models/user.js";
import Message from "#database/models/message.js";
import { isValidObjectId } from "mongoose";
import authMiddleware, { requiredAuthMiddleware } from "../middlewares/authorization.js";

import express from "express";
const router = express.Router();

router.post("/send/:username", authMiddleware,
async (req, res, next) => { try {
  const { content, anonymously } = req.body;

  const receiver = await User.findOne({ username: req.params.username }, { _id: 1 });
  if (!receiver) return res.status(404).json({ message: "Receiver not found." });

  const message = new Message({
    content,
    sender: (req.authorized && !anonymously) ? req.userId : null,
    receiver: receiver._id
  });

  await message.save();

  return res.status(201).json({ message });
} catch (err) { next(err); }});

router.post("/reply/:messageId", authMiddleware, requiredAuthMiddleware,
async (req, res, next) => { try {
  let { messageId } = req.params;
  if (!isValidObjectId(messageId)) return res.status(404).json({ message: "Invalid message." });
  
  const message = await Message.findOne({ _id: messageId }, { _id: 0, receiver: 1, 'reply.done': 1 });
  if (!message) return res.status(404).json({ message: "Message not found." });
  if (message.receiver != req.userId) return res.status(403).json({ message: "You are not the receiver." });
  if (message.reply.done) return res.status(409).json({ message: "This message is already replied to." });
  
  const reply = { done: true, content: req.body.content, timestamp: new Date() };
  await Message.updateOne({ _id: messageId }, { $set: { reply } });

  return res.status(201).json({ reply });
} catch (err) { next(err); }});

export default router;
