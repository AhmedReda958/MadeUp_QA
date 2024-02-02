import { Router } from "express";
import userRoute from "./routes/userRoute.js";
const router = Router();

router.get("/", (_, res) => {
  res.status(201).json({ message: "Connected to Backend!" });
});

// routes
router.use("/user", userRoute);

export default router;
