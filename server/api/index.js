import { Router } from "express";
import loginRoute from "./login.js";
import userRoute from "./user.js";
import { isDBConnected } from "../database/connection.js";
const router = Router();

router.get("/", async (_, res) => {
  if (isDBConnected()) {
    res.status(200).json({ message: "Available!" });
  } else {
    res.status(500).json({ message: "Something is wrong." });
  }
});

// routes
router.use("/login", loginRoute);
router.use("/user", userRoute);

export default router;
