import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const savedUser = await new UserModel({
      username,
      email,
      passwordHash,
    }).save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

export { createUser };
