import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
  getPostByGuide,
  createPostForGuide
} from "../controllers/postController";
import { withUser } from "../utils/middleware";

const router = express.Router();

router.get("/:id", getPostById);
router.get("/guide/:id", getPostByGuide);
router.post("/", withUser, createPost);
router.post("/guide/:id", withUser, createPostForGuide);
router.get("/", getAllPosts);
router.put("/:id", withUser, updatePost);
router.delete("/:id", withUser, deletePost);

export default router;
