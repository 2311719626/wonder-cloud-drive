import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config();

// Environment variables validation
const requiredEnvVars = [
  "PORT",
  "MONGODB_URI",
  "JWT_SECRET",
  "FILE_STORAGE_PATH",
];

// Check if all required environment variables are set
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

// Configuration object
const config = {
  server: {
    port: parseInt(process.env.PORT || "5000", 10),
  },
  database: {
    uri:
      process.env.MONGODB_URI || "mongodb://localhost:27017/wonder-cloud-drive",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
  fileUpload: {
    dir: path.resolve(process.env.FILE_STORAGE_PATH || "./uploads"),
    maxSize: process.env.MAX_FILE_SIZE || "50mb",
  },
  defaultUser: {
    username: process.env.DEFAULT_USERNAME || "admin",
    password: process.env.DEFAULT_PASSWORD || "admin123",
  },
};

export default config;
