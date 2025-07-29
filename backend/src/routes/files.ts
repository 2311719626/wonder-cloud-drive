import { Router } from "express";
import {
  uploadFile,
  getUserFiles,
  downloadFile,
  deleteFile,
} from "../controllers/fileController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// POST /api/files/upload - Upload a file (requires authentication)
router.post("/upload", authenticateToken, uploadFile);

// GET /api/files - Get user files (requires authentication)
router.get("/", authenticateToken, getUserFiles);

// GET /api/files/:id/download - Download a file (requires authentication)
router.get("/:id/download", authenticateToken, downloadFile);

// DELETE /api/files/:id - Delete a file (requires authentication)
router.delete("/:id", authenticateToken, deleteFile);

export default router;
