const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const Cafe = require("../models/Cafe");
const RewardClaim = require("../models/RewardClaim");

// ✅ Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "Cafechain/invoice",
      resource_type: "auto",  // 👈 handles pdfs + images
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      public_id: Date.now() + "-" + file.originalname.split(".")[0], // optional unique name
    };
  },
});
const upload = multer({ storage });

// ✅ GET cafes (for dropdown)
router.get("/cafes", async (req, res) => {
  try {
    const cafes = await Cafe.find({});
    res.json(cafes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching cafes" });
  }
});

// ✅ POST claim reward (upload invoice → Cloudinary)
router.post("/claim", upload.single("invoice"), async (req, res) => {
  try {
    const { cafeId, amount } = req.body;
    const userId = req.user?._id;

    if (!req.file) {
      return res.status(400).json({ error: "Invoice file is required" });
    }

    const newClaim = new RewardClaim({
      user: userId,
      cafe: cafeId,
      amount,
      invoiceUrl: req.file.path, // ✅ Cloudinary secure_url (works for pdf + images)
    });

    await newClaim.save();

    res.json({ message: "✅ Your points are on their way! Credited within 24h." });
  } catch (err) {
    console.error("Claim error:", err);
    res.status(500).json({ error: "Failed to submit claim" });
  }
});

// ✅ Get user’s upload history
router.get("/history", async (req, res) => {
  try {
    const claims = await RewardClaim.find({ user: req.user._id })
      .populate("cafe", "name")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;