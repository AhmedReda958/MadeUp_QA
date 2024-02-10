const { JWT_SECRET_KEY } = process.env;
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  req.authorized = false;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return next();

  const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
  // TODO: check if changed password after token iat and cancel auth
  req.userId = decodedToken.userId;
  req.authorized = true;

  next();
}

export function requiredAuthMiddleware(req, res, next) {
  if (!req.authorized) return res.status(401).json({ message: "Unauthorized." });
  next();
}
