import User from "../models/User.model.js";
import Event from "../models/Event.model.js";
import Genre from "../models/Genre.model.js";
import Ticket from "../models/Ticket.model.js";
import mongoose from "mongoose";


import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";

const createEvent = async (req, res) => {
  try {
    const { title, description, venue, startDate, endDate } = req.body;
    let { genreIds } = req.body;
    const userId = req.user.id;

    // 1. Validate file
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageFile = req.files.image;

    // 2. Upload to Cloudinary
    const uploadedImage = await uploadImageToCloudinary(imageFile, "events");

    // 3. Parse genreIds (if present)
    if (genreIds) {
      if (typeof genreIds === "string") {
        try {
          genreIds = JSON.parse(genreIds);
        } catch {
          genreIds = genreIds.split(",").map((id) => id.trim());
        }
      }

      if (!Array.isArray(genreIds)) {
        return res.status(400).json({ message: "genreIds must be an array" });
      }
    } else {
      genreIds = []; // default to empty array if not provided
    }

    // 4. Check user role
    const user = await User.findById(userId);
    if (user.accountType !== "admin") {
      return res.status(403).json({ message: "You are not authorized to create an event" });
    }

    // 5. If genreIds are provided, verify they exist
    let genres = [];
    if (genreIds.length > 0) {
      genres = await Genre.find({ _id: { $in: genreIds } });
      if (genres.length !== genreIds.length) {
        return res.status(404).json({ message: "One or more genres not found" });
      }
    }

    // 6. Create event
    const event = await Event.create({
      createdBy: userId,
      title,
      description,
      image: uploadedImage.secure_url,
      venue,
      genreIds,
      startDate,
      endDate,
    });

    const eventWithGenres = {
      ...event._doc,
      genres: genres.map((genre) => ({ id: genre._id, name: genre.name })),
    };

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: eventWithGenres,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    let {
      title,
      description,
      image, // fallback image URL from frontend if no new image is uploaded
      venue,
      genreIds,
      startDate,
      endDate,
    } = req.body;

    const userId = req.user.id;

    // Optional: Upload image if a new one is uploaded
    let uploadedImage = null;
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      uploadedImage = await uploadImageToCloudinary(imageFile, "events");
    }

    // Parse genreIds (could come as a JSON string or comma-separated string)
    if (genreIds) {
      if (typeof genreIds === "string") {
        try {
          genreIds = JSON.parse(genreIds);
        } catch {
          genreIds = genreIds.split(",").map((id) => id.trim());
        }
      }

      if (!Array.isArray(genreIds)) {
        return res.status(400).json({ message: "genreIds must be an array" });
      }
    } else {
      genreIds = []; // Default to empty array if not provided
    }

    // Check user role
    const user = await User.findById(userId);
    if (user.accountType !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to update an event",
      });
    }

    // Validate genre IDs if provided
    let genres = [];
    if (genreIds.length > 0) {
      genres = await Genre.find({ _id: { $in: genreIds } });
      if (genres.length !== genreIds.length) {
        return res.status(404).json({
          message: "One or more genres not found",
        });
      }
    }

    // Update the event
    const eventId = req.params.id;
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        description,
        image: uploadedImage ? uploadedImage.secure_url : image,
        venue,
        genreIds,
        startDate,
        endDate,
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    const eventWithGenres = {
      ...updatedEvent._doc,
      genres: genres.map((genre) => ({ id: genre._id, name: genre.name })),
    };

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event: eventWithGenres,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (user.accountType !== "admin") {
      return res.status(403).json({ message: "You are not authorized to delete an event" });
    }

    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID" });
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      event: deletedEvent,
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const showAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("genreIds", "name").populate("createdBy", "fullName email accountType");
    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }
    res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      events,
    });
  } catch (error) {
    console.error("Error retrieving events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {
  createEvent,
  updateEvent,
  deleteEvent,
  showAllEvents,

};