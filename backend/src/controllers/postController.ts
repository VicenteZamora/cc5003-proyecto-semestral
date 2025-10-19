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
        {
          new: true,
        },
      );

      // TODO: give the status code... im not sure which one is the right one
      res.json(updatedPost);
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

export { getAllPosts, getPostById, createPost, updatePost, deletePost };
