const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateReferralCode = () => crypto.randomBytes(3).toString("hex");

exports.register = async (req, res) => {
    const { name, phone, password, referralCode } = req.body;

    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) return res.status(400).json({ error: "Phone already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const securePhoneId = `${phone}-${Math.floor(100 + Math.random() * 900)}`;

        const newUser = new User({
        name,
        phone,
        password: hashedPassword,
        securePhoneId,
        referralCode: generateReferralCode(),
        referredBy: null,
    });

    if (referralCode) {
        const referrer = await User.findOne({ referralCode });
        if (referrer) {
            newUser.referredBy = referralCode;
            referrer.referralChildren.push(phone);
            await referrer.save();
        }
    }

    await newUser.save();
    res.status(201).json({ message: "User registered" });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.login = async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

        const token = jwt.sign({ phone: user.phone }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ token, user: { name: user.name, phone: user.phone, profilePic: user.profilePic } });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};