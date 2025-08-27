// seedCafes.js
const mongoose = require("mongoose");
const Cafe = require("./models/Cafe");
require("dotenv").config();

const cafes = [
    { name: "The Cafe de Meet", address: "Ahmedabad", phone: "9876543210", cafeCode: "CAFE001" },
    { name: "Cafe Soul", address: "Vadodara", phone: "9876543211", cafeCode: "CAFE002" },
    { name: "Brew & Bean", address: "Rajkot", phone: "9876543212", cafeCode: "CAFE003" },
    { name: "Latte Lounge", address: "Surat", phone: "9876543213", cafeCode: "CAFE004" },
    { name: "Mocha Magic", address: "Gandhinagar", phone: "9876543214", cafeCode: "CAFE005" },
];

const seedCafes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing cafes
    await Cafe.deleteMany({});
    console.log("🗑️ Old cafes removed");

    // Insert new cafes
    await Cafe.insertMany(cafes);
    console.log("🌱 Cafes seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding cafes:", err);
    process.exit(1);
  }
};

seedCafes();