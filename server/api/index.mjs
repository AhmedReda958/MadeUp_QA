import { Router } from "express";
// import { corsOptions } from "../app.mjs";
// import CORS from "cors";
import signingRoute from "./signing.mjs";
import appRoute from "./app.mjs";
import usersRoute from "./users.mjs";
import messagesRoute from "./messages.mjs";
import notificationsRoute from "./notifications.mjs";
import feedRoute from "./feed.mjs";
import { isDBConnected } from "#database/connection.mjs";

const router = Router();
// let cors = CORS(corsOptions);
// router.options(cors);
// router.use(cors);

router.get("/", async (_, res) => {
  if (isDBConnected()) {
    res.status(200).json({ code: "AVAILABLE" });
  } else {
    res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
  }
});

router.use(signingRoute);
router.use("/app", appRoute);
router.use("/users", usersRoute);
router.use("/messages", messagesRoute);
router.use("/notifications", notificationsRoute);
router.use("/feed", feedRoute);

export default router;
