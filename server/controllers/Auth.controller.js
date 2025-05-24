import User from "../models/User.model.js";
import Profile from "../models/Profile.model.js";
import Otp from "../models/Otp.model.js";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mailSender from "../utils/mailSender.util.js";
import twilio from "twilio";
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

    
    await Otp.create({ email, otp });
    await mailSender(email, "Your OTP Code", `Your OTP is: ${otp}`);


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

    // Check if the user already exists
    if (await User.exists({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate the OTP
    const otpData = await Otp.findOne({ email, otp });
    if (!otpData) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const profileDetails = await Profile.create({
      dob: null,
      venue: null,
      genre: [],
    });
    console.log("Profile created:", profileDetails);

    const user = await User.create({
      fullName,
      email,
      phone,
      profile: profileDetails._id,
      accountType: "user",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Error signing up:", error.message);
    return res.status(500).json({ message: "Internal server error",  });
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

    const otpData = await Otp.findOne({ $or: [{ email }, { phone }], otp });
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

    // DEBUG: Log the generated token for debugging purposes
    console.log("JWT Token in login controller:", token);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000, // 1 day
    });
    res.setHeader("Authorization", `Bearer ${token}`);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {}
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


export { sendOtp, signUp, login , logOut };
