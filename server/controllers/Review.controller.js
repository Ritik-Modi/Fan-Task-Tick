import User from "../models/User.model.js";
import Review from "../models/Review.model.js";
import Event from "../models/Event.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const createReview = async (req, res) => {
    try {
        const {  review, rating } = req.body;
        // const eventId = req.params.eventId;
        const userId = req.user.id; // Get from authentication middleware
        
        if (!review || !rating) {
            return res.status(400).json({ message: "Review and rating are required" });
        }

        
        
        // Create review
        const newReview = await Review.create({
            review,
            rating,
            userId
        });
        
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            review: newReview
        });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: error.message });
    }
}

const getReviews = async (req, res) => {
    try {
        
        const reviews = await Review.find().populate("userId" , "fullName");

        if(!reviews){
            return res.status(400).json({massage: "There are No Review till Now"})
        }
        
        res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully",
            reviews
        });
    } catch (error) {
        console.error("Error getting reviews:", error);
        res.status(500).json({ message: error.message });
    }
}

const deleteReview = async (req, res) => {
    try {
        
        const reviewId = req.params.reviewId;
        const userId = req.user.id;
        
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({ message: "Invalid review ID" });
        }
        
        // Find review and check if user is authorized to delete
        const review = await Review.findOne({ _id: reviewId });
        
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        
        // Check if user is the owner of the review or an admin
        const user = await User.findById(userId);
        if (review.userId.toString() !== userId && user.accountType !== "admin") {
            return res.status(403).json({ message: "You are not authorized to delete this review" });
        }
        
        await Review.findByIdAndDelete(reviewId);
        
        res.status(200).json({ 
            success: true,
            message: "Review deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ message: error.message });
    }
}

export {
    createReview,
    getReviews,
    deleteReview,
}