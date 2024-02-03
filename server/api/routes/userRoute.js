// routes/user.js

import connectToDB from "../../utils/database.js";
import User from "../../models/user.js";

import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/:username", authMiddleware, async (req, res) => {
  const { username } = req.params;
  try {
    await connectToDB();
    // Find the user by email or username
    let user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).send("User not Found!");
    }
    // ? not completed
    // todo: - hide
    // if user logedin
    if (req.authorized) {
      // his own profile
      if (req.userId === user._id.valueOf()) {
        return res.json(user);
      }

      return res.json(user);
    } else {
      return res.json(user);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

export default router;
