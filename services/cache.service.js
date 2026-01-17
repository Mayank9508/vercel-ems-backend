import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

export const cacheIntance = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD, //  MOST IMPORTANT LINE (Redis Cloud ke liye)
});
