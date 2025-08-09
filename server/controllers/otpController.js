const OTP = require("../models/OTP");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const crypto = require("crypto");
const twilio = require("twilio");

// XP System Constants
const XP_FOR_REGISTRATION = 100;
const XP_FOR_REFERRAL_BONUS = 200;

// Twilio setup
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const generateReferralCode = () => crypto.randomBytes(3).toString("hex");

// Endpoint to request an OTP
exports.requestOTP = async (req, res) => {
    const { phone } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
        return res.status(409).json({ error: "User with this phone number already exists." });
    }

    try {
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        // Store the OTP in the database with an expiration time
        await OTP.findOneAndUpdate(
            { phone },
            { otp, createdAt: Date.now() },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Send the OTP via Twilio
        await twilioClient.messages.create({
            body: `Your CafeNet verification code is: ${otp}`,
            to: phone,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        res.status(200).json({ message: "OTP sent successfully." });

    } catch (error) {
        console.error("Twilio or OTP error:", error);
        res.status(500).json({ error: "Failed to send OTP. Server error." });
    }
};

// Endpoint to verify OTP and register the user
exports.verifyOTPAndRegister = async (req, res) => {
    const { phone, otp, name, password, referralCode } = req.body;

    try {
        const otpDocument = await OTP.findOne({ phone, otp });

        if (!otpDocument) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }
        
        // OTP is valid, delete it to prevent reuse
        await OTP.deleteOne({ phone, otp });

        const hashedPassword = await bcrypt.hash(password, 10);
        const securePhoneId = `${phone}-607`;

        const newUser = new User({
            name,
            phone,
            password: hashedPassword,
            securePhoneId,
            referralCode: generateReferralCode(),
            xp: XP_FOR_REGISTRATION, 
            referredBy: null,
        });

        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                newUser.referredBy = referralCode;
                referrer.referralChildren.push(phone);
                referrer.xp += XP_FOR_REFERRAL_BONUS;
                await referrer.save();
            }
        }

        await newUser.save();
        
        const token = jwt.sign({ phone: newUser.phone }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax'
        });

        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error("Verification and registration error:", error);
        res.status(500).json({ error: "Server error" });
    }
};