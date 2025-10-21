import express from "express";
import { getCurrentUser, login, logout } from "../controllers/authController";
import { withUser } from "../utils/middleware";

const router = express.Router();

router.post("/", login);

router.use(withUser);
router.get("/me", getCurrentUser);
router.post("/logout", logout);

export default router;
