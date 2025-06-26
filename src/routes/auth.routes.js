import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.post("/logout", protect, authController.logoutUser);
authRoutes.get("/me", protect, authController.getCurrentUser);
authRoutes.get("/users-count", protect, authController.getTotalUser);

export default authRoutes;
