import express from "express";
import {
  createGame,
  deleteGame,
  getAllGames,
  getGameById,
  updateGame,
} from "../controllers/gameController";
import { withUser } from "../utils/middleware";

const router = express.Router();

router.get("/:id", getGameById);
router.post("/", withUser, createGame);
router.get("/", getAllGames);
router.put("/:id", withUser, updateGame);
router.delete("/:id", withUser, deleteGame);

export default router;