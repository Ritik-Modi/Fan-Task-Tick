import mongoose from "mongoose";

const verifiedIdentitySchema = new mongoose.Schema({
  ownerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  verifiedAt: { type: Date },
  status: { type: String, enum: ["active", "deactivated"], default: "active" },
  createdAt: { type: Date, default: Date.now },
});

const VerifiedIdentity = mongoose.model("VerifiedIdentity", verifiedIdentitySchema);
export default VerifiedIdentity;
