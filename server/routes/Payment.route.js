// 
import { isUser , authMiddleware} from "../middlewares/Auth.middleware.js";





import express from "express";
import { buyTicket, markTicketAsPaid, markTicketAsUsed } from "../controllers/Purchesed.controller.js";

const router = express.Router({ mergeParams: true });

// POST /api/v1/ticket/:ticketId/payment - Create payment order
router.post("/", authMiddleware,buyTicket);

// PUT /api/v1/ticket/:ticketId/payment/verify - Verify payment
router.put("/verify", authMiddleware, markTicketAsPaid);

// PUT /api/v1/ticket/:ticketId/payment/:userTicketId/used - Mark ticket as used
router.put("/:userTicketId/used", authMiddleware, markTicketAsUsed);

export default router;