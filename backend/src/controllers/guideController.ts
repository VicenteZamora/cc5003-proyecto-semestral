import { Request, Response, NextFunction } from "express";
import { Guide, guideModel } from "../models/guide";
import { UserModel } from "../models/user";

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

    guide.author = user!._id;
    const savedGuide = await new guideModel(guide).save();

    res.status(201).json(savedGuide);
  } catch (error) {
    next(error);
  }
};

const updateGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guide = req.body as Guide;
    const user = await UserModel.findById(req.userId);

    guide.author = user!._id;
    const updatedGuide = await guideModel.findByIdAndUpdate(
      req.params.id,
      guide,
      {
        new: true,
      },
    );

    // TODO: give the status code... im not sure which one is the right one
    res.json(updatedGuide);
  } catch (error) {
    next(error);
  }
};

const deleteGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.userId);

    await guideModel.findOneAndDelete({
      _id: req.params.id,
      author: user!._id,
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export { getGuideById, createGuide, updateGuide, deleteGuide };
