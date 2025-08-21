const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, unique: true },
    securePhoneId: { type: String, unique: true },
    password: String, // hashed
    email: { type: String, unique: true, sparse: true },
    isEmailVerified: { type: Boolean, default: false },
    profilePic: String,
    profilePicId: String,
    points: [{
        cafeId: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe" }, 
        totalPoints: { type: Number, default: 0 }
    }],
    referredBy: String,
    referralCode: String,
    referralChildren: [String],
    createdAt: { type: Date, default: Date.now },
    visitLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "VisitLog" }],
    rewardLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "RewardTransaction" }],
    xp: { type: Number, default: 0 },
    hasMultiplier: { type: Boolean, default: false },
    favoriteCafes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cafe" }]
});

module.exports = mongoose.model("User", userSchema);


// point data type
// zender