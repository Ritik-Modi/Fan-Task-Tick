import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  try {
    const url = process.env.MONGODB_URL;
    if (!url) {
      throw new Error("MongoDB URL is not defined in .env file");
    }
    await mongoose.connect(url);
    console.log("✅ mongoDB connection successful");

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Reconnecting...");
      connectDB();
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });
  } catch (error) {
    console.error(`❌ mongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
