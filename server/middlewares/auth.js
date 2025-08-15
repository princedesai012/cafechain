const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.authenticateUserJWT = async (req, res, next) => {
    let token;

    // 1. Try to get the token from cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // 2. If no token in cookies, try to get it from the Authorization header (for API calls)
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        const parts = authHeader.split(" ");
        if (parts.length === 2 && parts[0] === "Bearer") {
            token = parts[1];
        }
    }

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user exists
        const user = await User.findOne({ phone: decoded.phone });
        if (!user) {
            return res.status(401).json({ error: "User not found or deleted." });
        }
        
        // Add user data to request
        req.user = decoded;
        req.userPhone = decoded.phone;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token expired. Please login again.", tokenExpired: true });
        }
        res.status(401).json({ error: "Invalid token." });
    }
};

// Middleware to check if email is verified
exports.requireEmailVerified = async (req, res, next) => {
    try {
        const user = await User.findOne({ phone: req.userPhone });
        
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        
        if (!user.isEmailVerified) {
            return res.status(403).json({ 
                error: "Email verification required.", 
                requiresEmailVerification: true 
            });
        }
        
        next();
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};