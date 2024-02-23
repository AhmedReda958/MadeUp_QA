import User from "#database/models/user.mjs";
import { isValidObjectId } from "mongoose";
import authMiddleware, { requiredAuthMiddleware } from "#middlewares/authorization.mjs";

import express from "express";
const router = express.Router();

router.get("/", authMiddleware,
async (req, res, next) => { try {
  let { userId, username } = req.query;
  if (req.userId && !('userId' in req.query || 'username' in req.query)) userId = req.userId;
  let user = isValidObjectId(userId) ? await User.findById(userId) : await User.findOne({ username: username });
  if (!user) return res.status(404).json({ code: "USER_NOT_FOUND" });

  // if (req.userId != user._id) // TODO: hide private info
  return res.status(200).json(user);
} catch (err) { next(err); }});

router.patch("/", authMiddleware, requiredAuthMiddleware,
async (req, res, next) => { try {
  const updatedProfile = req.body; // TODO: validate

  const user = await User.findById(req.userId);
  if (!user) return res.status(409).json({ code: "CONFLICT" }); // TODO: handle, the user is logged in but not saved in the database

  if (req.userId != user._id) return res.status(403).json({ code: "FORBIDDEN" });
  Object.assign(user, updatedProfile);

  await user.save();
  return res.status(200).json(user);
} catch (err) { next(err); }});

export default router;