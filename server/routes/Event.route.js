
import express from "express";
import { 
    getAllEvents, 
    getEventById, 
    getEventByGenre, 
    getEventByDate, 
    getEventByVenue 
} from "../controllers/Event.controller.js";

const router = express.Router();

// GET /api/v1/event - Get all events
router.get("/getAllEvents", getAllEvents);

// GET /api/v1/event/:id - Get event by ID
router.get("/getEventById/:id", getEventById);

// GET /api/v1/event/genre/:genreId - Get events by genre
router.get("/getEventByGenre/:genreId", getEventByGenre);

// GET /api/v1/event/venue/:venue - Get events by venue
router.get("/getEventByVenue/:venue", getEventByVenue);

// GET /api/v1/event/date - Get events by date range (uses query params)
router.get("/getEventByDate", getEventByDate);

export default router;