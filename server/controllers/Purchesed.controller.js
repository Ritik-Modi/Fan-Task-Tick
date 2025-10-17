import UserTicket from "../models/UserTicket.model.js";
import Ticket from "../models/Ticket.model.js";
import User from "../models/User.model.js";
import Event from "../models/Event.model.js";
import generateQrCode from "../utils/generateQrCode.js";
import instance from "../config/razerpay.config.js";
import crypto from "crypto";

// 1. Buy Ticket - Create Razorpay order
const buyTicket = async (req, res) => {
  try {
    const { quantity } = req.body;
    const ticketId = req.params.ticketId; // Get from URL params
    const userId = req.user.id;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.quantity < quantity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const totalAmount = ticket.price * quantity * 100; // Razorpay uses paisa

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,    
      ticketDetails: {
        title: ticket.title,
        price: ticket.price,
        quantity,
      },
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 2. Mark Ticket As Paid - After Razorpay payment is successful
const markTicketAsPaid = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, quantity } = req.body;
    const ticketId = req.params.ticketId; // Get from URL params
    const userId = req.user.id;

    // Signature verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.quantity < quantity) {
      return res.status(400).json({ message: "Ticket not available" });
    }

    const totalPrice = ticket.price * quantity;

    // Update ticket quantity
    ticket.quantity -= quantity;
    if (ticket.quantity === 0) {
      ticket.statusbar = "sold out";
    }
    await ticket.save();

    // Generate QR code
    const qrCode = await generateQrCode(`${ticketId}-${userId}-${Date.now()}`);

    // Save in UserTicket
    const userTicket = await UserTicket.create({
      userId,
      ticketId,
      quantity,
      totalPrice,
      isPaid: true,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      qrCode,
    });

    res.status(200).json({
      success: true,
      message: "Payment verified & ticket purchased",
      userTicket,
    });
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Mark Ticket As Used - Optional for event check-in
const markTicketAsUsed = async (req, res) => {
  try {
    const ticketId = req.params.ticketId;
    const userTicketId = req.params.userTicketId;

    const userTicket = await UserTicket.findOne({ 
      _id: userTicketId,
      ticketId: ticketId
    });
    
    if (!userTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    userTicket.status = "inactive";
    await userTicket.save();

    res.status(200).json({
      success: true,
      message: "Ticket marked as used",
    });
  } catch (err) {
    console.error("Error marking ticket as used:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  buyTicket,
  markTicketAsPaid,
  markTicketAsUsed,
};