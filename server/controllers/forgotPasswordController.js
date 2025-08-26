// controllers/forgotPasswordController.js
const User = require("../models/User");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// ✅ configure transporter (use your Gmail / SMTP service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASSWORD, // your app password (not normal password)
  },
});

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    // Find user by phone
    const user = await User.findOne({ phone: mobile });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB
    await OTP.findOneAndUpdate(
      { phone: mobile, type: "phone" },
      { otp, createdAt: Date.now() },
      { upsert: true, new: true }
    );

    // ✅ send email with OTP
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email, // send to registered email
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "OTP sent successfully to email" });
  } catch (err) {
    console.error("sendOtp error:", err);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    const record = await OTP.findOne({ phone: mobile, type: "phone" });
    if (!record) {
      return res.status(400).json({ success: false, message: "OTP expired or not found" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    res.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ phone: mobile });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = password; // let pre-save hook hash it
    await user.save();
    await user.save();

    // Remove OTP after reset
    await OTP.deleteOne({ phone: mobile, type: "phone" });

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ success: false, message: "Password reset failed" });
  }
};