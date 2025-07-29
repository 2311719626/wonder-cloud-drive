import mongoose, { Document, Schema } from "mongoose";

// User interface
export interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
}

// User schema
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export User model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
