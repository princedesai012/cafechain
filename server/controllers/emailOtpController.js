// controllers/emailOtpController.js

const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

// Setup for sending emails (same as in your userController)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * @desc    Verify Email OTP, create user, and log them in
 * @route   POST /api/email-otp/verify-email-otp
 * @access  Public
 */
exports.verifyEmailOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        // 1. Find the OTP entry for the given email
        const otpEntry = await OTP.findOne({ email, type: 'email' });

        if (!otpEntry) {
            return res.status(400).json({ error: "OTP expired or invalid. Please try registering again." });
        }

        // 2. Check if the provided OTP is correct
        if (otpEntry.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP provided." });
        }

        // 3. OTP is correct! Create the user from the metadata
        const userData = otpEntry.metadata;
        if (!userData) {
            return res.status(500).json({ error: "Could not retrieve user data. Please register again." });
        }
        
        const securePhoneId = `${userData.phone}-607`;

        const newUser = new User({
            ...userData,
            isEmailVerified: true, // Set email as verified
            securePhoneId: securePhoneId
        });

        // 4. Handle referral logic (if any)
        if (userData.referredBy) {
            const referrer = await User.findOne({ referralCode: userData.referredBy });
            if (referrer) {
                // Constants for XP rewards
                const XP_FOR_REFERRAL_BONUS = 200;
                const XP_FOR_NEW_USER_REFERRAL = 150;

                referrer.xp += XP_FOR_REFERRAL_BONUS;
                newUser.xp += XP_FOR_NEW_USER_REFERRAL;
                await referrer.save();
            }
        }

        await newUser.save();

        // 5. Generate a JWT token for immediate login
        const token = jwt.sign(
            { id: newUser._id, phone: newUser.phone },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // 6. Clean up: Delete the used OTP entry
        await OTP.deleteOne({ _id: otpEntry._id });

        // 7. Send back the token and user info
        res.status(201).json({
            message: "Email verified and user registered successfully!",
            token,
            user: {
                name: newUser.name,
                phone: newUser.phone,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);
        res.status(500).json({ error: "Server error during OTP verification." });
    }
};


/**
 * @desc    Resend Email OTP
 * @route   POST /api/email-otp/resend-email-otp
 * @access  Public
 */
exports.resendEmailOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        // Find the existing registration attempt
        const existingOtpEntry = await OTP.findOne({ email, type: 'email' });
        if (!existingOtpEntry) {
            return res.status(400).json({ error: "No active registration found for this email. Please start over." });
        }

        // Generate a new OTP
        const newOtp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        // Update the existing entry with the new OTP and reset the expiry timer
        existingOtpEntry.otp = newOtp;
        existingOtpEntry.createdAt = Date.now();
        await existingOtpEntry.save();

        // Send the new OTP via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'CafeChain New Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
                    <h2 style="text-align: center;">☕ Your New CafeChain Code</h2>
                    <p>Your new verification code is:</p>
                    <h1 style="text-align: center; font-size: 36px; letter-spacing: 5px;">${newOtp}</h1>
                    <p>This code will expire in 10 minutes.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Resent OTP Email to ${email}`);

        res.status(200).json({ message: "A new OTP has been sent to your email." });

    } catch (error) {
        console.error("Resend OTP Error:", error);
        res.status(500).json({ error: "Failed to resend OTP." });
    }
};