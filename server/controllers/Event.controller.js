import Event from "../models/Event.model.js";
import Genre from "../models/Genre.model.js";
import User from "../models/User.model.js";
import mongoose from "mongoose";

const getAllEvents = async (req, res) => {
  try {
    const eventsWithPrices = await Event.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "eventId",
          as: "tickets",
        },
      },
      {
        $addFields: {
          minTicketPrice: {
            $cond: [
              { $gt: [{ $size: "$tickets" }, 0] },
              { $min: "$tickets.price" },
              null,
            ],
          },
        },
      },
      {
        $project: {
          tickets: 0, // we don’t need full ticket details in this response
        },
      },
    ]);

    // Populate genreIds (since aggregation breaks normal .populate())
    const populatedEvents = await Event.populate(eventsWithPrices, {
      path: "genreIds",
    });

    res.status(200).json(populatedEvents);
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
   
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid event ID" });
        }
        const event = await Event.findById(id).populate("genreIds");
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getEventByGenre = async (req, res) => {
    
    try {
        const { genreId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(genreId)) {
        return res.status(400).json({ message: "Invalid genre ID" });
    }
        const events = await Event.find({ genreIds: genreId }).populate("genreIds");
        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this genre" });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getEventByDate = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Log the received query parameters for debugging
        console.log('Received startDate:', startDate);
        console.log('Received endDate:', endDate);

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start date and end date are required" });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        const events = await Event.find({
            startDate: { $gte: start },
            endDate: { $lte: end },
        }).populate("genreIds");

        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this date range" });
        }

        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEventByVenue = async (req, res) => {
 
    try {
        const { venue } = req.params;
    if (!venue) {
        return res.status(400).json({ message: "Venue is required" });
    }
        const events = await Event.find({ venue }).populate("genreIds");
        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this venue" });
        }
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export{
    getAllEvents,
    getEventById,
    getEventByGenre,
    getEventByDate,
    getEventByVenue,
}
