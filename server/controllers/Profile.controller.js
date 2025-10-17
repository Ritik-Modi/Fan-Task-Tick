import Profile from "../models/Profile.model.js";
import User from "../models/User.model.js";
import UserTicket from "../models/UserTicket.model.js";
import mongoose from "mongoose";


const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).populate(
            {path: "profile",
             populate: {
                path: "genre"
            }});
        console.log("UserDetails [Profile]: ", user);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User profile fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile: {
                    Dob: user.profile.Dob,
                    location: user.profile.location,
                    genre: user.profile.genre.map((genre) => genre.name),
                },
            },
        });


    } catch (error) {
        console.error("Error fetching user profile: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const createUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { Dob, location, genreIds } = req.body;

        // Build the profile data dynamically
        const profileData = {};

        if (Dob) profileData.Dob = Dob;
        if (location) profileData.location = location;

        if (genreIds) {
            if (!Array.isArray(genreIds)) {
                return res.status(400).json({ message: "genreIds must be an array" });
            }

            const isValidGenreIds = genreIds.every((id) =>
                mongoose.Types.ObjectId.isValid(id)
            );

            if (!isValidGenreIds) {
                return res.status(400).json({ message: "Invalid genre IDs" });
            }

            profileData.genre = genreIds;
        }

        // if (Object.keys(profileData).length === 0) {
        //     return res.status(400).json({ message: "At least one field is required" });
        // }

        // Create the profile with only the provided fields
        const profile = await Profile.create(profileData);

        // Update the user with the new profile ID
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profile: profile._id },
            { new: true, runValidators: true }
        ).populate({
            path: "profile",
            populate: { path: "genre" },
        });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User profile created successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Error creating user profile: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getUserEvents = async (req, res) => {
    try {
        const userId = req.user.id;

        const userTickets = await UserTicket.find({userId , isPaid: true})
            .populate({
                path: "ticketId",
                populate: {
                    path: "eventId",
                    model: "Event",
                }
            })

            
        if(!userTickets || userTickets.length === 0) {
            return res.status(404).json({ message: "No tickets found" });
        }

        const events = userTickets.map((ut) =>({
            ticketInfo: {
                titile: ut.ticketId?.title,
                description: ut.ticketId?.description,
                price: ut.ticketId?.price,
                quantityBought: ut.quantity,
                totalPrice: ut.totalPrice,
                paymentId: ut.paymentId,
                qrCode: ut.qrCode,

            },
            eventInfo:  {
                id: ut.ticketId?.eventId?._id,
                title: ut.ticketId?.eventId?.title,
                description: ut.ticketId?.eventId?.description,
                image: ut.ticketId?.eventId?.image,
                venue: ut.ticketId?.eventId?.venue,
                startDate: ut.ticketId?.eventId?.startDate,
                endDate: ut.ticketId?.eventId?.endDate,
            },
        }))

        console.log("UserEvents: ", events);
        return res.status(200).json({
            message: "User events fetched successfully",
            events: events,
        })
    } catch (error) {
        console.error("Error fetching user events: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getPurchesedTickets = async (req, res) => {
    try {
        const now = new Date();
        const userId = req.user.id;
        const userTickets = await UserTicket.find({userId , isPaid: true})
            .populate({
                path: "ticketId",
                populate: {
                    path: "eventId",
                    model: "Event",
                    match: {endDate : {$gte : now }},
                }
            })
        
        if(!userTickets || userTickets.length === 0) {
            return res.status(404).json({ message: "No tickets found" });
        }
        
        const myTickets = userTickets
        .filter((ut) => ut.ticketId?.eventId !== null)
        .map((ut) => ({
            ticketInfo: {
                title: ut.ticketId?.title,
                description: ut.ticketId?.description,
                price: ut.ticketId?.price,
                quantityBought: ut.quantity,
                totalPrice: ut.totalPrice,
                paymentId: ut.paymentId,
                qrCode: ut.qrCode,
            },
            eventInfo: {
                id: ut.ticketId?.eventId?._id,
                title: ut.ticketId?.eventId?.title,
                description: ut.ticketId?.eventId?.description,
                placeName: ut.ticketId?.eventId?.placeName,
                image: ut.ticketId?.eventId?.image,
                venue: ut.ticketId?.eventId?.venue,
                startDate: ut.ticketId?.eventId?.startDate,
                endDate: ut.ticketId?.eventId?.endDate,
            },
        }))

        console.log("Purchased Tickets: ", myTickets);
        return res.status(200).json({
            message: "Purchased tickets fetched successfully",
            tickets: myTickets,
        })

        
    } catch (error) {
        console.error("Error fetching purchased tickets: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}


export {
  getUserProfile,
    createUserProfile,
//   updateUserGenre,
  getUserEvents,
//   getUserTickets,
  getPurchesedTickets,
};
