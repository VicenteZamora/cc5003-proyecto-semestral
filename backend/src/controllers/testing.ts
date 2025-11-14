import express from "express";
import { gameModel } from "../models/game";
import { guideModel } from "../models/guide";
import { postModel } from "../models/post";
import { UserModel } from "../models/user";

const router = express.Router();

router.post("/reset", async (request, response) => {
    await gameModel.deleteMany({});
    await guideModel.deleteMany({});
    await postModel.deleteMany({});
    await UserModel.deleteMany({});
    response.status(204).end();
});

export default router;