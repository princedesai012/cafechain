const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // The OTP will automatically be deleted after 10 minutes (600 seconds)
        expires: 600
    }
});

module.exports = mongoose.model("OTP", otpSchema);