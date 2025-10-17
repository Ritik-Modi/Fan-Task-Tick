import { Router } from "express";
import {
  getUserProfile,
  createUserProfile,
  getUserEvents,
  getPurchesedTickets
} from "../controllers/Profile.controller.js";
import { authMiddleware } from "../middlewares/Auth.middleware.js";

const router = Router();

router.get("/getUserProfile",    authMiddleware, getUserProfile);
router.post("/createUserProfile", authMiddleware, createUserProfile);
router.get("/getUserEvents",      authMiddleware, getUserEvents);
router.get("/getPurchesedTickets",authMiddleware, getPurchesedTickets);

export default router;
