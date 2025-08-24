const OTP = require("../models/OTP");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD // Use app password for Gmail
    }
});

// Request email OTP for verification
exports.requestEmailOTP = async (req, res) => {
    const { email, phone } = req.body;

    try {
        // Check if user exists with this phone number
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found. Please register first." });
        }

        // Check if email is already verified
        if (user.isEmailVerified) {
            return res.status(400).json({ error: "Email is already verified." });
        }

        // Prevent using an email that belongs to another user
        const emailOwner = await User.findOne({ email });
        if (emailOwner && emailOwner.phone !== phone) {
            return res.status(400).json({ error: "Email is already in use by another account." });
        }

        // Generate 6-digit OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        // Store OTP in database
        await OTP.findOneAndUpdate(
            { email },
            {
                email,
                otp,
                type: 'email',
                createdAt: Date.now()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'CafeChain Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <h2 style="color: #333; text-align: center;">☕ Welcome to CafeChain! 🎉</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    Hey there, coffee lover! We're thrilled to have you join the CafeChain family. Before you can dive into the world of caffeine-powered awesomeness, we just need you to verify your email address. It's quick, we promise!
                </p>
                <div style="background-color: #f9f9f9; padding: 20px; text-align: center; margin: 20px 0; border: 1px dashed #ccc; border-radius: 8px;">
                    <h3 style="color: #007bff; margin: 0;">🚀 Your Super-Secret Verification Code</h3>
                    <h1 style="color: #333; font-size: 36px; margin: 10px 0;">${otp}</h1>
                    <p style="color: #666; margin: 0; font-size: 14px;">(Psst... This code will self-destruct in 10 minutes, so don't wait too long!)</p>
                </div>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    If you didn't sign up for CafeChain, no worries—just ignore this email. But if you did, we can't wait to caffeinate your day!
                </p>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    Stay awesome,<br>
                    <span style="font-weight: bold;">The CafeChain Team ☕</span>
                </p>
                <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #888;">
                <p>Need help? <a href="mailto:team.cafechain@gmail.com" style="color: #007bff; text-decoration: none;">Contact us</a></p>
                <p>Powered by Team CafeChain ❤️</p>
            </footer>
        </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Email OTP sent successfully.",
            email: email
        });

    } catch (error) {
        console.error("Email OTP error:", error);
        res.status(500).json({ error: "Failed to send email OTP. Please try again." });
    }
};

// Verify email OTP and complete registration
exports.verifyEmailOTP = async (req, res) => {
    const { email, otp, phone } = req.body;

    try {
        // Find the OTP document
        const otpDocument = await OTP.findOne({ email, otp, type: 'email' });

        if (!otpDocument) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        // Find the user
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Prevent assigning an email that belongs to another user
        const emailOwner = await User.findOne({ email });
        if (emailOwner && emailOwner.phone !== phone) {
            return res.status(400).json({ error: "Email is already in use by another account." });
        }

        // Delete the OTP to prevent reuse
        await OTP.deleteOne({ email, otp, type: 'email' });

        // Update user with email and mark as verified
        user.email = email;
        user.isEmailVerified = true;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });

        res.status(200).json({
            message: "Email verified successfully! Welcome to CafeChain.",
            user: {
                name: user.name,
                phone: user.phone,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            },
            token
        });

    } catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({ error: "Server error during email verification." });
    }
};

// Resend email OTP
exports.resendEmailOTP = async (req, res) => {
    const { email, phone } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Generate new OTP
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        // Update OTP in database
        await OTP.findOneAndUpdate(
            { email },
            {
                email,
                otp,
                type: 'email',
                createdAt: Date.now()
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Send new email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'CafeChain Email Verification - New Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
                <h2 style="color: #333; text-align: center;">☕ CafeChain Email Verification 🚀</h2>
                <p style="color: #555; font-size: 16px; line-height: 1.6;">
                    Hello again! We noticed you requested a new verification code. No worries, we’ve got you covered. Here’s your shiny new code:
                </p>
                <div style="background-color: #f9f9f9; padding: 20px; text-align: center; margin: 20px 0; border: 1px dashed #ccc; border-radius: 8px;">
                <h3 style="color: #007bff; margin: 0;">✨ Your New Verification Code ✨</h3>
                <h1 style="color: #333; font-size: 36px; margin: 10px 0;">${otp}</h1>
                <p style="color: #666; margin: 0; font-size: 14px;">(Hurry! This code will expire in 10 minutes, so don’t let it slip away!)</p>
            </div>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                If you didn’t request this code, don’t worry—just ignore this email. But if you did, let’s get you verified and back to the good stuff!
            </p>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
                Cheers,<br>
                <span style="font-weight: bold;">The CafeChain Team ☕</span>
            </p>
            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #888;">
            <p>Need help? <a href="mailto:team.cafechain@gmail.com" style="color: #007bff; text-decoration: none;">Contact us</a></p>
            <p>Powered by Team CafeChain ❤️</p>
        </footer>
    </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "New email OTP sent successfully.",
            email: email
        });

    } catch (error) {
        console.error("Resend email OTP error:", error);
        res.status(500).json({ error: "Failed to resend email OTP. Please try again." });
    }
};