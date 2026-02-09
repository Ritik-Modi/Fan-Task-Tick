import { Router } from "express";
import { authMiddleware, ensureActiveUser } from "../middlewares/Auth.middleware.js";
import { sendIdentityOtp, verifyIdentityOtp, getMyIdentities } from "../controllers/Identity.controller.js";

const router = Router();

router.post("/send-otp", authMiddleware, ensureActiveUser, sendIdentityOtp);
router.post("/verify-otp", authMiddleware, ensureActiveUser, verifyIdentityOtp);
router.get("/my", authMiddleware, ensureActiveUser, getMyIdentities);

export default router;
