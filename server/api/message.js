import User from "#database/models/user.js";
import Message from "#database/models/message.js";
import authMiddleware from "../middlewares/authorization.js";

import express from "express";
const router = express.Router();

router.post("/:username/message", authMiddleware, async (req, res) => {
  try {
    const { content, anonymously } = req.body;

    const receiver = await User.findOne({ username: req.params.username }, { _id: 1 });
    if (!receiver) return res.status(404).json({ message: "Receiver not found." });

    const newMessage = new Message({
      content,
      sender: (req.authorized && !anonymously) ? req.userId : null,
      receiver: receiver._id
    });

    await newMessage.save();

    return res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    // TODO: log errors
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
