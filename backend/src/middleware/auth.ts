import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
      };
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Get token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  // Check if token exists
  if (!token) {
    res.status(401).json({ message: "Access token required" });
    return;
  }

  // Verify token
  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      res.status(403).json({ message: "Invalid or expired token" });
      return;
    }

    // Attach user info to request
    req.user = user as { id: string; username: string };
    next();
  });
};
