// controllers/rewardController.js
const Cafe = require("../models/Cafe");
const RewardTransaction = require("../models/RewardTransaction");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

exports.claimReward = async (req, res) => {
  try {
    const { cafeId, amount } = req.body;
    const userId = req.user._id; // from auth middleware

    // Validate cafe
    const cafe = await Cafe.findById(cafeId);
    if (!cafe) return res.status(404).json({ error: "Cafe not found" });

    // Handle invoice upload
    let invoiceUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "invoices",
      });
      invoiceUrl = result.secure_url;
    }

    // Calculate points (simple example)
    const points = Math.floor(amount / 500) * 50;

    // Save Reward Transaction
    const reward = new RewardTransaction({
      userId,
      cafeId,
      type: "earn",
      points,
      description: "Reward claim from invoice",
    });
    await reward.save();

    // Update user's points
    const user = await User.findById(userId);
    const existingCafePoints = user.points.find(p => p.cafeId.equals(cafeId));
    if (existingCafePoints) {
      existingCafePoints.totalPoints += points;
    } else {
      user.points.push({ cafeId, totalPoints: points });
    }
    await user.save();

    res.status(201).json({
      message: "Reward claim successful",
      points,
      invoiceUrl,
    });
  } catch (err) {
    console.error("Claim Reward Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all cafes (for dropdown)
exports.getCafes = async (req, res) => {
  try {
    const cafes = await Cafe.find().select("name _id");
    res.status(200).json(cafes);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};