const mongoose = require("mongoose");

const cafeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    phone: String,
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    cafeCode: { type: String, unique: true }, // A unique code for staff to identify the cafe
    // Other cafe-related fields can be added here
});

module.exports = mongoose.model("Cafe", cafeSchema);