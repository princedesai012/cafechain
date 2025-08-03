const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, unique: true },
    securePhoneId: { type: String, unique: true },
    password: String, // hashed
    profilePic: String,
    points: { type: Number, default: 0 },
    referredBy: String,
    referralCode: String,
    referralChildren: [String],
    createdAt: { type: Date, default: Date.now },
    visitLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "VisitLog" }],
    rewardLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "RewardTransaction" }],
});

module.exports = mongoose.model("User", userSchema);


// point data type 
// zender