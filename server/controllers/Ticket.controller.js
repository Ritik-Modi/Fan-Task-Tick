// controllers/ticketController.js
import Ticket from "../models/Ticket.model.js";
import Event from "../models/Event.model.js";
import mongoose from "mongoose";

export const getTicketsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    const tickets = await Ticket.find({ eventId });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const { title, description, price, quantity, startSession, endSession } = req.body;
    if (!title || !description || price === undefined || quantity === undefined || !startSession || !endSession) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const qty = Number(quantity);
    const cost = Number(price);
    if (!Number.isFinite(cost) || cost < 0 || !Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ message: "Invalid price or quantity" });
    }

    const ticket = new Ticket({
      eventId,
      title,
      description,
      price: cost,
      quantity: qty,
      startSession,
      endSession,
    });

    await ticket.save();
    event.tickets.push(ticket._id);
    await event.save();

    res.status(201).json({ success: true, ticket });
  } catch (err) {
    res.status(500).json({ message: "Ticket creation failed" });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      return res.status(400).json({ message: "Invalid ticket ID" });
    }
    const updated = await Ticket.findByIdAndUpdate(ticketId, req.body, { new: true });
    res.status(200).json({ success: true, ticket: updated });
  } catch (err) {
    res.status(500).json({ message: "Ticket update failed" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { ticketId, eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(ticketId) || !mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid ticket or event ID" });
    }
    await Ticket.findByIdAndDelete(ticketId);
    await Event.findByIdAndUpdate(eventId, { $pull: { tickets: ticketId } });
    res.status(200).json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};
