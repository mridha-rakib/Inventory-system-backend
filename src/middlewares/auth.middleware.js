import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decode: ", decoded);
      req.user = await User.findById(decoded.userId).select("-password");
      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      logger.error(error);
      res.status(401);
      next(error);
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const isLoggedOut = async (req, res, next) => {
  try {
    const accessToken = req.cookies.jwt;
    if (accessToken) {
      throw new Error("User already logged in.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

const admin = (req, res, next) => {
  console.log("Admin check - User:", req.user); // Debug
  console.log("Admin check - isAdmin:", req.user?.isAdmin); // Debug

  if (req.user && req.user.isAdmin === true) {
    next();
  } else {
    res.status(403); // 401 এর পরিবর্তে 403 ব্যবহার করুন
    throw new Error("Access denied. Admin privileges required.");
  }
};

export { protect, admin, isLoggedOut };
