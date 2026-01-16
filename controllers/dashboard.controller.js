import { EmployeeModel } from "../models/employee.model.js";
import { DepartmentModel } from "../models/department.model.js";
import { LeaveModel } from "../models/leave.model.js";
import { SalaryModel } from "../models/salary.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    // TOTAL COUNTS
    const totalEmployees = await EmployeeModel.countDocuments();
    const totalDepartments = await DepartmentModel.countDocuments();

    // LEAVE STATS
    const leaveApplied = await LeaveModel.countDocuments();
    const leaveApproved = await LeaveModel.countDocuments({ status: "Approved" });
    const leaveRejected = await LeaveModel.countDocuments({ status: "Rejected" });
    const leavePending = await LeaveModel.countDocuments({ status: "Pending" });

    // CURRENT MONTH SALARY
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const salaries = await SalaryModel.find({
      payDate: { $gte: start, $lt: end },
    });

    const monthlySalary = salaries.reduce(
      (sum, s) => sum + (s.netSalary || 0),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalDepartments,
        monthlySalary,
        leave: {
          applied: leaveApplied,
          approved: leaveApproved,
          rejected: leaveRejected,
          pending: leavePending,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Dashboard fetch failed",
    });
  }
};
