import User from "../../database/models/user.js";
import Message from "../../database/models/message.js";

import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { content, sender } = req.body;

    // Find receiver user by username
    const receiver = await User.findOne({ username: req.params.username });

    //check if recever exists
    if (!receiver) {
      return res.status(404).send("Receiver not found!");
    }

    // Check if sender information is provided
    let senderId;
    if (sender) {
      // If the user is logged in, use their ID as the sender
      senderId = req.user._id;
    }

    // Create a new message
    const newMessage = new Message({
      content,
      sender: senderId || null,
      receiver: receiver._id,
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
