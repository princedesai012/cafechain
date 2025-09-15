const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    otp: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['email', 'redemption'],
        required: true
    },
    // This field is essential for storing temporary user data during registration
    metadata: {
        type: Object 
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // The OTP will automatically be deleted from the database after 10 minutes
        expires: 600
    }
});

module.exports = mongoose.model("OTP", otpSchema);