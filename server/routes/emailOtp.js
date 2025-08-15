const express = require("express");
const router = express.Router();
const { 
    requestEmailOTP, 
    verifyEmailOTP, 
    resendEmailOTP 
} = require("../controllers/emailOtpController");
const { validateEmail, validateOTP } = require("../middlewares/validate");

// Email OTP routes
router.post("/request-email-otp", validateEmail, requestEmailOTP);
router.post("/verify-email-otp", validateEmail, validateOTP, verifyEmailOTP);
router.post("/resend-email-otp", validateEmail, resendEmailOTP);

// Health check route
router.get("/", (req, res) => {
    res.json({ message: "Email OTP API is working" });
});

module.exports = router;