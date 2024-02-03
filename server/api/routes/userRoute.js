// routes/user.js

import connectToDB from "../../utils/database.js";
import User from "../../models/user.js";

import express from "express";
const router = express.Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    await connectToDB();
    // Find the user by email or username
    let user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).send("User not Found!");
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return new res.status(500).send("Internal Server Error");
  }
});

export default router;
