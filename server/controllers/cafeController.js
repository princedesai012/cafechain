const Cafe = require("../models/Cafe");

// Get all cafes
exports.getCafes = async (req, res) => {
  try {
    const cafes = await Cafe.find({});
    res.status(200).json(cafes);
  } catch (error) {
    console.error("Error fetching cafes:", error);
    res.status(500).json({ error: "Server error" });
  }
};