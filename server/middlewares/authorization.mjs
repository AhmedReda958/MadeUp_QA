import { CommonError } from "#errors/index.mjs";
const { JWT_SECRET_KEY } = process.env;
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  console.log(token)
  if (!token) return next();
  console.log(token)

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    // TODO: log errors + handle
    console.error(new CommonError(err, "Unable to verify the jwt."));
  }

  // TODO: check if changed password after token iat and cancel auth
  req.userId = decodedToken?.userId;

  next();
}

export function requiredAuthMiddleware(req, res, next) {
  if (!req.userId) return res.status(401).json({ code: "UNAUTHORIZED" });
  next();
}
