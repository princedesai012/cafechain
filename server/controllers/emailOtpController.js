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
            subject: 'CafeNet Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to CafeNet!</h2>
                    <p>Thank you for registering with CafeNet. Please verify your email address to complete your registration.</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h3 style="color: #007bff; margin: 0;">Your Verification Code</h3>
                        <h1 style="color: #333; font-size: 32px; margin: 10px 0;">${otp}</h1>
                        <p style="color: #666; margin: 0;">This code will expire in 10 minutes.</p>
                    </div>
                    <p>If you didn't request this verification, please ignore this email.</p>
                    <p>Best regards,<br>The CafeNet Team</p>
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
            message: "Email verified successfully! Welcome to CafeNet.",
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
            subject: 'CafeNet Email Verification - New Code',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">CafeNet Email Verification</h2>
                    <p>You requested a new verification code. Here's your new code:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h3 style="color: #007bff; margin: 0;">Your New Verification Code</h3>
                        <h1 style="color: #333; font-size: 32px; margin: 10px 0;">${otp}</h1>
                        <p style="color: #666; margin: 0;">This code will expire in 10 minutes.</p>
                    </div>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <p>Best regards,<br>The CafeNet Team</p>
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