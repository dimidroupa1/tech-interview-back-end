import { Response } from "express";
import { redis } from "../utils/redis";
import UserModel from "../models/user.model";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);

  if (userJson) {
    const user = JSON.parse(userJson);

    res.cookie("user", user);

    res.status(201).json({
      success: true,
      user,
    });
  }
};
