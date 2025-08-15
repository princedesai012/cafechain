const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true
    },
    phone: { 
        type: String, 
        required: [true, 'Phone number is required'],
        unique: true,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid phone number']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    securePhoneId: { 
        type: String, 
        unique: true 
    },
    password: { 
        type: String,
        required: [true, 'Password is required']
    },
    profilePic: String,
    points: [{
        cafeId: { type: mongoose.Schema.Types.ObjectId, ref: "Cafe" }, 
        totalPoints: { type: Number, default: 0 }
    }],
    referredBy: String,
    referralCode: { 
        type: String,
        unique: true
    },
    referralChildren: [String],
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    visitLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "VisitLog" }],
    rewardLogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "RewardTransaction" }],
    xp: { type: Number, default: 0 },
    hasMultiplier: { type: Boolean, default: false },
    favoriteCafes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cafe" }],
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model("User", userSchema);


// point data type
// zender