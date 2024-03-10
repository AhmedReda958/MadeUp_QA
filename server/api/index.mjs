import { Router } from "express";
import signingRoute from "./signing.mjs";
import usersRoute from "./users.mjs";
import messagesRoute from "./messages.mjs";
import notificationsRoute from "./notifications.mjs";
import { isDBConnected } from "#database/connection.mjs";
const router = Router();

router.get("/", async (_, res) => {
  if (isDBConnected()) {
    res.status(200).json({ code: "AVAILABLE" });
  } else {
    res.status(500).json({ code: "INTERNAL_SERVER_ERROR" });
  }
});

router.use(signingRoute);
router.use("/users", usersRoute);
router.use("/messages", messagesRoute);
router.use("/notifications", notificationsRoute);

export default router;
