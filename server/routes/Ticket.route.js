// routes/ticketRoutes.js
import express from "express";
import {
  getTicketsByEvent,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/Ticket.controller.js";


const router = express.Router({ mergeParams: true });

router.get("/getTicketsByEvent", getTicketsByEvent);
router.post("/create-ticket", createTicket);
router.put("/updateTicket/:ticketId", updateTicket);
router.delete("/deleteTicket/:ticketId", deleteTicket);

export default router;
