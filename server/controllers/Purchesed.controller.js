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

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket || ticket.quantity < qty) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const totalAmount = ticket.price * qty * 100; // Razorpay uses paisa

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        ticketId: String(ticketId),
        userId: String(userId),
        quantity: String(qty),
      },
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,    
      ticketDetails: {
        title: ticket.title,
        price: ticket.price,
        quantity: qty,
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
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
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

    const order = await instance.orders.fetch(razorpay_order_id);
    const orderQty = Number(order?.notes?.quantity);
    const orderTicketId = order?.notes?.ticketId;
    const orderUserId = order?.notes?.userId;

    if (!Number.isInteger(orderQty) || orderQty <= 0) {
      return res.status(400).json({ message: "Invalid order quantity" });
    }
    if (orderTicketId !== String(ticketId) || orderUserId !== String(userId)) {
      return res.status(403).json({ message: "Order does not belong to this user or ticket" });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const expectedAmount = ticket.price * orderQty * 100;
    if (order.amount !== expectedAmount) {
      return res.status(400).json({ message: "Order amount mismatch" });
    }

    const existingPayment = await UserTicket.findOne({
      $or: [{ orderId: razorpay_order_id }, { paymentId: razorpay_payment_id }],
    });
    if (existingPayment) {
      return res.status(409).json({ message: "Payment already processed" });
    }

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId, quantity: { $gte: orderQty } },
      { $inc: { quantity: -orderQty } },
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    if (updatedTicket.quantity === 0) {
      updatedTicket.statusbar = "sold out";
      await updatedTicket.save();
    }

    const event = await Event.findById(updatedTicket.eventId);
    if (event && event.endDate < new Date()) {
      updatedTicket.statusbar = "inactive";
      await updatedTicket.save();
    }

    // Generate QR code
    const qrCode = await generateQrCode(`${ticketId}-${userId}-${Date.now()}`);

    // Save in UserTicket
    const userTicket = await UserTicket.create({
      userId,
      ticketId,
      quantity: orderQty,
      totalPrice: ticket.price * orderQty,
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
    const userId = req.user.id;
    const accountType = req.user.accountType;

    const userTicket = await UserTicket.findOne({ 
      _id: userTicketId,
      ticketId: ticketId
    });
    
    if (!userTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (String(userTicket.userId) !== String(userId) && accountType !== "admin") {
      return res.status(403).json({ message: "You are not authorized to mark this ticket as used" });
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
