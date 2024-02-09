// routes/user.js
import User from "#database/models/user.js";

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import messageRoute from "./message.js";
const router = express.Router();

// TODO: handle POST for user creation (register)

// get user data
router.get("/:username", authMiddleware, async (req, res) => {
  const { username } = req.params;
  try {
    // Find the user by email or username
    let user = await User.findOne({ username: username });
    if (!user) return res.status(404).json({ error: "User not found" });

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
      // TODO: hide private info
      return res.json(user);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

// TODO: Change PUT to be PATCH
// Update user profile route
router.put("/update/:user_id", authMiddleware, async (req, res) => {
  try {
    const updatedProfile = req.body; // Assuming you send the updated profile details in the request body

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

router.use(messageRoute);

export default router;
