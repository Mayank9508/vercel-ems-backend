import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addSalaryController,
  getMySalaryController,
  getSalaryController,
} from "../controllers/salary.controller.js";

export const router = express.Router();

router.post("/add", authMiddleware, addSalaryController);
router.get("/my-salary", authMiddleware, getMySalaryController);
router.get("/:id", authMiddleware, getSalaryController);

