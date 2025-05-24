import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  Dob: {
    type: String,
    default:null
  },
  location: {
    type: String,
    default:null
    
  },
  genre: [
    {
      ref: "Genre",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
