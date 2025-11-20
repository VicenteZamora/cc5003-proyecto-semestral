import { Request, Response, NextFunction } from "express";
import { Post, postModel } from "../models/post";
import { UserModel } from "../models/user";

const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await postModel.find({});
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const getPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await postModel.findById(req.params.id);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = req.body as Post;
    const user = await UserModel.findById(req.userId);

    if (user) {
      post.author = user._id;
      const savedPost = await new postModel(post).save();
      res.status(201).json(savedPost);
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = req.body as Post;
    const user = await UserModel.findById(req.userId);

    if (user) {
      post.author = user._id;
      const updatedPost = await postModel.findOneAndUpdate(
        { _id: req.params.id, author: user._id },
        post,
        { new: true }
      );
      
      if (updatedPost) {
        res.status(200).json(updatedPost);
      } else {
        res.status(404).json({ error: "Post not found or unauthorized" });
      }
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (user) {
      await postModel.findOneAndDelete({
        _id: req.params.id,
        author: user._id,
      });
      res.status(204).end();
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

const getPostByGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guideId = req.params.id;
    const comments = await postModel
      .find({ guide: guideId })
      .populate("author", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

const createPostForGuide = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guideId = req.params.id;
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const saved = await postModel.create({
      content: req.body.content,
      author: user._id,
      guide: guideId,
    });

    const populatedPost = await postModel
      .findById(saved._id)
      .populate("author", "username");

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    next(error);
  }
};

export { 
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostByGuide,
  createPostForGuide
};