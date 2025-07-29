import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import config from "./config";

// Import routes
import authRoutes from "./routes/auth";
import fileRoutes from "./routes/files";

// Create Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Cross-origin resource sharing
app.use(express.json({ limit: "50mb" })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Parse URL-encoded bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Wonder Cloud Drive API" });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Connect to MongoDB
mongoose
  .connect(config.database.uri)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server
    app.listen(config.server.port, () => {
      console.log(`Server is running on port ${config.server.port}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

export default app;
