import { Router } from "express";
import userRoute from "./routes/userRoute.js";
import loginRoute from "./routes/loginRoute.js";
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
router.use("/user", userRoute);
router.use("/login", loginRoute);

export default router;
