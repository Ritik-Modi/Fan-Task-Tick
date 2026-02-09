import SecurityEvent from "../models/SecurityEvent.model.js";
import VerifiedIdentity from "../models/VerifiedIdentity.model.js";

const minutesAgo = (min) => new Date(Date.now() - min * 60 * 1000);
const hoursAgo = (h) => new Date(Date.now() - h * 60 * 60 * 1000);

const scoreUserRisk = async (user) => {
  const reasons = [];
  let score = 0;

  const recentOtp = await SecurityEvent.countDocuments({
    $or: [{ userId: user._id }, { email: user.email }],
    type: { $in: ["auth_otp_requested", "identity_otp_requested"] },
    createdAt: { $gte: minutesAgo(15) },
  });
  if (recentOtp >= 6) {
    score += 30;
    reasons.push(`High OTP volume in 15m (${recentOtp})`);
  }

  const identities = await VerifiedIdentity.find({
    ownerUserId: user._id,
    createdAt: { $gte: hoursAgo(24) },
  }).lean();

  const ipCounts = identities.reduce((acc, id) => {
    if (!id.createdIp) return acc;
    acc[id.createdIp] = (acc[id.createdIp] || 0) + 1;
    return acc;
  }, {});

  const maxIp = Math.max(0, ...Object.values(ipCounts));
  if (maxIp >= 4) {
    score += 25;
    reasons.push(`Multiple identities from same IP in 24h (${maxIp})`);
  }

  const purchaseEvents = await SecurityEvent.find({
    userId: user._id,
    type: "purchase_completed",
    createdAt: { $gte: hoursAgo(1) },
  }).lean();

  const eventSet = new Set(
    purchaseEvents.map((e) => e.metadata?.eventId).filter(Boolean)
  );
  if (eventSet.size >= 4) {
    score += 20;
    reasons.push(`Purchases across many events in 1h (${eventSet.size})`);
  }

  return { score, reasons };
};

export { scoreUserRisk };
