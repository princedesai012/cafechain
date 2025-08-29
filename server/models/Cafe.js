const mongoose = require("mongoose");

const cafeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    phone: String,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cafeCode: { type: String, unique: true },
    image: { type: String, default: "https://via.placeholder.com/400x250" }, // default cafe image
    features: [String], // e.g. ["Free WiFi", "Outdoor Seating"]
}); 

module.exports = mongoose.model("Cafe", cafeSchema);