// server/middlewares/cafeAuth.js
const jwt = require("jsonwebtoken");

exports.authenticateCafeOwnerJWT = (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

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
        
        // Check if the user is a cafe owner
        if (decoded.role !== 'cafeOwner') {
            return res.status(403).json({ error: "Access denied. You are not a cafe owner." });
        }

        req.user = { _id: decoded.id, phone: decoded.phone, role: decoded.role };
    
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};