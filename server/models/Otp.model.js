import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["auth", "identity"],
    default: "auth",
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m", // OTP expires after 5 minutes
  },
});

const Otp = mongoose.model("Otp", OtpSchema);
export default Otp;
