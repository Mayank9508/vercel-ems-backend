import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addLeaveController,
  getLeavesController,
  getMyLeavesController,
  getLeaveDetailController,
  updateLeaveStatusController,
  getEmployeeLeaveHistoryForAdmin,
} from "../controllers/leave.controller.js";

export const router = express.Router();

router.post("/add", authMiddleware, addLeaveController);
router.get("/my-leave-list", authMiddleware, getMyLeavesController);
router.get("/detail/:id", authMiddleware, getLeaveDetailController);
router.get("/", authMiddleware, getLeavesController);
router.put("/update-status/:id", authMiddleware, updateLeaveStatusController);
router.get("/admin/employee/:id", authMiddleware, getEmployeeLeaveHistoryForAdmin);
