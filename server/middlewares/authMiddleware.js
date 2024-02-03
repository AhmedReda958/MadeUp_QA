import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "your-secret-key"
    );
    req.userId = decodedToken.userId;
    console.log("middleware", req.userId);
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
