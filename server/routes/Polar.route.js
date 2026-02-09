import express from "express";
import { validateEvent } from "@polar-sh/sdk/webhooks/index.js";
import { fulfillPolarOrder } from "../controllers/PolarPayment.controller.js";

const router = express.Router();

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const secret = process.env.POLAR_WEBHOOK_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "POLAR_WEBHOOK_SECRET not configured" });
    }

    const signature = req.headers["webhook-signature"];
    if (!signature) {
      return res.status(400).json({ message: "Missing webhook signature" });
    }

    const event = validateEvent({
      payload: req.body,
      headers: {
        "webhook-signature": signature,
      },
      secret,
    });

    if (event.type === "order.paid") {
      await fulfillPolarOrder(event.data);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Polar webhook error:", error);
    return res.status(400).json({ message: "Invalid webhook" });
  }
});

export default router;
