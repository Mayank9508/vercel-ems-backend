import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addEmployeeController,
  editEmployeeController,
  fetchEmployeesByDepId,
  getAllEmployeesController,
  getSingleEmployeeController,
} from "../controllers/employees.controller.js";
import { upload } from "../services/multer.js";

export const router = express.Router();

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// router.get("/", authMiddleware, getDepartments)
// router.get("/getDepartmentNames", authMiddleware, getDepartmentsName)
router.post(
  "/add",
  authMiddleware,
  upload.single("image"),
  addEmployeeController
);
router.get("/:id", authMiddleware, getSingleEmployeeController);
router.put("/edit/:id", authMiddleware, editEmployeeController)
// router.delete("/:id", authMiddleware, deleteDepartment)
router.get("/", authMiddleware, getAllEmployeesController);
router.get("/department/:id", authMiddleware, fetchEmployeesByDepId)