import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import config from "../config";
import File from "../models/File";

// Ensure upload directory exists
if (!fs.existsSync(config.fileUpload.dir)) {
  fs.mkdirSync(config.fileUpload.dir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, config.fileUpload.dir);
  },
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename =
      path.basename(file.originalname, ext) + "-" + uniqueSuffix + ext;
    cb(null, filename);
  },
});

// Create multer upload instance
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
}).single("file");

// Upload file controller
export const uploadFile = (req: Request, res: Response): void => {
  // Use multer upload middleware
  upload(req, res, async (err) => {
    if (err) {
      console.error("File upload error:", err);
      res.status(500).json({ message: "File upload failed" });
      return;
    }

    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    try {
      // Check if user is authenticated
      if (!req.user) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }

      // Create file record in database
      const newFile = new File({
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
        path: req.file.path,
        owner: req.user.id,
      });

      const savedFile = await newFile.save();

      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          id: savedFile._id,
          filename: savedFile.filename,
          originalName: savedFile.originalName,
          size: savedFile.size,
          uploadTime: savedFile.uploadTime,
        },
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};

// Get user files controller
export const getUserFiles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Get user files from database
    const files = await File.find({ owner: req.user.id })
      .select("-path -owner -shareLink -shareExpiry -sharePassword")
      .sort({ uploadTime: -1 });

    res.json({
      files,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Download file controller
export const downloadFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fileId = req.params.id;

    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Find file in database
    const file = await File.findOne({ _id: fileId, owner: req.user.id });

    if (!file) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.path)) {
      res.status(404).json({ message: "File not found on disk" });
      return;
    }

    // Set headers for file download
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.originalName}"`
    );

    // Stream file to response
    const fileStream = fs.createReadStream(file.path);
    fileStream.pipe(res);
  } catch (error) {
    console.error("File download error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete file controller
export const deleteFile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fileId = req.params.id;

    // Check if user is authenticated
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    // Find file in database
    const file = await File.findOne({ _id: fileId, owner: req.user.id });

    if (!file) {
      res.status(404).json({ message: "File not found" });
      return;
    }

    // Delete file from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete file record from database
    await File.deleteOne({ _id: fileId });

    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("File deletion error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
