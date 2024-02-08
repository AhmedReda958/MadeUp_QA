import jwt from "jsonwebtoken";
const { JWT_SECRET_KEY } = process.env;

export default (req, res, next) => {
  req.authorized = false;
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return next();

    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = decodedToken.userId;
    req.authorized = true;

    next();
  } catch (error) {
    // TODO: log errors
    console.error(error);
    res.status(500).json({ message: "Something went wrong while authenticating." });
  }
}
