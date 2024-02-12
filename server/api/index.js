import { Router } from "express";
import signingRoute from "./signing.js";
import usersRoute from "./users.js";
import messagesRoute from "./messages.js";
import { isDBConnected } from "#database/connection.js";
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

export default router;
