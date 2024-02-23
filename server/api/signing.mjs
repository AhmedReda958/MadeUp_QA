const { JWT_SECRET_KEY } = process.env;
const SIGNING_EXPIRY = '30d'; // TODO: configure
import DatabaseError from "#errors/database.mjs";
import User from "#database/models/user.mjs";
import jwt from "jsonwebtoken";
import express from "express";
const router = express.Router();

router.post("/login", async (req, res, next) => { try {
  let authMethod = 'Basic', authorization = req.headers.authorization;
  if (!authorization.startsWith(authMethod)) return res.status(401).json({ code: "UNAUTHORIZED" });
  authorization = authorization.slice((authMethod).length + 1);
  const [ identifier, password ] = Buffer.from(authorization, 'base64').toString().split(':');

  let user = await User.findOne({
    $or: [
      "email", "username",
      // TODO: add later on
      // "phoneNumber"
    ]
    .map(identifying => { return { [identifying]: identifier }; })
  }, { email: 1, username: 1, password: 1 });

  if (!(user && await user.comparePassword(password)))
  return res.status(401).json({ code: "INVALID", found: !!user });
  
  const token = jwt.sign(
    { userId: user._id }, JWT_SECRET_KEY, { expiresIn: SIGNING_EXPIRY }
  );

  return res.status(200).json({ user, token });
} catch (err) { next(err); }});

router.post("/register", async (req, res, next) => { try {
  const { email, username, password } = req.body;
  let user = new User({ username, email, password });
  try { await user.save(); } catch (err) {
    if (err.code == 11000)
      return res.status(409).json({ code: "USER_EXISTS", user: err.keyValue });
    throw new DatabaseError("SAVE_NEW_USER", err);
  }

  const token = jwt.sign(
    { userId: user._id }, JWT_SECRET_KEY, { expiresIn: SIGNING_EXPIRY }
  );

  return res.status(201).json({ 
    user: {
      _id: user._id,
      username: user.username,
      email: user.email
    },
    token
  });
} catch (err) { next(err); }});

export default router;
