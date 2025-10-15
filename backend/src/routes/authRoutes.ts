import express from "express";
import { getCurrentUser, login, logout } from "../controllers/authController";

const router = express.Router();

router.post("/", login);
router.get("/me", getCurrentUser);
router.post("/logout", logout);

export default router;
