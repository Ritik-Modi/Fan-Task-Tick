import Genre from "../models/Genre.model.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        if (genres.length === 0) {
            return res.status(404).json({ message: "No genres found" });
        }
        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addGenre = async (req, res) => {

    try {
        const { name } = req.body;
        if (!name) {
        return res.status(400).json({ message: "Genre name is required" });
        }
        const existingGenre = await Genre.findOne({ name });
        if (existingGenre) {
            return res.status(409).json({ message: "Genre already exists" });
        }
        const newGenre = new Genre({ name });
        await newGenre.save();
        res.status(201).json(newGenre);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const removeGenre = async (req, res) => {
    
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid genre ID" });
        }
        const genre = await Genre.findByIdAndDelete(id);
        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }
        res.status(200).json({ message: "Genre deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export{
    // suggestGenres,
    getAllGenres,
    addGenre,
    removeGenre,
}