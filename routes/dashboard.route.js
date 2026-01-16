import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";

export const router = express.Router();

router.get("/", authMiddleware, getDashboardStats);
