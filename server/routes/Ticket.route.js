import { authMiddleware , isAdmin } from "../middlewares/Auth.middleware.js";
import express from "express";
import { createTicketForEvent, updateTicket, deleteTicket, getTicketByEvent } from "../controllers/Ticket.controller.js";

const router = express.Router({ mergeParams: true }); // Important: mergeParams allows access to eventId

// GET /api/v1/event/:eventId/ticket - Get all tickets for an event
router.get("/getTicketsByEvent", getTicketByEvent);


// POST /api/v1/event/:eventId/ticket - Create a ticket for an event
router.post("/create-ticket",authMiddleware, isAdmin, createTicketForEvent);

// PUT /api/v1/event/:eventId/ticket/:ticketId - Update a ticket
router.put("/updateTicket/:ticketId",authMiddleware, isAdmin, updateTicket);

// DELETE /api/v1/event/:eventId/ticket/:ticketId - Delete a ticket
router.delete("/deleteTicket/:ticketId",authMiddleware, isAdmin, deleteTicket);

export default router;