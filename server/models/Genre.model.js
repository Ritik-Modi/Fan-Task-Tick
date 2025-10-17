import mongoose from "mongoose";

const GenreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Genre = mongoose.model("Genre", GenreSchema);
export default Genre;
