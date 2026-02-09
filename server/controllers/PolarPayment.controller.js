import polar from "../config/polarClient.js";
import Ticket from "../models/Ticket.model.js";
import Event from "../models/Event.model.js";
import UserTicket from "../models/UserTicket.model.js";
import VerifiedIdentity from "../models/VerifiedIdentity.model.js";
import generateQrCode from "../utils/generateQrCode.js";
import SecurityEvent from "../models/SecurityEvent.model.js";
import User from "../models/User.model.js";

const PER_EVENT_IDENTITY_LIMIT = 2;

const createCheckoutSession = async (req, res) => {
  try {
  const { quantity, verifiedIdentityId } = req.body;
  const ticketId = req.params.ticketId;
  const userId = req.user.id;

    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

  let identity;
  if (verifiedIdentityId) {
    identity = await VerifiedIdentity.findById(verifiedIdentityId);
    if (!identity || String(identity.ownerUserId) !== String(userId)) {
      return res.status(404).json({ message: "Verified identity not found" });
    }
    if (!identity.verifiedAt || identity.status !== "active") {
      return res.status(403).json({ message: "Identity is not verified or is deactivated" });
    }
  } else {
    // Default: allow self purchase without verification (uses account email)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    identity = await VerifiedIdentity.findOne({ email: user.email });
    if (identity && String(identity.ownerUserId) !== String(userId)) {
      return res.status(409).json({ message: "Email is already verified by another account" });
    }
    if (!identity) {
      identity = await VerifiedIdentity.create({
        ownerUserId: userId,
        name: user.fullName,
        email: user.email,
        phone: String(user.phone || ""),
        verifiedAt: new Date(),
        status: "active",
      });
    } else if (!identity.verifiedAt) {
      identity.verifiedAt = new Date();
      identity.status = "active";
      await identity.save();
    }
  }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    if (ticket.quantity < qty) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const event = await Event.findById(ticket.eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const alreadyPurchased = await UserTicket.aggregate([
      {
        $match: {
          eventId: event._id,
          verifiedIdentityId: identity._id,
          isPaid: true,
        },
      },
      { $group: { _id: null, total: { $sum: "$quantity" } } },
    ]);
    const totalBought = alreadyPurchased[0]?.total || 0;
  if (totalBought + qty > PER_EVENT_IDENTITY_LIMIT) {
    return res.status(400).json({
      message: `Ticket limit exceeded. Max ${PER_EVENT_IDENTITY_LIMIT} tickets per identity per event.`,
    });
  }

    const session = await polar.checkouts.create({
      products: [process.env.POLAR_PRODUCT_ID],
      successUrl: process.env.POLAR_SUCCESS_URL,
      returnUrl: process.env.POLAR_RETURN_URL,
      externalCustomerId: String(userId),
      customerEmail: identity.email,
      customerName: identity.name,
      metadata: {
        ticketId: String(ticketId),
        eventId: String(event._id),
        quantity: String(qty),
        verifiedIdentityId: String(identity._id),
        userId: String(userId),
      },
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating Polar checkout session:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const fulfillPolarOrder = async (order) => {
  const metadata = order?.metadata || {};
  const ticketId = metadata.ticketId;
  const eventId = metadata.eventId;
  const userId = metadata.userId;
  const verifiedIdentityId = metadata.verifiedIdentityId;
  const qty = Number(metadata.quantity);

  if (!ticketId || !eventId || !userId || !verifiedIdentityId || !Number.isInteger(qty) || qty <= 0) {
    throw new Error("Invalid metadata in Polar order");
  }

  const existing = await UserTicket.findOne({ polarOrderId: order.id });
  if (existing) {
    return existing;
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const updatedTicket = await Ticket.findOneAndUpdate(
    { _id: ticketId, quantity: { $gte: qty } },
    { $inc: { quantity: -qty } },
    { new: true }
  );
  if (!updatedTicket) {
    throw new Error("Not enough tickets available");
  }

  if (updatedTicket.quantity === 0) {
    updatedTicket.statusbar = "sold out";
    await updatedTicket.save();
  }

  const event = await Event.findById(eventId);
  if (event && event.endDate < new Date()) {
    updatedTicket.statusbar = "inactive";
    await updatedTicket.save();
  }

  const qrCode = await generateQrCode(`${ticketId}-${userId}-${Date.now()}`);

  const userTicket = await UserTicket.create({
    userId,
    ticketId,
    eventId,
    verifiedIdentityId,
    quantity: qty,
    totalPrice: ticket.price * qty,
    isPaid: true,
    orderId: order.id,
    paymentId: order.id,
    polarOrderId: order.id,
    qrCode,
  });

  await SecurityEvent.create({
    userId,
    type: "purchase_completed",
    metadata: {
      eventId,
      ticketId,
      quantity: qty,
      amount: ticket.price * qty,
      verifiedIdentityId,
      polarOrderId: order.id,
    },
  });

  return userTicket;
};

export {
  createCheckoutSession,
  fulfillPolarOrder,
};
