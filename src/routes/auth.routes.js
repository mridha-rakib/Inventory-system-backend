import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { protect, isLoggedOut } from "../middlewares/auth.middleware.js";
import upload from "../utils/upload.js";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/register", upload.single("image"), authController.register);
authRoutes.post("/login", isLoggedOut, authController.login);
authRoutes.post("/logout", protect, authController.logoutUser);
authRoutes.get("/me", protect, authController.getCurrentUser);
authRoutes.get("/users-count", protect, authController.getTotalUser);

export default authRoutes;
