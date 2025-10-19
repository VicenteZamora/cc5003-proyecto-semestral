import { Request, Response, NextFunction } from "express";
import { UserModel, User } from "../models/user";
import bcrypt from "bcrypt";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body as User;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
    user.passwordHash = passwordHash;

    const savedUser = await new UserModel(user).save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

export { createUser };
