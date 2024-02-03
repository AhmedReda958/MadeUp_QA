import { Router } from "express";
import loginRoute from "./routes/loginRoute.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import connectToDB from "../utils/database.js";
const router = Router();

router.get("/", async (_, res) => {
  try {
    await connectToDB();
    res.status(201).json({ message: "Connected to Backend!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// routes
router.use("/login", loginRoute);
router.use("/user", userRoute);
router.use("/user", messageRoute);

export default router;
