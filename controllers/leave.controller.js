import { EmployeeModel } from "../models/employee.model.js";
import { LeaveModel } from "../models/leave.model.js";

export const addLeaveController = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after end date",
      });
    }

    const employee = await EmployeeModel.findOne({
      userId: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const newLeave = await LeaveModel.create({
      employeeId: employee._id,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    return res.status(201).json({
      success: true,
      message: "Leave added successfully",
      leave: newLeave,
    });
  } catch (error) {
    console.error("Add Leave Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add leave",
    });
  }
};

export const getMyLeavesController = async (req, res) => {
  try {
    const employee = await EmployeeModel.findOne({
      userId: req.user._id,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const leaves = await LeaveModel.find({
      employeeId: employee._id,
    })
      .populate({
        path: "employeeId",
        populate: [
          { path: "department", select: "dep_name" },
          { path: "userId", select: "name" },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    console.error("Get Leaves Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaves",
    });
  }
};

export const getLeavesController = async (req, res) => {
  try {
    const leaves = await LeaveModel.find()
      .populate({
        path: "employeeId",
        select: "employeeId department userId",
        populate: [
          {
            path: "department",
            select: "dep_name",
          },
          {
            path: "userId",
            select: "name",
          },
        ],
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leaves,
      message: "Leaves fetched successfully",
    });
  } catch (error) {
    console.log("Leave Fetch Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Server error while fetching leaves",
    });
  }
};

export const getLeaveDetailController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Leave ID is required",
      });
    }

    const leave = await LeaveModel.findById(id).populate({
      path: "employeeId",
      select: "employeeId department userId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name profileImage",
        },
      ],
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Leave Detail get successfully",
      leave,
    });
  } catch (error) {
    console.error("Get Leave Detail Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leave details",
    });
  }
};

// import { LeaveModel } from "../models/leave.model.js";

export const updateLeaveStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // ✅ status validation
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // ✅ update + populate (INLINE)
    const leave = await LeaveModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate({
      path: "employeeId",
      select: "employeeId department userId",
      populate: [
        {
          path: "department",
          select: "dep_name",
        },
        {
          path: "userId",
          select: "name profileImage",
        },
      ],
    });

    // ❌ leave not found
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Leave not found",
      });
    }

    // ✅ success
    return res.status(200).json({
      success: true,
      message: `Leave ${status}`,
      leave,
    });
  } catch (error) {
    console.error("Update Leave Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update leave status",
    });
  }
};

export const getEmployeeLeaveHistoryForAdmin = async (req, res) => {
  try {
    const { id } = req.params; // employeeId

    const leaves = await LeaveModel.find({ employeeId: id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      leaves,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Unable to fetch employee leave history",
    });
  }
};

