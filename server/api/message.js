import User from "../database/models/user.js";
import Message from "../database/models/message.js";

import express from "express";
const router = express.Router();

router.post("/:username/message", async (req, res) => {
  try {
    const { content, sender } = req.body;

    // Find receiver user by username
    const receiver = await User.findOne({ username: req.params.username });
    if (!receiver) return res.status(404).send("Receiver not found!");

    // Create a new message
    const newMessage = new Message({
      content,
      // If the user is logged in, use their ID as the sender
      // is that because there could be messages from unknown senders ?
      sender: sender ? req.user._id : null,
      receiver: receiver._id
    });

    // Save the new message
    await newMessage.save();

    return res.status(201).send("Message sent successfully!");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;
