import User from "../models/User.model.js";
import Ticket from "../models/Ticket.model.js";
import mongoose from "mongoose";
import Event from "../models/Event.model.js";

const createTicketForEvent = async (req, res) => {
  try {
    const { title, description, price, quantity, startSession, endSession } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (user.accountType !== "admin") {
      return res.status(403).json({ message: "You are not authorized to create a ticket" });
    }
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const ticket = await Ticket.create({
      eventId,
      title,
      description,
      price,
      quantity,
      startSession,
      endSession,
    });

    // Add the ticket to the event's tickets array
    await Event.findByIdAndUpdate(eventId, { $push: { tickets: ticket._id } });

    const ticketWithEvent = {
      ...ticket._doc,
      event: {
        id: event._id,
        title: event.title,
        description: event.description,
        image: event.image,
        venue: event.venue,
        genreIds: event.genreIds,
        startDate: event.startDate,
        endDate: event.endDate,
      },
    };

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket: ticketWithEvent,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateTicket = async (req, res) => { 
    try {
        const { title, description, price, quantity, startSession, endSession , statusbar } = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (user.accountType !== "admin") {
            return res.status(403).json({ message: "You are not authorized to update a ticket" });
        }
        
        const ticketId = req.params.ticketId;
        const eventId = req.params.eventId;
        
        const ticket = await Ticket.findOne({ _id: ticketId, eventId });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found for this event" });
        }
        
        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, {
            title,
            description,
            price,
            quantity,
            startSession,
            endSession,
            statusbar,
        }, { new: true });
        
        res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            ticket: updatedTicket,
        });
    } catch (error) {
        console.error("Error updating ticket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteTicket = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (user.accountType !== "admin") {
            return res.status(403).json({ message: "You are not authorized to delete a ticket" });
        }
        
        const ticketId = req.params.ticketId;
        const eventId = req.params.eventId;
        
        const deletedTicket = await Ticket.findOneAndDelete({ _id: ticketId, eventId });
        if (!deletedTicket) {
            return res.status(404).json({ message: "Ticket not found for this event" });
        }
        
        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully",
            ticket: deletedTicket,
        });
    } catch (error) {
        console.error("Error deleting ticket:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getTicketByEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        
        // Validate event exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        
        const tickets = await Ticket.find({ eventId }).populate("eventId", "title description image venue genreIds startDate endDate");
        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ message: "No tickets found for this event" });
        }
        
        res.status(200).json({
            success: true,
            message: "Tickets retrieved successfully",
            tickets,
        });
    } catch (error) {
        console.error("Error getting tickets by event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {
    createTicketForEvent,
    updateTicket,
    deleteTicket,
    getTicketByEvent,
}