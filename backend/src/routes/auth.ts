import { Router } from "express";
import { login, getCurrentUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Login route
router.post("/login", login);

// Get current user route
router.get("/me", authenticateToken, getCurrentUser);

export default router;
