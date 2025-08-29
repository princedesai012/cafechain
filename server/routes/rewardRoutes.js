// routes/rewardRoute.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const Cafe = require("../models/Cafe");
const RewardClaim = require("../models/RewardClaim");

// If you have auth middleware, import & use it:
// const requireAuth = require("../middlewares/requireAuth");

// ✅ Cloudinary storage config
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "Cafechain/invoice",
      resource_type: "auto", // handles pdfs + images
      allowed_formats: ["jpg", "jpeg", "png", "pdf"],
      public_id: Date.now() + "-" + file.originalname.split(".")[0],
    };
  },
});
const upload = multer({ storage });

// ✅ GET cafes (for dropdown)
// router.get("/cafes", requireAuth, async (req, res) => {
router.get("/cafes", async (req, res) => {
  try {
    const cafes = await Cafe.find({}, "name _id").sort({ name: 1 });
    res.json(cafes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching cafes" });
  }
});

// ✅ POST claim reward (upload invoice → Cloudinary)
// router.post("/claim", requireAuth, upload.single("invoice"), async (req, res) => {
router.post("/claim", upload.single("invoice"), async (req, res) => {
  try {
    const { cafeId, amount } = req.body;
    const userId = req.user?._id; // from auth middleware, if present

    if (!cafeId) {
      return res.status(400).json({ error: "Cafe is required" });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Invoice file is required" });
    }

    // Optional: validate cafe exists
    const cafeExists = await Cafe.exists({ _id: cafeId });
    if (!cafeExists) {
      return res.status(404).json({ error: "Cafe not found" });
    }

    const newClaim = new RewardClaim({
      user: userId || null, // allow null if unauth for now; ideally enforce auth
      cafe: cafeId,
      amount: Number(amount),
      // multer-storage-cloudinary sets `path` to secure_url
      invoiceUrl: req.file.path,
    });

    await newClaim.save();

    res.json({
      message: "✅ Your points are on their way! Credited within 24h.",
      claimId: newClaim._id,
      invoiceUrl: newClaim.invoiceUrl,
      status: newClaim.status,
    });
  } catch (err) {
    console.error("Claim error:", err);
    res.status(500).json({ error: "Failed to submit claim" });
  }
});

// ✅ Get user’s upload history
// router.get("/history", requireAuth, async (req, res) => {
router.get("/history", async (req, res) => {
  try {
    const userId = req.user?._id;
    const query = userId ? { user: userId } : {}; // if no auth, return all (dev mode)
    const claims = await RewardClaim.find(query)
      .populate("cafe", "name")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
