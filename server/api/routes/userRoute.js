// routes/user.js
import express from "express";
const router = express.Router();

router.get("/:id", (req, res) => {
  const userId = req.params.id;
  res.send(`User ID: ${userId}`);
});

export default router;
