import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js";
import Otp from "../models/Otp.model.js";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mailSender from "../utils/mailSender.util.js";
import twilio from "twilio";
import SecurityEvent from "../models/SecurityEvent.model.js";
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
dotenv.config();

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
    isDuplicate = await Otp.findOne({ otp });
    retries--;
  } while (isDuplicate && retries > 0);

  if (retries === 0) {
    throw new Error("Failed to generate a unique OTP after multiple attempts.");
  }

  return otp;
};

const avatarImg = [
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Christian",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Liam",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Easton",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Luis",
  "https://api.dicebear.com/9.x/thumbs/svg?seed=Leo"
  

]


const assignRandomAvatar = () => {
  const index = Math.floor(Math.random() * avatarImg.length);
  return avatarImg[index];
}

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email ) {
      return res.status(400).json({ message: "Email or phone is required" });
    }

    // const existingUser = await User.exists({ email });
    // if (existingUser) {
    //   return res.status(400).json({ message: "User already exists" });
    // }

    const otp = await generateOtp();
    console.log("OTP generated:", otp);

    
    await Otp.create({ email, otp, purpose: "auth" });
    await SecurityEvent.create({
      email,
      type: "auth_otp_requested",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });
    const body = `
      <h3>Your Fantasktick OTP Code</h3>
      <p>Hello 👋,</p>
      <p>Your OTP code is: <strong>${otp}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `;
    await mailSender(email, "Your OTP Code", body);


    // if (phone) {
    //   await Otp.create({ phone, otp });

    //   await client.messages.create({
    //     body: `Your OTP is: ${otp}`,
    //     from: process.env.TWILIO_PHONE_NUMBER,
    //     to: `+91${phone}`, // Replace +91 if needed
    //   });
    // }

    return res
      .status(200)
      .json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const signUp = async (req, res) => {
  try {
    const { fullName, email, phone, otp } = req.body;
    if (!fullName || !email || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    if (await User.exists({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otpData = await Otp.findOne({ email, otp, purpose: "auth" });
    if (!otpData) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const avatar = assignRandomAvatar(); // ✅ assign avatar

    const user = await User.create({
      fullName,
      email,
      phone,
      accountType: "user",
      avatar, // ✅ store avatar
    });

    const payload = {
      id: user._id,
      email: user.email,
      phone: user.phone,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Error signing up:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    const user = await User.findOne({ $or: [{ email }, { phone }] });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user not found! please sign up" });
    }

    const otpData = await Otp.findOne({ $or: [{ email }, { phone }], otp, purpose: "auth" });
    if (!otpData) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const payload = {
      id: user._id,
      email: user.email,
      phone: user.phone,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.setHeader("Authorization", `Bearer ${token}`);
    console.log(token)
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export { sendOtp, signUp, login, logOut,  };


