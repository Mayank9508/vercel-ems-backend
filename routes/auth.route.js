import express from "express";
import {
  fetchLoginUserController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", authMiddleware, logoutController);
router.get("/current-user", authMiddleware, fetchLoginUserController);
router.put("/forgot-password", forgotPasswordController);
