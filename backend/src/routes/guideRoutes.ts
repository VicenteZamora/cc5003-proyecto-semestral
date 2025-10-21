import express from "express";
import {
  createGuide,
  deleteGuide,
  getAllGuides,
  getGuideById,
  updateGuide,
} from "../controllers/guideController";
import { withUser } from "../utils/middleware";

const router = express.Router();

router.get("/:id", getGuideById);
router.post("/", withUser, createGuide);
router.get("/", getAllGuides);
router.put("/:id", withUser, updateGuide);
router.delete("/:id", withUser, deleteGuide);

export default router;
