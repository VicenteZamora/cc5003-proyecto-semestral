import express from "express";
import {
  createPost,
  deletePost,
  getPostById,
  updatePost,
} from "../controllers/postController";

const router = express.Router();

router.get("/:id", getPostById);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
