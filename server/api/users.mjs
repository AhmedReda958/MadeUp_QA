import User from "#database/models/user/index.mjs";
import Follow from "#database/models/follow/index.mjs";
import { isValidObjectId } from "mongoose";
import authMiddleware, {
  requiredAuthMiddleware,
} from "#middlewares/authorization.mjs";
import paginationMiddleware from "#middlewares/pagination.mjs";
import {
  allowedUserUpdates,
  privateUserData,
} from "#database/models/user/filters.mjs";

import express from "express";
const router = express.Router();

router.get("/find", async (req, res, next) => {
  try {
    let { query } = req.query;

    let regexQuery = { $regex: query, $options: "i" };
    const users = await User.find({
      $or: [{ username: regexQuery }, { fullName: regexQuery }],
    }).limit(10);

    if (!users) return res.status(404).json({ code: "USER_NOT_FOUND" });

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

const fetchFromUsernameRoutes = [];
router.all(
  ["/username/:username", "/username/:username/*"],
  authMiddleware,
  async (req, res, next) => {
    try {
      let urlPaths = req.url
        .split("/")
        .filter((path) => path !== "")
        .slice(2);
      let project;
      if (!fetchFromUsernameRoutes.some((route) => route(req, urlPaths)))
        project = { _id: 1 };
      req.myUser = await User.findOne(
        { username: req.params.username.toLowerCase() },
        project
      );
      if (!req.myUser) return res.status(404).json({ code: "USER_NOT_FOUND" });
      urlPaths.unshift("", req.myUser._id);
      req.url = urlPaths.join("/");
      next("route");
    } catch (err) {
      next(err);
    }
  }
);

router.use(["/me", "/me/*"], authMiddleware, requiredAuthMiddleware);
router.all("/me", (req, res, next) => {
  req.url = "/" + req.userId;
  next("route");
});
router.all("/me/*", (req, res, next) => {
  req.url = "/" + req.userId + req.url.slice(3);
  next("route");
});

fetchFromUsernameRoutes.push(
  (req, urlPaths) => req.method == "GET" && urlPaths.length === 0
);

router.use(["/:userId", "/:userId/*"], authMiddleware);
router
  .route("/:userId")
  .get(async (req, res, next) => {
    try {
      let { userId } = req.params;
      let user =
        "myUser" in req
          ? req.myUser
          : isValidObjectId(userId)
          ? await User.findById(userId)
          : null;
      if (!user) return res.status(404).json({ code: "USER_NOT_FOUND" });

      let view = user.toJSON();
      if (req.userId != user._id)
        for (let key of privateUserData) delete view[key];

      try {
        view.follows = await Follow.follows({ userId, viewer: req.userId });
      } catch (err) {
        console.error(err); // TODO: log errors
      }

      if (req.userId === user._id.toString())
        // TODO: enhance is online logic
        await User.updateOne({ _id: user._id }, { lastSeen: new Date() });

      return res.status(200).json(view);
    } catch (err) {
      next(err);
    }
  })
  .patch(requiredAuthMiddleware, async (req, res, next) => {
    try {
      let { userId } = req.params;
      if (!isValidObjectId(userId))
        return res.status(404).json({ code: "INVALID_USER" });

      if (req.userId != userId)
        return res.status(403).json({ code: "FORBIDDEN" });

      let demandedUpdates = Object.keys(req.body);
      if (demandedUpdates.length === 0)
        return res.status(400).json({ code: "NO_UPDATES" });
      demandedUpdates = demandedUpdates.filter((key) =>
        allowedUserUpdates.includes(key)
      );
      if (demandedUpdates.length === 0)
        return res.status(400).json({ code: "NO_ALLOWED_UPDATES" });

      await User.updateOne(
        { _id: userId },
        demandedUpdates.reduce(
          (updates, key) => {
            let value = req.body[key];
            (value == null ? updates.$unset : updates.$set)[key] = value;
            return updates;
          },
          { $set: {}, $unset: {} }
        )
      );

      return res.status(200).json({ updated: demandedUpdates });
    } catch (err) {
      next(err);
    }
  });

router.use("/:userId/follow", requiredAuthMiddleware);
router
  .route("/:userId/follow")
  .get((req, res, next) => {
    Follow.followSince({
      follower: req.userId,
      following: req.params.userId,
    })
      .then((timestamp) => {
        if (!timestamp) return res.status(200).json({ followed: false });
        res.status(200).send({ followed: true, timestamp });
      })
      .catch(next);
  })
  .put((req, res, next) => {
    new Follow({
      follower: req.userId,
      following: req.params.userId,
      timestamp: new Date(),
    })
      .save()
      .then((follow) =>
        res.status(200).json({ followed: true, timestamp: follow.timestamp })
      )
      .catch((err) => {
        if (err.name === "MongoServerError" && err.code === 11000)
          return res.status(400).json({ code: "ALREADY_FOLLOWED" });
        next(err);
      });
  })
  .delete((req, res, next) => {
    Follow.deleteOne({
      follower: req.userId,
      following: req.params.userId,
    })
      .then((result) => {
        if (result.deletedCount === 0)
          return res.status(400).json({ code: "NOT_FOLLOWED" });
        res.status(200).json({ followed: false });
      })
      .catch(next);
  });

router.get("/:userId/followers", paginationMiddleware, (req, res, next) => {
  Follow.followers({
    userId: req.params.userId,
    pagination: req.pagination,
    briefUsers: !("onlyids" in req.query),
  })
    .then((followers) => res.status(200).send(followers))
    .catch(next);
});

router.get("/:userId/following", paginationMiddleware, (req, res, next) => {
  Follow.following({
    userId: req.params.userId,
    pagination: req.pagination,
    briefUsers: !("onlyids" in req.query),
  })
    .then((following) => res.status(200).send(following))
    .catch(next);
});

router.get("/:userId/follows", paginationMiddleware, (req, res, next) => {
  Follow.follows({ userId: req.params.userId, viewer: req.userId })
    .then((follows) => res.status(200).send(follows))
    .catch(next);
});

export default router;
