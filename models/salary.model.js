import mongoose, { Schema } from "mongoose";

const salarySchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    basicSalary: {
      type: Number,
      required: true,
    },
    allowances: {
      type: Number,
    },
    deduction: {
      type: Number,
    },
    netSalary: {
      type: Number,
    },
    payDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SalaryModel = mongoose.model("Salary", salarySchema);
