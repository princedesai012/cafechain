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

// Get single cafe by ID
exports.getCafeById = async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id);
    if (!cafe) {
      return res.status(404).json({ error: "Cafe not found" });
    }
    res.status(200).json(cafe);
  } catch (error) {
    console.error("Error fetching cafe:", error);
    res.status(500).json({ error: "Server error" });
  }
};
