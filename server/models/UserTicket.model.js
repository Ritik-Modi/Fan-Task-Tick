import mongoose from "mongoose";

const userTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  verifiedIdentityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VerifiedIdentity",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  orderId: {
    type: String,
    required: true },
  paymentId: {
    type: String,
    required: true,
  },
  polarOrderId: {
    type: String,
  },
  qrCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

const UserTicket = mongoose.model("UserTicket", userTicketSchema);
export default UserTicket;
