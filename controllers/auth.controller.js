import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import bcrypt from "bcrypt";
// import {cacheIntance} from "../services/cache.service.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPass,
      role,
    });

    const token = jwt.sign(
      { _id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        message: "All fields are required",
      });
    }

    let user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    let comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return res.status(403).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    let token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      message: "User LoggedIn",
      success: true,
      token,
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

export const logoutController = async (req, res) => {
  try {
    let token = req.cookies.token;
    // await cacheIntance.set(token, "blacklisted");

    res.clearCookie("token",{
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "User logged out",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      error,
    });
  }
};

export const fetchLoginUserController = async (req, res) => {
  try {
    return res.status(200).json({
      message: "Current user fectched",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};


//reset password feature

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
