import { SalaryModel } from "../models/salary.model.js";
import { EmployeeModel } from "../models/employee.model.js";

export const addSalaryController = async (req, res) => {
  try {
    const { employeeId, basicSalary, allowances, deduction, payDate } =
      req.body;

    if (!employeeId || !basicSalary || !allowances || !deduction || !payDate) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const totalSalary =
      Number(basicSalary) + Number(allowances) - Number(deduction);

    const newSalary = await SalaryModel.create({
      employeeId,
      basicSalary,
      allowances,
      deduction,
      netSalary: totalSalary,
      payDate,
    });

    return res.status(201).json({
      success: true,
      message: "Salary added successfully",
      salary: newSalary,
    });
  } catch (error) {
    console.error("Add Salary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add salary",
    });
  }
};

export const getSalaryController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Employee id is required",
      });
    }

    const salary = await SalaryModel.find({ employeeId: id })
      .populate("employeeId", "employeeId")
      .sort({ payDate: -1 });

    return res.status(200).json({
      success: true,
      salary,
    });
  } catch (error) {
    console.error("Get Salary Error:", error);
    return res.status(500).json({
      success: false,
      error: "Salary fetch server error",
    });
  }
};


export const getMySalaryController = async (req, res) => {
  try {
    const userId = req.user._id; // logged-in USER id

    // 🔥 find employee linked with this user
    const employee = await EmployeeModel.findOne({ userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee profile not found",
      });
    }

    // 🔥 now fetch salary using employee._id
    const salary = await SalaryModel.find({
      employeeId: employee._id,
    }).sort({ payDate: -1 });

    return res.status(200).json({
      success: true,
      salary,
    });
  } catch (error) {
    console.error("Get My Salary Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch salary",
    });
  }
};

