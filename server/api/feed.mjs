import message from "#database/models/message.mjs";
import authMiddleware, {
  requiredAuthMiddleware,
} from "#middlewares/authorization.mjs";
import express from "express";
const router = express.Router();

// get unseen notifications count
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const posts = await message.aggregate([
      {
        $match: {
          "reply.private": false,
          $and: [
            { "reply.content": { $exists: true } },
            { $expr: { $ne: [{ $type: "$reply.content" }, "object"] } },
          ],
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

export default router;
