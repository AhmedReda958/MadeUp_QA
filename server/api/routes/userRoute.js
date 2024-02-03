// routes/user.js

import connectToDB from "../../utils/database.js";
import User from "../../models/user.js";

import express from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
const router = express.Router();

// get user data
router.get("/:username", authMiddleware, async (req, res) => {
  const { username } = req.params;
  try {
    await connectToDB();
    // Find the user by email or username
    let user = await User.findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // ? not completed
    // todo: - hide user private data
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

// Update user profile route
router.put("/update/:user_id", authMiddleware, async (req, res) => {
  try {
    const updatedProfile = req.body; // Assuming you send the updated profile details in the request body
    await connectToDB();

    // Find the user by ID
    const user = await User.findById(req.params.user_id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // if user logedin && profile owner
    if (req.authorized && req.userId === user._id.valueOf()) {
      // Update user profile fields
      Object.assign(user, updatedProfile);

      // Save the updated user
      await user.save();
      return res.json({ message: "User profile updated successfully", user });
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
