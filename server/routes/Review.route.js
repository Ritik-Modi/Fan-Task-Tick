
import { authMiddleware, isUser } from '../middlewares/Auth.middleware.js';





import express from "express";
import { createReview, getReviews, deleteReview } from "../controllers/Review.controller.js";

const router = express.Router({ mergeParams: true });

// GET /api/v1/event/:eventId/review - Get all reviews for an event
router.get("/getReview", getReviews);

// POST /api/v1/event/:eventId/review - Create a review for an event
router.post("/create-review", authMiddleware, createReview);

// DELETE /api/v1/event/:eventId/review/:reviewId - Delete a review
router.delete("/deleteReview/:reviewId", authMiddleware, deleteReview);

export default router;