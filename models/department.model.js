import mongoose from "mongoose";
import { EmployeeModel } from "./employee.model.js";
import { LeaveModel } from "./leave.model.js";
import { SalaryModel } from "./salary.model.js";
import { UserModel } from "./user.model.js";

const departmentSchema = new mongoose.Schema(
  {
    dep_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

departmentSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  const employees = await EmployeeModel.find({ department: doc._id });

  const empIds = employees.map((emp) => emp._id);

  const userIds = employees
    .filter((emp) => emp.userId)
    .map((emp) => emp.userId);

  await EmployeeModel.deleteMany({ department: doc._id });
  await LeaveModel.deleteMany({ employeeId: { $in: empIds } });
  await SalaryModel.deleteMany({ employeeId: { $in: empIds } });
  await UserModel.deleteMany({ _id: { $in: userIds } });
});

export const DepartmentModel = mongoose.model("Department", departmentSchema);
