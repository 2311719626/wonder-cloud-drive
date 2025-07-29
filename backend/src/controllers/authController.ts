import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config";
import User from "../models/User";

// Generate JWT token
const generateToken = (user: any): string => {
  return jwt.sign(
    { id: user._id.toString(), username: user.username },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn } as any
  );
};

// Login controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    // Check if provided credentials match default user
    if (
      username === config.defaultUser.username &&
      password === config.defaultUser.password
    ) {
      // Create default user in database if not exists
      let user = await User.findOne({ username: config.defaultUser.username });

      if (!user) {
        // Create default user
        user = new User({
          username: config.defaultUser.username,
          password: config.defaultUser.password,
        });

        await user.save();
      }

      // Generate token
      const token = generateToken(user);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
        },
      });
      return;
    }

    // If not default user, check in database
    const user = await User.findOne({ username });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // For simplicity, we're not hashing the default password
    // In a real application, passwords should always be hashed
    if (password !== user.password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get current user controller
export const getCurrentUser = (req: Request, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ message: "User not authenticated" });
    return;
  }

  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
    },
  });
};
