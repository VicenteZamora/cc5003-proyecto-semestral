import { Request, Response, NextFunction } from "express";
import { Guide, guideModel } from "../models/guide";
import { UserModel } from "../models/user";

const getAllGuides = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const guides = await guideModel.find({});

    res.json(guides);
  } catch (error) {
    next(error);
  }
};

const getGuideById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const guide = await guideModel.findById(req.params.id);

    res.json(guide);
  } catch (error) {
    next(error);
  }
};

const createGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guide = req.body as Guide;
    const user = await UserModel.findById(req.userId);

    if (user) {
      guide.author = user._id;
      const savedGuide = await new guideModel(guide).save();

      res.status(201).json(savedGuide);
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

const updateGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guide = req.body as Guide;
    const user = await UserModel.findById(req.userId);

    if (user) {
      guide.author = user._id;
      const updatedGuide = await guideModel.findOneAndUpdate(
        { _id: req.params.id, author: user._id },
        guide,
        {
          new: true,
        },
      );

      // TODO: give the status code... im not sure which one is the right one
      res.json(updatedGuide);
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (user) {
      await guideModel.findOneAndDelete({
        _id: req.params.id,
        author: user._id,
      });

      res.status(204).end();
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

export { getAllGuides, getGuideById, createGuide, updateGuide, deleteGuide };
