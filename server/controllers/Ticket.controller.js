// controllers/ticketController.js
import Ticket from "../models/Ticket.model.js";
import Event from "../models/Event.model.js";

export const getTicketsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const tickets = await Ticket.find({ eventId });
    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const ticket = new Ticket({
      eventId,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      startSession: req.body.startSession,
      endSession: req.body.endSession,
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
    const updated = await Ticket.findByIdAndUpdate(ticketId, req.body, { new: true });
    res.status(200).json({ success: true, ticket: updated });
  } catch (err) {
    res.status(500).json({ message: "Ticket update failed" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { ticketId, eventId } = req.params;
    await Ticket.findByIdAndDelete(ticketId);
    await Event.findByIdAndUpdate(eventId, { $pull: { tickets: ticketId } });
    res.status(200).json({ success: true, message: "Ticket deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};
