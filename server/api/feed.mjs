import message from "#database/models/message.mjs";
import authMiddleware, {
  requiredAuthMiddleware,
} from "#middlewares/authorization.mjs";
import paginationMiddleware from "#middlewares/pagination.mjs";
import express from "express";
const router = express.Router();

// get unseen notifications count
router.get(
  "/",
  authMiddleware,
  paginationMiddleware,
  async (req, res, next) => {
    message
      .userFeed(req.userId, req.pagination, {
        includes: req.query.include,
        users: req.query.user,
      })
      .then((posts) => res.status(200).json(posts))
      .catch(next);
  }
);

export default router;