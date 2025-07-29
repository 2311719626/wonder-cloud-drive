import mongoose, { Document, Schema } from "mongoose";

// File interface
export interface IFile extends Document {
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadTime: Date;
  path: string;
  owner: mongoose.Types.ObjectId;
  shareLink?: string;
  shareExpiry?: Date;
  sharePassword?: string;
}

// File schema
const FileSchema: Schema = new Schema({
  filename: {
    type: String,
    required: true,
    trim: true,
  },
  originalName: {
    type: String,
    required: true,
    trim: true,
  },
  size: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
    trim: true,
  },
  uploadTime: {
    type: Date,
    default: Date.now,
  },
  path: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shareLink: {
    type: String,
    unique: true,
    sparse: true,
  },
  shareExpiry: {
    type: Date,
  },
  sharePassword: {
    type: String,
  },
});

// Create and export File model
const File = mongoose.model<IFile>("File", FileSchema);
export default File;
