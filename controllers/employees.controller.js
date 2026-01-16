import { EmployeeModel } from "../models/employee.model.js";
import { UserModel } from "../models/user.model.js";
import { uploadFileToIMAGEKIT } from "../services/storage.service.js";
import bcrypt from "bcrypt";

export const addEmployeeController = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const {
      name,
      email,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
      password,
      role,
    } = req.body;
    if (
      !name ||
      !email ||
      !employeeId ||
      !dob ||
      !gender ||
      !maritalStatus ||
      !designation ||
      !department ||
      !salary ||
      !password ||
      !role
    ) {
      return res.status(403).json({
        message: "All fields are rquired",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
        error: "Image not received",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already registered in employee",
        message: "User already registered",
      });
    }

    const uploadedImage = await uploadFileToIMAGEKIT(
      req.file.buffer,
      req.file.originalname
    );

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      role,
      password: hashPass,
      profileImage: uploadedImage.url,
    });

    const newEmployee = await EmployeeModel.create({
      userId: newUser._id,
      employeeId,
      dob,
      gender,
      maritalStatus,
      designation,
      department,
      salary,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created",
      employee: newEmployee,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Employee add failed",
      success: false,
      message: "Employee add failed",
    });
  }
};

export const getAllEmployeesController = async (req, res) => {
  try {
    const employees = await EmployeeModel.find()
      .populate("userId", "-password -createdAt -updatedAt")
      .populate("department");

    return res.status(200).json({
      success: true,
      employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};

export const getSingleEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
        error: "Id missing",
      });
    }

    let employee = await EmployeeModel.findById(id)
      .populate("userId", "-password -createdAt -updatedAt")
      .populate("department");

    if (!employee) {
      employee = await EmployeeModel.findOne({ userId: id })
        .populate("userId", "-password -createdAt -updatedAt")
        .populate("department");
    }

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(201).json({
      success: true,
      employee,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees",
    });
  }
};

export const editEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employee id is required",
      });
    }

    const { name, maritalStatus, designation, salary, department } = req.body;

    if (!name || !maritalStatus || !designation || !salary || !department) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // employee find
    const employee = await EmployeeModel.findById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // update user (name)
    await UserModel.findByIdAndUpdate(employee.userId, { name }, { new: true });

    // update employee
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id,
      {
        maritalStatus,
        designation,
        salary,
        department,
      },
      { new: true }
    )
      .populate("userId", "-password")
      .populate("department");

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Employee update failed",
    });
  }
};

export const fetchEmployeesByDepId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Id is required",
        error: "Id missing",
      });
    }

    const employees = await EmployeeModel.find({ department: id });
    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No employees found for this department",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Employees get by depId",
      employees,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch employees By DepartmentId",
    });
  }
};
