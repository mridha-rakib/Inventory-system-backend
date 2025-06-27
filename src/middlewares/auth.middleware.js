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
      console.log("Decoded JWT:", decoded);
      req.user = await User.findById(decoded.sub);
      console.log("Authenticated user:", req.user);
      next();
    } catch (error) {
      logger.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, token failed");
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
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized, as admin");
  }
};

export { protect, admin, isLoggedOut };
