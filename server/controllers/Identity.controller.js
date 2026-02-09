import otpGenerator from "otp-generator";
import VerifiedIdentity from "../models/VerifiedIdentity.model.js";
import Otp from "../models/Otp.model.js";
import mailSender from "../utils/mailSender.util.js";
import SecurityEvent from "../models/SecurityEvent.model.js";

const generateOtp = async () => {
  let otp, isDuplicate;
  let retries = 5;

  do {
    otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      digits: true,
      lowerCaseAlphabets: false,
    });
    isDuplicate = await Otp.findOne({ otp, purpose: "identity" });
    retries--;
  } while (isDuplicate && retries > 0);

  if (retries === 0) {
    throw new Error("Failed to generate a unique OTP after multiple attempts.");
  }

  return otp;
};

const sendIdentityOtp = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const ownerUserId = req.user.id;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    const existing = await VerifiedIdentity.findOne({ email });
    if (existing && String(existing.ownerUserId) !== String(ownerUserId)) {
      return res.status(409).json({ message: "This email is already verified by another account" });
    }

    if (existing && existing.verifiedAt) {
      return res.status(200).json({ success: true, message: "Identity already verified", identity: existing });
    }

    await VerifiedIdentity.findOneAndUpdate(
      { email },
      { name, phone, ownerUserId, createdIp: req.ip, createdUserAgent: req.headers["user-agent"] },
      { upsert: true, new: true }
    );

    const otp = await generateOtp();
    await Otp.create({ email, otp, purpose: "identity" });

    const body = `
      <h3>Your Fantasktick Identity OTP</h3>
      <p>Hello ${name},</p>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `;

    if (process.env.SKIP_EMAIL === "true") {
      console.log("SKIP_EMAIL enabled. Identity OTP for", email, "is", otp);
    } else {
      await mailSender(email, "Identity Verification OTP", body);
    }

    await SecurityEvent.create({
      userId: ownerUserId,
      email,
      type: "identity_otp_requested",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    return res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending identity OTP:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyIdentityOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const ownerUserId = req.user.id;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpData = await Otp.findOne({ email, otp, purpose: "identity" });
    if (!otpData) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const identity = await VerifiedIdentity.findOneAndUpdate(
      { email, ownerUserId },
      { verifiedAt: new Date(), status: "active" },
      { new: true }
    );

    if (!identity) {
      return res.status(404).json({ message: "Identity not found" });
    }

    await SecurityEvent.create({
      userId: ownerUserId,
      email,
      type: "identity_verified",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: { identityId: identity._id },
    });

    return res.status(200).json({ success: true, message: "Identity verified", identity });
  } catch (error) {
    console.error("Error verifying identity OTP:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getMyIdentities = async (req, res) => {
  try {
    const ownerUserId = req.user.id;
    const identities = await VerifiedIdentity.find({ ownerUserId });
    return res.status(200).json({ success: true, identities });
  } catch (error) {
    console.error("Error fetching identities:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  sendIdentityOtp,
  verifyIdentityOtp,
  getMyIdentities,
};
