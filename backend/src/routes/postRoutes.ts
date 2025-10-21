import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../controllers/postController";
import { withUser } from "../utils/middleware";

const router = express.Router();

router.get("/:id", getPostById);
router.post("/", withUser, createPost);
router.get("/", getAllPosts);
router.put("/:id", withUser, updatePost);
router.delete("/:id", withUser, deletePost);

export default router;
