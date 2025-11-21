import { Request, Response, NextFunction } from "express";
import { Guide, guideModel } from "../models/guide";
import { UserModel } from "../models/user";
import { gameModel } from "../models/game";

const getAllGuides = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const guides = await guideModel.find({}).populate("author", "username");

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
    const guide = await guideModel
      .findById(req.params.id)
      .populate("author", "username");

    res.json(guide);
  } catch (error) {
    next(error);
  }
};

const createGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guide = req.body as Guide;
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Verificar que el juego existe
    const game = await gameModel.findById(guide.game);
    if (!game) {
      return res.status(400).json({ error: "Game not found" });
    }

    // Crear la guía
    guide.author = user._id;
    const savedGuide = await new guideModel(guide).save();
    await savedGuide.populate("author", "username");

    // Actualizar el usuario y el juego
    user.guides = user.guides.concat(savedGuide._id);
    await user.save();

    game.guides = game.guides.concat(savedGuide._id);
    await game.save();

    res.status(201).json(savedGuide);
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

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Buscar la guía antes de eliminarla para obtener el gameId
    const guide = await guideModel.findOne({
      _id: req.params.id,
      author: user._id,
    });

    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    // Eliminar la guía
    await guideModel.findByIdAndDelete(req.params.id);

    // Actualizar el usuario y el juego
    user.guides = user.guides.filter(
      (g) => g.toString() !== req.params.id
    );
    await user.save();

    const game = await gameModel.findById(guide.game);
    if (game) {
      game.guides = game.guides.filter(
        (g) => g.toString() !== req.params.id
      );
      await game.save();
    }

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export { getAllGuides, getGuideById, createGuide, updateGuide, deleteGuide };