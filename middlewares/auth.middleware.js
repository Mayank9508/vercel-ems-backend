import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
// import {cacheIntance} from "../services/cache.service.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Token not found",
        success: false,
      });
    }

    // let isBlackListed = await cacheIntance.get(token);

    // if (isBlackListed) {
    //   return res.status(400).json({
    //     message: "token blacklisted! Unauthorized",
    //   });
    // }

    let decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token ! Unauthorized",
      });
    }

    let user = await UserModel.findById(decoded._id);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token! Unauthorized",
      error,
    });
  }
};
