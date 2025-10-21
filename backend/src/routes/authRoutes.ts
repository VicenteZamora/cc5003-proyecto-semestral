import express from "express";
import { getCurrentUser, login, logout } from "../controllers/authController";
import { withUser } from "../utils/middleware";

const router = express.Router();

router.use(withUser);
router.post("/", login);
router.get("/me", getCurrentUser);
router.post("/logout", logout);

export default router;
