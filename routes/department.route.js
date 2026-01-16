import  express from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { addDepartmentController, deleteDepartment, editDepartment, getDepartment, getDepartments, getDepartmentsName,  } from "../controllers/department.controller.js";

export const router = express.Router();

router.get("/", authMiddleware, getDepartments)
router.get("/getDepartmentNames", authMiddleware, getDepartmentsName)
router.post("/add", authMiddleware, addDepartmentController)
router.get("/:id", authMiddleware, getDepartment)
router.put("/:id", authMiddleware, editDepartment)
router.delete("/:id", authMiddleware, deleteDepartment)