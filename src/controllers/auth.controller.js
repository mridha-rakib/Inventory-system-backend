import AuthService from "../services/auth.service.js";
import { createdResponse, successResponse } from "../utils/response.js";
import logger from "../utils/logger.js";
import { config } from "../config/app.config.js";
import { clearAuthCookie, setAuthCookie } from "../utils/cookie.js";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import CloudinaryService from "../services/cloudinary.service.js";
import fs from "fs/promises";

class AuthController {
  constructor() {
    this.authService = new AuthService();
    this.cloudinaryService = new CloudinaryService();
  }

  register = async (req, res, next) => {
    let filePath;
    let uploadResult;

    if (req.file) {
      filePath = req.file.path;
    }
    try {
      if (req.file && filePath) {
        await fs.access(req.file.path);

        uploadResult = await this.cloudinaryService.uploadImage(filePath);
      }

      const userData = {
        ...req.body,
        ...(uploadResult && { image: uploadResult.url }),
      };

      const user = await this.authService.register(userData);

      if (user) {
        generateToken(res, user._id);
      } else {
        const error = new Error("Invalid user data");
        error.statusCode = 400;
        throw error;
      }
      await this.cleanupFile(filePath);
      createdResponse(res, "User registered successfully", user);
    } catch (error) {
      logger.error(`Register controller error: ${error.message}`);
      await this.cleanupFile(filePath);
      if (uploadResult?.public_id) {
        await this.cloudinaryService
          .deleteImage(uploadResult.public_id)
          .catch(console.error);
      }
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const error = new Error("Email and password are required");
        error.statusCode = 400;
        throw error;
      }

      const user = await this.authService.login({ email, password });
      generateToken(res, user._id);
      successResponse(res, "Login successful", { user });
    } catch (error) {
      logger.error(`Login controller error: ${error.message}`);
      next(error);
    }
  };

  getTotalUser = async (req, res, next) => {
    try {
      const totalUsers = await User.countDocuments();
      res.status(200).json({
        success: true,
        totalUsers: totalUsers,
        message: `Database contains ${totalUsers} users`,
      });
    } catch (error) {
      next(error);
    }
  };

  getCurrentUser = async (req, res, next) => {
    try {
      console.log("Current user:", req.user);
      successResponse(res, "Current user retrieved", req.user);
    } catch (error) {
      logger.error(`Get current user error: ${error.message}`);
      next(error);
    }
  };

  logoutUser = async (req, res, next) => {
    try {
      clearAuthCookie(res);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };

  async cleanupFile(filePath) {
    if (!filePath) return;

    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("File cleanup error:", error.message);
      }
    }
  }
}

export default AuthController;
