const { JWT_SECRET_KEY } = process.env;
import User from "../../database/models/user.js";
import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  // TODO: use Basic access authentication credentials (Base 64 <username|email:password>)
  const { email, password, username } = req.body;
  console.log(email, password, username);

  try {
    // Find the user by email or username
    let user = await User.findOne({
      $or: [{ email }, { username }],
    });

    // If user not found, create a new one, TODO: distinct registration process instead
    if (!user) {
      // TODO: add additional validation for password strength, etc.
      try {
        user = new User({ username, email, password });

        await user.save();
      } catch (error) {
        return new Response(JSON.stringify(error.message), { status: 401 });
      }
    } else if (!(await user.comparePassword(password))) {
      // If password doesn't match, return authentication failure
      return res
        .status(401)
        .json({ message: "Invalid email/username or password" });
    }
    // User is authenticated, create a JWT token
    const token = jwt.sign(
      { userId: user._id }, JWT_SECRET_KEY, { expiresIn: "30d" }
    );

    // For simplicity, we're just sending a success message here
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        // Include other user data as needed
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
