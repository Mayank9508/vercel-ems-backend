import dotenv from "dotenv";
dotenv.config();
import redis from "redis";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
// import { userRegister } from "./userSeed.js";
import { router as authRoutes } from "./routes/auth.route.js";
import { router as departmentRoutes } from "./routes/department.route.js";
import { router as employeeRoutes } from "./routes/employee.route.js";
import { router as salaryRoutes } from "./routes/salary.route.js";
import { router as leaveRoutes } from "./routes/leave.route.js";
import { router as dashboardRoutes } from "./routes/dashboard.route.js";
import cookieParser from "cookie-parser";
import { cacheIntance } from "./services/cache.service.js";


const app = express();

cacheIntance.on("connect", () => {
  console.log("redis connected successfully");
});

cacheIntance.on("error", (err) => {
  console.error("Redis Error:", err);
});

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    // origin: "https://vercel-ems-frontend.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

connectDb();
// userRegister()

app.get("/", (req, res) => {
  res.send("EMS Backend is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
app.listen(process.env.PORT, () => {
  console.log(`server is running on Port ${process.env.PORT}`);
});
