import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  location: { type: String },
  latitude: { type: Number }, // Separate latitude field
  longitude: { type: Number }, // Separate longitude field
  phone: { type: String },
  about: { type: String },
  languages: [{ type: String }],
  interests: [{ type: String }],
  image: { type: String },
  isVerified: { type: Boolean, default: false },
  isNewUser: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  username: { type: String },
}, { timestamps: true });

const UserModel = mongoose.models.users || mongoose.model("users", userSchema);
export default UserModel;
