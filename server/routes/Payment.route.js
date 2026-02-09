import { authMiddleware, ensureActiveUser } from "../middlewares/Auth.middleware.js";
import express from "express";
import { createCheckoutSession } from "../controllers/PolarPayment.controller.js";
import { markTicketAsUsed } from "../controllers/Purchesed.controller.js";

const router = express.Router({ mergeParams: true });

// POST /api/v1/ticket/:ticketId/payment - Create Polar checkout session
router.post("/", authMiddleware, ensureActiveUser, createCheckoutSession);

// PUT /api/v1/ticket/:ticketId/payment/:userTicketId/used - Mark ticket as used
router.put("/:userTicketId/used", authMiddleware, ensureActiveUser, markTicketAsUsed);

export default router;
