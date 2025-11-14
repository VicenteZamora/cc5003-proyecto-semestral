import { Request, Response } from "express";
import { gameModel } from "../models/game";

// Obtener todos los juegos
export const getAllGames = async (_req: Request, res: Response) => {
  try {
    const games = await gameModel.find({}).populate("guides");
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los juegos" });
  }
};

// Obtener un juego por ID
export const getGameById = async (req: Request, res: Response) => {
  try {
    const game = await gameModel.findById(req.params.id).populate("guides");
    if (!game) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el juego" });
  }
};

// Crear un nuevo juego
export const createGame = async (req: Request, res: Response) => {
  try {
    const { name, genre, platform, description, image } = req.body;
    const newGame = new gameModel({
      name,
      genre,
      platform,
      description,
      image,
      guides: [],
    });
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error) {
    res.status(400).json({ error: "Error al crear el juego" });
  }
};

// Actualizar un juego
export const updateGame = async (req: Request, res: Response) => {
  try {
    const updatedGame = await gameModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedGame) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    res.json(updatedGame);
  } catch (error) {
    res.status(400).json({ error: "Error al actualizar el juego" });
  }
};

// Eliminar un juego
export const deleteGame = async (req: Request, res: Response) => {
  try {
    const deletedGame = await gameModel.findByIdAndDelete(req.params.id);
    if (!deletedGame) {
      return res.status(404).json({ error: "Juego no encontrado" });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el juego" });
  }
};