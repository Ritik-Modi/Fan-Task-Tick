import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  accountType: { type: String, enum: ["user", "admin"], default: "user" },
  phone: { type: Number, required: true },
  avatar: { type: String, required: true }, // ✅ New field
  profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
 