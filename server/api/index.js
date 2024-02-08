import { Router } from "express";
import loginRoute from "./routes/login.js";
import userRoute from "./routes/user.js";
import messageRoute from "./routes/message.js";
import { isDBConnected } from "../database/connection.js";
const router = Router();

router.get("/", async (_, res) => {
  if (isDBConnected()) {
    res.status(200).json({ message: "Connected to Backend!" });
  } else {
    res.status(500).json({ message: "Something is wrong." });
  }
});

// routes
router.use("/login", loginRoute);
router.use("/user", userRoute);
router.use("/message", messageRoute);

export default router;
