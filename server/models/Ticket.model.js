import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  startSession: {
    type: Date,
    required: true,
  },
  endSession: {
    type: Date,
    required: true,
  },
  statusbar: {
    type: String,
    enum: ["active", "sold out", "inactive"],
    default: "active",
  },
});

ticketSchema.pre("save" , async  function(next){
  const ticket = this
  const now = new Date()

  const event = await mongoose.model("Event").findById(ticket.eventId)
  if (!event) {
    return next(new Error("Event not found"));
  }

  if(this.quantity === 0){
    ticket.statusbar = "sold out"
  }else if(event.endDate < now){
    ticket.statusbar = "inactive"
  }
  next();
})

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;
