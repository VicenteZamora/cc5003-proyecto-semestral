import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../utils/config";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username: username });
    const errorMessage = "Invalid username or password";
    if (user) {
      const passwordCorrect = await bcrypt.compare(password, user.passwordHash);

      if (!passwordCorrect) {
        res.status(401).json({
          error: errorMessage,
        });
      } else {
        const userForToken = {
          username: user.username,
          csrf: crypto.randomUUID(),
          id: user._id,
        };

        const token = jwt.sign(userForToken, config.JWT_SECRET, {
          expiresIn: 60 * 60,
        });
        res.setHeader("X-CSRF-Token", userForToken.csrf);
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        res.status(200).send({ username: user.username });
      }
    } else {
      res.status(401).json({ error: errorMessage });
    }
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
