import express from "express";
import {
  createGuide,
  deleteGuide,
  getGuideById,
  updateGuide,
} from "../controllers/guideController";

const router = express.Router();

router.get("/:id", getGuideById);
router.post("/", createGuide);
router.put("/:id", updateGuide);
router.delete("/:id", deleteGuide);

export default router;
