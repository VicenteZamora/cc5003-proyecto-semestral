import { Request, Response, NextFunction } from "express";
import { Guide, guideModel } from "../models/guide";
import { UserModel } from "../models/user";

const getGuideById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const guide = await guideModel.findById(id);
  if (guide) {
    res.json(guide);
  } else {
    res.status(404).end();
  }
};

const createGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guide = req.body as Guide;
    const user = await UserModel.findById(req.userId);

    if (user) {
      guide.author = user._id;
      const savedGuide = await new guideModel(guide).save();

      res.json(201).json(savedGuide);
    } else {
      res.status(400).json({
        error: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guide = req.body as Guide;
    const user = await UserModel.findById(req.userId);

    // TODO: I guess we should check if the user is the author of the guide too
    if (user) {
      guide.author = user._id;
      const updatedGuide = await guideModel.findByIdAndUpdate(
        req.params.id,
        guide,
        {
          new: true,
        },
      );

      // TODO: give the status code... im not sure which one is the right one
      res.json(updatedGuide);
    } else {
      res.status(400).json({
        error: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
};

const deleteGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (user) {
      // TODO: implemente the delete logic, we should check if the user is the author of the guide too
      // TODO: check mongoose middlewares
    } else {
      res.status(400).json({
        error: "User not found",
      });
    }
  } catch (error) {
    next(error);
  }
};
