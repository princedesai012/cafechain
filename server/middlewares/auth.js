const jwt = require("jsonwebtoken");

exports.authenticateUserJWT = (req, res, next) => {
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
        req.user = decoded; // The decoded payload contains the user's phone number
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token." });
    }
};