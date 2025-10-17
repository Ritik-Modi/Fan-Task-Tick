import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.headers["x-access-token"] ||
      req.headers["authorization"];
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    // DEBUG:
    console.log("Extracted Token:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (req.user.accountType !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const isUser = (req, res, next) => {
  try {
    if (req.user.accountType !== "user") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    next();
  } catch (error) {
    console.error("Error in isUser middleware:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { authMiddleware, isAdmin , isUser };
