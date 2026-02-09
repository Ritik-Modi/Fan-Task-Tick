import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.model.js";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    let token =
      req.cookies.token ||
      req.headers["x-access-token"] ||
      req.headers["authorization"];

    if (typeof token === "string" && token.startsWith("Bearer ")) {
      token = token.slice("Bearer ".length);
    }
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

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

const ensureActiveUser = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findById(userId).select("status");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ success: false, message: "Account suspended" });
    }
    next();
  } catch (error) {
    console.error("Error in ensureActiveUser middleware:", error);
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

export { authMiddleware, ensureActiveUser, isAdmin , isUser };
