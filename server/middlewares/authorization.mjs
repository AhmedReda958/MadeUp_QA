import { CommonError } from "#errors/index.mjs";
const { JWT_SECRET_KEY } = process.env;
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return next();

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    if (err?.message == "jwt malformed") req.unauthorizedReason = 'INVALID_TOKEN';
    else console.error(new CommonError(err, "Unable to verify the jwt."));
    // TODO: log errors
  }

  // TODO: check if changed password after token iat and cancel auth
  req.userId = decodedToken?.userId;

  next();
}

export function requiredAuthMiddleware(req, res, next) {
  if (!req.userId) {
    let response = { code: "UNAUTHORIZED" }
    if ('unauthorizedReason' in req) response.reason = req.unauthorizedReason;
    return res.status(401).json(response);
  }
  next();
}
