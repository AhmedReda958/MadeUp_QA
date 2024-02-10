import User from "#database/models/user.js";
import authMiddleware, { requiredAuthMiddleware } from "../middlewares/authorization.js";

import express from "express";
const router = express.Router();

router.get("/:username", authMiddleware,
async (req, res, next) => { try {
  const { username } = req.params;
  let user = await User.findOne({ username: username });
  if (!user) return res.status(404).json({ error: "User not found" });

  // if (req.userId == user._id) // TODO: hide private info
  return res.status(200).json(user);
} catch (err) { next(err); }});

router.patch("/", authMiddleware, requiredAuthMiddleware,
async (req, res, next) => { try {
  const updatedProfile = req.body; // TODO: validate

  const user = await User.findById(req.userId);
  if (!user) return res.status(409).json({ error: "Conflict." }); // TODO: handle, the user is logged in but not saved in the database

  if (req.userId != user._id) return res.status(403).json({ error: "Forbidden." });
  Object.assign(user, updatedProfile);

  await user.save();
  return res.status(200).json(user);
} catch (err) { next(err); }});

export default router;