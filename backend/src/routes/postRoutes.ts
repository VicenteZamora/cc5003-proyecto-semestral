import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controllers/postController";

const router = express.Router();

router.get("/:id", getPostById);
router.post("/", createPost);
router.get("/", getAllPosts);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
