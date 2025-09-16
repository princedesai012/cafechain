const PendingCafe = require("../models/PendingCafe");
const User = require("../models/User");
const Cafe = require("../models/Cafe");
const crypto = require("crypto");
const RewardClaim = require("../models/RewardClaim");
const { logVisit } = require("../controllers/userController");

// Get all pending claims
exports.getPendingClaims = async (req, res) => {
  try {
    const claims = await RewardClaim.find({ status: "pending" })
      .populate("user", "name email")
      .populate("cafe", "name");
    res.json(claims);
  } catch (err) {
    console.error("Error fetching pending claims:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Approve claim -> add points to user
exports.approveClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await RewardClaim.findById(id).populate("user").populate("cafe");

    if (!claim) return res.status(404).json({ error: "Claim not found" });
    if (claim.status !== "pending") {
      return res.status(400).json({ error: "Claim already processed" });
    }

    claim.status = "approved";
    await claim.save();

    // Call logVisit with fromAdmin = true
    await logVisit(null, null, true, {
      userPhone: claim.user.phone,
      cafeId: claim.cafe._id,
      amountSpent: claim.amount
    });

    res.json({ message: "Claim approved and points/XP added", claim });
  } catch (err) {
    console.error("Error approving claim:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Reject claim
exports.rejectClaim = async (req, res) => {
  try {
    const { id } = req.params;
    const claim = await RewardClaim.findById(id);

    if (!claim) return res.status(404).json({ error: "Claim not found" });
    if (claim.status !== "pending") {
      return res.status(400).json({ error: "Claim already processed" });
    }

    claim.status = "rejected";
    await claim.save();

    res.json({ message: "Claim rejected", claim });
  } catch (err) {
    console.error("Error rejecting claim:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
      // Find all users and select only the fields needed for the lookup page
      const users = await User.find({}).select("name phone email createdAt").sort({ createdAt: -1 });
      res.json(users);
  } catch (err) {
      console.error("Error fetching all users:", err);
      res.status(500).json({ error: "Server error fetching users" });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
      const userId = req.params.id;
      
      // Find the user by their ID and populate their related history logs
      const user = await User.findById(userId)
          .populate('visitLogs')       // Fetches the full documents from the VisitLog collection
          .populate('rewardLogs');     // Fetches the full documents from the RewardTransaction collection

      if (!user) {
          return res.status(404).json({ error: "User not found." });
      }

      res.json(user);
  } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ error: "Server error fetching user profile" });
  }
};


exports.getAllCafes = async (req, res) => {
  try {
      // Find all cafes and sort them by creation date
      const cafes = await Cafe.find({}).sort({ createdAt: -1 });
      res.json(cafes);
  } catch (err) {
      console.error("Error fetching all cafes:", err);
      res.status(500).json({ error: "Server error fetching cafes" });
  }
};

exports.getCafeDetails = async (req, res) => {
  try {
      const cafeId = req.params.id; // This will now correctly receive the ID
      console.log("Fetching details for cafe ID:", cafeId); // This will no longer be undefined

      const cafe = await Cafe.findById(cafeId);

      if (!cafe) {
          return res.status(404).json({ error: "Cafe not found." });
      }
      res.json(cafe);
  } catch (err) {
      console.error("Error fetching cafe details:", err);
      res.status(500).json({ error: "Server error fetching cafe details" });
  }
};

// Get all cafes pending approval from the temporary collection
exports.getPendingCafes = async (req, res) => {
  try {
    const cafes = await PendingCafe.find({ status: "pending_approval" });
    res.json(cafes);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching pending cafes" });
  }
};

// Approve a cafe and create permanent records in the User and Cafe collections
exports.approveCafe = async (req, res) => {
  try {
      const pendingCafeId = req.params.id;
      const pendingData = await PendingCafe.findById(pendingCafeId);
      if (!pendingData) {
          return res.status(404).json({ error: "Pending application not found." });
      }

      // Create a single new Cafe document from the pending data
      const newCafe = new Cafe({
          // Map all fields from pendingData to the new Cafe model
          name: pendingData.name,
          address: pendingData.address,
          cafePhone: pendingData.cafePhone,
          description: pendingData.description,
          openingHours: pendingData.openingHours,
          image: pendingData.image,
          gallery: pendingData.gallery,
          features: pendingData.features,
          ownerName: pendingData.ownerName,
          ownerPhone: pendingData.ownerPhone,
          email: pendingData.email,
          password: pendingData.hashedPassword, // Pass the pre-hashed password
          cafeCode: crypto.randomBytes(3).toString("hex").toUpperCase(),
          status: "active",
      });

      await newCafe.save();
      await PendingCafe.findByIdAndDelete(pendingCafeId);

      res.json({ message: "Cafe approved and created successfully." });
  } catch (err) {
      console.error("Approve Cafe Error:", err);
      res.status(500).json({ error: "Server error approving cafe" });
  }
};

// Reject a cafe application and remove the temporary record
exports.rejectCafe = async (req, res) => {
  try {
      const pendingCafeId = req.params.id;
      const pendingCafe = await PendingCafe.findByIdAndDelete(pendingCafeId);
      if (!pendingCafe) {
          return res.status(404).json({ error: "Pending application not found." });
      }
      // You could optionally send an email to the user here informing them of the rejection
      res.json({ message: "Cafe application rejected and removed." });
  } catch (err) {
      console.error("Reject Cafe Error:", err);
      res.status(500).json({ error: "Server error rejecting cafe" });
  }
};