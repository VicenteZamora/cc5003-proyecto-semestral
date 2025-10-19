import express from "express";
import {
  createGuide,
  deleteGuide,
  getAllGuides,
  getGuideById,
  updateGuide,
} from "../controllers/guideController";

const router = express.Router();

router.get("/:id", getGuideById);
router.post("/", createGuide);
router.get("/", getAllGuides);
router.put("/:id", updateGuide);
router.delete("/:id", deleteGuide);

export default router;
