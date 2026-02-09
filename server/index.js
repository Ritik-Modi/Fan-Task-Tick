import express from "express";
import dotenv from "dotenv";

import connectDB from "./config/dataBase.config.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/Admin.route.js";
import userRoutes from "./routes/User.route.js";
import eventRoutes from "./routes/Event.route.js";
import ticketRoutes from "./routes/Ticket.route.js";
import reviewRoutes from "./routes/Review.route.js";
import paymentRoutes from "./routes/Payment.route.js";
import genreRoutes from "./routes/common.route.js";
import polarRoutes from "./routes/Polar.route.js";
import identityRoutes from "./routes/Identity.route.js";
import fileUpload from "express-fileupload";




dotenv.config();
const app = express();
const PORT = process.env.PORT || 4100;
connectDB();

app.use("/api/v1/polar", polarRoutes);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [
    "https://fan-task-tick.vercel.app",
    "http://localhost:5173",
  ],
  credentials: true,

}))
app.use(fileUpload({ useTempFiles: true }));



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/event", eventRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/event/:eventId/ticket", ticketRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/ticket/:ticketId/payment", paymentRoutes);
app.use("/api/v1/identity", identityRoutes);


app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to the Event Management API",
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

