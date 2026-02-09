import { Router } from "express";
import {
  getUserProfile,
  createUserProfile,
  getUserEvents,
  getPurchesedTickets
} from "../controllers/Profile.controller.js";
import { authMiddleware, ensureActiveUser } from "../middlewares/Auth.middleware.js";

const router = Router();

router.get("/getUserProfile",    authMiddleware, ensureActiveUser, getUserProfile);
router.post("/createUserProfile", authMiddleware, ensureActiveUser, createUserProfile);
router.get("/getUserEvents",      authMiddleware, ensureActiveUser, getUserEvents);
router.get("/getPurchesedTickets",authMiddleware, ensureActiveUser, getPurchesedTickets);

export default router;
