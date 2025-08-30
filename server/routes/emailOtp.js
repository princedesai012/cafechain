const express = require("express");
const router = express.Router();
const { requestEmailOTP, verifyEmailOTP, resendEmailOTP } = require("../controllers/emailOtpController");
const { validateEmail } = require("../middlewares/validate");

// Email OTP routes
router.post("/request-email-otp", validateEmail, requestEmailOTP);
router.post("/verify-email-otp", validateEmail, verifyEmailOTP);
router.post("/resend-email-otp", validateEmail, resendEmailOTP);

module.exports = router;