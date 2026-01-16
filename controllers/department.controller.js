import mongoose from "mongoose";
import { DepartmentModel } from "../models/department.model.js";

export const addDepartmentController = async (req, res) => {
  try {
    let { dep_name, description } = req.body;

    if (!dep_name || !description) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newDepartment = await DepartmentModel.create({
      dep_name,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Add Department successfully",
      department: newDepartment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Add department server error",
    });
  }
};

export const getDepartments = async (req, res) => {
  try {
    let departments = await DepartmentModel.find();
    const dept_name = await DepartmentModel.find().select("dep_name -_id");
    let name = "sagar";
    return res.status(200).json({
      success: true,
      departments,
      dept_name,
      message: "All departments get successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "get departments server error",
      message: "Internsl Server error",
    });
  }
};

export const getDepartmentsName = async (req, res) => {
  try {
    // let departments = await DepartmentModel.find();
    const dept_name = await DepartmentModel.find().select("dep_name -_id");
    // let name = "sagar"
    return res.status(200).json({
      success: true,
      dept_name,
      message: "All departments name  get successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "get departments name server error",
      message: "Internsl Server error",
    });
  }
};

export const getDepartment = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Id is required",
      });
    }

    const department = await DepartmentModel.findById({ _id: id });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      department,
      message: "Department get successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "get department server error",
      message: "Internsl Server error",
    });
  }
};

export const editDepartment = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Id is required",
      });
    }

    let { dep_name, description } = req.body;

    if (!dep_name || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const updatedDepartment = await DepartmentModel.findByIdAndUpdate(
      id,
      { dep_name, description },
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department: updatedDepartment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Edit department server error",
      message: "Internsl Server error",
    });
  }
};

// export const deleteDepartment = async (req, res) => {
//   try {
//     let { id } = req.params;

//     if (!id) {
//       return res.status(400).json({
//         message: "id is required",
//       });
//     }

//     let deleteDepartment = await DepartmentModel.findByIdAndDelete({ _id: id });

//     if (!deleteDepartment) {
//       return res.status(404).json({
//         message: "Department not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Department deleted successfully",
//       deleteDepartment,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       error: "delete department server error",
//       message: "Internal Server error",
//     });
//   }
// };

export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await DepartmentModel.findByIdAndDelete(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("DELETE DEPARTMENT ERROR:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
